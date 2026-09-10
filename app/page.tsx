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
import { WhatsAppFab } from "@/components/whatsapp-fab";

/**
 * Orden narrativo: promesa -> catalogo -> prueba -> credibilidad -> objeciones
 * -> accion. Los testimonios se colocan DESPUES del comparador antes/despues
 * para que lleguen cuando el visitante ya vio evidencia, no antes.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <Services />
        <BeforeAfter />
        <Stats />
        <About />
        <Testimonials />
        <Faq />
        <Booking />
        <FinalCta />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </>
  );
}
