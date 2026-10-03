import { endereco, enderecoLinha1, flags, historia, horariosTexto, instagram, mapaLinkUrl, textos } from "@/data/gas";
import { IconeInstagram, IconePin, IconeRelogio } from "./Icones";

export function QuemSomos() {
  const t = textos.quemSomos;
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center">
      <div>
        <p className="rotulo text-marinho">Quem somos</p>
        <h2 id="titulo-quem-somos" className="mt-4 text-h2 text-marinho">
          {t.titulo}
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg">{t.texto}</p>
        <p className="mt-4 inline-block rounded-[6px] bg-marinho px-3 py-1.5 font-titulo text-xl font-extrabold uppercase tracking-[0.04em] text-amarelo">
          {historia.confirmado ? historia.textoConfirmadoLongo : historia.textoProvisorio}
        </p>
        <p className="mt-6">
          <a
            href={instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 font-semibold text-marinho underline decoration-2 underline-offset-4"
          >
            <IconeInstagram className="h-5 w-5" />
            Acompanhe no Instagram: @{instagram.usuario}
          </a>
        </p>
        {flags.revendaAtiva && (
          <div className="cartao mt-8 p-5">
            <h3 className="text-h3 text-marinho">Seja revendedor</h3>
            <p className="mt-2">Fale com a gente pelo WhatsApp para saber como funciona.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Cartão de visita: só fatos confirmados (endereço, horário) */}
        <div className="cartao grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-amarelo text-marinho" aria-hidden="true">
              <IconePin className="h-6 w-6" />
            </span>
            <div>
              <p className="font-titulo text-xl font-extrabold uppercase leading-tight text-marinho">Loja em {endereco.bairro}</p>
              <p className="mt-1">
                {enderecoLinha1}
                <br />
                {endereco.cidade}/{endereco.uf} · CEP {endereco.cep}
              </p>
              <a
                href={mapaLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-12 items-center font-semibold text-azul underline decoration-2 underline-offset-4"
              >
                Como chegar
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-amarelo text-marinho" aria-hidden="true">
              <IconeRelogio className="h-6 w-6" />
            </span>
            <div>
              <p className="font-titulo text-xl font-extrabold uppercase leading-tight text-marinho">Atendimento</p>
              <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3">
                {horariosTexto.tabela.map(([dias, horas]) => (
                  <div key={dias} className="contents">
                    <dt>{dias}</dt>
                    <dd className="font-semibold">{horas}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3" aria-label="Fotos da empresa (a confirmar)">
        {t.fotos.map((foto, i) => (
          <li
            key={foto}
            className={`grid place-items-center rounded-cartao border-[3px] border-dashed border-marinho bg-white/60 p-3 text-center ${
              i === 0 ? "col-span-2 aspect-[16/9] sm:col-span-1 sm:aspect-[4/5]" : "aspect-[4/3] sm:aspect-[4/5]"
            }`}
          >
            <span>
              <span className="block font-titulo text-xl font-extrabold uppercase text-marinho">{foto}</span>
              <span className="marcador mt-2 text-marinho" data-a-confirmar>
                FOTO A CONFIRMAR
              </span>
            </span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
}
