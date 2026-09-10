import type { Metadata, Viewport } from "next";
import { Hedvig_Letters_Serif } from "next/font/google";
import { clinic, doctor, faq, services } from "@/content/site";
import "./globals.css";

/**
 * Hedvig Letters Serif sale de Google Fonts y se auto-hospeda en el build:
 * cero peticiones a terceros y cero salto de fuente (next/font inyecta las
 * metricas de respaldo). General Sans no esta en Google, asi que se carga
 * desde Fontshare, su distribuidor oficial. Ver DECISIONS.md.
 */
const display = Hedvig_Letters_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-display-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(clinic.url),
  title: {
    default: `${clinic.name} | ${clinic.tagline} en ${clinic.address.locality}`,
    template: `%s | ${clinic.name}`,
  },
  description:
    "Cirugía plástica, armonización facial, bioestimuladores de colágeno y tratamientos de calidad de piel. Valoración inicial sin costo con cirujana certificada.",
  keywords: [
    "cirugía plástica",
    "armonización facial",
    "toxina botulínica",
    "bioestimuladores de colágeno",
    "medicina estética",
    clinic.address.locality,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: clinic.url,
    siteName: clinic.name,
    title: `${clinic.name} | ${clinic.tagline}`,
    description:
      "Tratamientos estéticos y quirúrgicos planeados sobre tu anatomía. Valoración inicial sin costo.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#d9d4c7",
};

/**
 * Datos estructurados. Se emiten en el layout y no en la pagina porque
 * describen a la entidad (la clinica), no al documento.
 * MedicalClinic hereda de LocalBusiness, asi que un solo nodo cubre el panel
 * local de Google y el marcado sanitario.
 */
function structuredData() {
  const clinicNode = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${clinic.url}#clinic`,
    name: clinic.legalName,
    url: clinic.url,
    telephone: clinic.phoneDisplay,
    email: clinic.email,
    medicalSpecialty: "PlasticSurgery",
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.locality,
      addressRegion: clinic.address.region,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    openingHours: ["Mo-Fr 09:00-19:00", "Sa 09:00-14:00"],
    employee: {
      "@type": "Physician",
      name: doctor.name,
      medicalSpecialty: "PlasticSurgery",
    },
    availableService: services.map((s) => ({
      "@type": "MedicalProcedure",
      name: s.title,
      description: s.summary,
    })),
  };

  // Bloque de preguntas: alimenta el resultado enriquecido de FAQ en la SERP.
  const faqNode = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return [clinicNode, faqNode];
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX" className={display.variable}>
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
        />
      </head>
      <body>
        {/* Primer elemento tabulable de la pagina: deja saltar la navegacion. */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-bark focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Saltar al contenido
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </body>
    </html>
  );
}
