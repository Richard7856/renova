import { testimonials } from "@/content/site";
import { Reveal } from "./reveal";
import { Section, SectionHeading } from "./ui";

export function Testimonials() {
  return (
    <Section tone="cream">
      <div className="shell">
        <SectionHeading
          eyebrow="Testimonios"
          title="Lo que dicen nuestras pacientes"
          align="center"
        />

        {/* En movil es un carrusel de scroll nativo con snap: sin JS, sin
            librerias y con la inercia real del sistema operativo. En escritorio
            se convierte en rejilla y el scroll deja de aplicar. */}
        <ul className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-4">
          {testimonials.map((t, i) => (
            <li
              key={t.name}
              className="w-[85%] shrink-0 snap-start md:w-auto"
            >
              <Reveal delay={i * 70} className="h-full">
                <figure className="flex h-full flex-col rounded-card bg-sage p-7">
                  <blockquote className="flex-1 text-[0.9375rem] leading-relaxed text-cocoa">
                    {t.quote}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-clay/25 pt-4">
                    <span className="block font-display text-lg text-ink">
                      {t.name}
                    </span>
                    <span className="text-[0.8125rem] text-bark">
                      {t.detail}
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
