import { larguraSeguraMascote, mascote } from "@/data/gas";

/**
 * Mascote da cliente (arquivo em /public/brand). Nunca é ampliado além do tamanho real
 * e, em baixa resolução, nunca passa de 160 px de largura.
 */
export function Mascote({
  largura,
  className = "",
  decorativo = false,
  prioridade = false,
}: {
  largura: number;
  className?: string;
  decorativo?: boolean;
  prioridade?: boolean;
}) {
  const w = larguraSeguraMascote(largura);
  const h = Math.round((w * mascote.altura) / mascote.largura);
  return (
    <picture>
      <source srcSet={mascote.avif} type="image/avif" />
      <source srcSet={mascote.webp} type="image/webp" />
      <img
        src={mascote.png}
        width={w}
        height={h}
        alt={decorativo ? "" : mascote.alt}
        loading={prioridade ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={prioridade ? "high" : "auto"}
        className={`h-auto max-w-full ${className}`}
      />
    </picture>
  );
}
