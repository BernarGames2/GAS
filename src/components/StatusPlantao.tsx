"use client";

import { useEffect, useState } from "react";
import { horariosTexto } from "@/data/gas";
import { getStatus, type Status } from "@/lib/status";

/**
 * Selo do plantão. Sem JS (e antes de hidratar) mostra o horário fixo; depois troca
 * pelo status ao vivo, calculado no fuso de Uberlândia. Largura muda, altura não (sem CLS).
 */
export function StatusPlantao() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const atualizar = () => setStatus(getStatus(new Date()));
    atualizar();
    const id = window.setInterval(atualizar, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const estado = status === null ? "neutro" : status.aberto ? "aberto" : "fechado";

  return (
    <p
      className="selo-status inline-flex max-w-full items-center gap-2.5 rounded-full border-2 border-marinho bg-branco px-3.5 font-titulo text-[0.9375rem] font-extrabold uppercase leading-none tracking-[0.03em] text-marinho"
      data-status={estado}
    >
      <span className="bolinha" data-estado={estado} aria-hidden="true" />
      <span data-status-texto>{status?.rotulo ?? horariosTexto.selo}</span>
    </p>
  );
}
