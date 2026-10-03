/**
 * FONTE ÚNICA DE VERDADE do site da Atende Gás Urgente.
 *
 * Tudo o que aparece no site sai daqui. O que ainda não foi confirmado com a
 * cliente está com `confirmado: false` (ou flag desligada) e NÃO aparece, ou
 * aparece com o marcador "A CONFIRMAR". Lista completa em PENDENCIAS.md.
 *
 * Proibido neste arquivo (e no site): preço, desconto, brinde, prazo de entrega,
 * lista de bairros, marcas de gás, selos, número de entregadores, depoimentos.
 */
import mascoteGerado from "./mascote.json";

/* -------------------------------------------------------------------------- */
/* Contato                                                                     */
/* -------------------------------------------------------------------------- */

// TODO: confirmar qual número é o WhatsApp da empresa. Candidatos vistos:
// (34) 3216-3140 · (34) 3215-6700 · 0800 941 1010 (bio cortada) · (34) 99908-9902.
// Valor provisório = telefone principal. Formato: 55 + DDD + número, só dígitos.
export const WHATSAPP_NUMBER = "553432163140";

export const telefone = {
  exibicao: "(34) 3216-3140",
  href: "tel:+553432163140",
  e164: "+553432163140",
  /** Provisório: é o principal até a cliente confirmar. */
  confirmado: false,
} as const;

export const email = {
  endereco: "",
  /** Só aparece no rodapé se a cliente aprovar. */
  confirmado: false,
} as const;

export const instagram = {
  usuario: "atendegasurgente",
  url: "https://www.instagram.com/atendegasurgente/",
  confirmado: true,
} as const;

/* -------------------------------------------------------------------------- */
/* Empresa                                                                     */
/* -------------------------------------------------------------------------- */

export const empresa = {
  nome: "Atende Gás Urgente",
  nomeCaixaAlta: "ATENDE GÁS URGENTE",
  /** Frase da bio do Instagram (confirmada). */
  frasePortfolio: "Trabalhamos com todos os tamanhos e modelos",
  produto: "gás GLP",
} as const;

export const endereco = {
  rua: "Rua Liopino Lourenço de Araújo",
  numero: "280",
  bairro: "Laranjeiras",
  cidade: "Uberlândia",
  uf: "MG",
  cep: "38410-232",
  plusCode: "2QW6+97",
  /** Centro da Plus Code 58HH2QW6+97 (decodificada com open-location-code). */
  geo: { latitude: -18.9540625, longitude: -48.2393125 },
} as const;

export const enderecoLinha1 = `${endereco.rua}, ${endereco.numero}`;
export const enderecoCompleto = `${endereco.rua}, ${endereco.numero} — ${endereco.bairro}, ${endereco.cidade}/${endereco.uf}, CEP ${endereco.cep}`;
const enderecoBusca = `${endereco.rua}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`;
export const mapaEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(enderecoBusca)}&z=16&output=embed`;
export const mapaLinkUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoBusca)}`;

/**
 * Facebook diz "fundada em 1992"; no Google a empresa disse "30 anos de mercado".
 * Enquanto não confirmar, o site usa só o texto provisório.
 */
export const historia = {
  anoFundacao: 1992,
  textoConfirmadoCurto: "Mais de 30 anos",
  textoConfirmadoLongo: "Desde 1992.",
  textoProvisorio: "Há muitos anos em Uberlândia",
  confirmado: false,
} as const;

/** Nota pública no Google. Só entra (no site e no JSON-LD) se a cliente aprovar. */
export const avaliacaoGoogle = {
  nota: 4.2,
  total: 53,
  confirmado: false,
} as const;

/**
 * Tamanhos/modelos de botijão vendidos. A CONFIRMAR.
 * Quando confirmar: preencher `opcoes` e ligar `confirmado` — o formulário troca o campo de texto por chips.
 */
export const tamanhos: { confirmado: boolean; opcoes: readonly string[] } = {
  confirmado: false,
  opcoes: [],
};

/** Formas de pagamento. A CONFIRMAR — por enquanto o atendente confirma. */
export const pagamento = {
  confirmado: false,
  opcoes: ["Dinheiro", "Pix", "Cartão"],
  nota: "Dinheiro, Pix ou cartão — o atendente confirma.",
} as const;

/* -------------------------------------------------------------------------- */
/* Horários (Google Maps)                                                      */
/* -------------------------------------------------------------------------- */

export const FUSO = "America/Sao_Paulo";

export type Expediente = { abre: number; fecha: number };

/** Minutos desde 00:00. Índice = dia da semana (0 = domingo). Feriados: A CONFIRMAR. */
const SEG_A_SAB: Expediente = { abre: 7 * 60 + 30, fecha: 21 * 60 };
const DOMINGO: Expediente = { abre: 8 * 60, fecha: 19 * 60 };

export const expedientes: readonly Expediente[] = [
  DOMINGO,
  SEG_A_SAB,
  SEG_A_SAB,
  SEG_A_SAB,
  SEG_A_SAB,
  SEG_A_SAB,
  SEG_A_SAB,
];

export const horariosTexto = {
  /** Fallback do selo (sem JS / antes de hidratar). */
  selo: "ATENDIMENTO: SEG–SÁB 7H30–21H · DOM 8H–19H",
  microlinha: "Seg a sáb, 7h30 às 21h · Dom, 8h às 19h",
  semana: "Segunda a sábado, das 7h30 às 21h",
  domingo: "Domingo, das 8h às 19h",
  feriadosConfirmado: false,
} as const;

/** Para o JSON-LD (schema.org). */
export const horariosSchema = [
  {
    dias: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abre: "07:30",
    fecha: "21:00",
  },
  { dias: ["Sunday"], abre: "08:00", fecha: "19:00" },
] as const;

/* -------------------------------------------------------------------------- */
/* Flags de conteúdo que dependem de aprovação da cliente                      */
/* -------------------------------------------------------------------------- */

export const flags = {
  /** Texto "Como saber o nível sem balança" (água morna). Se não aprovado, fica oculto. */
  aguaMornaAprovada: false,
  /** Seção "Sentiu cheiro de gás?". Se não aprovada, fica oculta. */
  segurancaAprovada: false,
  /** Bloco "Seja revendedor" em Quem somos. */
  revendaAtiva: false,
  /** Linha "Site por Webcreate" no rodapé (aprovação do Bernardo). */
  creditoWebcreate: false,
} as const;

/**
 * Modo revisão: `npm run build:revisao` mostra também os blocos ainda não aprovados
 * (segurança, água morna), com a etiqueta "EM REVISÃO", para a cliente aprovar.
 * O build normal (`npm run build`) esconde esses blocos.
 */
export const MODO_REVISAO = process.env.NEXT_PUBLIC_MODO_REVISAO === "1";

/** Domínio do site. atendegasurgente.com.br consta no Facebook e não abre — A CONFIRMAR. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://atendegasurgente.com.br").replace(/\/$/, "");

/* -------------------------------------------------------------------------- */
/* Mascote                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * /public/brand/mascote.png — hoje é um PLACEHOLDER genérico (o recorte do Instagram não
 * estava disponível). NUNCA redesenhar o mascote: troque o PNG pelo arquivo da cliente,
 * rode `npm run imagens` (gera WebP/AVIF e atualiza mascote.json; use `-- --remover-fundo`
 * se vier com fundo branco) e `npm run og`.
 * Com baixa resolução (< 560 px) o site nunca exibe o mascote acima de 160 px.
 */
export const mascote = {
  png: "/brand/mascote.png",
  webp: "/brand/mascote.webp",
  avif: "/brand/mascote.avif",
  largura: mascoteGerado.largura,
  altura: mascoteGerado.altura,
  altaResolucao: mascoteGerado.largura >= 560,
  /** true enquanto o PNG for o placeholder genérico gerado por scripts/mascote-placeholder.mjs. */
  placeholder: mascoteGerado.placeholder,
  alt: mascoteGerado.placeholder
    ? "Ilustração de botijão de gás"
    : "Mascote da Atende Gás Urgente: botijão amarelo de boné azul fazendo sinal de positivo",
} as const;

/** Largura máxima em que o mascote pode aparecer sem ser ampliado/borrado. */
export function larguraSeguraMascote(desejada: number): number {
  const teto = mascote.altaResolucao ? desejada : Math.min(desejada, 160);
  return Math.min(teto, mascote.largura);
}

/* -------------------------------------------------------------------------- */
/* Mensagens de WhatsApp                                                       */
/* -------------------------------------------------------------------------- */

export const mensagens = {
  padrao: "Olá! Vim pelo site e preciso pedir gás. Pode me ajudar?",
  termometroCheio:
    "Olá! Vim pelo site. Meu botijão ainda está bom, mas já quero deixar o próximo pedido adiantado. Pode me ajudar?",
  termometroMetade:
    "Olá! Vim pelo site. Meu botijão está pela metade e quero garantir o próximo. Pode me ajudar?",
  termometroAcabando:
    "Olá! Vim pelo site. Meu botijão está acabando e preciso pedir gás. Pode confirmar o valor e o prazo?",
  seguranca: "Olá! Vim pelo site e tenho uma dúvida sobre o meu botijão.",
} as const;

export type DadosPedido = {
  tamanho: string;
  quantidade: number;
  bairro: string;
  rua: string;
  complemento: string;
  pagamento: string;
  nome: string;
};

export function mensagemPedido(d: DadosPedido): string {
  const tamanho = d.tamanho.trim() || "tamanho a combinar";
  const endereco = [d.rua.trim(), d.complemento.trim()].filter(Boolean).join(", ");
  const linhas = [
    "Olá! Vim pelo site e quero pedir gás.",
    "",
    `Botijão: ${tamanho} x${d.quantidade}`,
    `Bairro: ${d.bairro.trim()}`,
    `Endereço: ${endereco}`,
    `Pagamento: ${d.pagamento.trim() || "a combinar"}`,
  ];
  if (d.nome.trim()) linhas.push(`Nome: ${d.nome.trim()}`);
  linhas.push("", "Pode confirmar o valor e o prazo?");
  return linhas.join("\n");
}

export type DadosEmpresa = {
  empresa: string;
  cnpj: string;
  botijoesSemana: string;
  endereco: string;
};

export function mensagemEmpresa(d: DadosEmpresa): string {
  const linhas = [
    "Olá! Vim pelo site e quero falar sobre abastecimento de gás para a minha empresa.",
    "",
    `Empresa: ${d.empresa.trim()}`,
  ];
  if (d.cnpj.trim()) linhas.push(`CNPJ: ${d.cnpj.trim()}`);
  if (d.botijoesSemana.trim()) linhas.push(`Botijões por semana: ${d.botijoesSemana.trim()}`);
  if (d.endereco.trim()) linhas.push(`Endereço: ${d.endereco.trim()}`);
  linhas.push("", "Podemos conversar?");
  return linhas.join("\n");
}

/* -------------------------------------------------------------------------- */
/* Textos da página (texto exato do briefing)                                  */
/* -------------------------------------------------------------------------- */

export const textos = {
  seo: {
    titulo: "Atende Gás Urgente | Gás de cozinha em Uberlândia — Laranjeiras",
    descricao:
      "Peça seu botijão de gás pelo WhatsApp. Atendimento de segunda a sábado, 7h30 às 21h, e domingo, 8h às 19h, em Uberlândia.",
  },
  hero: {
    linhas: ["ACABOU", "O GÁS?", "PEÇA AGORA."],
    subtitulo:
      "Escolha o botijão, mande o pedido pelo WhatsApp e a gente confirma valor e prazo com você na hora.",
    ctaZap: "PEDIR GÁS NO WHATSAPP",
    ctaLigar: `LIGAR ${telefone.exibicao}`,
    microlinha: `${horariosTexto.microlinha} · ${endereco.bairro}, ${endereco.cidade}`,
  },
  termometro: {
    titulo: "QUANTO GÁS AINDA TEM NO SEU BOTIJÃO?",
    sub: "Mexa no botijão e veja o que fazer.",
    atalhos: [
      { rotulo: "CHEIO", valor: 100 },
      { rotulo: "METADE", valor: 50 },
      { rotulo: "ACABANDO", valor: 12 },
    ],
    estados: {
      cheio: {
        titulo: "TUDO CERTO POR ENQUANTO",
        corpo:
          "Seu botijão está em boa fase. Guarde-o em pé, em local ventilado e longe de fontes de calor.",
        cta: "Já quero deixar o próximo pedido adiantado",
      },
      metade: {
        titulo: "FIQUE DE OLHO",
        corpo:
          "Dá para seguir, mas se tem visita, festa ou muita gente em casa, vale garantir o próximo.",
        cta: "Pedir agora",
      },
      acabando: {
        titulo: "HORA DE PEDIR",
        corpo:
          "Quanto antes você pede, menos chance de ficar sem gás no meio do preparo. Mande o pedido que a gente confirma valor e prazo.",
        cta: "Pedir agora",
      },
    },
    aguaMornaTitulo: "Como saber o nível sem balança",
    aguaMornaTexto:
      "Despeje um pouco de água morna na lateral do botijão e passe a mão: a parte onde o gás está fica mais gelada que a vazia.",
    aviso: "Ilustração para orientação. O nível real depende do uso.",
  },
  pedido: {
    titulo: "PEÇA EM 3 TOQUES",
    sub: "Sem cadastro, sem app. O pedido sai pronto no WhatsApp.",
    etapas: ["QUAL BOTIJÃO?", "ONDE VAMOS ENTREGAR?", "COMO VAI PAGAR?"],
    tamanhoLabel: "Tamanho/modelo (ex.: o que você usa hoje)",
    avisoEndereco: "A gente confirma se atende o seu endereço.",
    botaoFinal: "ENVIAR PEDIDO NO WHATSAPP",
    rodape: "O atendente confirma disponibilidade, valor e prazo antes de fechar.",
  },
  empresas: {
    titulo: "RESTAURANTE, PADARIA, CONDOMÍNIO? TEM ATENDIMENTO PARA EMPRESA.",
    texto: "Se o seu negócio usa gás todo dia, fale com a gente para combinar o abastecimento.",
    botao: "FALAR SOBRE ABASTECIMENTO",
  },
  seguranca: {
    titulo: "SENTIU CHEIRO DE GÁS? FAÇA ISSO:",
    passos: [
      "Não acenda fósforo, isqueiro nem interruptor de luz.",
      "Não use celular perto do cheiro.",
      "Abra portas e janelas para ventilar.",
      "Feche o registro do botijão, se for seguro fazer isso.",
      "Saia do local e ligue para o Corpo de Bombeiros: 193.",
    ],
    boasPraticas: [
      "Guarde o botijão em pé e em local ventilado",
      "Confira a mangueira e as conexões",
      "Troque a mangueira vencida",
      "Não deixe botijão perto de calor",
    ],
    rodape: "Dúvida sobre o seu botijão? Fale com a gente.",
  },
  quemSomos: {
    titulo: "UMA EMPRESA DE BAIRRO, DE UBERLÂNDIA.",
    texto:
      "A Atende Gás Urgente trabalha com gás GLP e tem todos os tamanhos e modelos de botijão. Atendemos famílias e empresas de Uberlândia.",
    fotos: ["Loja", "Equipe", "Frota"],
  },
  faq: [
    {
      pergunta: "Vocês atendem o meu bairro?",
      resposta: "Mande seu endereço no WhatsApp que a gente confirma.",
      confirmado: true,
    },
    {
      pergunta: "Qual o horário?",
      resposta: `${horariosTexto.semana}. ${horariosTexto.domingo}.`,
      confirmado: true,
    },
    {
      pergunta: "Quais formas de pagamento?",
      resposta: "O atendente confirma no pedido.",
      confirmado: true,
    },
    {
      pergunta: "Qual o prazo?",
      resposta: "Informamos o prazo na hora do pedido, de acordo com o seu endereço.",
      confirmado: true,
    },
    {
      pergunta: "Vocês atendem empresas?",
      resposta: "Sim.",
      confirmado: true,
    },
    {
      pergunta: "Qual a diferença entre os tamanhos de botijão?",
      resposta: "",
      confirmado: false,
    },
  ],
} as const;
