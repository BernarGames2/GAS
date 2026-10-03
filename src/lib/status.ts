import { expedientes, FUSO } from "@/data/gas";

export type Status = {
  aberto: boolean;
  rotulo: string;
  /** null quando está aberto. */
  proximaAbertura: { quando: "hoje" | "amanha"; minutos: number } | null;
};

const DIAS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const formatador = new Intl.DateTimeFormat("en-US", {
  timeZone: FUSO,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/** Dia da semana e minutos desde 00:00 SEMPRE no fuso de Uberlândia, não no do aparelho. */
export function horaEmUberlandia(agora: Date): { dia: number; minutos: number } {
  let dia = 0;
  let hora = 0;
  let minuto = 0;
  for (const parte of formatador.formatToParts(agora)) {
    if (parte.type === "weekday") dia = DIAS[parte.value] ?? 0;
    else if (parte.type === "hour") hora = Number(parte.value) % 24;
    else if (parte.type === "minute") minuto = Number(parte.value);
  }
  return { dia, minutos: hora * 60 + minuto };
}

/** 450 → "7H30" · 480 → "8H" · 1260 → "21H" */
export function horaCurta(minutos: number): string {
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m === 0 ? `${h}H` : `${h}H${String(m).padStart(2, "0")}`;
}

export function getStatus(agora: Date): Status {
  const { dia, minutos } = horaEmUberlandia(agora);
  const hoje = expedientes[dia]!;

  if (minutos >= hoje.abre && minutos < hoje.fecha) {
    return { aberto: true, rotulo: `ATENDENDO AGORA · ATÉ ${horaCurta(hoje.fecha)}`, proximaAbertura: null };
  }

  if (minutos < hoje.abre) {
    return {
      aberto: false,
      rotulo: `ABRIMOS HOJE ÀS ${horaCurta(hoje.abre)}`,
      proximaAbertura: { quando: "hoje", minutos: hoje.abre },
    };
  }

  const amanha = expedientes[(dia + 1) % 7]!;
  return {
    aberto: false,
    rotulo: `FECHADO AGORA · ABRIMOS AMANHÃ ÀS ${horaCurta(amanha.abre)}`,
    proximaAbertura: { quando: "amanha", minutos: amanha.abre },
  };
}
