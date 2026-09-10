import Image from "next/image";
import { hero } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { TreatmentWheel } from "./treatment-wheel";
import { ButtonLink } from "./ui";

export function Hero() {
  return (
    <section id="inicio" className="bg-sage pt-28 pb-20 md:pt-36 md:pb-28">
      <div className="shell">
        <p className="eyebrow">{hero.eyebrow}</p>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          {/* clamp mantiene la proporcion del titular de 90px del original sin
              romperlo en pantallas pequenas ni depender de breakpoints. */}
          <h1 className="text-[clamp(2.75rem,7.5vw,5.625rem)] leading-[0.98]">
            {hero.title}
          </h1>

          <div className="lg:pb-3">
            <p className="max-w-md text-base leading-relaxed text-cocoa/85 md:text-lg">
              {hero.subtitle}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <ButtonLink
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                Agendar valoración
              </ButtonLink>
              <ButtonLink href="#servicios" variant="outline">
                Ver tratamientos
              </ButtonLink>
            </div>
          </div>
        </div>

        {/*
          Este contenedor hace dos trabajos: es el marco de la imagen del hero y
          es la tarjeta de la rueda. La clase `wheel` aporta las variables de
          geometria; `relative` y `overflow-hidden` son requisito de los hijos
          posicionados de la rueda.

          Altura fija por breakpoint, no en `vh`: el radio de la rueda es una
          longitud absoluta, asi que atar la altura al alto de la ventana haria
          que en una pantalla apaisada los pills se salieran por arriba.
        */}
        <div className="wheel relative mt-12 h-[400px] overflow-hidden rounded-card bg-ink md:h-[520px] xl:h-[580px]">
          <Image
            src={hero.image}
            alt={hero.imageAlt}
            fill
            /* Unica imagen sobre el pliegue: se precarga y no se difiere.
               Es la candidata a LCP de la pagina. */
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover"
          />

          <TreatmentWheel />

          {/* Arriba a la izquierda, no abajo: el borde inferior lo ocupa ahora
              el disco de la rueda. */}
          <div className="absolute top-5 left-5 z-[3] flex items-center gap-3 rounded-pill bg-cream/90 px-5 py-3 backdrop-blur-sm">
            <span className="font-display text-2xl text-ink">
              {hero.rating.score}
            </span>
            <span className="text-xs leading-tight text-cocoa">
              {hero.rating.count}+ reseñas
              <br />
              de pacientes
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
