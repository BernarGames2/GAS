import { email, empresa, endereco, enderecoLinha1, flags, horariosTexto, instagram, telefone } from "@/data/gas";
import { IconeInstagram, IconePin, IconeRelogio, IconeTelefone } from "./Icones";
import { MapaSobClique } from "./MapaSobClique";
import { Mascote } from "./Mascote";

export function Footer() {
  const ano = new Date().getFullYear();
  return (
    <footer className="secao-escura bg-marinho text-white" aria-labelledby="titulo-rodape">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.1fr_1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-16 w-16 flex-none place-items-center rounded-full bg-amarelo">
              <Mascote largura={44} decorativo className="w-11" />
            </span>
            <p id="titulo-rodape" className="font-titulo text-[1.75rem] font-extrabold uppercase leading-none">
              {empresa.nomeCaixaAlta}
            </p>
          </div>
          <p className="mt-4 text-white">Gás GLP em Uberlândia. Todos os tamanhos e modelos.</p>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-xl text-amarelo">
            <IconePin className="h-5 w-5" /> Endereço
          </h2>
          <address className="mt-3 not-italic leading-relaxed">
            {enderecoLinha1}
            <br />
            {endereco.bairro}, {endereco.cidade}/{endereco.uf}
            <br />
            CEP {endereco.cep}
          </address>
          <MapaSobClique />
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-xl text-amarelo">
            <IconeRelogio className="h-5 w-5" /> Horários
          </h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 leading-relaxed">
            {horariosTexto.tabela.map(([dias, horas]) => (
              <div key={dias} className="contents">
                <dt>{dias}</dt>
                <dd className="whitespace-nowrap font-semibold">{horas}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-xl text-amarelo">
            <IconeTelefone className="h-5 w-5" /> Contato
          </h2>
          <ul className="mt-2 space-y-1">
            <li>
              <a
                href={telefone.href}
                aria-label={`Ligar para a Atende Gás Urgente: ${telefone.exibicao}`}
                className="inline-flex min-h-12 items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
                data-cta="telefone"
              >
                {telefone.exibicao}
              </a>
            </li>
            <li>
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center gap-2 font-semibold underline decoration-2 underline-offset-4"
              >
                <IconeInstagram className="h-5 w-5" />@{instagram.usuario}
              </a>
            </li>
            {email.confirmado && email.endereco && (
              <li>
                <a href={`mailto:${email.endereco}`} className="inline-flex min-h-12 items-center font-semibold underline decoration-2 underline-offset-4">
                  {email.endereco}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="faixa-zebrada" aria-hidden="true" />
      <div className="container-site flex flex-wrap items-center justify-between gap-2 py-5 text-pequeno">
        <p>
          © {ano} {empresa.nome}
        </p>
        {flags.creditoWebcreate && <p>Site por Webcreate</p>}
      </div>
    </footer>
  );
}
