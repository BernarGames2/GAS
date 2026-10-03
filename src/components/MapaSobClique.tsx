"use client";

import { useState } from "react";
import { enderecoLinha1, mapaEmbedUrl, mapaLinkUrl } from "@/data/gas";
import { IconePin } from "./Icones";

/** O mapa do Google só carrega quando a pessoa pede (não pesa e não chama terceiros antes). */
export function MapaSobClique() {
  const [aberto, setAberto] = useState(false);

  if (aberto) {
    return (
      <iframe
        title={`Mapa: ${enderecoLinha1}, Uberlândia`}
        src={mapaEmbedUrl}
        className="mt-4 h-64 w-full rounded-cartao border-2 border-amarelo bg-white"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
      <button type="button" onClick={() => setAberto(true)} className="btn btn-claro btn-p" data-ver-mapa>
        <IconePin />
        Ver mapa
      </button>
      <a href={mapaLinkUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4">
        Abrir no Google Maps
      </a>
    </div>
  );
}
