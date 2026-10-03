import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { SITE_URL, empresa, textos } from "@/data/gas";
import "./globals.css";

const titulo = Barlow_Condensed({
  subsets: ["latin"],
  weight: "800",
  display: "swap",
  variable: "--font-titulo",
});

const corpo = Barlow({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
  variable: "--font-corpo",
});

// Saira Stencil One só com os dígitos 1–3 (subset do Google Fonts, 3,7 KB, licença OFL).
// Usada apenas nos numerais das etapas do pedido.
const stencil = localFont({
  src: "../fonts/saira-stencil-one-123.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-stencil",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: textos.seo.titulo,
  description: textos.seo.descricao,
  applicationName: empresa.nome,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: empresa.nome,
    title: textos.seo.titulo,
    description: textos.seo.descricao,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Atende Gás Urgente — Acabou o gás?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: textos.seo.titulo,
    description: textos.seo.descricao,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFC400",
};

/**
 * Roda antes da hidratação: marca <html class="js"> e revela as seções (fade-up, 1 vez)
 * quando entram na tela. Sem JS nada fica escondido.
 */
const scriptRevelar = `(function(){var d=document.documentElement;d.classList.add('js');function r(){var els=[].slice.call(document.querySelectorAll('[data-revelar]'));if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('revelado')});return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('revelado');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0.01});els.forEach(function(e){io.observe(e)})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',r)}else{r()}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${titulo.variable} ${corpo.variable} ${stencil.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptRevelar }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
