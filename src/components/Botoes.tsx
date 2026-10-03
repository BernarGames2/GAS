import type { ReactNode } from "react";
import { telefone } from "@/data/gas";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { IconeTelefone, IconeZap } from "./Icones";

type Tamanho = "g" | "m" | "p";

const classeTamanho: Record<Tamanho, string> = { g: "btn-g", m: "", p: "btn-p" };

export function BotaoZap({
  mensagem,
  children,
  tamanho = "m",
  className = "",
  variante = "zap",
  rotuloAcessivel,
}: {
  mensagem: string;
  children: ReactNode;
  tamanho?: Tamanho;
  className?: string;
  /** "zap" = botão principal verde; "outline" = secundário (ainda abre o WhatsApp). */
  variante?: "zap" | "outline";
  rotuloAcessivel?: string;
}) {
  const estilo = variante === "zap" ? "btn-zap" : "btn-outline";
  return (
    <a
      href={buildWhatsAppUrl(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={rotuloAcessivel ? `${rotuloAcessivel} (abre o WhatsApp)` : undefined}
      className={`btn ${estilo} ${classeTamanho[tamanho]} ${className}`}
      data-cta="whatsapp"
    >
      <IconeZap />
      <span>{children}</span>
    </a>
  );
}

export function BotaoLigar({
  children,
  tamanho = "m",
  variante = "outline",
  className = "",
}: {
  children: ReactNode;
  tamanho?: Tamanho;
  variante?: "outline" | "marinho" | "claro";
  className?: string;
}) {
  const estilo = { outline: "btn-outline", marinho: "btn-marinho", claro: "btn-claro" }[variante];
  return (
    <a
      href={telefone.href}
      aria-label={`Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
      className={`btn ${estilo} ${classeTamanho[tamanho]} ${className}`}
      data-cta="telefone"
    >
      <IconeTelefone />
      <span>{children}</span>
    </a>
  );
}

/** Link discreto "ou ligue" que acompanha o botão principal. */
export function LinkLigar({ className = "", prefixo = "Prefere ligar?" }: { className?: string; prefixo?: string }) {
  return (
    <a
      href={telefone.href}
      aria-label={`${prefixo} Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
      className={`inline-flex min-h-12 items-center gap-2 font-semibold underline decoration-2 underline-offset-4 ${className}`}
      data-cta="telefone"
    >
      <IconeTelefone className="h-5 w-5" />
      <span>
        {prefixo} {telefone.exibicao}
      </span>
    </a>
  );
}
