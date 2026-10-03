// Build de REVISÃO: mostra também os blocos que ainda dependem de aprovação da cliente
// (segurança, água morna), com a etiqueta "EM REVISÃO". Saída em out-revisao/.
// Funciona em qualquer sistema (não depende de sintaxe de variável de ambiente do shell).
import { spawnSync } from "node:child_process";
import { renameSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";

const raiz = fileURLToPath(new URL("..", import.meta.url));
const r = spawnSync("npx", ["next", "build"], {
  cwd: raiz,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, NEXT_PUBLIC_MODO_REVISAO: "1" },
});
if (r.status !== 0) process.exit(r.status ?? 1);
rmSync(`${raiz}out-revisao`, { recursive: true, force: true });
renameSync(`${raiz}out`, `${raiz}out-revisao`);
console.log("\nBuild de revisão em out-revisao/ (os blocos não aprovados aparecem com a etiqueta EM REVISÃO).");
