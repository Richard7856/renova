"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { beforeAfter } from "@/content/site";
import { Section, SectionHeading, type Tone } from "./ui";

/**
 * Comparador arrastrable antes/despues.
 *
 * Decision de accesibilidad: el control es un <input type="range"> real,
 * estirado sobre la imagen y con el pulgar dibujado por CSS. Un div con
 * onPointerMove habria sido mas corto, pero habria dejado el comparador
 * inoperable con teclado y mudo para lectores de pantalla. Con range obtenemos
 * gratis: arrastre con raton, arrastre tactil, flechas, Inicio/Fin, rol slider
 * y valor anunciado. Solo hay que darle un aria-label util y ocultar el
 * cursor nativo.
 *
 * La imagen "despues" se recorta con clip-path en lugar de width para que
 * NO se reescale al mover el control: si se animara el ancho, la cara se
 * deformaria y la comparacion dejaria de ser honesta.
 */
export function BeforeAfter({ tone }: { tone: Tone }) {
  const [position, setPosition] = useState(50);
  const id = useId();

  return (
    <Section id="resultados" tone={tone}>
      <div className="shell">
        <SectionHeading
          eyebrow={beforeAfter.eyebrow}
          title={beforeAfter.title}
          body={beforeAfter.body}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,520px)_1fr] lg:items-center">
          <div className="relative select-none overflow-hidden rounded-card bg-(--surface)">
            <div className="relative aspect-[3/4]">
              <Image
                src={beforeAfter.before.src}
                alt={beforeAfter.before.alt}
                fill
                sizes="(min-width: 1024px) 520px, 100vw"
                className="object-cover"
              />

              <div
                className="absolute inset-0"
                style={{ clipPath: `inset(0 0 0 ${position}%)` }}
              >
                <Image
                  src={beforeAfter.after.src}
                  /* La descripcion de esta imagen ya la da el control range;
                     repetirla aqui duplicaria el anuncio. */
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 520px, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Linea divisoria y tirador, puramente decorativos: el elemento
                  que recibe el foco y los eventos es el input de abajo. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream"
                style={{ left: `${position}%` }}
              >
                <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream shadow-lg">
                  <svg width="20" height="12" viewBox="0 0 20 12" aria-hidden="true">
                    <path
                      d="M7 1 L2 6 L7 11 M13 1 L18 6 L13 11"
                      fill="none"
                      stroke="#70441B"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <span className="pointer-events-none absolute top-4 left-4 rounded-pill bg-ink/60 px-3 py-1 text-xs text-white">
                {beforeAfter.before.label}
              </span>
              <span className="pointer-events-none absolute top-4 right-4 rounded-pill bg-ink/60 px-3 py-1 text-xs text-white">
                {beforeAfter.after.label}
              </span>

              <label htmlFor={id} className="sr-only">
                Comparar antes y después: mueve el control para revelar el
                resultado
              </label>
              <input
                id={id}
                type="range"
                min={0}
                max={100}
                step={1}
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                aria-valuetext={`${position}% del resultado visible`}
                className="absolute inset-0 h-full w-full cursor-ew-resize appearance-none bg-transparent [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-11 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-[400px] [&::-webkit-slider-thumb]:w-11 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
              />
            </div>
          </div>

          <div>
            <p className="font-display text-2xl text-ink md:text-3xl">
              {beforeAfter.caseNote}
            </p>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-cocoa/85">
              Publicamos únicamente casos con consentimiento informado firmado,
              fotografiados con la misma distancia focal, encuadre e iluminación
              en ambas tomas. Sin retoque digital ni cambios de pose.
            </p>

            {/* Aviso legal: obligatorio y deliberadamente no escondido. */}
            <p className="mt-8 rounded-media border border-clay/30 bg-(--surface) p-5 text-[0.8125rem] leading-relaxed text-cocoa">
              <strong className="font-semibold">Aviso.</strong>{" "}
              {beforeAfter.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
