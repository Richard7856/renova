"use client";

import { useState, type FormEvent } from "react";
import { clinic, interestOptions } from "@/content/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Section } from "./ui";

/**
 * Formulario de cita.
 *
 * No hay backend: al enviar se redacta el mensaje y se abre WhatsApp con el
 * texto ya escrito. Ventajas concretas frente a un POST a un servidor:
 *  - el lead nace en el canal donde de hecho se cierra la cita;
 *  - no se almacena ningun dato personal de salud en reposo, asi que el sitio
 *    queda fuera del alcance de los deberes de custodia de datos sensibles;
 *  - no hay un endpoint que pueda caerse y tragarse solicitudes en silencio.
 *
 * Contrapartida asumida: no queda registro propio de leads ni analitica de
 * abandono. Si eso se vuelve necesario, el reemplazo es un webhook a n8n en
 * `onSubmit` conservando la apertura de WhatsApp como confirmacion.
 * Ver DECISIONS.md.
 */
export function Booking() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // La validacion dura la hace el navegador con `required`; aqui solo
    // construimos el destino.
    const url = buildWhatsAppUrl({ name, interest, message });
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const field =
    "w-full rounded-media border border-clay/35 bg-sage px-4 py-3.5 text-[0.9375rem] text-cocoa placeholder:text-cocoa/45 focus:border-bark focus:outline-none";
  const labelCls = "block text-sm font-medium text-cocoa";

  return (
    <Section id="contacto" tone="cream">
      <div className="shell grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow">Agenda</p>
          <h2 className="mt-4 text-[2.25rem] leading-[1.08] md:text-[3.25rem]">
            Agenda tu valoración
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-cocoa/85">
            Completa el formulario y se abrirá WhatsApp con tu mensaje ya
            redactado. Respondemos en horario de clínica, normalmente el mismo
            día.
          </p>

          <dl className="mt-10 space-y-6 border-t border-clay/25 pt-8 text-sm">
            <div>
              <dt className="text-bark">Teléfono</dt>
              <dd className="mt-1">
                <a
                  href={`tel:${clinic.phoneDisplay.replace(/\s/g, "")}`}
                  className="font-display text-2xl text-ink hover:text-bark"
                >
                  {clinic.phoneDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-bark">Consultorio</dt>
              <dd className="mt-1 text-cocoa">
                {clinic.address.street}
                <br />
                {clinic.address.locality}, {clinic.address.region}{" "}
                {clinic.address.postalCode}
              </dd>
            </div>
            <div>
              <dt className="text-bark">Horario</dt>
              <dd className="mt-1 text-cocoa">
                {clinic.hours.map((h) => (
                  <span key={h.days} className="block">
                    {h.days}: {h.time}
                  </span>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nombre" className={labelCls}>
              Nombre <span aria-hidden="true">*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className={`mt-2 ${field}`}
            />
          </div>

          <div>
            <label htmlFor="interes" className={labelCls}>
              Servicio de interés <span aria-hidden="true">*</span>
            </label>
            <select
              id="interes"
              name="interes"
              required
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className={`mt-2 ${field}`}
            >
              <option value="" disabled>
                Selecciona una opción
              </option>
              {interestOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="mensaje" className={labelCls}>
              ¿En qué podemos ayudarte?
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntanos brevemente qué te gustaría tratar"
              className={`mt-2 resize-y ${field}`}
            />
          </div>

          <div className="flex items-start gap-3">
            <input
              id="consentimiento"
              name="consentimiento"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#70441B]"
            />
            <label
              htmlFor="consentimiento"
              className="text-[0.8125rem] leading-relaxed text-cocoa/85"
            >
              Acepto que la clínica me contacte por WhatsApp para agendar una
              cita. Tus datos viajan directo al chat: este sitio no los almacena.
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-pill bg-bark px-7 py-4 text-[0.9375rem] font-medium text-cream transition-colors hover:bg-cocoa"
          >
            Continuar en WhatsApp
          </button>

          <p className="text-center text-xs text-cocoa/70">
            Se abrirá una ventana de WhatsApp con tu mensaje listo para enviar.
          </p>
        </form>
      </div>
    </Section>
  );
}
