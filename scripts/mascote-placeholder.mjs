// Gera um PLACEHOLDER genérico (botijão sem rosto, sem boné, sem polegar) em
// public/brand/mascote.png, só para o layout funcionar enquanto o arquivo da
// cliente não chega. NÃO é o mascote e não tenta imitá-lo.
// Uso: node scripts/mascote-placeholder.mjs && npm run imagens -- --placeholder
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="200" viewBox="-6 -6 172 212">
  <g fill="#FFFFFF" stroke="#FFFFFF" stroke-width="12" stroke-linejoin="round">
    <rect x="40" y="6" width="80" height="54" rx="16"/>
    <rect x="14" y="50" width="132" height="134" rx="40"/>
    <rect x="34" y="178" width="92" height="16" rx="5"/>
  </g>
  <g stroke="#12306B" stroke-width="6" stroke-linejoin="round">
    <rect x="40" y="6" width="80" height="54" rx="16" fill="#FFC400"/>
    <rect x="14" y="50" width="132" height="134" rx="40" fill="#FFC400"/>
    <rect x="34" y="178" width="92" height="16" rx="5" fill="#12306B"/>
  </g>
  <rect x="53" y="17" width="54" height="16" rx="8" fill="#12306B"/>
  <rect x="70" y="36" width="20" height="18" rx="3" fill="#12306B"/>
  <path d="M17 117h126" stroke="#12306B" stroke-width="4"/>
  <rect x="30" y="68" width="10" height="92" rx="5" fill="#FFFFFF" fill-opacity=".55"/>
  <rect x="50" y="78" width="60" height="30" rx="6" fill="#FFFFFF" stroke="#12306B" stroke-width="3"/>
  <path d="M80 83c6 6 9 10 9 14a9 9 0 0 1-18 0c0-3 2-6 4-8 0 3 2 5 4 5-1-4 0-7 1-11z" fill="#12306B"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(`${raiz}public/brand/mascote.png`);
console.log("placeholder gerado em public/brand/mascote.png (160×200)");
