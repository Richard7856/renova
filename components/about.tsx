import Image from "next/image";
import { about, doctor } from "@/content/site";
import { Reveal } from "./reveal";
import { Section, SectionHeading, type Tone } from "./ui";

export function About({ tone }: { tone: Tone }) {
  return (
    <Section id="nosotros" tone={tone}>
      <div className="shell grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-card">
            <Image
              src={about.image}
              alt={about.imageAlt}
              width={794}
              height={810}
              sizes="(min-width: 1024px) 576px, 100vw"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Ficha del medico responsable. En publicidad sanitaria mexicana la
              cedula debe ser visible, no ir escondida en el pie. Solo se
              muestra con datos reales: ver doctor.isPublished. */}
          {doctor.isPublished ? (
            <div className="mt-5 rounded-media bg-(--surface) p-6">
              <div className="flex items-center gap-4">
                <Image
                  src={doctor.portrait}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <p className="font-display text-xl text-ink">{doctor.name}</p>
                  <p className="text-sm text-cocoa/85">{doctor.role}</p>
                  <p className="mt-0.5 text-xs text-bark">{doctor.license}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-1.5 text-[0.8125rem] text-cocoa/85">
                {doctor.credentials.map((c) => (
                  <li key={c}>· {c}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={120}>
          <SectionHeading
            eyebrow={about.eyebrow}
            title={about.title}
            body={about.body}
          />

          <dl className="mt-10 space-y-7">
            {about.pillars.map((p) => (
              <div key={p.title} className="border-t border-clay/25 pt-5">
                <dt className="font-display text-xl text-ink">{p.title}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-cocoa/85">
                  {p.body}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  );
}
