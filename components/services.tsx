import Image from "next/image";
import { services } from "@/content/site";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./ui";

export function Services() {
  return (
    <Section id="servicios" tone="cream">
      <div className="shell">
        <SectionHeading
          eyebrow="Servicios"
          title="Nuestros tratamientos"
          body="Cinco áreas de trabajo. Cada una lista exactamente qué incluye, para que sepas dónde encaja lo que buscas antes de escribirnos."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={(i % 2) * 90}
              /* La primera tarjeta ocupa el ancho completo: da jerarquia al
                 bloque quirurgico, que es el servicio de mayor valor. */
              className={i === 0 ? "md:col-span-2" : ""}
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-card bg-sage">
                <div
                  className={`relative overflow-hidden ${
                    i === 0 ? "h-64 md:h-80" : "h-52"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 1216px, 100vw" : "(min-width: 768px) 596px, 100vw"}
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

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {service.treatments.map((t) => (
                      <li
                        key={t}
                        className="rounded-pill bg-cream px-3.5 py-1.5 text-[0.8125rem] text-cocoa"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
