"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { formatPrice, services, type Service } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

/**
 * Pestanas de categorias de servicio, con el patron ARIA de "tabs":
 * tablist / tab / tabpanel, foco itinerante (solo la pestana activa es
 * tabulable) y flechas, Inicio y Fin para moverse entre pestanas.
 *
 * Activacion automatica: mover el foco con flechas tambien cambia el panel.
 * Es la variante recomendada cuando mostrar un panel es instantaneo, como aqui.
 *
 * SEO: los cinco paneles estan SIEMPRE en el HTML; los inactivos llevan
 * `hidden`. Un buscador encuentra todos los precios, no solo los de la
 * pestana que estaba abierta al renderizar.
 *
 * Enlace directo: `/#inyectables` (o cualquier slug) abre esa pestana.
 * Util para compartir precios concretos por WhatsApp o Instagram.
 */
export function ServiceTabs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseId = useId();

  // Abrir la pestana indicada en el hash. Se escucha hashchange porque el
  // enlace puede pulsarse estando ya en la pagina.
  useEffect(() => {
    function selectFromHash() {
      const slug = window.location.hash.slice(1);
      const index = services.findIndex((s) => s.slug === slug);
      if (index === -1) return;
      setActiveIndex(index);
      containerRef.current?.scrollIntoView({ block: "start" });
    }
    selectFromHash();
    window.addEventListener("hashchange", selectFromHash);
    return () => window.removeEventListener("hashchange", selectFromHash);
  }, []);

  // Mantiene visible la pestana activa dentro de la fila desplazable (movil),
  // tambien cuando se activo por enlace directo y no por teclado. Se desplaza
  // solo la fila, no la pagina: scrollIntoView movería tambien el documento.
  useEffect(() => {
    const tab = tabRefs.current[activeIndex];
    const list = tab?.parentElement;
    if (!tab || !list || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({
      left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [activeIndex]);

  function focusTab(index: number) {
    const count = services.length;
    // Envuelve en ambos sentidos: flecha derecha en la ultima vuelve a la primera.
    const next = (index + count) % count;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // El indice sale de la pestana que tiene el foco, no del estado: con
    // pulsaciones rapidas (tecla mantenida) el estado puede ir un evento
    // atrasado y dos flechas seguidas calculaban desde la misma posicion.
    const current = tabRefs.current.indexOf(
      event.target as HTMLButtonElement,
    );
    if (current === -1) return;

    const actions: Record<string, () => void> = {
      ArrowRight: () => focusTab(current + 1),
      ArrowLeft: () => focusTab(current - 1),
      Home: () => focusTab(0),
      End: () => focusTab(services.length - 1),
    };
    const action = actions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  }

  return (
    <div ref={containerRef} id="precios" style={{ scrollMarginTop: "6rem" }}>
      {/* En movil la fila se desplaza en horizontal en lugar de partirse en
          dos lineas: una pestana huerfana en la segunda fila parece otro
          control. El margen negativo deja que el scroll llegue al borde. */}
      <div
        role="tablist"
        aria-label="Categorías de tratamiento"
        onKeyDown={handleKeyDown}
        className="relative -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {services.map((service, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={service.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${service.slug}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${service.slug}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 snap-start rounded-pill px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                isActive
                  ? "bg-bark text-cream"
                  : "border border-clay/40 text-cocoa hover:border-bark hover:bg-bark/5"
              }`}
            >
              {service.tabLabel}
            </button>
          );
        })}
      </div>

      {services.map((service, i) => (
        <div
          key={service.slug}
          role="tabpanel"
          id={`${baseId}-panel-${service.slug}`}
          aria-labelledby={`${baseId}-tab-${service.slug}`}
          hidden={i !== activeIndex}
          // tabIndex 0: si el panel no tuviera nada enfocable, el teclado
          // saltaria del tablist directo a lo siguiente de la pagina.
          tabIndex={0}
          className="mt-6 focus-visible:outline-offset-4"
        >
          {/* La key cambia cuando el panel se activa: React lo remonta y la
              animacion de entrada (.panel-in) vuelve a correr. */}
          <ServicePanel
            key={`${service.slug}-${i === activeIndex}`}
            service={service}
            isEager={i === 0}
          />
        </div>
      ))}
    </div>
  );
}

function ServicePanel({
  service,
  isEager,
}: {
  service: Service;
  isEager: boolean;
}) {
  const hasPrices = service.treatments.some((t) => t.price !== undefined);

  return (
    <article className="panel-in grid overflow-hidden rounded-card bg-(--surface) lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative h-56 sm:h-72 lg:h-auto lg:min-h-[440px]">
        <Image
          src={service.image}
          alt={service.imageAlt}
          fill
          sizes="(min-width: 1024px) 520px, 100vw"
          // Solo la primera pestana se precarga; las demas esperan a abrirse.
          loading={isEager ? "eager" : "lazy"}
          className="object-cover"
        />
      </div>

      <div className="flex flex-col p-7 md:p-10">
        <h3 className="text-[1.75rem] leading-tight md:text-[2.25rem]">
          {service.title}
        </h3>
        <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-cocoa/85">
          {service.summary}
        </p>

        {hasPrices ? (
          <PriceList service={service} />
        ) : (
          /* Cirugia: sin precios, en dos columnas para que 11 procedimientos
             no conviertan el panel en una columna interminable. */
          <ul className="mt-7 grid gap-x-8 gap-y-2.5 text-[0.9375rem] text-cocoa sm:grid-cols-2">
            {service.treatments.map((t) => (
              <li key={t.name} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-clay"
                />
                {t.name}
              </li>
            ))}
          </ul>
        )}

        {service.note ? (
          <p className="mt-6 text-[0.8125rem] leading-relaxed text-bark">
            {service.note}
          </p>
        ) : null}

        <div className="mt-auto pt-8">
          <a
            href={buildWhatsAppUrl({ interest: service.title })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-pill bg-bark px-7 py-3.5 text-[0.9375rem] font-medium text-cream transition-colors duration-200 hover:bg-cocoa"
          >
            {hasPrices
              ? "Agendar este tratamiento"
              : "Agendar valoración quirúrgica"}
          </a>
        </div>
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
    <dl className="mt-7 divide-y divide-clay/20 border-y border-clay/20">
      {service.treatments.map((t) => (
        <div
          key={t.name}
          className="flex items-baseline justify-between gap-4 py-3.5"
        >
          <dt
            /* min-w-0: un flex item no baja de su contenido minimo por defecto.
               hyphens + overflow-wrap: permiten partir palabras muy largas
               ("Polidesoxirribonucleótidos" ensanchaba la pagina en movil). */
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
              <span className="font-display text-xl whitespace-nowrap text-ink">
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
