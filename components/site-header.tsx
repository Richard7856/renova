"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clinic, nav } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Cabecera fija. Es cliente por dos razones concretas: el menu movil necesita
 * estado, y el fondo solido solo debe aparecer tras desplazarse (sobre el hero
 * la cabecera flota transparente, como en el original).
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    // passive: este listener nunca llama preventDefault, y decirselo al
    // navegador le permite no bloquear el scroll esperando a que responda.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Con el menu movil abierto el fondo no debe poder desplazarse detras.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-sage/95 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="shell flex h-20 items-center justify-between">
        <Link
          href="#inicio"
          className="font-display text-2xl tracking-tight text-ink"
        >
          {clinic.name}
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-cocoa transition-colors hover:text-bark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden md:block">
          <Link
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-pill bg-bark px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-cocoa"
          >
            Agendar cita
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-clay/40 md:hidden"
        >
          <span className="sr-only">
            {open ? "Cerrar menú" : "Abrir menú"}
          </span>
          <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
            <path
              d={open ? "M2 2 L16 12 M16 2 L2 12" : "M0 1h18M0 7h18M0 13h18"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {open ? (
        <div id="menu-movil" className="shell pb-8 md:hidden">
          <ul className="flex flex-col gap-1 border-t border-clay/20 pt-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-2xl text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-6 block rounded-pill bg-bark px-6 py-4 text-center text-sm font-medium text-cream"
          >
            Agendar cita por WhatsApp
          </Link>
        </div>
      ) : null}
    </header>
  );
}
