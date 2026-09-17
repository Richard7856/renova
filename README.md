# Renova — sitio de clínica de cirugía plástica

Réplica mejorada de `holabotox.framer.website`, reconstruida en Next.js.

```bash
npm install
npm run dev     # http://localhost:3210
npm run build   # build de producción
npm run typecheck
```

## Qué tocar

| Necesitas… | Archivo |
|---|---|
| Cambiar textos, servicios, precios, contacto | `content/site.ts` — **único** |
| Cambiar el mensaje de WhatsApp | `lib/whatsapp.ts` |
| Cambiar colores, fuentes o radios | bloque `@theme` de `app/globals.css` |
| Ajustar la rueda (radio, grosor, disco, velocidad) | variables `.wheel` en `app/globals.css` |
| Reordenar secciones | `app/page.tsx` |

## Bloques ocultos hasta tener datos reales

Estos bloques están listos pero apagados en `content/site.ts`, porque su
contenido de plantilla era inventado:

| Para mostrar… | Cambia |
|---|---|
| Testimonios | llena `testimonials` |
| Franja de cifras | llena `stats` |
| Calificación en el hero | `hero.rating` |
| Ficha de la cirujana y cédula | `doctor.isPublished: true` |
| Caso antes/después | `beforeAfter.isPublished: true` |
| Plan de mantenimiento | `maintenancePlan.isPublished: true` |

Los tonos de fondo y el menú se ajustan solos.

## Antes de publicar

```bash
grep -n "TODO:" content/site.ts
```

Cada `TODO:` es un dato inventado. Como mínimo hay que sustituir:

1. **Número de WhatsApp** (`clinic.whatsapp`, formato E.164 sin `+` ni espacios).
   Si es incorrecto, WhatsApp abre un chat vacío sin dar error y el lead se pierde
   sin dejar rastro.
2. **Nombre y cédula de especialidad** del cirujano responsable. En México la
   cédula es obligatoria en publicidad médica (NOM-004 / COFEPRIS).
3. **Dominio real** en `clinic.url` — alimenta canonical, Open Graph y sitemap.
4. **Fotografías.** Las actuales se sirven desde el CDN de la plantilla de origen.
   Al reemplazarlas por archivos en `/public`, borra el bloque `remotePatterns`
   de `next.config.ts`.
5. **Casos antes/después.** Publicar solo con consentimiento informado firmado.
6. **Si cambias la foto del hero**, vuelve a medir el contraste de la rueda: el
   velo radial (`--veil`) está calibrado sobre los píxeles de la imagen actual.
   El texto de los pills replica el original y no cumple AA en buena parte de su
   superficie — ver DECISIONS.md para los números y el dial que lo corrige.

## Diferencias frente al original

- Español coherente en todo el sitio (el original mezcla títulos en español con
  cuerpo de relleno en inglés y una doctora ficticia de Nueva York).
- 116 kB de JS frente a ~2 MB; página prerenderizada estáticamente.
- `MedicalClinic` + `FAQPage` en JSON-LD, sitemap y robots.
- Comparador antes/después arrastrable y operable con teclado.
- Rueda de tratamientos giratoria sobre la foto del hero, reproducida con las
  medidas del original (80 s por vuelta, pills de largo uniforme, vidrio
  transparente) en CSS puro: 0 kB de JavaScript.
- Contraste AA, foco visible, enlace de salto y `prefers-reduced-motion`.

Las decisiones de arquitectura y sus contrapartidas están en [DECISIONS.md](DECISIONS.md).
