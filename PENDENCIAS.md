# Pendências — Atende Gás Urgente

Tudo o que ainda depende da cliente (ou do Bernardo). Enquanto um item estiver aberto, o site **não inventa**: esconde o bloco, usa um texto neutro ou mostra o marcador **A CONFIRMAR**.
Todos os ajustes são feitos em `src/data/gas.ts` (fonte única de verdade), salvo indicação.

| # | Pendência | Situação hoje no site | Onde ajustar |
|---|---|---|---|
| 1 | **Logo/mascote em alta** (PNG transparente ou vetor) | O recorte do Instagram não veio junto com o briefing, então `public/brand/mascote.png` é um **placeholder genérico** (botijão sem rosto/boné/polegar — não é o mascote). O site nunca exibe o mascote acima do tamanho real nem acima de 160 px enquanto for baixa resolução. | Trocar `public/brand/mascote.png` → `npm run imagens` (use `-- --remover-fundo` se vier com fundo branco) → `npm run og` |
| 2 | **Número principal e qual é o WhatsApp** | Botões usam `WHATSAPP_NUMBER = "553432163140"` (provisório = telefone principal (34) 3216-3140). Outros números vistos: (34) 3215-6700 · 0800 941 1010 · (34) 99908-9902. | `WHATSAPP_NUMBER` e `telefone` |
| 3 | **Relação com a marca “Gás Urgente”** (gasurgente.com.br, app, Av. João Pessoa 1163) | Não é mencionada em lugar nenhum (o QA reprova se aparecer). | — |
| 4 | **Domínio** atendegasurgente.com.br (consta no Facebook e não abre) | Usado provisoriamente em canonical, Open Graph, sitemap e JSON-LD. | `SITE_URL` (ou variável `NEXT_PUBLIC_SITE_URL` no build) |
| 5 | **Tamanhos e modelos vendidos** | Pedido usa campo de texto livre + “Trabalhamos com todos os tamanhos e modelos” (frase da bio). FAQ “diferença entre os tamanhos” = A CONFIRMAR. | `tamanhos.opcoes` + `tamanhos.confirmado: true` (vira chips); resposta em `textos.faq` |
| 6 | **Bairros atendidos** | Não listados (proibido sem confirmação). FAQ: “Mande seu endereço no WhatsApp que a gente confirma.” | — |
| 7 | **Formas de pagamento** | Seleção com Dinheiro / Pix / Cartão + nota “o atendente confirma”. FAQ: “O atendente confirma no pedido.” | `pagamento` |
| 8 | **Política de prazo** | Nenhum prazo prometido. FAQ: “Informamos o prazo na hora do pedido…” | — |
| 9 | **Feriados** | Status ao vivo ignora feriados (usa o horário normal do dia da semana). | `expedientes` em `gas.ts` / `getStatus` em `src/lib/status.ts` |
| 10 | **“Desde 1992” / “mais de 30 anos”** | Site mostra “Há muitos anos em Uberlândia”. | `historia.confirmado: true` (hero passa a “Mais de 30 anos”; Quem somos, “Desde 1992.”) |
| 11 | **Fotos reais** (loja, equipe, frota) | 3 molduras “FOTO A CONFIRMAR” em Quem somos. | `src/components/QuemSomos.tsx` (trocar pelas fotos em AVIF/WebP com width/height) |
| 12 | **Aprovar texto de segurança** (“Sentiu cheiro de gás?”) | **Oculto** no build normal; aparece com etiqueta “EM REVISÃO” no build de revisão. | `flags.segurancaAprovada: true` |
| 13 | **Aprovar o truque da água morna** (“Como saber o nível sem balança”) | **Oculto** no build normal; aparece com etiqueta no build de revisão. | `flags.aguaMornaAprovada: true` |
| 14 | **Aprovar uso da nota do Google** (4,2 ★, 53 avaliações — há reclamações públicas de demora) | Não aparece no site nem no JSON-LD (`aggregateRating`). | `avaliacaoGoogle.confirmado: true` |
| 15 | **A revenda segue ativa?** | Bloco “Seja revendedor” oculto. Se ativar, revisar o texto do bloco. | `flags.revendaAtiva` + `QuemSomos.tsx` |
| 16 | **E-mail** | Não aparece no rodapé. | `email.endereco` + `email.confirmado: true` |
| 17 | **Crédito “Site por Webcreate”** (aprovação do Bernardo) | Oculto. | `flags.creditoWebcreate: true` |
| 18 | **Conferir o pin do mapa** | Coordenadas do JSON-LD decodificadas da Plus Code 2QW6+97 → 58HH2QW6+97 (‑18.9540625, ‑48.2393125). O mapa do rodapé busca pelo endereço. | `endereco.geo` |

## Como a cliente revisa os blocos pendentes

```bash
npm run build:revisao   # gera out-revisao/ com segurança e água morna visíveis (etiqueta "EM REVISÃO")
```

Aprovado o texto, ligue a flag correspondente em `src/data/gas.ts` e rode `npm run build` normalmente.
