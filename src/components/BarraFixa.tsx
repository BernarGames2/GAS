import { mensagens, telefone } from "@/data/gas";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { IconeTelefone, IconeZap } from "./Icones";

/** Só no celular: sempre visível, 64 px + área segura do aparelho. */
export function BarraFixa() {
  return (
    <nav
      aria-label="Pedir gás"
      className="fixed inset-x-0 bottom-0 z-50 bg-marinho md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="faixa-zebrada !h-1" aria-hidden="true" />
      <div className="flex h-16">
        <a
          href={buildWhatsAppUrl(mensagens.padrao)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pedir no WhatsApp (abre o WhatsApp)"
          className="flex basis-[65%] items-center justify-center gap-2 bg-zap font-titulo text-xl font-extrabold uppercase text-branco active:bg-zap-hover"
          data-cta="whatsapp"
        >
          <IconeZap className="h-6 w-6" />
          Pedir no WhatsApp
        </a>
        <a
          href={telefone.href}
          aria-label={`Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
          className="flex basis-[35%] items-center justify-center gap-2 bg-marinho font-titulo text-xl font-extrabold uppercase text-branco"
          data-cta="telefone"
        >
          <IconeTelefone className="h-5 w-5" />
          Ligar
        </a>
      </div>
    </nav>
  );
}
