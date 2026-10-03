import { BarraFixa } from "@/components/BarraFixa";
import { EmpresasForm } from "@/components/EmpresasForm";
import { FaixaZebrada } from "@/components/FaixaZebrada";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { IconePredio, IconeRestaurante } from "@/components/Icones";
import { PedidoEm3Toques } from "@/components/PedidoEm3Toques";
import { QuemSomos } from "@/components/QuemSomos";
import { Seguranca } from "@/components/Seguranca";
import { Termometro } from "@/components/Termometro";
import { BotaoZap, LinkLigar } from "@/components/Botoes";
import { flags, mensagens, MODO_REVISAO, textos } from "@/data/gas";
import { jsonLd } from "@/lib/jsonld";

export default function Pagina() {
  const mostrarSeguranca = flags.segurancaAprovada || MODO_REVISAO;

  return (
    <>
      <a href="#conteudo" className="sr-only-focusable fixed left-3 top-3 z-[60] rounded-[8px] bg-marinho px-4 py-3 font-semibold text-white">
        Pular para o conteúdo
      </a>
      <Header />

      <main id="conteudo">
        <Hero />
        <FaixaZebrada />

        {/* 3) Termômetro do botijão */}
        <section id="nivel" aria-labelledby="titulo-termometro" className="secao bg-papel" data-revelar suppressHydrationWarning>
          <div className="container-site">
            <div className="mb-10 max-w-[760px]">
              <p className="rotulo text-marinho">Termômetro do botijão</p>
              <h2 id="titulo-termometro" className="mt-4 text-h2 text-marinho">
                {textos.termometro.titulo}
              </h2>
              <p className="mt-4 text-xl font-semibold">{textos.termometro.sub}</p>
            </div>
            <Termometro />
          </div>
        </section>
        <FaixaZebrada />

        {/* 4) Pedido em 3 toques */}
        <section id="pedido" aria-labelledby="titulo-pedido" className="secao secao-escura bg-marinho text-white" data-revelar suppressHydrationWarning>
          <div className="container-site">
            <PedidoEm3Toques>
              <p className="rotulo text-amarelo">Pedido pronto</p>
              <h2 id="titulo-pedido" className="mt-4 text-h2 text-amarelo">
                {textos.pedido.titulo}
              </h2>
              <p className="mt-4 max-w-[34ch] text-xl font-semibold">{textos.pedido.sub}</p>
            </PedidoEm3Toques>
          </div>
        </section>
        <FaixaZebrada />

        {/* 5) Para empresas */}
        <section id="empresas" aria-labelledby="titulo-empresas" className="secao bg-white" data-revelar suppressHydrationWarning>
          <div className="container-site grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
            <div>
              <div className="flex gap-3 text-marinho" aria-hidden="true">
                <span className="grid h-16 w-16 place-items-center rounded-cartao bg-amarelo">
                  <IconePredio className="h-9 w-9" />
                </span>
                <span className="grid h-16 w-16 place-items-center rounded-cartao bg-amarelo">
                  <IconeRestaurante className="h-9 w-9" />
                </span>
              </div>
              <h2 id="titulo-empresas" className="mt-6 text-h2 text-marinho">
                {textos.empresas.titulo}
              </h2>
              <p className="mt-5 max-w-[44ch] text-xl font-semibold">{textos.empresas.texto}</p>
            </div>
            <EmpresasForm />
          </div>
        </section>
        <FaixaZebrada />

        {/* 6) Segurança (só com aprovação da cliente, ou no build de revisão) */}
        {mostrarSeguranca && (
          <>
            <section id="seguranca" aria-labelledby="titulo-seguranca" className="secao bg-papel" data-revelar suppressHydrationWarning>
              <div className="container-site">
                <Seguranca />
              </div>
            </section>
            <FaixaZebrada />
          </>
        )}

        {/* 7) Quem somos */}
        <section id="quem-somos" aria-labelledby="titulo-quem-somos" className="secao bg-amarelo-claro" data-revelar suppressHydrationWarning>
          <div className="container-site">
            <QuemSomos />
          </div>
        </section>
        <FaixaZebrada />

        {/* 8) Perguntas frequentes */}
        <section id="duvidas" aria-labelledby="titulo-faq" className="secao bg-papel" data-revelar suppressHydrationWarning>
          <div className="container-site">
            <Faq />
            <div className="mx-auto mt-10 flex max-w-[860px] flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
              <BotaoZap mensagem={mensagens.padrao} rotuloAcessivel="Pedir gás no WhatsApp">
                Pedir gás no WhatsApp
              </BotaoZap>
              <LinkLigar className="text-marinho" prefixo="ou ligue" />
            </div>
          </div>
        </section>
        <FaixaZebrada />
      </main>

      <Footer />
      <BarraFixa />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }} />
    </>
  );
}
