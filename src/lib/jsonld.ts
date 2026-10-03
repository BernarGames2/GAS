import { avaliacaoGoogle, empresa, endereco, horariosSchema, instagram, SITE_URL, telefone } from "@/data/gas";

/** JSON-LD LocalBusiness. aggregateRating só entra se a cliente aprovar a nota do Google. */
export function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#empresa`,
    name: empresa.nome,
    description: "Revenda de gás GLP (botijões) em Uberlândia. Pedidos pelo WhatsApp ou telefone.",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og.png`,
    telephone: telefone.e164,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${endereco.rua}, ${endereco.numero}`,
      addressLocality: endereco.cidade,
      addressRegion: endereco.uf,
      postalCode: endereco.cep,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: endereco.geo.latitude,
      longitude: endereco.geo.longitude,
    },
    openingHoursSpecification: horariosSchema.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dias.map((d) => `https://schema.org/${d}`),
      opens: h.abre,
      closes: h.fecha,
    })),
    sameAs: [instagram.url],
    ...(avaliacaoGoogle.confirmado
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avaliacaoGoogle.nota,
            reviewCount: avaliacaoGoogle.total,
            bestRating: 5,
          },
        }
      : {}),
  };
}
