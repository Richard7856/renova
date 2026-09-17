import Image from "next/image";
import { formatPrice, services, type Service } from "@/content/site";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./ui";

export function Services() {
  return (
    <Section id="servicios" tone="cream">
      <div className="shell">
        <SectionHeading
          eyebrow="Servicios"
          title="Nuestros tratamientos"
          body="Cinco áreas de trabajo con precios publicados, para que sepas qué incluye cada una y cuánto cuesta antes de escribirnos."
        />

        {/* grid-cols-1 explicito = minmax(0, 1fr). Sin el, la pista implicita mide
            lo que la palabra mas larga del catalogo ("Polidesoxirribonucleótidos")
            y ensanchaba la pagina entera en movil. */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={(i % 2) * 90}
              /* La primera tarjeta ocupa el ancho completo: da jerarquia al
                 bloque quirurgico, que es el servicio de mayor valor. */
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <ServiceCard service={service} isFeatured={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

function ServiceCard({
  service,
  isFeatured,
}: {
  service: Service;
  isFeatured: boolean;
}) {
  const hasPrices = service.treatments.some((t) => t.price !== undefined);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card bg-sage">
      <div
        className={`relative overflow-hidden ${isFeatured ? "h-64 md:h-80" : "h-52"}`}
      >
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes={
            isFeatured
              ? "(min-width: 768px) 1216px, 100vw"
              : "(min-width: 768px) 596px, 100vw"
          }
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col p-7 md:p-8">
        <h3 className="text-[1.6rem] leading-tight md:text-[2rem]">
          {service.title}
        </h3>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-cocoa/85">
          {service.summary}
        </p>

        {hasPrices ? (
          <PriceList service={service} />
        ) : (
          /* Cirugia: sin precios, lista en columnas para que 11 procedimientos
             no conviertan la tarjeta en una columna interminable. */
          <ul className="mt-6 grid gap-x-8 gap-y-2.5 text-[0.9375rem] text-cocoa sm:grid-cols-2 lg:grid-cols-3">
            {service.treatments.map((t) => (
              <li key={t.name} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-clay" />
                {t.name}
              </li>
            ))}
          </ul>
        )}

        {service.note ? (
          <p className="mt-6 border-t border-clay/25 pt-4 text-[0.8125rem] leading-relaxed text-bark">
            {service.note}
          </p>
        ) : null}
      </div>
    </article>
  );
}

/**
 * Lista de precios. <dl> y no una tabla: cada fila es un par nombre/valor,
 * que es exactamente lo que <dt>/<dd> anuncian a un lector de pantalla, y se
 * reflowea en movil sin el desbordamiento horizontal de una <table>.
 */
function PriceList({ service }: { service: Service }) {
  return (
    <dl className="mt-6 divide-y divide-clay/20 border-y border-clay/20">
      {service.treatments.map((t) => (
        <div
          key={t.name}
          className="flex items-baseline justify-between gap-4 py-3"
        >
          <dt
            /* min-w-0: un flex item no baja de su contenido minimo por defecto.
               hyphens + overflow-wrap: permiten partir palabras muy largas. */
            className="min-w-0 text-[0.9375rem] hyphens-auto text-cocoa [overflow-wrap:anywhere]"
          >
            {t.group ? (
              <span className="block text-[0.75rem] tracking-wide text-bark uppercase">
                {t.group}
              </span>
            ) : null}
            {t.name}
          </dt>
          <dd className="shrink-0 text-right">
            {t.price !== undefined ? (
              <span className="font-display text-lg whitespace-nowrap text-ink">
                {formatPrice(t.price)}
              </span>
            ) : null}
            {t.unit ? (
              <span className="block text-[0.75rem] text-cocoa/75">
                {t.unit}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
