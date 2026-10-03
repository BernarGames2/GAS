import { textos } from "@/data/gas";
import { IconeMais } from "./Icones";
import { ACONFIRMAR } from "./Revisao";

export function Faq() {
  return (
    <div className="mx-auto max-w-[860px]">
      <h2 id="titulo-faq" className="text-h2 text-marinho">
        Perguntas frequentes
      </h2>
      <div className="mt-8 space-y-3">
        {textos.faq.map((item) => (
          <details key={item.pergunta} className="group cartao overflow-hidden">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-titulo text-[1.375rem] font-extrabold uppercase leading-tight text-marinho [&::-webkit-details-marker]:hidden">
              {item.pergunta}
              <span className="grid h-10 w-10 flex-none place-items-center rounded-full border-2 border-marinho group-open:rotate-45 group-open:bg-amarelo" aria-hidden="true">
                <IconeMais className="h-5 w-5" />
              </span>
            </summary>
            <div className="border-t-2 border-dashed border-marinho px-5 py-4 text-lg">
              {item.confirmado ? (
                <p>
                  {item.resposta}
                  {item.pergunta === "Vocês atendem empresas?" && (
                    <>
                      {" "}
                      <a href="#empresas" className="font-semibold text-azul underline decoration-2 underline-offset-4">
                        Fale sobre abastecimento
                      </a>
                    </>
                  )}
                </p>
              ) : (
                <ACONFIRMAR />
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
