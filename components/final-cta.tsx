import { finalCta } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { ButtonLink, SectionHeading } from "./ui";

export function FinalCta() {
  return (
    <section className="bg-bark py-24 text-cream md:py-32">
      <div className="shell text-center">
        <SectionHeading
          title={finalCta.title}
          body={finalCta.body}
          align="center"
          invert
        />
        <div className="mt-9 flex justify-center">
          <ButtonLink
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
          >
            Agendar por WhatsApp
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
