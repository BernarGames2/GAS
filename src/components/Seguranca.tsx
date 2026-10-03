import { flags, mensagens, textos } from "@/data/gas";
import { BotaoZap, LinkLigar } from "./Botoes";
import { IconeChama, IconeCheck, IconeEscudo } from "./Icones";
import { SeloRevisao } from "./Revisao";

export function Seguranca() {
  const t = textos.seguranca;
  return (
    <div className="rounded-cartao border-[3px] border-alerta bg-papel p-5 sm:p-10">
      {!flags.segurancaAprovada && <SeloRevisao />}
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 flex-none place-items-center rounded-full bg-alerta text-white" aria-hidden="true">
          <IconeEscudo className="h-8 w-8" />
        </span>
        <h2 id="titulo-seguranca" className="text-h2 text-marinho">
          {t.titulo}
        </h2>
      </div>

      <ol className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-1" data-passos-seguranca>
        {t.passos.map((passo, i) => (
          <li key={passo} className="flex items-start gap-4 rounded-[10px] bg-white p-4 text-lg font-semibold">
            <span className="grid h-10 w-10 flex-none place-items-center rounded-full border-[3px] border-alerta font-titulo text-2xl font-extrabold leading-none text-alerta" aria-hidden="true">
              {i + 1}
            </span>
            <span className="pt-1.5">
              {i === t.passos.length - 1 ? (
                <>
                  {passo.replace(/193\.$/, "")}
                  <a href="tel:193" className="font-extrabold text-alerta underline decoration-2 underline-offset-4">
                    193
                  </a>
                  .
                </>
              ) : (
                passo
              )}
            </span>
          </li>
        ))}
      </ol>

      <h3 className="mt-10 text-h3 text-marinho">Boas práticas</h3>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.boasPraticas.map((dica, i) => (
          <li key={dica} className="cartao flex items-start gap-3 p-4 font-semibold">
            {i === 3 ? (
              <IconeChama className="h-6 w-6 flex-none text-alerta" />
            ) : (
              <IconeCheck className="h-6 w-6 flex-none text-azul" />
            )}
            {dica}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-4 border-t-2 border-dashed border-marinho pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-titulo text-2xl font-extrabold uppercase text-marinho">{t.rodape}</p>
        <div className="flex flex-wrap items-center gap-4">
          <BotaoZap mensagem={mensagens.seguranca} rotuloAcessivel="Tirar dúvida sobre o botijão">
            Falar no WhatsApp
          </BotaoZap>
          <LinkLigar className="text-marinho" prefixo="ou ligue" />
        </div>
      </div>
    </div>
  );
}
