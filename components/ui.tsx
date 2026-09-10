import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * Primitivas compartidas. Existen para que el ritmo vertical y la forma de los
 * botones se definan en un solo lugar: si el espaciado de seccion cambia,
 * cambia aqui y no en catorce archivos.
 */

export function Section({
  id,
  children,
  className = "",
  tone = "sage",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "sage" | "cream" | "bark";
}) {
  const tones = {
    sage: "bg-sage",
    cream: "bg-cream",
    bark: "bg-bark text-cream",
  } as const;

  return (
    <section
      id={id}
      className={`${tones[tone]} py-20 md:py-28 ${className}`}
      /* scroll-margin duplica el scroll-padding del html para los navegadores
         que aun no lo respetan en anclajes internos. */
      style={{ scrollMarginTop: "5rem" }}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

type ButtonProps = ComponentProps<typeof Link> & {
  variant?: "solid" | "outline" | "ghost";
};

export function ButtonLink({
  variant = "solid",
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variants = {
    solid: "bg-bark text-cream hover:bg-cocoa",
    outline: "border border-clay/50 text-cocoa hover:border-bark hover:bg-bark/5",
    ghost: "bg-cream text-cocoa hover:bg-white",
  } as const;

  return (
    <Link
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-[0.9375rem] font-medium transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

/** Titulo de seccion con etiqueta superior, usado en casi todos los bloques. */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  invert = false,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  invert?: boolean;
}) {
  return (
    <div
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow ? (
        <p className={`eyebrow ${invert ? "!text-cream/70" : ""}`}>{eyebrow}</p>
      ) : null}
      <h2
        className={`mt-4 text-[2.25rem] leading-[1.08] md:text-[3.25rem] ${
          invert ? "!text-cream" : ""
        }`}
      >
        {title}
      </h2>
      {body ? (
        <p
          className={`mt-5 text-base leading-relaxed md:text-lg ${
            invert ? "text-cream/80" : "text-cocoa/85"
          }`}
        >
          {body}
        </p>
      ) : null}
    </div>
  );
}
