import { Fragment, type ReactNode } from "react";
import { About } from "@/components/about";
import { BeforeAfter } from "@/components/before-after";
import { Booking } from "@/components/booking";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";
import { Testimonials } from "@/components/testimonials";
import type { Tone } from "@/components/ui";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { beforeAfter, testimonials } from "@/content/site";

type Block = {
  key: string;
  /** false = la seccion no se renderiza y no consume un tono. */
  isVisible: boolean;
  render: (tone: Tone) => ReactNode;
};

/**
 * Orden narrativo: promesa -> catalogo -> prueba -> credibilidad -> objeciones
 * -> accion. Los testimonios van DESPUES del antes/despues para que lleguen
 * cuando el visitante ya vio evidencia.
 *
 * Los tonos se asignan aqui, alternando solo entre secciones visibles: si una
 * se oculta, las vecinas siguen alternando en lugar de fundirse. El hero es
 * sage, asi que la primera seccion del flujo arranca en cream.
 */
const blocks: Block[] = [
  { key: "services", isVisible: true, render: (t) => <Services tone={t} /> },
  {
    key: "results",
    isVisible: beforeAfter.isPublished,
    render: (t) => <BeforeAfter tone={t} />,
  },
  { key: "about", isVisible: true, render: (t) => <About tone={t} /> },
  {
    key: "testimonials",
    isVisible: testimonials.length > 0,
    render: (t) => <Testimonials tone={t} />,
  },
  { key: "faq", isVisible: true, render: (t) => <Faq tone={t} /> },
  { key: "booking", isVisible: true, render: (t) => <Booking tone={t} /> },
];

/** La franja cafe de cifras va justo antes de "Nosotros", que es donde se
 *  lee como credencial de la clinica. Se renderiza sola a null si esta vacia,
 *  y al ser cafe no participa en la alternancia sage/cream. */
const STATS_BEFORE = "about";

export default function Home() {
  const visible = blocks.filter((b) => b.isVisible);

  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        {visible.map((block, i) => (
          <Fragment key={block.key}>
            {block.key === STATS_BEFORE ? <Stats /> : null}
            {block.render(i % 2 === 0 ? "cream" : "sage")}
          </Fragment>
        ))}
        <FinalCta />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
