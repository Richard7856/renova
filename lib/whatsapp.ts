import { clinic } from "@/content/site";

export type LeadDraft = {
  name: string;
  interest: string;
  message?: string;
};

/**
 * Construye el enlace de WhatsApp con el mensaje ya redactado.
 *
 * Por que wa.me y no api.whatsapp.com: wa.me resuelve al cliente instalado en
 * movil y a WhatsApp Web en escritorio sin pantalla intermedia. El numero debe
 * ir en E.164 sin `+`, espacios ni guiones; si no, WhatsApp abre un chat vacio
 * en lugar de fallar visiblemente, y el lead se pierde en silencio.
 *
 * El mensaje se redacta en primera persona del paciente porque es el paciente
 * quien aparece enviandolo.
 */
export function buildWhatsAppUrl(lead?: LeadDraft): string {
  const number = clinic.whatsapp.replace(/\D/g, "");

  const text = lead
    ? [
        `Hola, soy ${lead.name.trim()}.`,
        `Me interesa: ${lead.interest}.`,
        lead.message?.trim() ? `\n${lead.message.trim()}` : "",
        `\nMe gustaría agendar una valoración.`,
      ]
        .filter(Boolean)
        .join(" ")
    : `Hola, me gustaría agendar una valoración en ${clinic.name}.`;

  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
