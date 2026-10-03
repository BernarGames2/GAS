// Valida o contraste WCAG 2.x (AA) de todos os pares de cor usados no site.
// As cores são lidas de src/app/globals.css (fonte única dos tokens).
// Uso: npm run contraste   (sai com código 1 se algum par reprovar)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));

export function lerTokens() {
  const css = readFileSync(`${raiz}src/app/globals.css`, "utf8");
  const tokens = {};
  for (const [, nome, valor] of css.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) tokens[nome] = valor.toUpperCase();
  return tokens;
}

function canal(c) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminancia(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * canal((n >> 16) & 255) + 0.7152 * canal((n >> 8) & 255) + 0.0722 * canal(n & 255);
}

export function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Mistura `cor` com alfa sobre `fundo` (para fundos translúcidos). */
function sobre(cor, alfa, fundo) {
  const c = parseInt(cor.slice(1), 16);
  const f = parseInt(fundo.slice(1), 16);
  const mix = (sh) => Math.round(((c >> sh) & 255) * alfa + ((f >> sh) & 255) * (1 - alfa));
  return "#" + [16, 8, 0].map((sh) => mix(sh).toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function verificarContraste() {
  const t = lerTokens();
  const TEXTO = 4.5;
  const NAO_TEXTO = 3; // ícones, bordas de campo, anel de foco (WCAG 1.4.11)
  const chipHero = sobre("#FFFFFF", 0.7, t.amarelo);
  const pares = [
    ["azul-marinho", t["azul-marinho"], "amarelo", t.amarelo, TEXTO, "texto do hero e do header"],
    ["azul-marinho", t["azul-marinho"], "chip do hero (branco 70% sobre amarelo)", chipHero, TEXTO, "chips de confiança"],
    ["azul-marinho", t["azul-marinho"], "amarelo-claro", t["amarelo-claro"], TEXTO, "Quem somos, rodapé do cartão"],
    ["azul-marinho", t["azul-marinho"], "papel", t.papel, TEXTO, "títulos em fundo claro"],
    ["azul-marinho", t["azul-marinho"], "branco", t.branco, TEXTO, "cartões"],
    ["grafite", t.grafite, "papel", t.papel, TEXTO, "texto corrido"],
    ["grafite", t.grafite, "branco", t.branco, TEXTO, "texto em cartões"],
    ["grafite", t.grafite, "amarelo-claro", t["amarelo-claro"], TEXTO, "texto em Quem somos"],
    ["branco", t.branco, "azul-marinho", t["azul-marinho"], TEXTO, "seção do pedido, rodapé, barra fixa"],
    ["amarelo", t.amarelo, "azul-marinho", t["azul-marinho"], TEXTO, "títulos na seção escura"],
    ["branco", t.branco, "zap", t.zap, TEXTO, "botão WhatsApp"],
    ["branco", t.branco, "zap-hover", t["zap-hover"], TEXTO, "botão WhatsApp (hover)"],
    ["zap", t.zap, "papel", t.papel, TEXTO, "legenda da prévia"],
    ["azul", t.azul, "branco", t.branco, TEXTO, "links"],
    ["azul", t.azul, "papel", t.papel, TEXTO, "links"],
    ["alerta", t.alerta, "papel", t.papel, TEXTO, "numerais do bloco de segurança"],
    ["alerta", t.alerta, "branco", t.branco, TEXTO, "asterisco/193 em cartão branco"],
    ["branco", t.branco, "alerta", t.alerta, NAO_TEXTO, "ícone do escudo"],
    ["erro", "#B3261E", "papel", t.papel, TEXTO, "mensagens de erro"],
    ["erro", "#B3261E", "branco", t.branco, TEXTO, "mensagens de erro"],
    ["cinza", "#5D6472", "papel", t.papel, TEXTO, "etapas futuras / placeholder"],
    ["cinza", "#5D6472", "branco", t.branco, TEXTO, "placeholder dos campos"],
    ["azul (foco)", t.azul, "amarelo", t.amarelo, NAO_TEXTO, "anel de foco no hero"],
    ["azul (foco)", t.azul, "papel", t.papel, NAO_TEXTO, "anel de foco"],
    ["azul (foco)", t.azul, "branco", t.branco, NAO_TEXTO, "anel de foco"],
    ["amarelo (foco)", t.amarelo, "azul-marinho", t["azul-marinho"], NAO_TEXTO, "anel de foco na seção escura"],
    ["azul-marinho (borda)", t["azul-marinho"], "branco", t.branco, NAO_TEXTO, "borda dos campos"],
  ];

  return pares.map(([nf, f, nb, b, minimo, uso]) => {
    const razao = contraste(f, b);
    return { frente: `${nf} ${f}`, fundo: `${nb} ${b}`, razao: Math.round(razao * 100) / 100, minimo, uso, ok: razao >= minimo };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const resultado = verificarContraste();
  for (const r of resultado) {
    console.log(`${r.ok ? "OK " : "XX "} ${r.razao.toFixed(2).padStart(5)}:1 (mín ${r.minimo}) ${r.frente} sobre ${r.fundo} — ${r.uso}`);
  }
  const falhas = resultado.filter((r) => !r.ok);
  console.log(falhas.length ? `\n${falhas.length} par(es) reprovado(s)` : `\nTodos os ${resultado.length} pares passam AA.`);
  process.exit(falhas.length ? 1 : 0);
}
