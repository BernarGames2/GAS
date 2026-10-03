import { empresa, mensagens, telefone } from "@/data/gas";
import { BotaoZap } from "./Botoes";
import { IconeTelefone } from "./Icones";
import { Mascote } from "./Mascote";

export function Header() {
  return (
    <header className="sticky top-0 z-40 h-16 border-b-2 border-marinho bg-amarelo text-marinho">
      <div className="container-site flex h-full items-center justify-between gap-3">
        <a href="#topo" className="flex min-h-12 items-center gap-2.5" aria-label={`${empresa.nome} — início`}>
          <Mascote largura={40} decorativo prioridade className="w-10" />
          <span className="font-titulo text-[1.375rem] font-extrabold uppercase leading-none tracking-[0.01em] sm:text-2xl">
            {empresa.nomeCaixaAlta}
          </span>
        </a>

        <div className="hidden items-center gap-5 md:flex">
          <a
            href={telefone.href}
            aria-label={`Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
            className="inline-flex min-h-12 items-center gap-2 font-titulo text-xl font-extrabold"
            data-cta="telefone"
          >
            <IconeTelefone className="h-5 w-5" />
            {telefone.exibicao}
          </a>
          <BotaoZap mensagem={mensagens.padrao} tamanho="p" rotuloAcessivel="Pedir gás">
            Pedir gás
          </BotaoZap>
        </div>

        <a
          href={telefone.href}
          aria-label={`Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
          className="grid h-12 w-12 place-items-center rounded-full border-2 border-marinho bg-branco md:hidden"
          data-cta="telefone"
        >
          <IconeTelefone className="h-6 w-6" />
        </a>
      </div>
    </header>
  );
}
