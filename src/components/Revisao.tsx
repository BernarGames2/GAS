/** Etiqueta para blocos que só aparecem no build de revisão (ainda não aprovados pela cliente). */
export function SeloRevisao() {
  return (
    <p className="marcador mb-4 bg-white text-alerta" data-revisao>
      EM REVISÃO · A CONFIRMAR COM A CLIENTE
    </p>
  );
}

/** Marcador visível para fatos ainda não confirmados. */
export function ACONFIRMAR({ className = "" }: { className?: string }) {
  return (
    <span className={`marcador ${className}`} data-a-confirmar>
      A CONFIRMAR
    </span>
  );
}
