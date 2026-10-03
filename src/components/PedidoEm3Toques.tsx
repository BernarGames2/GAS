"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { empresa, mensagemPedido, mensagens, pagamento, tamanhos, textos, type DadosPedido } from "@/data/gas";
import { abrirWhatsApp } from "@/lib/whatsapp";
import { BotaoZap, LinkLigar } from "./Botoes";
import { IconeAlerta, IconeCaminhao, IconeCheck, IconeMais, IconeMenos, IconeSeta, IconeVoltar, IconeZap } from "./Icones";

type Etapa = 0 | 1 | 2;
type Erros = Partial<Record<"bairro" | "rua", string>>;

const VAZIO: DadosPedido = {
  tamanho: "",
  quantidade: 1,
  bairro: "",
  rua: "",
  complemento: "",
  pagamento: "",
  nome: "",
};

export function PedidoEm3Toques({ children }: { children: ReactNode }) {
  const t = textos.pedido;
  const [etapa, setEtapa] = useState<Etapa>(0);
  const [direcao, setDirecao] = useState<"avancar" | "voltar" | null>(null);
  const [dados, setDados] = useState<DadosPedido>(VAZIO);
  const [erros, setErros] = useState<Erros>({});
  const tituloEtapa = useRef<HTMLHeadingElement>(null);
  const mensagem = mensagemPedido(dados);

  // Ao trocar de etapa, o foco vai para o título da nova etapa (teclado e leitor de tela).
  useEffect(() => {
    if (direcao) tituloEtapa.current?.focus();
  }, [etapa, direcao]);

  function campo<K extends keyof DadosPedido>(chave: K, valor: DadosPedido[K]) {
    setDados((d) => ({ ...d, [chave]: valor }));
    if (chave in erros) setErros((e) => ({ ...e, [chave]: undefined }));
  }

  function validarEndereco(): boolean {
    const novos: Erros = {};
    if (!dados.bairro.trim()) novos.bairro = "Informe o bairro.";
    if (!dados.rua.trim()) novos.rua = "Informe a rua e o número.";
    setErros(novos);
    const primeiro = novos.bairro ? "pedido-bairro" : novos.rua ? "pedido-rua" : null;
    if (primeiro) {
      // espera a etapa 2 estar na tela antes de focar
      window.requestAnimationFrame(() => document.getElementById(primeiro)?.focus());
      return false;
    }
    return true;
  }

  function irPara(nova: Etapa) {
    if (nova === etapa) return;
    setDirecao(nova > etapa ? "avancar" : "voltar");
    setEtapa(nova);
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (etapa === 0) return irPara(1);
    if (etapa === 1) {
      if (validarEndereco()) irPara(2);
      return;
    }
    if (!validarEndereco()) {
      irPara(1);
      return;
    }
    abrirWhatsApp(mensagem);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        {children}
        {/* Prévia ao vivo (desktop): mostra a mensagem se montando enquanto a pessoa preenche */}
        <figure className="mt-10 hidden lg:block" aria-hidden="true">
          <figcaption className="font-titulo text-base font-extrabold uppercase tracking-[0.08em] text-amarelo">
            Prévia da mensagem
          </figcaption>
          <div className="relative mt-3 max-w-[420px] rounded-[14px] rounded-bl-[4px] border-2 border-amarelo bg-papel p-5 text-grafite shadow-[6px_6px_0_var(--azul-marinho-escuro)]">
            <p className="whitespace-pre-line text-pequeno font-semibold" data-previa-lateral>
              {mensagem}
            </p>
            <p className="mt-3 flex items-center justify-end gap-1.5 text-[0.75rem] font-semibold text-zap">
              <IconeZap className="h-4 w-4" /> vai pronta para o WhatsApp
            </p>
          </div>
        </figure>
      </div>

    <div className="cartao bg-papel text-grafite" data-pedido>
      {/* Stepper */}
      <ol className="grid grid-cols-3 border-b-2 border-marinho" aria-label="Etapas do pedido">
        {t.etapas.map((rotulo, i) => {
          const atual = i === etapa;
          const feita = i < etapa;
          return (
            <li key={rotulo} className={i > 0 ? "border-l-2 border-marinho" : ""}>
              <button
                type="button"
                onClick={() => irPara(i as Etapa)}
                disabled={i > etapa}
                aria-current={atual ? "step" : undefined}
                className={`flex h-full min-h-[88px] w-full flex-col items-start gap-1 px-3 py-3 text-left disabled:cursor-default sm:flex-row sm:items-center sm:gap-3 sm:px-4 ${
                  atual ? "bg-amarelo text-marinho" : feita ? "bg-white text-marinho" : "bg-papel text-[#5d6472]"
                } ${i === 0 ? "rounded-tl-[12px]" : ""} ${i === 2 ? "rounded-tr-[12px]" : ""}`}
              >
                <span className="numeral-etapa flex items-center gap-1 text-[2.75rem] sm:text-[3.25rem]" aria-hidden="true">
                  {i + 1}
                  {feita && <IconeCheck className="h-5 w-5" />}
                </span>
                <span className="font-titulo text-[0.95rem] font-extrabold uppercase leading-tight sm:text-lg">
                  <span className="sr-only">Etapa {i + 1}: </span>
                  {rotulo}
                  {feita && <span className="sr-only"> (feita)</span>}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <form onSubmit={aoEnviar} noValidate className="p-5 sm:p-8">
        <div key={etapa} className={direcao === "avancar" ? "etapa-avancar" : direcao === "voltar" ? "etapa-voltar" : ""}>
          <h3 ref={tituloEtapa} tabIndex={-1} className="text-h3 text-marinho outline-none">
            {etapa + 1}. {t.etapas[etapa]}
          </h3>

          {etapa === 0 && (
            <div className="mt-5 space-y-6">
              {tamanhos.confirmado ? (
                <fieldset>
                  <legend className="campo-label">Tamanho do botijão</legend>
                  <div className="flex flex-wrap gap-2">
                    {tamanhos.opcoes.map((op) => (
                      <label key={op} className="cursor-pointer">
                        <input
                          type="radio"
                          name="tamanho"
                          value={op}
                          checked={dados.tamanho === op}
                          onChange={() => campo("tamanho", op)}
                          className="peer sr-only"
                        />
                        <span className="inline-flex min-h-12 items-center rounded-pilula border-2 border-marinho bg-white px-4 font-semibold peer-checked:bg-marinho peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-azul">
                          {op}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : (
                <div>
                  <label htmlFor="pedido-tamanho" className="campo-label">
                    {t.tamanhoLabel}
                  </label>
                  <input
                    id="pedido-tamanho"
                    className="campo"
                    value={dados.tamanho}
                    onChange={(e) => campo("tamanho", e.target.value)}
                    autoComplete="off"
                    enterKeyHint="next"
                    aria-describedby="pedido-tamanho-nota"
                  />
                  <p id="pedido-tamanho-nota" className="mt-2 text-pequeno font-semibold text-marinho">
                    {empresa.frasePortfolio}.
                  </p>
                </div>
              )}

              <div>
                <span id="pedido-qtd-rotulo" className="campo-label">
                  Quantidade
                </span>
                <div className="inline-flex items-center gap-1 rounded-pilula border-2 border-marinho bg-white p-1" role="group" aria-labelledby="pedido-qtd-rotulo">
                  <button
                    type="button"
                    className="grid h-12 w-12 place-items-center rounded-full bg-marinho text-white disabled:opacity-40"
                    onClick={() => campo("quantidade", Math.max(1, dados.quantidade - 1))}
                    disabled={dados.quantidade <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    <IconeMenos />
                  </button>
                  <output className="w-12 text-center font-titulo text-3xl font-extrabold text-marinho" aria-live="polite" data-qtd>
                    {dados.quantidade}
                  </output>
                  <button
                    type="button"
                    className="grid h-12 w-12 place-items-center rounded-full bg-marinho text-white disabled:opacity-40"
                    onClick={() => campo("quantidade", Math.min(9, dados.quantidade + 1))}
                    disabled={dados.quantidade >= 9}
                    aria-label="Aumentar quantidade"
                  >
                    <IconeMais />
                  </button>
                </div>
              </div>
            </div>
          )}

          {etapa === 1 && (
            <div className="mt-5 space-y-5">
              <Campo id="pedido-bairro" rotulo="Bairro" obrigatorio erro={erros.bairro}>
                <input
                  id="pedido-bairro"
                  className="campo"
                  value={dados.bairro}
                  onChange={(e) => campo("bairro", e.target.value)}
                  autoComplete="address-level3"
                  enterKeyHint="next"
                  aria-required="true"
                  aria-invalid={erros.bairro ? true : undefined}
                  aria-describedby={erros.bairro ? "pedido-bairro-erro" : undefined}
                />
              </Campo>
              <Campo id="pedido-rua" rotulo="Rua e número" obrigatorio erro={erros.rua}>
                <input
                  id="pedido-rua"
                  className="campo"
                  value={dados.rua}
                  onChange={(e) => campo("rua", e.target.value)}
                  autoComplete="address-line1"
                  enterKeyHint="next"
                  aria-required="true"
                  aria-invalid={erros.rua ? true : undefined}
                  aria-describedby={erros.rua ? "pedido-rua-erro" : undefined}
                />
              </Campo>
              <Campo id="pedido-complemento" rotulo="Complemento/ponto de referência">
                <input
                  id="pedido-complemento"
                  className="campo"
                  value={dados.complemento}
                  onChange={(e) => campo("complemento", e.target.value)}
                  autoComplete="address-line2"
                  enterKeyHint="next"
                />
              </Campo>
              <p className="flex items-center gap-2 font-semibold text-marinho">
                <IconeCaminhao className="h-6 w-6 flex-none" />
                {t.avisoEndereco}
              </p>
            </div>
          )}

          {etapa === 2 && (
            <div className="mt-5 space-y-5">
              <Campo id="pedido-pagamento" rotulo="Forma de pagamento">
                <select
                  id="pedido-pagamento"
                  className="campo"
                  value={dados.pagamento}
                  onChange={(e) => campo("pagamento", e.target.value)}
                  aria-describedby="pedido-pagamento-nota"
                >
                  <option value="">Escolha (opcional)</option>
                  {pagamento.opcoes.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <p id="pedido-pagamento-nota" className="mt-2 text-pequeno font-semibold text-marinho">
                  {pagamento.nota}
                </p>
              </Campo>
              <Campo id="pedido-nome" rotulo="Nome (opcional)">
                <input
                  id="pedido-nome"
                  className="campo"
                  value={dados.nome}
                  onChange={(e) => campo("nome", e.target.value)}
                  autoComplete="name"
                  enterKeyHint="send"
                />
              </Campo>
              <div className="rounded-[10px] border-2 border-dashed border-marinho bg-white p-4 lg:hidden">
                <p className="font-titulo text-base font-extrabold uppercase tracking-[0.06em] text-marinho">Vai assim no WhatsApp:</p>
                <p className="mt-2 whitespace-pre-line text-pequeno" data-previa>
                  {mensagem}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          {etapa < 2 ? (
            <button type="submit" className="btn btn-marinho w-full sm:w-auto">
              Continuar
              <IconeSeta />
            </button>
          ) : (
            <button type="submit" className="btn btn-zap w-full sm:w-auto" data-enviar-pedido>
              <IconeZap />
              {t.botaoFinal}
            </button>
          )}
          {etapa > 0 && (
            <button type="button" className="btn btn-claro btn-p self-start sm:self-auto" onClick={() => irPara((etapa - 1) as Etapa)}>
              <IconeVoltar />
              Voltar
            </button>
          )}
        </div>
        {etapa === 2 && <LinkLigar className="mt-4 text-marinho" />}

        <noscript>
          <p className="mt-6 font-semibold">
            Seu navegador está sem JavaScript. Peça direto pelo WhatsApp:{" "}
            <BotaoZap mensagem={mensagens.padrao} tamanho="p">
              Pedir gás no WhatsApp
            </BotaoZap>
          </p>
        </noscript>
      </form>

      <p className="rounded-b-[12px] border-t-2 border-marinho bg-amarelo-claro px-5 py-3 text-pequeno font-semibold text-marinho sm:px-8">
        {t.rodape}
      </p>
    </div>
    </div>
  );
}

function Campo({
  id,
  rotulo,
  obrigatorio = false,
  erro,
  children,
}: {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  erro?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="campo-label">
        {rotulo}
        {obrigatorio && (
          <span className="text-alerta" aria-hidden="true">
            {" "}
            *
          </span>
        )}
        {obrigatorio && <span className="sr-only"> (obrigatório)</span>}
      </label>
      {children}
      {erro && (
        <p id={`${id}-erro`} className="erro-campo" tabIndex={-1} data-erro>
          <IconeAlerta className="h-5 w-5 flex-none" />
          {erro}
        </p>
      )}
    </div>
  );
}
