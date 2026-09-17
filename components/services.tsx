import { Reveal } from "./reveal";
import { ServiceTabs } from "./service-tabs";
import { Section, SectionHeading, type Tone } from "./ui";

/**
 * Catalogo con precios. La cabecera es de servidor; las pestanas son el unico
 * trozo interactivo y viven en su propio componente de cliente.
 *
 * Antes eran cinco tarjetas apiladas con foto grande: 2,560 px de alto en
 * escritorio. Con pestanas se muestra una categoria a la vez.
 */
export function Services({ tone }: { tone: Tone }) {
  return (
    <Section id="servicios" tone={tone}>
      <div className="shell">
        <SectionHeading
          eyebrow="Servicios"
          title="Nuestros tratamientos"
          body="Cinco áreas de trabajo con precios publicados, para que sepas qué incluye cada una y cuánto cuesta antes de escribirnos."
        />

        <Reveal className="mt-12">
          <ServiceTabs />
        </Reveal>
      </div>
    </Section>
  );
}
