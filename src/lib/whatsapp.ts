import { WHATSAPP_NUMBER } from "@/data/gas";

/** Link wa.me com a mensagem já escrita. encodeURIComponent transforma "\n" em %0A. */
export function buildWhatsAppUrl(msg: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/** Abre o WhatsApp a partir de um formulário (gesto do usuário). Nada é enviado a servidor. */
export function abrirWhatsApp(msg: string): void {
  const url = buildWhatsAppUrl(msg);
  const janela = window.open(url, "_blank");
  if (janela) janela.opener = null;
  else window.location.href = url;
}
