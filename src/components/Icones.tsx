import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export function IconeChama(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.5c3.6 3.4 6 6.6 6 10.2a6 6 0 0 1-12 0c0-2.3 1.1-4.3 2.7-5.9.2 2 1.2 3.4 2.6 3.9-.6-3 .2-5.6.7-8.2Z" />
    </svg>
  );
}

export function IconeTelefone(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M21 16.6v2.9a2 2 0 0 1-2.2 2A19.6 19.6 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h2.9a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.8a16 16 0 0 0 4.8 4.8l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function IconeRelogio(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}

export function IconePin(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 21.5s-7-6.1-7-11.5a7 7 0 0 1 14 0c0 5.4-7 11.5-7 11.5Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  );
}

export function IconeCaminhao(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M2.5 6h11v10h-11zM13.5 9.5h4l3 3.4V16h-7z" />
      <circle cx="6.5" cy="17.5" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="17" cy="17.5" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconePredio(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M4 21V4.5A1.5 1.5 0 0 1 5.5 3h8A1.5 1.5 0 0 1 15 4.5V21M15 9h4.5a.5.5 0 0 1 .5.5V21M2.5 21h19" />
      <path d="M8 7h3M8 11h3M8 15h3M17.5 13v.01M17.5 17v.01" />
    </svg>
  );
}

export function IconeRestaurante(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M6 2.5v8M3.5 2.5v5a2.5 2.5 0 0 0 5 0v-5M6 10.5v11M18 21.5v-19c-2.5 1.2-4 4.4-4 8.5h4" />
    </svg>
  );
}

export function IconeEscudo(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 2.8 4.5 5.6v6c0 4.8 3.2 8.2 7.5 9.6 4.3-1.4 7.5-4.8 7.5-9.6v-6Z" />
      <path d="M12 8v4.5M12 16v.01" />
    </svg>
  );
}

export function IconeInstagram(p: P) {
  return (
    <svg {...base} {...p}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.3 6.7v.01" />
    </svg>
  );
}

export function IconeCheck(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="m4.5 12.5 4.8 4.8L19.5 7" />
    </svg>
  );
}

export function IconeAlerta(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5.5M12 16.5v.01" />
    </svg>
  );
}

export function IconeMais(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconeMenos(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconeSeta(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function IconeVoltar(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}

/** Balão de conversa com telefone — ícone próprio, sem logotipo oficial. */
export function IconeZap(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M3.5 20.5 4.8 16A8.6 8.6 0 1 1 8 19.3Z" />
      <path
        d="M9.2 8.2c.3-.3.8-.3 1 .1l.7 1.4c.1.3 0 .6-.2.8l-.5.5c.5 1.1 1.4 2 2.5 2.6l.5-.5c.2-.2.5-.3.8-.2l1.4.7c.4.2.4.7.1 1l-.6.7c-.5.5-1.3.6-2 .3a8.4 8.4 0 0 1-4.2-4.2c-.3-.7-.2-1.5.3-2Z"
        fill="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
