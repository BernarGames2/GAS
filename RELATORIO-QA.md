# Relatório de entrega — QA e autocrítica

Build: `npm run build` sem erros nem avisos (Next.js 16.3, Turbopack, `output: 'export'`).
QA automatizado (`npm run qa`): **50/50** no build normal e **50/50** no build de revisão (`npm run qa:revisao`).
Contraste: 27 pares de cor, todos AA (menor: 3,64:1 para anel de foco, mínimo 3:1; texto ≥ 4,5:1).

## Notas finais (autocrítica, Parte 7-D)

| Critério | Nota | Por quê |
|---|---|---|
| Clareza do CTA | 9,5 | Verde só existe no WhatsApp; aparece no hero (visível sem rolar no iPhone SE), no header (desktop) e na barra fixa (celular). “Ligar” é sempre o secundário. |
| Identidade | 9 | Fita zebrada entre todas as seções, numerais em stencil, cartões “etiqueta”, selo de plantão ao vivo, botijão desenhado. Sobe quando entrar o mascote real. |
| Legibilidade no celular | 9 | Corpo 17 px, títulos condensados grandes, contraste AA, alvos ≥ 48 px, sem overflow em 320 px. |
| Confiança | 9 | Só fatos: endereço com “Como chegar”, horários, Instagram, status ao vivo, cartão da loja. Fotos reais e “desde 1992” dependem da cliente. |
| Originalidade | 9 | Termômetro do botijão com régua de fases e mensagem por estado; prévia ao vivo da mensagem do pedido; nada de banner genérico. |
| Acabamento | 9 | Revisado em 1440, 768, 390 e 375×667, nos estados interativos e no build de revisão. |

## Defeitos encontrados nos screenshots e corrigidos

1. **Hero no celular apertado** — o mascote espremia horário e chips (endereço quebrando em 2 linhas atrás da barra fixa). Reorganizado em áreas de grid: horário ao lado do mascote, chips em linha própria.
2. **Termômetro no celular** — ao mexer no controle, o resultado ficava fora da tela. Botijão um pouco menor no celular e régua “Hora de pedir / Fique de olho / Tudo certo” logo abaixo dos atalhos.
3. **Foco invisível** — o anel amarelo (usado na seção azul) sumia nos campos do cartão claro do pedido. Dentro de cartões claros o anel volta ao azul.
4. **Fotos de “Quem somos” gigantes no celular** — conflito de `aspect-ratio`; corrigido (1 larga + 2 menores).
5. **Botões Voltar/Continuar desalinhados no celular** — agora o principal ocupa a largura toda e “Voltar” fica abaixo.

Outros ajustes da mesma rodada: nível “acabando” se confundia com a base azul do botijão (base passou a amarelo); placeholder sumia no círculo azul (contorno branco); hero do tablet com vão vazio (mascote ao lado do título e bloco centralizado); “21h” e “280” quebrando sozinhos; coluna esquerda do pedido repetia o stepper (virou prévia ao vivo da mensagem); `aria-label` que não continha o texto visível (Lighthouse); link “193” com 22 px (virou botão “Ligar 193” de 48 px, mantendo o texto exato).

## Lighthouse (out/ servido com gzip)

| | Performance | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Mobile | 98–99 | 100 | 100 | 100 |
| Desktop | 100 | 100 | 100 | 100 |

CLS 0 · TBT 60–90 ms · FCP 1,1 s · LCP 2,0–2,3 s (simulado) / 1,0–1,9 s (4G aplicado).

## Fora da meta (decisão consciente)

- **JS ~140 KB gzip (meta < 90 KB).** O piso do Next.js 16 App Router + React 19 é ~130 KB numa página vazia; o código do site é ~10 KB. Botões de pedido são links comuns e funcionam antes do JS. Alternativa para cumprir: Next só como gerador estático + JS puro nos componentes interativos.
- **LCP simulado no limite (2,0–2,3 s).** O modo simulado do Lighthouse conta o download desses scripts no caminho do LCP; com 4G aplicado de verdade o LCP fica entre 1,0 e 1,9 s.
- **Mascote**: o arquivo do Instagram não veio com o briefing; há um placeholder genérico (não é o mascote). Ver `PENDENCIAS.md`.
