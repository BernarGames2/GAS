"use client";

import { useState, type FormEvent } from "react";
import { mensagemEmpresa, textos, type DadosEmpresa } from "@/data/gas";
import { abrirWhatsApp } from "@/lib/whatsapp";
import { LinkLigar } from "./Botoes";
import { IconeAlerta, IconeZap } from "./Icones";

const VAZIO: DadosEmpresa = { empresa: "", cnpj: "", botijoesSemana: "", endereco: "" };

export function EmpresasForm() {
  const [dados, setDados] = useState<DadosEmpresa>(VAZIO);
  const [erro, setErro] = useState<string | null>(null);

  function campo(chave: keyof DadosEmpresa, valor: string) {
    setDados((d) => ({ ...d, [chave]: valor }));
    if (chave === "empresa") setErro(null);
  }

  function aoEnviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!dados.empresa.trim()) {
      setErro("Informe o nome da empresa.");
      document.getElementById("empresa-nome")?.focus();
      return;
    }
    abrirWhatsApp(mensagemEmpresa(dados));
  }

  return (
    <form onSubmit={aoEnviar} noValidate className="cartao space-y-5 p-5 sm:p-8" data-form-empresa>
      <div>
        <label htmlFor="empresa-nome" className="campo-label">
          Empresa<span className="text-alerta" aria-hidden="true"> *</span>
          <span className="sr-only"> (obrigatório)</span>
        </label>
        <input
          id="empresa-nome"
          className="campo"
          value={dados.empresa}
          onChange={(e) => campo("empresa", e.target.value)}
          autoComplete="organization"
          aria-required="true"
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? "empresa-nome-erro" : undefined}
        />
        {erro && (
          <p id="empresa-nome-erro" className="erro-campo" tabIndex={-1} data-erro>
            <IconeAlerta className="h-5 w-5 flex-none" />
            {erro}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="empresa-cnpj" className="campo-label">
          CNPJ (opcional)
        </label>
        <input
          id="empresa-cnpj"
          className="campo"
          value={dados.cnpj}
          onChange={(e) => campo("cnpj", e.target.value)}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="empresa-qtd" className="campo-label">
          Quantos botijões por semana
        </label>
        <input
          id="empresa-qtd"
          className="campo"
          value={dados.botijoesSemana}
          onChange={(e) => campo("botijoesSemana", e.target.value)}
          autoComplete="off"
        />
      </div>
      <div>
        <label htmlFor="empresa-endereco" className="campo-label">
          Endereço
        </label>
        <input
          id="empresa-endereco"
          className="campo"
          value={dados.endereco}
          onChange={(e) => campo("endereco", e.target.value)}
          autoComplete="street-address"
        />
      </div>
      <div className="flex flex-col items-start gap-3 pt-2">
        <button type="submit" className="btn btn-zap w-full sm:w-auto" data-enviar-empresa>
          <IconeZap />
          {textos.empresas.botao}
        </button>
        <LinkLigar className="text-marinho" />
      </div>
    </form>
  );
}
