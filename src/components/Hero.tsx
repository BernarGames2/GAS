import { endereco, enderecoLinha1, historia, instagram, mapaLinkUrl, mensagens, textos } from "@/data/gas";
import { BotaoLigar, BotaoZap } from "./Botoes";
import { IconeInstagram, IconePin, IconeRelogio } from "./Icones";
import { Mascote } from "./Mascote";
import { StatusPlantao } from "./StatusPlantao";

export function Hero() {
  const { hero } = textos;
  return (
    <section id="topo" aria-labelledby="titulo-hero" className="hero padrao-pontos relative bg-amarelo text-marinho">
      <div
        className="container-site grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 pb-12 pt-6 [grid-template-areas:'texto_texto'_'ctas_ctas'_'info_mascote'_'chips_chips'] md:pt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-x-10 lg:py-16 lg:[grid-template-areas:'texto_mascote'_'ctas_mascote'_'info_mascote'_'chips_mascote']"
      >
        <div className="[grid-area:texto]">
          <StatusPlantao />
          <h1 id="titulo-hero" className="mt-5 text-h1 font-extrabold">
            <span className="block">{hero.linhas[0]}</span>
            <span className="block">{hero.linhas[1]}</span>
            <span className="block">
              <span className="faixa-branca">{hero.linhas[2]}</span>
            </span>
          </h1>
          <p className="mt-6 max-w-[36ch] text-lg font-semibold leading-snug text-marinho md:text-xl">
            {hero.subtitulo}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4 [grid-area:ctas] sm:flex-row sm:flex-wrap sm:items-center">
          <BotaoZap mensagem={mensagens.padrao} tamanho="g" rotuloAcessivel="Pedir gás no WhatsApp">
            {hero.ctaZap}
          </BotaoZap>
          <BotaoLigar tamanho="g">{hero.ctaLigar}</BotaoLigar>
        </div>

        <p className="mt-7 flex items-start gap-2 self-center text-base font-semibold [grid-area:info]">
          <IconeRelogio className="mt-0.5 h-5 w-5 flex-none" />
          <span>{hero.microlinha}</span>
        </p>

        <div className="mt-4 [grid-area:chips]">
          <ul className="flex flex-wrap gap-2 text-pequeno font-semibold" aria-label="Sobre a empresa">
            <li>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-pilula border-2 border-marinho bg-white/70 px-3"
              >
                <IconeInstagram className="h-4 w-4" />@{instagram.usuario}
              </a>
            </li>
            <li>
              <a
                href={mapaLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-1.5 rounded-pilula border-2 border-marinho bg-white/70 px-3"
                aria-label={`${enderecoLinha1}, ${endereco.bairro} — abrir no mapa`}
              >
                <IconePin className="h-4 w-4 flex-none" />
                {enderecoLinha1}
              </a>
            </li>
            <li className="inline-flex min-h-12 items-center rounded-pilula border-2 border-dashed border-marinho px-3">
              {historia.confirmado ? historia.textoConfirmadoCurto : historia.textoProvisorio}
            </li>
          </ul>
        </div>

        <div className="mt-7 self-center [grid-area:mascote] lg:mt-0 lg:self-center lg:justify-self-center">
          <div className="mascote-palco h-[120px] w-[120px] lg:h-[280px] lg:w-[280px]">
            <div className="relative translate-y-[6%]">
              <div className="mascote-pulinho">
                <Mascote largura={160} prioridade className="w-[84px] lg:w-[160px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
