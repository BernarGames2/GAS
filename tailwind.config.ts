import type { Config } from "tailwindcss";

/**
 * Design system "Plantão do Botijão".
 * As cores vivem como CSS variables em src/app/globals.css; aqui só apontamos para elas.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        amarelo: "var(--amarelo)",
        "amarelo-claro": "var(--amarelo-claro)",
        marinho: "var(--azul-marinho)",
        "marinho-escuro": "var(--azul-marinho-escuro)",
        azul: "var(--azul)",
        grafite: "var(--grafite)",
        papel: "var(--papel)",
        branco: "var(--branco)",
        zap: "var(--zap)",
        "zap-hover": "var(--zap-hover)",
        alerta: "var(--alerta)",
      },
      fontFamily: {
        titulo: ["var(--font-titulo)", "Arial Narrow", "Arial", "sans-serif"],
        corpo: ["var(--font-corpo)", "Arial", "sans-serif"],
        stencil: ["var(--font-stencil)", "Impact", "sans-serif"],
      },
      fontSize: {
        h1: ["clamp(3.25rem, 11vw, 7rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
        h2: ["clamp(2.25rem, 6vw, 4rem)", { lineHeight: "0.95", letterSpacing: "-0.01em" }],
        h3: ["1.5rem", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        corpo: ["1.0625rem", { lineHeight: "1.6" }],
        pequeno: ["0.875rem", { lineHeight: "1.45" }],
      },
      borderRadius: {
        cartao: "14px",
        pilula: "999px",
      },
      boxShadow: {
        botao: "0 6px 0 rgba(18, 48, 107, 0.9)",
        "botao-apertado": "0 2px 0 rgba(18, 48, 107, 0.9)",
        etiqueta: "6px 6px 0 var(--azul-marinho)",
      },
      maxWidth: {
        container: "1200px",
      },
      spacing: {
        secao: "clamp(56px, 9vw, 112px)",
      },
    },
  },
  plugins: [],
};

export default config;
