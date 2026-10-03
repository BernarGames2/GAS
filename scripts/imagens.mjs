// Prepara o mascote para o site:
//   1. (opcional) --remover-fundo: deixa transparente o fundo claro que encosta nas bordas
//      (útil para o recorte do Instagram, que vem com fundo branco);
//   2. gera public/brand/mascote.webp e .avif;
//   3. grava largura/altura reais em src/data/mascote.json (o site nunca amplia a imagem).
// Uso: npm run imagens            → depois de trocar public/brand/mascote.png
//      npm run imagens -- --remover-fundo
import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const png = `${raiz}public/brand/mascote.png`;
const args = new Set(process.argv.slice(2));

let imagem = sharp(png).ensureAlpha();

if (args.has("--remover-fundo")) {
  const { data, info } = await imagem.raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const claro = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235;
  const visitado = new Uint8Array(w * h);
  const fila = [];
  for (let x = 0; x < w; x++) fila.push(x, (h - 1) * w + x);
  for (let y = 0; y < h; y++) fila.push(y * w, y * w + w - 1);
  while (fila.length) {
    const p = fila.pop();
    if (visitado[p]) continue;
    visitado[p] = 1;
    const i = p * 4;
    if (!claro(i)) continue;
    data[i + 3] = 0;
    const x = p % w;
    const y = (p / w) | 0;
    if (x > 0) fila.push(p - 1);
    if (x < w - 1) fila.push(p + 1);
    if (y > 0) fila.push(p - w);
    if (y < h - 1) fila.push(p + w);
  }
  imagem = sharp(data, { raw: info });
  await imagem.clone().trim().png().toFile(png + ".tmp");
  const { rename } = await import("node:fs/promises");
  await rename(png + ".tmp", png);
  imagem = sharp(png);
  console.log("fundo claro removido");
}

const meta = await sharp(png).metadata();
await sharp(png).webp({ quality: 90, alphaQuality: 100 }).toFile(`${raiz}public/brand/mascote.webp`);
await sharp(png).avif({ quality: 70 }).toFile(`${raiz}public/brand/mascote.avif`);

const dados = { largura: meta.width, altura: meta.height, placeholder: args.has("--placeholder") };
await writeFile(`${raiz}src/data/mascote.json`, JSON.stringify(dados, null, 2) + "\n");
console.log("mascote:", dados);
if (meta.width < 560) console.log("baixa resolução → o site limita o mascote a 160 px de largura");
