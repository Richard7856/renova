"use client";

import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/** Desplazamiento minimo (px) para cambiar de estado: evita parpadeos con el
 *  rebote elastico de iOS y con trackpads que emiten deltas de 1-2 px. */
const SCROLL_THRESHOLD = 8;

/**
 * Boton flotante de WhatsApp.
 *
 * Se oculta al bajar y reaparece al subir. En movil tapaba la columna de
 * precios justo mientras se leia; quien baja esta leyendo, quien sube esta
 * buscando algo, y ahi es cuando conviene tenerlo a mano.
 *
 * Es un enlace, no un boton: navega a otro destino, asi que debe poder
 * abrirse en pestana nueva, copiarse y anunciarse como enlace. Oculto sigue
 * siendo tabulable y reaparece al recibir foco (focus-visible), para no dejar
 * a quien navega con teclado con un foco invisible.
 */
export function WhatsAppFab() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < SCROLL_THRESHOLD) return;
      // Cerca del inicio siempre visible: no hay nada que tapar todavia.
      setIsHidden(delta > 0 && y > 200);
      lastY = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform duration-300 hover:scale-105 focus-visible:translate-y-0 ${
        isHidden ? "translate-y-[calc(100%+2rem)]" : "translate-y-0"
      }`}
      style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
    >
      <span className="sr-only">Escribir por WhatsApp</span>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="#fff"
        aria-hidden="true"
      >
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.86 9.86 0 0 0 4.76 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.25-4.36c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.25 8.24z" />
      </svg>
    </a>
  );
}
