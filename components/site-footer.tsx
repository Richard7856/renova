import Link from "next/link";
import { clinic, doctor, nav, services } from "@/content/site";
import { Logo } from "./logo";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sage pt-20 pb-10">
      <div className="shell">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <Logo height={96} />
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-cocoa/85">
              {clinic.tagline}. Atención médica centrada en resultados
              naturales, seguridad y planes a la medida.
            </p>
            {doctor.isPublished ? (
              <p className="mt-5 text-[0.8125rem] text-bark">
                Responsable sanitario: {doctor.name} — {doctor.license}
              </p>
            ) : null}
          </div>

          <nav aria-label="Secciones del sitio">
            <h2 className="text-sm font-semibold text-ink">Navegación</h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cocoa hover:text-bark">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-semibold text-ink">Contacto</h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem] text-cocoa">
              <li>
                {clinic.address.street}, {clinic.address.locality}
              </li>
              <li>
                <a
                  href={`tel:${clinic.phoneDisplay.replace(/\s/g, "")}`}
                  className="hover:text-bark"
                >
                  {clinic.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${clinic.email}`} className="hover:text-bark">
                  {clinic.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Lista completa de tratamientos en el pie: es contenido util para el
            visitante y a la vez la senal semantica que un buscador local
            necesita para asociar la clinica a cada termino de busqueda. */}
        <div className="mt-14 border-t border-clay/25 pt-8">
          <h2 className="text-sm font-semibold text-ink">Tratamientos</h2>
          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-cocoa/80">
            {services
              .flatMap((s) => s.treatments)
              .map((t) => (
                <li key={t.name}>{t.name}</li>
              ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-clay/25 pt-6 text-xs text-cocoa/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {clinic.legalName}. Todos los derechos reservados.
          </p>
          <p>
            Los resultados varían entre pacientes. Este sitio no sustituye una
            consulta médica.
          </p>
        </div>
      </div>
    </footer>
  );
}
