import { stats } from "@/content/site";
import { Reveal } from "./reveal";

export function Stats() {
  if (stats.length === 0) return null;

  return (
    <section className="bg-bark py-16 text-cream md:py-20">
      <div className="shell grid grid-cols-2 gap-10 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80}>
            <p className="font-display text-[2.75rem] leading-none text-cream md:text-[3.5rem]">
              {s.value}
            </p>
            <p className="mt-3 text-sm text-cream/75">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
