// QA automatizado do site (Parte 7 do briefing).
//
// Uso:  npm run build && npm run qa             → testa out/
//       npm run build:revisao -- e depois  node scripts/qa.mjs --pasta out --revisao
//       node scripts/qa.mjs --sem-screenshots    → só os testes
//
// Gera qa/relatorio.md e qa/screens/<largura>x<altura>/*.png. Sai com código 1 se algo falhar.
// Navegador: usa CHROMIUM_PATH, ou /opt/pw-browsers/chromium, ou o Chromium do Playwright
// (instale com `npx playwright install chromium` se precisar).
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { chromium } from "playwright-core";
import sharp from "sharp";
import { verificarContraste } from "./contraste.mjs";
import { servir } from "./servir.mjs";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const opcao = (nome, padrao) => {
  const i = args.indexOf(nome);
  return i >= 0 ? args[i + 1] : padrao;
};
const PASTA = join(raiz, opcao("--pasta", "out"));
const SEM_SCREENSHOTS = args.includes("--sem-screenshots");
const PORTA = 4317;
const BASE = `http://127.0.0.1:${PORTA}/`;
const SAIDA = join(raiz, "qa");

const fonteGas = readFileSync(join(raiz, "src/data/gas.ts"), "utf8");
const WHATSAPP_NUMBER = fonteGas.match(/WHATSAPP_NUMBER = "(\d+)"/)[1];
const segurancaVisivel = /segurancaAprovada: true/.test(fonteGas) || args.includes("--revisao");

/* ------------------------------------------------------------------ */
const resultados = [];
function registrar(grupo, nome, ok, detalhe = "") {
  resultados.push({ grupo, nome, ok, detalhe });
  console.log(`${ok ? "✔" : "✘"} [${grupo}] ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
}
async function checar(grupo, nome, fn) {
  try {
    const r = await fn();
    if (r === true || r === undefined) registrar(grupo, nome, true);
    else if (typeof r === "string") registrar(grupo, nome, true, r);
    else registrar(grupo, nome, r.ok, r.detalhe);
  } catch (e) {
    registrar(grupo, nome, false, String(e?.message ?? e).split("\n")[0]);
  }
}
function igual(recebido, esperado, rotulo = "") {
  if (recebido !== esperado) throw new Error(`${rotulo}esperado ${JSON.stringify(esperado)}, veio ${JSON.stringify(recebido)}`);
}
/* ------------------------------------------------------------------ */

if (!existsSync(join(PASTA, "index.html"))) {
  console.error(`Não achei ${PASTA}/index.html — rode "npm run build" antes.`);
  process.exit(1);
}

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const servidor = await servir(PASTA, PORTA);
const navegador = await chromium.launch({ executablePath });
const errosConsole = [];

async function novaPagina(opcoes = {}, { stubAbrir = false } = {}) {
  const contexto = await navegador.newContext({ locale: "pt-BR", ...opcoes });
  if (stubAbrir) {
    await contexto.addInitScript(() => {
      window.__abertos = [];
      window.open = (url) => {
        window.__abertos.push(String(url));
        return { opener: null };
      };
    });
  }
  const pagina = await contexto.newPage();
  pagina.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") errosConsole.push(m.text());
  });
  pagina.on("pageerror", (e) => errosConsole.push(String(e)));
  return { contexto, pagina };
}

const textoDecodificado = (href) => new URL(href).searchParams.get("text");

/* ================================================================== */
/* A) Screenshots                                                      */
/* ================================================================== */
const SECOES = [
  ["01-header", "header"],
  ["02-hero", "#topo"],
  ["03-termometro", "#nivel"],
  ["04-pedido", "#pedido"],
  ["05-empresas", "#empresas"],
  ...(segurancaVisivel ? [["06-seguranca", "#seguranca"]] : []),
  ["07-quem-somos", "#quem-somos"],
  ["08-faq", "#duvidas"],
  ["09-rodape", "footer"],
];
const VIEWPORTS = [
  [1440, 900],
  [768, 1024],
  [390, 844],
];

if (!SEM_SCREENSHOTS) {
  await rm(join(SAIDA, "screens"), { recursive: true, force: true });
  for (const [w, h] of VIEWPORTS) {
    const dir = join(SAIDA, "screens", `${w}x${h}`);
    await mkdir(dir, { recursive: true });
    const { contexto, pagina } = await novaPagina({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    await pagina.goto(BASE, { waitUntil: "networkidle" });
    await pagina.evaluate(() => document.fonts.ready);
    await pagina.screenshot({ path: join(dir, "00-primeira-dobra.png") });
    for (const [nome, seletor] of SECOES) {
      const alvo = pagina.locator(seletor).first();
      await alvo.scrollIntoViewIfNeeded();
      await pagina.waitForTimeout(650); // fade-up das seções
      // a barra fixa do celular cobre o fim da seção; some só para a foto da seção
      await pagina.evaluate(() => document.querySelector('nav[aria-label="Pedir gás"]')?.style.setProperty("visibility", "hidden"));
      await alvo.screenshot({ path: join(dir, `${nome}.png`) });
      await pagina.evaluate(() => document.querySelector('nav[aria-label="Pedir gás"]')?.style.removeProperty("visibility"));
    }
    await pagina.evaluate(() => document.querySelectorAll("[data-revelar]").forEach((e) => e.classList.add("revelado")));
    await pagina.waitForTimeout(600);
    await pagina.screenshot({ path: join(dir, "99-pagina-inteira.png"), fullPage: true });
    await contexto.close();
  }
  registrar("A", "screenshots 1440×900, 768×1024, 390×844 de cada seção", true, "qa/screens/");
}

/* ================================================================== */
/* A) Status do plantão em horários simulados                          */
/* ================================================================== */
// Datas em America/Sao_Paulo (UTC−3, sem horário de verão). 2026-10-05 = segunda; 2026-10-04 = domingo.
const CASOS_STATUS = [
  ["segunda 07:00", "2026-10-05T07:00:00-03:00", "ABRIMOS HOJE ÀS 7H30"],
  ["segunda 07:30", "2026-10-05T07:30:00-03:00", "ATENDENDO AGORA · ATÉ 21H"],
  ["segunda 12:00", "2026-10-05T12:00:00-03:00", "ATENDENDO AGORA · ATÉ 21H"],
  ["segunda 20:59", "2026-10-05T20:59:00-03:00", "ATENDENDO AGORA · ATÉ 21H"],
  ["segunda 21:00", "2026-10-05T21:00:00-03:00", "FECHADO AGORA · ABRIMOS AMANHÃ ÀS 7H30"],
  ["segunda 21:30", "2026-10-05T21:30:00-03:00", "FECHADO AGORA · ABRIMOS AMANHÃ ÀS 7H30"],
  ["domingo 08:00", "2026-10-04T08:00:00-03:00", "ATENDENDO AGORA · ATÉ 19H"],
  ["domingo 19:00", "2026-10-04T19:00:00-03:00", "FECHADO AGORA · ABRIMOS AMANHÃ ÀS 7H30"],
  ["domingo 07:00", "2026-10-04T07:00:00-03:00", "ABRIMOS HOJE ÀS 8H"],
  ["sábado 21:30 (amanhã é domingo)", "2026-10-03T21:30:00-03:00", "FECHADO AGORA · ABRIMOS AMANHÃ ÀS 8H"],
];

{
  // Aparelho em Tóquio: prova que o cálculo usa o fuso de Uberlândia, não o do aparelho.
  const { contexto, pagina } = await novaPagina({ timezoneId: "Asia/Tokyo", viewport: { width: 390, height: 844 } });
  for (const [rotulo, iso, esperado] of CASOS_STATUS) {
    await checar("A", `status ${rotulo}`, async () => {
      await pagina.clock.setFixedTime(new Date(iso));
      await pagina.goto(BASE, { waitUntil: "load" });
      await pagina.waitForSelector('[data-status]:not([data-status="neutro"])');
      const texto = await pagina.locator("[data-status-texto]").textContent();
      igual(texto, esperado);
      const estado = await pagina.locator("[data-status]").getAttribute("data-status");
      igual(estado, esperado.startsWith("ATENDENDO") ? "aberto" : "fechado", "bolinha: ");
      return `“${texto}” (aparelho em Asia/Tokyo)`;
    });
  }
  await contexto.close();
}

await checar("A", "status sem JavaScript mostra o horário fixo e nenhuma seção fica escondida", async () => {
  const { contexto, pagina } = await novaPagina({ javaScriptEnabled: false });
  await pagina.goto(BASE);
  const texto = await pagina.locator("[data-status-texto]").textContent();
  igual(texto, "ATENDIMENTO: SEG–SÁB 7H30–21H · DOM 8H–19H");
  const opacidades = await pagina.$$eval("[data-revelar]", (els) => els.map((e) => getComputedStyle(e).opacity));
  if (opacidades.some((o) => o !== "1")) throw new Error(`seções invisíveis sem JS: ${opacidades}`);
  await contexto.close();
});

await checar("A", "CLS = 0 no carregamento (390×844 e 1440×900)", async () => {
  const valores = [];
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    const { contexto, pagina } = await novaPagina({ viewport });
    await pagina.addInitScript(() => {
      window.__cls = 0;
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: "layout-shift", buffered: true });
    });
    await pagina.goto(BASE, { waitUntil: "networkidle" });
    await pagina.waitForTimeout(1500);
    valores.push(await pagina.evaluate(() => window.__cls));
    await contexto.close();
  }
  return { ok: valores.every((v) => v < 0.001), detalhe: `CLS ${valores.map((v) => v.toFixed(4)).join(" / ")}` };
});

/* ================================================================== */
/* A) Links wa.me e tel:                                               */
/* ================================================================== */
{
  const { contexto, pagina } = await novaPagina({ viewport: { width: 390, height: 844 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });

  await checar("A", "todos os links wa.me: número certo, mensagem decodificada e rótulo acessível", async () => {
    const links = await pagina.$$eval('a[href^="https://wa.me/"]', (as) =>
      as.map((a) => ({ href: a.href, rotulo: a.getAttribute("aria-label") || a.textContent.trim() })),
    );
    if (!links.length) throw new Error("nenhum link wa.me");
    for (const l of links) {
      const url = new URL(l.href);
      igual(url.pathname, `/${WHATSAPP_NUMBER}`, "número: ");
      const msg = textoDecodificado(l.href);
      if (!msg?.startsWith("Olá! Vim pelo site")) throw new Error(`mensagem estranha: ${msg}`);
      if (!l.rotulo) throw new Error(`link sem rótulo: ${l.href}`);
    }
    return `${links.length} links; ex.: “${textoDecodificado(links[0].href)}”`;
  });

  await checar("A", "CTA do hero abre wa.me com a mensagem padrão exata", async () => {
    const href = await pagina.locator('#topo a[data-cta="whatsapp"]').getAttribute("href");
    igual(textoDecodificado(href), "Olá! Vim pelo site e preciso pedir gás. Pode me ajudar?");
    if (!href.includes("Ol%C3%A1!%20Vim%20pelo%20site")) throw new Error("não está com encodeURIComponent");
  });

  await checar("A", "barra fixa do celular: WhatsApp 65% + Ligar 35%, 64 px", async () => {
    const barra = pagina.locator('nav[aria-label="Pedir gás"]');
    const caixa = await barra.boundingBox();
    const zap = await barra.locator('a[data-cta="whatsapp"]').boundingBox();
    const tel = await barra.locator('a[data-cta="telefone"]').boundingBox();
    if (Math.round(zap.height) !== 64) throw new Error(`altura ${zap.height}`);
    const pz = zap.width / caixa.width;
    const pt = tel.width / caixa.width;
    if (Math.abs(pz - 0.65) > 0.01 || Math.abs(pt - 0.35) > 0.01) throw new Error(`${pz} / ${pt}`);
    if (Math.round(caixa.y + caixa.height) !== 844) throw new Error("não está colada no rodapé da tela");
  });

  await checar("A", "todos os links tel: apontam para números válidos e têm rótulo", async () => {
    const links = await pagina.$$eval('a[href^="tel:"]', (as) =>
      as.map((a) => ({ href: a.getAttribute("href"), rotulo: a.getAttribute("aria-label") || a.textContent.trim(), cta: a.dataset.cta })),
    );
    for (const l of links) {
      if (!["tel:+553432163140", "tel:193"].includes(l.href)) throw new Error(`tel inesperado ${l.href}`);
      if (l.cta === "telefone" && !l.rotulo.includes("(34) 3216-3140")) throw new Error(`rótulo ${l.rotulo}`);
    }
    return `${links.length} links tel:`;
  });

  await checar("A", "nenhum link externo abre sem rel=noopener", async () => {
    const ruins = await pagina.$$eval('a[target="_blank"]', (as) => as.filter((a) => !/noopener/.test(a.rel)).map((a) => a.href));
    if (ruins.length) throw new Error(ruins.join(", "));
  });
  await contexto.close();
}

/* ================================================================== */
/* A) Termômetro pelo teclado                                          */
/* ================================================================== */
{
  const { contexto, pagina } = await novaPagina({ viewport: { width: 390, height: 844 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  const range = pagina.locator("[data-termometro]");
  const titulo = pagina.locator("[data-estado-termometro] h3");
  const ctaZap = pagina.locator('[data-estado-termometro] a[data-cta="whatsapp"]');

  await checar("A", "termômetro: Tab até o controle e teclas mudam o nível", async () => {
    await range.focus();
    await pagina.keyboard.press("Home");
    igual(await range.getAttribute("aria-valuetext"), "Botijão com 0 por cento");
    igual(await titulo.textContent(), "HORA DE PEDIR");
    const msg = textoDecodificado(await ctaZap.getAttribute("href"));
    if (!msg.includes("Meu botijão está acabando")) throw new Error(msg);
    await pagina.keyboard.press("End");
    igual(await range.getAttribute("aria-valuetext"), "Botijão com 100 por cento");
    igual(await titulo.textContent(), "TUDO CERTO POR ENQUANTO");
    for (let i = 0; i < 31; i++) await pagina.keyboard.press("ArrowDown");
    igual(await range.getAttribute("aria-valuetext"), "Botijão com 69 por cento");
    igual(await titulo.textContent(), "FIQUE DE OLHO");
    await pagina.keyboard.press("ArrowUp");
    igual(await titulo.textContent(), "TUDO CERTO POR ENQUANTO", "70%: ");
    for (let i = 0; i < 41; i++) await pagina.keyboard.press("ArrowDown");
    igual(await range.getAttribute("aria-valuetext"), "Botijão com 29 por cento");
    igual(await titulo.textContent(), "HORA DE PEDIR", "29%: ");
    return "Home=0 · End=100 · 69 → FIQUE DE OLHO · 70 → TUDO CERTO · 29 → HORA DE PEDIR";
  });

  await checar("A", "termômetro: atalhos CHEIO/METADE/ACABANDO", async () => {
    for (const [rotulo, valor, estado] of [
      ["CHEIO", "100", "TUDO CERTO POR ENQUANTO"],
      ["METADE", "50", "FIQUE DE OLHO"],
      ["ACABANDO", "12", "HORA DE PEDIR"],
    ]) {
      const botao = pagina.getByRole("button", { name: rotulo, exact: true });
      await botao.click();
      igual(await range.inputValue(), valor, `${rotulo}: `);
      igual(await botao.getAttribute("aria-pressed"), "true", `${rotulo} aria-pressed: `);
      igual(await titulo.textContent(), estado);
    }
  });

  await checar("A", "termômetro: tocar no botijão define o nível", async () => {
    const svg = pagina.locator("[data-botijao]");
    const caixa = await svg.boundingBox();
    await svg.click({ position: { x: caixa.width / 2, y: caixa.height * 0.3 } });
    const valor = Number(await range.inputValue());
    if (valor < 70) throw new Error(`toque no alto do botijão deu ${valor}%`);
    return `toque a 30% da altura → ${valor}%`;
  });
  await contexto.close();
}

/* ================================================================== */
/* A) Formulários                                                      */
/* ================================================================== */
{
  const { contexto, pagina } = await novaPagina({ viewport: { width: 390, height: 844 } }, { stubAbrir: true });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  const card = pagina.locator("[data-pedido]");

  await checar("A", "pedido: avançar sem preencher mostra erros inline e foca o 1º campo", async () => {
    await card.getByRole("button", { name: /continuar/i }).click();
    await card.getByRole("button", { name: /continuar/i }).click();
    await pagina.waitForSelector("[data-erro]");
    const erros = await card.locator("[data-erro]").allTextContents();
    igual(erros.length, 2, "nº de erros: ");
    igual(await pagina.evaluate(() => document.activeElement?.id), "pedido-bairro", "foco: ");
    igual(await pagina.locator("#pedido-bairro").getAttribute("aria-invalid"), "true");
    igual(await pagina.locator("#pedido-bairro").getAttribute("aria-describedby"), "pedido-bairro-erro");
    const abertos = await pagina.evaluate(() => window.__abertos.length);
    igual(abertos, 0, "não pode abrir o WhatsApp: ");
    return erros.join(" | ");
  });

  await checar("A", "pedido preenchido gera a mensagem exata no WhatsApp", async () => {
    await pagina.locator("#pedido-bairro").fill("Laranjeiras");
    await pagina.locator("#pedido-rua").fill("Rua das Acácias, 100");
    await pagina.locator("#pedido-complemento").fill("casa azul");
    await card.getByRole("button", { name: /continuar/i }).click();
    await pagina.locator("#pedido-pagamento").selectOption("Pix");
    await pagina.locator("#pedido-nome").fill("Maria");
    await card.getByRole("button", { name: /voltar/i }).click();
    await card.getByRole("button", { name: /voltar/i }).click();
    await pagina.locator("#pedido-tamanho").fill("o mesmo de sempre");
    await pagina.getByRole("button", { name: "Aumentar quantidade" }).click();
    await card.getByRole("button", { name: /continuar/i }).click();
    await card.getByRole("button", { name: /continuar/i }).click();
    await card.locator("[data-enviar-pedido]").click();
    const [url] = await pagina.evaluate(() => window.__abertos);
    if (!url) throw new Error("WhatsApp não foi aberto");
    if (!url.includes("%0A")) throw new Error("quebras de linha não viraram %0A");
    igual(new URL(url).pathname, `/${WHATSAPP_NUMBER}`);
    igual(
      textoDecodificado(url),
      "Olá! Vim pelo site e quero pedir gás.\n\nBotijão: o mesmo de sempre x2\nBairro: Laranjeiras\nEndereço: Rua das Acácias, 100, casa azul\nPagamento: Pix\nNome: Maria\n\nPode confirmar o valor e o prazo?",
    );
  });

  await checar("A", "empresas: sem preencher mostra erro; preenchido abre WhatsApp", async () => {
    const form = pagina.locator("[data-form-empresa]");
    await form.locator("[data-enviar-empresa]").click();
    await form.locator("[data-erro]").waitFor();
    igual(await pagina.evaluate(() => document.activeElement?.id), "empresa-nome", "foco: ");
    await pagina.locator("#empresa-nome").fill("Padaria Exemplo");
    await pagina.locator("#empresa-qtd").fill("4");
    await form.locator("[data-enviar-empresa]").click();
    const abertos = await pagina.evaluate(() => window.__abertos);
    igual(
      textoDecodificado(abertos.at(-1)),
      "Olá! Vim pelo site e quero falar sobre abastecimento de gás para a minha empresa.\n\nEmpresa: Padaria Exemplo\nBotijões por semana: 4\n\nPodemos conversar?",
    );
  });

  await checar("A", "nada é enviado a servidor (nenhum fetch/XHR/beacon durante o uso)", async () => {
    const pedidos = [];
    const { contexto: c2, pagina: p2 } = await novaPagina({ viewport: { width: 390, height: 844 } }, { stubAbrir: true });
    p2.on("request", (r) => {
      if (["fetch", "xhr", "ping", "eventsource", "websocket"].includes(r.resourceType())) pedidos.push(r.url());
    });
    await p2.goto(BASE, { waitUntil: "networkidle" });
    await p2.locator("#empresa-nome").fill("Teste");
    await p2.locator("[data-enviar-empresa]").click();
    await p2.waitForTimeout(300);
    await c2.close();
    if (pedidos.length) throw new Error(pedidos.join(", "));
  });
  await contexto.close();
}

/* ================================================================== */
/* A/B) Layout: overflow, iPhone SE, texto cortado, movimento reduzido */
/* ================================================================== */
await checar("A", "sem overflow horizontal em 360 px (e 320 px)", async () => {
  const det = [];
  for (const largura of [360, 320]) {
    const { contexto, pagina } = await novaPagina({ viewport: { width: largura, height: 740 } });
    await pagina.goto(BASE, { waitUntil: "networkidle" });
    const { sw, cw } = await pagina.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
    if (sw > cw) throw new Error(`${largura}px: scrollWidth ${sw} > ${cw}`);
    const selo = await pagina.locator(".selo-status").boundingBox();
    if (selo.x + selo.width > largura) throw new Error(`${largura}px: selo de status vaza a tela`);
    det.push(`${largura}px ok`);
    await contexto.close();
  }
  return det.join(" · ");
});

await checar("B", "iPhone SE (375×667): H1 e CTA do WhatsApp visíveis sem rolar", async () => {
  const { contexto, pagina } = await novaPagina({ viewport: { width: 375, height: 667 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  await pagina.evaluate(() => document.fonts.ready);
  const h1 = await pagina.locator("#titulo-hero").boundingBox();
  const cta = await pagina.locator('#topo a[data-cta="whatsapp"]').boundingBox();
  const limite = 667 - 64; // a barra fixa cobre os últimos 64 px
  if (h1.y < 64 || h1.y + h1.height > limite) throw new Error(`H1 ${JSON.stringify(h1)}`);
  if (cta.y + cta.height > limite) throw new Error(`CTA termina em ${cta.y + cta.height}px (limite ${limite})`);
  if (!SEM_SCREENSHOTS) await pagina.screenshot({ path: join(SAIDA, "screens", "375x667-iphone-se.png") });
  await contexto.close();
  return `CTA termina em ${Math.round(cta.y + cta.height)} px (visível até ${limite} px)`;
});

await checar("B", "nenhum texto cortado (elementos com overflow escondendo conteúdo)", async () => {
  const problemas = [];
  for (const viewport of [
    { width: 360, height: 740 },
    { width: 768, height: 1024 },
    { width: 1440, height: 900 },
  ]) {
    const { contexto, pagina } = await novaPagina({ viewport });
    await pagina.goto(BASE, { waitUntil: "networkidle" });
    await pagina.evaluate(() => document.fonts.ready);
    const cortados = await pagina.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || el.closest("[hidden], noscript, .sr-only, .sr-only-focusable, svg")) return false;
          if (!el.childNodes.length || ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return false;
          return el.scrollWidth > el.clientWidth + 1 && /hidden|clip/.test(cs.overflowX + cs.textOverflow);
        })
        .map((el) => `${el.tagName.toLowerCase()}: “${el.textContent.trim().slice(0, 40)}”`),
    );
    problemas.push(...cortados.map((c) => `${viewport.width}px ${c}`));
    await contexto.close();
  }
  if (problemas.length) throw new Error(problemas.join("; "));
});

await checar("B", "mascote sem caixa branca (PNG com cantos transparentes)", async () => {
  const { data, info } = await sharp(join(raiz, "public/brand/mascote.png")).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alfa = (x, y) => data[(y * info.width + x) * 4 + 3];
  const cantos = [alfa(0, 0), alfa(info.width - 1, 0), alfa(0, info.height - 1), alfa(info.width - 1, info.height - 1)];
  if (cantos.some((a) => a > 10)) throw new Error(`cantos opacos (alfa ${cantos}) — rode npm run imagens -- --remover-fundo`);
  return `${info.width}×${info.height}, cantos transparentes`;
});

await checar("B", "mascote nunca exibido acima do tamanho real nem acima de 160 px (baixa resolução)", async () => {
  const { contexto, pagina } = await novaPagina({ viewport: { width: 1440, height: 900 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  const imgs = await pagina.$$eval('img[src*="mascote"]', (is) => is.map((i) => ({ w: i.getBoundingClientRect().width, n: i.naturalWidth })));
  for (const i of imgs) {
    if (i.w > i.n + 0.5) throw new Error(`ampliado: ${i.w}px de ${i.n}px`);
    if (i.n < 560 && i.w > 160) throw new Error(`baixa resolução exibida a ${i.w}px`);
  }
  await contexto.close();
  return imgs.map((i) => `${Math.round(i.w)}px`).join(", ");
});

await checar("A", "prefers-reduced-motion desliga pulso, pulinho e transição do nível", async () => {
  const { contexto, pagina } = await novaPagina({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  const r = await pagina.evaluate(() => ({
    pulinho: getComputedStyle(document.querySelector(".mascote-pulinho")).animationName,
    nivel: getComputedStyle(document.querySelector(".nivel-gas")).transitionDuration,
    revelar: getComputedStyle(document.querySelector("[data-revelar]")).transform,
  }));
  if (r.pulinho !== "none" || r.nivel !== "0s" || r.revelar !== "none") throw new Error(JSON.stringify(r));
  await contexto.close();
});

/* ================================================================== */
/* Acessibilidade básica                                               */
/* ================================================================== */
{
  const { contexto, pagina } = await novaPagina({ viewport: { width: 390, height: 844 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  await checar("A11y", "lang=pt-BR, um único H1, campos com rótulo, imagens com alt", async () => {
    const r = await pagina.evaluate(() => ({
      lang: document.documentElement.lang,
      h1: document.querySelectorAll("h1").length,
      semRotulo: [...document.querySelectorAll("input, select, textarea")].filter((c) => !c.labels?.length && !c.getAttribute("aria-label")).map((c) => c.id),
      semAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    }));
    igual(r.lang, "pt-BR");
    igual(r.h1, 1, "H1: ");
    if (r.semRotulo.length) throw new Error(`campos sem rótulo: ${r.semRotulo}`);
    igual(r.semAlt, 0, "imagens sem alt: ");
  });
  await checar("A11y", "alvos de toque ≥ 48 px nos botões e links principais", async () => {
    const pequenos = await pagina.$$eval("main a, main button, header a, footer a, footer button, nav a", (els) =>
      els
        .filter((e) => e.offsetParent !== null && !e.closest("p:not([class*=flex])"))
        .map((e) => ({ t: (e.getAttribute("aria-label") || e.textContent).trim().slice(0, 30), h: e.getBoundingClientRect().height }))
        .filter((e) => e.h > 0 && e.h < 47.5),
    );
    if (pequenos.length) throw new Error(pequenos.map((p) => `${p.t} (${Math.round(p.h)}px)`).join("; "));
  });
  await checar("A11y", "foco visível de 3 px", async () => {
    await pagina.keyboard.press("Tab");
    await pagina.keyboard.press("Tab");
    const contorno = await pagina.evaluate(() => {
      const cs = getComputedStyle(document.activeElement);
      return `${cs.outlineStyle} ${cs.outlineWidth}`;
    });
    igual(contorno, "solid 3px");
  });
  await checar("A11y", "FAQ em <details> nativo", async () => {
    const n = await pagina.locator("#duvidas details > summary").count();
    if (n < 6) throw new Error(`${n} perguntas`);
    return `${n} perguntas`;
  });
  await contexto.close();
}

/* ================================================================== */
/* C) Conteúdo proibido                                                */
/* ================================================================== */
const PROIBIDOS = [
  ["R$", /R\$/],
  ["min (minutos)", /\b\d+\s*min\b|\bminutos?\b|\bmin\.?\s*$/im],
  ["grátis", /gr[aá]tis/i],
  ["24h", /24\s*h/i],
  ["garantido", /garantid/i],
  ["marca alheia “Gás Urgente”", /(?<!Atende )G[áa]s Urgente/i],
  ["desconto/promoção/brinde", /desconto|promo[çc][ãa]o|brinde/i],
  ["prazo prometido (relâmpago/rápido/expresso)", /rel[âa]mpago|r[áa]pid[oa]|expresso/i],
  ["depoimentos/estrelas", /depoimento|estrelas|★/i],
  ["preço", /pre[çc]o/i],
];

{
  const { contexto, pagina } = await novaPagina({ viewport: { width: 1440, height: 900 } });
  await pagina.goto(BASE, { waitUntil: "networkidle" });
  const textoPagina = await pagina.evaluate(() => {
    document.querySelectorAll("details").forEach((d) => (d.open = true));
    const metas = [...document.querySelectorAll("meta[content], title")].map((m) => m.getAttribute("content") ?? m.textContent);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent);
    const links = [...document.querySelectorAll("a[href]")].map((a) => decodeURIComponent(a.href));
    const rotulos = [...document.querySelectorAll("[aria-label], [alt], [title]")].map((e) => e.getAttribute("aria-label") ?? e.getAttribute("alt") ?? e.title);
    return [document.body.innerText, ...metas, ...ld, ...links, ...rotulos].join("\n");
  });
  await contexto.close();

  // Código: todas as strings de conteúdo (src/data, componentes) — sem comentários nem nomes de variáveis/classes.
  const arquivosFonte = [];
  const andar = (dir) => {
    for (const nome of readdirSync(dir)) {
      const c = join(dir, nome);
      if (statSync(c).isDirectory()) andar(c);
      else if (/\.(tsx?|css)$/.test(nome)) arquivosFonte.push(c);
    }
  };
  andar(join(raiz, "src"));
  const textoCodigo = arquivosFonte
    .map((f) => {
      const src = readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, "");
      // strings, template literals e texto JSX (">texto<", sem confundir com comparações "a > b")
      const literais = [...src.matchAll(/"([^"\n]*)"|`([^`]*)`|(?<=[^\s=])>([^<>{}\n]+)</g)].map((m) => m[1] ?? m[2] ?? m[3]);
      return literais.filter((l) => !/^[\w\s:[\]\-/.!#%()&,'_=>]*$/.test(l) || /[À-ú]/.test(l) || /\s/.test(l)).join("\n");
    })
    .join("\n")
    // utilitários de CSS/Tailwind não são conteúdo
    .replace(/\b(?:min|max)-[\w[\]().%-]+/g, "");

  for (const [nome, re] of PROIBIDOS) {
    await checar("C", `zero ocorrências de ${nome}`, async () => {
      const naPagina = textoPagina.match(re);
      const noCodigo = textoCodigo.match(re);
      if (naPagina || noCodigo) throw new Error(`achado: “${(naPagina ?? noCodigo)[0]}” ${naPagina ? "na página" : "no código"}`);
    });
  }
  await checar("C", "“A CONFIRMAR” aparece só como marcador", async () => {
    const n = (textoPagina.match(/A CONFIRMAR/g) ?? []).length;
    return `${n} marcador(es) visível(is)`;
  });
}

/* ================================================================== */
/* Contraste, tamanho de JS, erros de console                          */
/* ================================================================== */
await checar("A", "contraste AA de todos os pares de cor", async () => {
  const r = verificarContraste();
  const falhas = r.filter((x) => !x.ok);
  if (falhas.length) throw new Error(falhas.map((f) => `${f.frente}/${f.fundo} ${f.razao}`).join("; "));
  return `${r.length} pares; menor: ${Math.min(...r.map((x) => x.razao)).toFixed(2)}:1`;
});

let jsGzip = 0;
await checar("Perf", "JS carregado na home (gzip)", async () => {
  const html = readFileSync(join(PASTA, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script[^>]*src="([^"]+\.js)"[^>]*>/g)].filter((m) => !/noModule/i.test(m[0])).map((m) => m[1]);
  jsGzip = scripts.reduce((soma, s) => soma + gzipSync(readFileSync(join(PASTA, s))).length, 0);
  const inline = [...html.matchAll(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g)].reduce((s, m) => s + gzipSync(m[1]).length, 0);
  const kb = (n) => `${(n / 1024).toFixed(1)} KB`;
  return {
    ok: true,
    detalhe: `${kb(jsGzip)} em ${scripts.length} arquivos + ${kb(inline)} inline (meta do briefing: < 90 KB${jsGzip > 90 * 1024 ? " — ACIMA, ver relatório" : ""})`,
  };
});

await checar("A", "nenhum erro ou aviso no console (hidratação incluída)", async () => {
  const unicos = [...new Set(errosConsole)];
  if (unicos.length) throw new Error(unicos.slice(0, 5).join(" | "));
});

await navegador.close();
servidor.close();

/* ================================================================== */
/* Relatório                                                           */
/* ================================================================== */
const falhas = resultados.filter((r) => !r.ok);
const linhas = [
  "# Relatório de QA — Atende Gás Urgente",
  "",
  `Gerado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} · pasta testada: \`${opcao("--pasta", "out")}\`${args.includes("--revisao") ? " (build de revisão)" : ""}`,
  "",
  `**${resultados.length - falhas.length}/${resultados.length} verificações passaram.**`,
  "",
  "| | Grupo | Verificação | Detalhe |",
  "|---|---|---|---|",
  ...resultados.map((r) => `| ${r.ok ? "✅" : "❌"} | ${r.grupo} | ${r.nome} | ${r.detalhe.replace(/\|/g, "\\|").replace(/\n/g, " ")} |`),
  "",
  SEM_SCREENSHOTS ? "" : "Screenshots em `qa/screens/` (uma pasta por viewport + `375x667-iphone-se.png`).",
];
await mkdir(SAIDA, { recursive: true });
await writeFile(join(SAIDA, "relatorio.md"), linhas.join("\n") + "\n");
console.log(`\n${resultados.length - falhas.length}/${resultados.length} ok — relatório em qa/relatorio.md`);
process.exit(falhas.length ? 1 : 0);
