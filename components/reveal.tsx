"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Aparicion suave al entrar en el viewport.
 *
 * El estado inicial (opacity 0) lo pone JS, no el CSS de entrada: si el script
 * no carga, el contenido queda visible en lugar de invisible para siempre.
 * Es la diferencia entre una mejora progresiva y una pagina en blanco.
 *
 * El observer se desconecta tras el primer disparo: la animacion es de entrada,
 * no un estado que deba mantenerse sincronizado con el scroll.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Quien pidio menos movimiento no recibe ni el estado inicial.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.dataset.reveal = "armed";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.style.transitionDelay = `${delay}ms`;
        el.dataset.reveal = "shown";
        observer.disconnect();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
