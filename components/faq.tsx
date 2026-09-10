import { faq } from "@/content/site";
import { Section, SectionHeading } from "./ui";

/**
 * Acordeon con <details>/<summary> nativos.
 *
 * El original usa un acordeon de Framer construido con divs: sin rol, sin
 * estado expandido anunciado y sin funcionar si falla el JS. La version nativa
 * trae expandido/colapsado, teclado y busqueda en pagina de fabrica, y permite
 * que TODO este bloque sea un componente de servidor: cero KB de JS.
 */
export function Faq() {
  return (
    <Section id="preguntas">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          eyebrow="Preguntas frecuentes"
          title="Antes de escribirnos"
          body="Las dudas que más nos llegan por WhatsApp, respondidas sin rodeos."
        />

        <div className="divide-y divide-clay/25 border-y border-clay/25">
          {faq.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-display text-lg text-ink md:text-xl">
                  {item.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-clay/40 transition-transform duration-300 group-open:rotate-45"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <path
                      d="M6 0v12M0 6h12"
                      stroke="#70441B"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-4 max-w-2xl pr-14 text-[0.9375rem] leading-relaxed text-cocoa/85">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}
