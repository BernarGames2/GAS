// Gera public/og.png (1200×630): mascote + "ACABOU O GÁS?".
// Rode de novo sempre que trocar o mascote: npm run og (precisa de internet para baixar as fontes;
// atrás de proxy no Node 22: NODE_USE_ENV_PROXY=1 npm run og)
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const dados = JSON.parse(readFileSync(`${raiz}src/data/mascote.json`, "utf8"));
const png = readFileSync(`${raiz}public/brand/mascote.png`).toString("base64");
// baixa resolução: nunca acima de 160 px nem acima do tamanho real
const largura = Math.min(dados.largura, dados.largura >= 560 ? 300 : 160);

// Fontes embutidas (data URL) só com os caracteres usados — o Chromium não precisa de rede.
const TEXTO_TITULO = "ATENDE GÁS URGENTE Acabou o gás? PEÇA PELO WHATSAPP";
const TEXTO_CORPO = "Uberlândia · Laranjeiras";
async function fonteEmbutida(familia, texto) {
  const ua = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";
  const url = `https://fonts.googleapis.com/css2?family=${familia}&display=block&text=${encodeURIComponent(texto)}`;
  let css = await (await fetch(url, { headers: { "user-agent": ua } })).text();
  for (const [, arquivo] of css.matchAll(/url\((https:[^)]+)\)/g)) {
    const bin = Buffer.from(await (await fetch(arquivo)).arrayBuffer()).toString("base64");
    css = css.replace(arquivo, `data:font/woff2;base64,${bin}`);
  }
  return css;
}
const fontes =
  (await fonteEmbutida("Barlow+Condensed:wght@800", TEXTO_TITULO + TEXTO_TITULO.toUpperCase())) +
  (await fonteEmbutida("Barlow:wght@600", TEXTO_CORPO));

const html = `<!doctype html><html><head><meta charset="utf-8">
<style>${fontes}</style>
<style>
  *{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;overflow:hidden;background:#FFC400;color:#12306B;font-family:'Barlow',sans-serif;position:relative;
    background-image:radial-gradient(rgba(18,48,107,.08) 2px,transparent 2.2px);background-size:22px 22px}
  .conteudo{position:absolute;left:80px;top:70px}
  .marca{font:800 34px 'Barlow Condensed';letter-spacing:.04em;border:3px solid #12306B;border-radius:8px;padding:6px 14px;display:inline-block}
  h1{font:800 150px/0.92 'Barlow Condensed';text-transform:uppercase;letter-spacing:-.01em;margin-top:34px}
  .faixa{display:inline-block;background:#fff;padding:2px 22px 0;transform:rotate(-2deg);box-shadow:8px 8px 0 #12306B;margin-top:20px;font:800 64px 'Barlow Condensed'}
  .local{margin-top:34px;font-size:30px}
  .palco{position:absolute;right:110px;top:150px;width:300px;height:300px;border-radius:50%;background:#12306B;display:grid;place-items:center}
  .palco::before{content:"";position:absolute;inset:-14px;border-radius:50%;border:4px dashed #12306B}
  .palco img{width:${largura}px;transform:translateY(6%)}
  .zebra{position:absolute;left:0;right:0;bottom:0;height:22px;background:repeating-linear-gradient(45deg,#FFC400 0 16px,#12306B 16px 32px)}
</style></head><body>
  <div class="conteudo">
    <div class="marca">ATENDE GÁS URGENTE</div>
    <h1>Acabou<br>o gás?</h1>
    <div class="faixa">PEÇA PELO WHATSAPP</div>
    <p class="local">Uberlândia · Laranjeiras</p>
  </div>
  <div class="palco"><img src="data:image/png;base64,${png}" alt=""></div>
  <div class="zebra"></div>
</body></html>`;

const executablePath =
  process.env.CHROMIUM_PATH ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const navegador = await chromium.launch({ executablePath });
const pagina = await navegador.newPage({ viewport: { width: 1200, height: 630 } });
await pagina.setContent(html, { waitUntil: "networkidle" });
await pagina.evaluate(() => document.fonts.ready);
await pagina.screenshot({ path: `${raiz}public/og.png` });
await navegador.close();
console.log("public/og.png gerado (1200×630)");
