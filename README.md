# Atende Gás Urgente — site

Página única, estática, para a revenda de gás GLP **Atende Gás Urgente** (Laranjeiras, Uberlândia/MG).
Objetivo: quem está com o gás acabando pede pelo WhatsApp em poucos segundos.

Conceito visual **“Plantão do Botijão”**: sinalização de utilidade (fita zebrada amarelo/azul, numerais em stencil, cartões tipo etiqueta, selo de plantão com status ao vivo) e o **Termômetro do Botijão**, que transforma “estou ficando sem gás” em pedido.

> **Pendências da cliente:** veja [`PENDENCIAS.md`](PENDENCIAS.md). Nada que não esteja confirmado aparece no site.

## Rodando

Requisitos: Node 20+.

```bash
npm install
npm run dev            # desenvolvimento em http://localhost:3000
npm run build          # gera o site estático em out/
npm start              # serve out/ em http://127.0.0.1:4173 (com gzip, como numa hospedagem)
```

`out/index.html` também abre direto com duplo clique (caminhos relativos): layout, termômetro, pedido e status funcionam; só as fontes da web não carregam via `file://` (bloqueio do próprio navegador). Para ver 100%, use `npm start`.

### Publicar

Qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, GitHub Pages, S3…): publique a pasta `out/`. Ative compressão gzip/brotli (todas essas já fazem). Se o domínio for outro, faça o build com `NEXT_PUBLIC_SITE_URL=https://seu-dominio npm run build` (canonical, Open Graph e sitemap usam esse valor).

## Onde mudar as coisas

| O quê | Onde |
|---|---|
| Fatos, textos, horários, número do WhatsApp, flags de aprovação | `src/data/gas.ts` (fonte única de verdade) |
| Cores, tipografia, botões, faixa zebrada, movimentos | `src/app/globals.css` (CSS variables) + `tailwind.config.ts` |
| Regras do selo “ATENDENDO AGORA / FECHADO” | `src/lib/status.ts` (sempre no fuso `America/Sao_Paulo`) |
| Montagem dos links do WhatsApp | `src/lib/whatsapp.ts` + `mensagemPedido` / `mensagemEmpresa` em `gas.ts` |
| SEO (title, description, OG, JSON-LD, sitemap, robots) | `src/app/layout.tsx`, `src/lib/jsonld.ts`, `src/app/sitemap.ts`, `src/app/robots.ts` |

### Trocar o mascote

O arquivo atual é um **placeholder genérico** (ver pendência 1). Quando chegar o arquivo da cliente:

```bash
# 1. substitua public/brand/mascote.png
npm run imagens                    # gera WebP/AVIF e grava largura/altura em src/data/mascote.json
npm run imagens -- --remover-fundo # idem, removendo fundo branco (recorte do Instagram)
npm run og                         # refaz public/og.png (1200×630) — precisa de internet p/ as fontes
```

Com menos de 560 px de largura o site trata o mascote como baixa resolução e nunca o exibe acima de 160 px. O mascote nunca é redesenhado.

## Estrutura

```
src/app/            layout.tsx · page.tsx · globals.css · sitemap.ts · robots.ts · icon.svg
src/data/gas.ts     fatos, horários, WHATSAPP_NUMBER, textos, flags `confirmado`
src/lib/            status.ts (getStatus) · whatsapp.ts (buildWhatsAppUrl) · jsonld.ts
src/components/     Header · Hero · StatusPlantao · Termometro · PedidoEm3Toques · EmpresasForm
                    Seguranca · QuemSomos · Faq · Footer · MapaSobClique · BarraFixa · FaixaZebrada
                    Botoes · Icones (SVG próprios) · Mascote · Revisao
src/fonts/          Saira Stencil One só com os dígitos 1–3 (3,7 KB)
public/brand/       mascote.png/.webp/.avif · public/og.png
scripts/            qa.mjs · contraste.mjs · servir.mjs · imagens.mjs · og.mjs · build-revisao.mjs
```

## QA

```bash
npm run build && npm run qa          # testa out/ → qa/relatorio.md + qa/screens/
npm run build:revisao && npm run qa:revisao   # idem para out-revisao/ (blocos em revisão visíveis)
npm run contraste                    # só o contraste WCAG dos pares de cor
```

O `qa.mjs` (Playwright) cobre: screenshots 1440×900 / 768×1024 / 390×844 de cada seção e dos estados interativos; selo de status em 10 horários simulados (com o aparelho em outro fuso); fallback sem JavaScript; CLS; todos os links `wa.me` e `tel:` decodificados; termômetro pelo teclado, atalhos e toque; formulários vazios (erros e foco) e preenchidos (mensagem exata); nada enviado a servidor; overflow em 360/320 px; iPhone SE com H1 + CTA visíveis; texto cortado; mascote sem caixa branca e sem ampliação; movimento reduzido; acessibilidade básica (rótulos, alvos ≥ 48 px, foco de 3 px, nome acessível × texto visível); busca de conteúdo proibido (R$, “min”, grátis, 24h, garantido, “Gás Urgente” sem “Atende”, desconto, preço, prazo prometido, depoimentos) na página e no código; contraste AA; tamanho do JS; erros de console.

Navegador: usa `CHROMIUM_PATH`, ou `/opt/pw-browsers/chromium`, ou o Chromium do Playwright (`npx playwright install chromium`).

## Desempenho (medido em out/ servido com gzip)

| Lighthouse | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Mobile (padrão, 4G simulado) | 98–99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

- CLS 0 · TBT 60–90 ms · FCP 1,1 s.
- LCP: 2,0–2,3 s no modo simulado do Lighthouse; 1,0–1,9 s com throttling 4G aplicado de verdade (`--throttling-method=devtools`).
- **JS: ~140 KB gzip, acima da meta de 90 KB do briefing.** Só o runtime do Next.js 16 (App Router) + React 19 já ocupa ~130 KB gzip numa página vazia; o código do site soma ~10 KB. Os scripts são `async` e os botões de WhatsApp/telefone são links comuns, então funcionam antes de o JS carregar. Para ficar abaixo de 90 KB seria preciso abandonar o React no cliente (ex.: usar o Next só como gerador estático e reescrever termômetro/formulários em JS puro) — fica como decisão em aberto.

## Privacidade (LGPD)

- **Sem cookies, sem analytics, sem formulário que envia dados.** Os formulários só montam o texto e abrem o WhatsApp; nada vai para servidor (o QA verifica).
- O **mapa do Google** só carrega quando a pessoa clica em “Ver mapa” (até lá, nenhuma requisição a terceiros).
- Fontes são servidas pelo próprio site (next/font), sem chamar o Google Fonts no navegador.

### Se quiser medir visitas (com consentimento)

1. Prefira uma ferramenta sem cookies (ex.: Plausible, Umami ou Cloudflare Web Analytics) — normalmente dispensa banner, mas cite-a numa política de privacidade.
2. Se usar Google Analytics 4: adicione um banner de consentimento e só carregue o script **depois** do aceite (Consent Mode v2 com `analytics_storage: 'denied'` por padrão).
3. Coloque o script em `src/app/layout.tsx` com `next/script` (`strategy="afterInteractive"`), condicionado ao consentimento, e registre isso numa página de política de privacidade.
4. Para medir cliques no WhatsApp, use o atributo `data-cta="whatsapp"` / `data-cta="telefone"` que todos os botões já têm.

## Fontes e licenças

Barlow, Barlow Condensed e Saira Stencil One — SIL Open Font License (Google Fonts).
