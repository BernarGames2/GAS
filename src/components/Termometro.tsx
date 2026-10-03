"use client";

import { useRef, useState, type MouseEvent } from "react";
import { flags, mensagens, MODO_REVISAO, textos } from "@/data/gas";
import { BotaoZap, LinkLigar } from "./Botoes";
import { SeloRevisao } from "./Revisao";

type Estado = "cheio" | "metade" | "acabando";

export function estadoDoNivel(nivel: number): Estado {
  if (nivel >= 70) return "cheio";
  if (nivel >= 30) return "metade";
  return "acabando";
}

const mensagemDoEstado: Record<Estado, string> = {
  cheio: mensagens.termometroCheio,
  metade: mensagens.termometroMetade,
  acabando: mensagens.termometroAcabando,
};

const FASES: { id: Estado; titulo: string; faixa: string }[] = [
  { id: "acabando", titulo: "Hora de pedir", faixa: "abaixo de 30%" },
  { id: "metade", titulo: "Fique de olho", faixa: "de 30% a 69%" },
  { id: "cheio", titulo: "Tudo certo", faixa: "70% ou mais" },
];

// Geometria do SVG (viewBox 220×340): corpo do botijão.
const CORPO = { x: 18, y: 62, w: 184, h: 246, r: 56 };

export function Termometro() {
  const [nivel, setNivel] = useState(50);
  const svgRef = useRef<SVGSVGElement>(null);
  const t = textos.termometro;
  const estado = estadoDoNivel(nivel);
  const info = t.estados[estado];
  const mostrarAguaMorna = flags.aguaMornaAprovada || MODO_REVISAO;

  function nivelPeloToque(e: MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const caixa = svg.getBoundingClientRect();
    const y = ((e.clientY - caixa.top) / caixa.height) * 340;
    const pct = ((CORPO.y + CORPO.h - y) / CORPO.h) * 100;
    setNivel(Math.round(Math.min(100, Math.max(0, pct))));
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-16">
      {/* Botijão + controles */}
      <div className="mx-auto w-full max-w-[340px]">
        <div className="flex items-end justify-center gap-3">
          <svg
            ref={svgRef}
            viewBox="0 0 220 340"
            width="220"
            height="340"
            className="h-auto w-[180px] flex-none cursor-pointer select-none sm:w-[220px]"
            aria-hidden="true"
            onClick={nivelPeloToque}
            data-botijao
          >
            <defs>
              <clipPath id="corpo-botijao">
                <rect x={CORPO.x} y={CORPO.y} width={CORPO.w} height={CORPO.h} rx={CORPO.r} />
              </clipPath>
            </defs>
            {/* alça */}
            <rect x="60" y="8" width="100" height="66" rx="18" fill="var(--amarelo)" stroke="var(--azul-marinho)" strokeWidth="6" />
            <rect x="77" y="20" width="66" height="18" rx="9" fill="var(--azul-marinho)" />
            <rect x="96" y="44" width="28" height="22" rx="4" fill="var(--azul-marinho)" />
            {/* base (atrás do corpo) */}
            <rect x="48" y="304" width="124" height="30" rx="6" fill="var(--amarelo)" stroke="var(--azul-marinho)" strokeWidth="5" />
            <rect x="72" y="315" width="22" height="9" rx="3" fill="var(--azul-marinho)" />
            <rect x="126" y="315" width="22" height="9" rx="3" fill="var(--azul-marinho)" />
            {/* corpo vazio */}
            <rect x={CORPO.x} y={CORPO.y} width={CORPO.w} height={CORPO.h} rx={CORPO.r} fill="var(--branco)" />
            {/* gás */}
            <g clipPath="url(#corpo-botijao)">
              <rect
                className="nivel-gas"
                x={CORPO.x}
                y={CORPO.y}
                width={CORPO.w}
                height={CORPO.h}
                fill="var(--azul-marinho)"
                style={{ transform: `scaleY(${nivel / 100})` }}
              />
            </g>
            {/* marcas de 25 / 50 / 75 % */}
            {[0.25, 0.5, 0.75].map((f) => {
              const y = CORPO.y + CORPO.h * (1 - f);
              const d = `M${CORPO.x + CORPO.w - 34} ${y}h22`;
              return (
                <g key={f} strokeLinecap="round">
                  <path d={d} stroke="var(--azul-marinho)" strokeWidth="9" />
                  <path d={d} stroke="var(--amarelo)" strokeWidth="4" />
                </g>
              );
            })}
            {/* brilho */}
            <rect x="34" y="96" width="12" height="160" rx="6" fill="#ffffff" opacity="0.35" />
            {/* contorno */}
            <rect x={CORPO.x} y={CORPO.y} width={CORPO.w} height={CORPO.h} rx={CORPO.r} fill="none" stroke="var(--azul-marinho)" strokeWidth="6" />
            {/* etiqueta */}
            <rect x="64" y="112" width="92" height="44" rx="8" fill="var(--amarelo)" stroke="var(--azul-marinho)" strokeWidth="3" />
            <text x="110" y="145" textAnchor="middle" fontFamily="var(--font-titulo)" fontWeight="800" fontSize="30" fill="var(--azul-marinho)">
              GLP
            </text>
          </svg>

          <div className="flex flex-col items-center">
            <p className="mb-2 font-titulo text-[2.5rem] font-extrabold leading-none text-marinho" aria-hidden="true" data-nivel-pct>
              {nivel}%
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={nivel}
              onChange={(e) => setNivel(Number(e.target.value))}
              className="range-vertical"
              aria-label="Nível de gás no botijão"
              aria-orientation="vertical"
              aria-valuetext={`Botijão com ${nivel} por cento`}
              data-termometro
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-2" role="group" aria-label="Atalhos de nível">
          {t.atalhos.map((a) => (
            <button
              key={a.rotulo}
              type="button"
              onClick={() => setNivel(a.valor)}
              aria-pressed={nivel === a.valor}
              className="min-h-12 rounded-pilula border-2 border-marinho bg-white px-2 font-titulo text-lg font-extrabold uppercase tracking-wide text-marinho aria-pressed:bg-marinho aria-pressed:text-white"
            >
              {a.rotulo}
            </button>
          ))}
        </div>
        <ReguaFases estado={estado} className="mt-4 lg:hidden" />
        <p className="mt-4 text-center text-pequeno text-grafite">{t.aviso}</p>
      </div>

      {/* Painel do estado */}
      <div className="flex flex-col gap-6">
        <div className="cartao overflow-hidden" data-estado-termometro={estado}>
          <div
            className={`flex items-center gap-2 border-b-2 border-marinho px-5 py-2 font-titulo text-base font-extrabold uppercase tracking-[0.08em] ${
              estado === "acabando" ? "bg-marinho text-amarelo" : estado === "metade" ? "bg-amarelo text-marinho" : "bg-amarelo-claro text-marinho"
            }`}
            aria-hidden="true"
          >
            Botijão com {nivel}%
          </div>
          <div className="p-5 sm:p-7">
            <div aria-live="polite">
              <h3 className="text-[2rem] leading-none text-marinho sm:text-[2.5rem]">{info.titulo}</h3>
              <p className="mt-3 max-w-[52ch] text-corpo">{info.corpo}</p>
            </div>
            <div className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              {estado === "cheio" && (
                <BotaoZap mensagem={mensagemDoEstado.cheio} variante="outline" tamanho="p">
                  {info.cta}
                </BotaoZap>
              )}
              {estado === "metade" && (
                <BotaoZap mensagem={mensagemDoEstado.metade}>
                  {info.cta}
                </BotaoZap>
              )}
              {estado === "acabando" && (
                <span key="pulso" className="cta-pulsa-1x inline-flex">
                  <BotaoZap mensagem={mensagemDoEstado.acabando} tamanho="g">
                    {info.cta}
                  </BotaoZap>
                </span>
              )}
              <LinkLigar className="text-marinho" prefixo="ou ligue" />
            </div>
          </div>
        </div>

        <ReguaFases estado={estado} className="hidden lg:grid" />

        {mostrarAguaMorna && (
          <aside className="rounded-cartao border-2 border-dashed border-marinho bg-white p-5" aria-labelledby="agua-morna">
            {!flags.aguaMornaAprovada && <SeloRevisao />}
            <h3 id="agua-morna" className="text-h3 text-marinho">
              {t.aguaMornaTitulo}
            </h3>
            <p className="mt-2">{t.aguaMornaTexto}</p>
          </aside>
        )}
      </div>
    </div>
  );
}

/** Régua das fases (mesmos limites do painel). */
function ReguaFases({ estado, className = "" }: { estado: Estado; className?: string }) {
  return (
    <ol className={`grid grid-cols-3 overflow-hidden rounded-[10px] border-2 border-marinho bg-white ${className}`} aria-label="Fases do botijão">
      {FASES.map((f, i) => {
        const atual = f.id === estado;
        return (
          <li
            key={f.id}
            aria-current={atual ? "step" : undefined}
            className={`px-2 py-3 text-center sm:px-3 ${i > 0 ? "border-l-2 border-marinho" : ""} ${atual ? "bg-marinho text-amarelo" : "text-marinho"}`}
          >
            <span className="block font-titulo text-[1.05rem] font-extrabold uppercase leading-tight sm:text-xl">{f.titulo}</span>
            <span className={`mt-0.5 block text-pequeno font-semibold ${atual ? "text-white" : "text-grafite"}`}>{f.faixa}</span>
          </li>
        );
      })}
    </ol>
  );
}
