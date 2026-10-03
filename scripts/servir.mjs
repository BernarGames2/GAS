// Servidor estático mínimo para a pasta out/ (sem dependências).
// Uso: node scripts/servir.mjs [pasta=out] [porta=4173]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

export function servir(pasta = "out", porta = 4173) {
  const raiz = resolve(pasta);
  const servidor = createServer(async (req, res) => {
    try {
      const caminho = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
      let arquivo = normalize(join(raiz, caminho));
      if (!arquivo.startsWith(raiz)) throw new Error("fora da raiz");
      const info = await stat(arquivo).catch(() => null);
      if (info?.isDirectory()) arquivo = join(arquivo, "index.html");
      else if (!info && !extname(arquivo)) arquivo += ".html";
      const corpo = await readFile(arquivo);
      res.writeHead(200, { "content-type": TIPOS[extname(arquivo)] ?? "application/octet-stream" });
      res.end(corpo);
    } catch {
      res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
      res.end(await readFile(join(raiz, "404.html")).catch(() => "404"));
    }
  });
  return new Promise((ok) => servidor.listen(porta, "127.0.0.1", () => ok(servidor)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [pasta = "out", porta = "4173"] = process.argv.slice(2);
  await servir(pasta, Number(porta));
  console.log(`servindo ${pasta}/ em http://127.0.0.1:${porta}`);
}
