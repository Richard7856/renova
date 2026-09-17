# Decisiones técnicas

## [2026-09-09] Next.js 15 App Router con arquitectura server-first

**Context:** Replicar `holabotox.framer.website`, una plantilla de Framer para
clínica estética. El sitio de origen envía ~2 MB de JavaScript para renderizar
lo que es, funcionalmente, una landing de una sola página: no hay estado de
aplicación, ni sesión, ni datos que cambien entre visitas.

**Decision:** Next.js 15 con App Router. Solo cuatro componentes son
`"use client"` — cabecera (menú móvil + fondo al hacer scroll), comparador
antes/después, formulario y `Reveal`. Todo lo demás se renderiza en el servidor
y llega como HTML. Resultado medido: **116 kB de First Load JS**, página
prerenderizada estáticamente.

**Alternatives considered:**
- *Astro:* enviaría aún menos JS, pero deja el proyecto fuera del stack que ya
  mantenemos y complica añadir después panel, auth o Supabase.
- *HTML/CSS vanilla:* sin build y desplegable en cualquier sitio, pero el
  contenido quedaría duplicado en el markup, que es justo el problema que
  `content/site.ts` resuelve.
- *Exportar el HTML de Framer:* rápido, pero hereda el JS, los nombres de clase
  generados y la imposibilidad de mantenerlo.

**Risks/Limitations:** La fuente General Sans no está en Google Fonts, así que
se carga desde Fontshare (su distribuidor oficial) mediante un `<link>` externo.
Es una petición a un tercero en la ruta crítica de renderizado, mitigada con
`preconnect` y `display=swap`.

**Improvement opportunities:** Auto-hospedar los `.woff2` de General Sans en
`/public/fonts` con `next/font/local`. Elimina el tercero y el salto de fuente,
a cambio de versionar los archivos y revisar la licencia de redistribución.

---

## [2026-09-09] Todo el contenido en un único módulo tipado

**Context:** El sitio de origen es una plantilla a medio personalizar: títulos
de servicios en español sobre textos de relleno en inglés, una doctora ficticia
("Dr. Sarah Mitchell") y una dirección en Nueva York. No hay contenido real de
la clínica todavía.

**Decision:** `content/site.ts` es la única fuente de verdad. Ningún componente
escribe texto de negocio. Los datos inventados llevan `TODO:` y se auditan con
`grep -n "TODO:" content/site.ts`. Las opciones del selector del formulario se
derivan del catálogo de servicios, así que no pueden desincronizarse.

**Alternatives considered:**
- *Texto en el JSX:* más directo de escribir, pero cambiar de clínica ficticia a
  real obligaría a revisar catorce archivos y a confiar en que no se olvida uno.
- *CMS (Sanity/Payload):* correcto cuando la clínica publique blog o casos con
  regularidad. Hoy sería infraestructura sin nadie que la use.

**Risks/Limitations:** El archivo crece con el sitio. Pasadas unas ~600 líneas
conviene partirlo por dominio (`content/services.ts`, `content/legal.ts`).

**Improvement opportunities:** Migrar a MDX o a un CMS cuando exista un blog.

---

## [2026-09-09] WhatsApp como transporte del formulario, sin backend

**Context:** La clínica necesita recibir solicitudes de cita. El formulario del
original no envía a ninguna parte.

**Decision:** El formulario no hace POST. Al enviarse, `lib/whatsapp.ts` redacta
el mensaje en primera persona de la paciente y abre `wa.me` con el texto ya
escrito. Se suma un botón flotante persistente.

**Alternatives considered:**
- *Webhook a n8n + Supabase:* da registro propio de leads y analítica de
  abandono, pero introduce un endpoint que puede caerse y tragarse solicitudes
  en silencio, y obliga a custodiar datos personales de salud en reposo.
- *Ambos canales:* cubre más, pero duplica la superficie de fallo antes de saber
  si el volumen de leads lo justifica.

**Risks/Limitations:** No queda registro propio de leads ni forma de medir cuánta
gente abandona el formulario. Si el número de WhatsApp está mal escrito, WhatsApp
abre un chat vacío en lugar de dar error: el lead se pierde **en silencio**. Por
eso `buildWhatsAppUrl` normaliza a E.164 con `replace(/\D/g, "")`, pero el número
correcto sigue siendo responsabilidad del dato en `content/site.ts`.

**Improvement opportunities:** Añadir el webhook a n8n dentro de `onSubmit`
conservando la apertura de WhatsApp como confirmación visible. El punto de
extensión ya está aislado en una sola función.

---

## [2026-09-09] Correcciones de accesibilidad sobre el diseño original

**Context:** La paleta y los componentes del original se replicaron fielmente,
pero varios fallan criterios WCAG AA.

**Decision:**
1. **Contraste.** El acento `#986A3E` da **4.03:1** sobre el crema `#F7ECDF`,
   por debajo del 4.5:1 exigido para texto normal. Se reserva para texto ≥24px,
   bordes e iconos. El cuerpo usa `#633B2C` (8.1:1) y las etiquetas `#70441B`
   (7.1:1).
2. **Comparador antes/después.** El control es un `<input type="range">` real
   estirado sobre la imagen, con el pulgar dibujado por CSS. Un `div` con
   `onPointerMove` habría sido más corto pero inoperable con teclado y mudo para
   lectores de pantalla. Con `range` se obtienen gratis arrastre, táctil,
   flechas, Inicio/Fin, rol `slider` y valor anunciado.
3. **Acordeón de FAQ.** `<details>`/`<summary>` nativos en lugar del acordeón de
   divs de Framer. Trae expandido/colapsado, teclado y búsqueda en página de
   fábrica, y permite que el bloque entero sea componente de servidor: 0 kB de JS.
4. **Foco visible.** El original lo pierde por completo; se define un anillo
   único legible sobre los dos fondos de la paleta.
5. **Enlace de salto** al contenido como primer elemento tabulable.
6. **`prefers-reduced-motion`** apaga scroll suave, cinta y revelaciones.
7. **Cinta de tratamientos.** La segunda copia de la lista lleva `aria-hidden`
   para que un lector de pantalla no lea el catálogo dos veces.

**Alternatives considered:** Cambiar `#986A3E` por un marrón más oscuro en toda
la interfaz habría dado AA en cualquier tamaño, pero altera visiblemente la
identidad que se pidió replicar. Restringirlo por tamaño conserva el aspecto y
cumple: AA permite 3:1 para texto grande.

**Risks/Limitations:** El pulgar del `range` se estira con alturas fijas por
`::-webkit-slider-thumb`; si cambia la altura del contenedor hay que ajustarla.

**Improvement opportunities:** Pasar Lighthouse y axe-core en CI para que la
regresión de contraste falle el build en vez de descubrirse en producción.

---

## [2026-09-09] Revelación al scroll que falla en visible, no en invisible

**Context:** El original anima la entrada de bloques al hacer scroll.

**Decision:** El estado inicial `opacity: 0` lo aplica JavaScript
(`data-reveal="armed"`), no la hoja de estilos. Si el script no carga, el
contenido se ve; nunca al revés. El observer se desconecta tras el primer
disparo porque es una animación de entrada, no un estado a sincronizar.

**Alternatives considered:** Poner `opacity: 0` directamente en CSS es una línea
menos, pero convierte cualquier fallo de JS en una página en blanco — en un sitio
médico cuyo contenido es la información al paciente, es un modo de fallo
inaceptable.

**Risks/Limitations:** En una pestaña en segundo plano el navegador suspende las
entregas del `IntersectionObserver` y los bloques quedan invisibles hasta que la
pestaña vuelve al frente, momento en el que se resuelve solo. Verificado durante
el desarrollo: con `visibilityState: "hidden"`, 12 de 15 bloques permanecían
en `armed`.

---

## [2026-09-09] Rueda de tratamientos giratoria, en CSS puro

**Context:** Es el elemento que más pidió el cliente. En el original es un
carrusel radial: pills que salen como radios de una circunferencia **sobre la
propia fotografía del hero**, girando lentamente, con un disco central que dice
"Lista de tratamientos".

**Decision:** Reconstruido midiendo el original en el DOM, no a ojo. Valores
verificados con `getComputedStyle` y `DOMMatrix` sobre la página en producción:

| Parámetro | Original | Aquí |
|---|---|---|
| Radios | 16 a 22.5° | 15 a 24° (los tratamientos que hay) |
| Velocidad | +9° / 2 s → 80 s/vuelta | idéntica, verificada en 9.00° / 2 s |
| Pill | 182×38, r 50px, `rgba(152,106,62,.1)`, blur 5px | mismo, fill algo más denso |
| Miniatura | círculo 26px al extremo exterior | igual |
| Disco | círculo 200px, `z-index: 1` | 210–260px según breakpoint |

La pieza no evidente es **el disco central: no es decorativo**. Los pills se
anclan por su extremo interior a un radio común, y ahí convergen 15 rectángulos
de 38px de grosor en un espacio donde solo caben ~37px de arco. Se solapan por
diseño, y el disco tapa exactamente esa zona. Los radios están calculados para
que todo el solape quede por debajo del radio del disco.

Todo es CSS: rotación, pausa al pasar el cursor y geometría. **La sección añade
0 kB de JavaScript** — el First Load JS se mantuvo en 116 kB al incorporarla.

La colocación de cada pill es una sola cadena de transformaciones con
`transform-origin: 0 50%` en el eje de la rueda, leída de derecha a izquierda:
`translateX(-100%)` lleva su extremo derecho al eje, `rotate(90deg)` lo vuelve
radial con la miniatura hacia fuera, `translateY(-inner-r)` lo empuja al radio
interior y `rotate(--a)` lo sitúa en la circunferencia. Anclar por el extremo
interior —y no por el centro— es lo que permite que cada pill mida lo que mide
su texto, igual que en el original, sin calcular longitudes.

**Alternatives considered:**
- *Animar cada radio por separado*, como hace Framer con 16 animaciones
  simultáneas. Rotar un único contenedor da el mismo resultado con una sola
  animación compuesta.
- *JavaScript con `requestAnimationFrame`:* permitiría inercia y arrastre, a
  cambio de trabajo en el hilo principal en cada fotograma para algo que el
  compositor resuelve solo.
- *Longitud de pill fija:* más simple, pero obliga a truncar o envolver los
  nombres largos y pierde el ritmo irregular que caracteriza al original.

**Risks/Limitations:**
- Los pills se recortan en los bordes de la tarjeta. Es intencional y ocurre
  igual en el original, pero significa que **algunos nombres se leen a medias**.
  Por eso la rueda no es la fuente canónica del catálogo.
- A mitad de giro varios nombres quedan boca abajo. Inherente al diseño pedido.
- Añadir tratamientos muy largos puede desbordar la tarjeta por arriba; el
  límite práctico ronda los 30 caracteres.

**Improvement opportunities:** Hacer los pills enlazables a cada tratamiento
cuando existan páginas de detalle. Requeriría contrarrotar el texto en la mitad
inferior para que sea legible al pasar el cursor.

---

## [2026-09-09] La rueda va oculta a lectores de pantalla

**Context:** La rueda contiene los 15 nombres de tratamiento, que también están
en la sección de Servicios y en el pie.

**Decision:** `aria-hidden="true"` sobre la rueda. El disco central es un enlace
real a `#servicios`, donde el catálogo está en texto plano y legible.

**Alternatives considered:** Exponerla como lista haría que un lector de
pantalla leyera el mismo catálogo tres veces en la misma página, y expondría
como contenido unos textos rotados en ángulos arbitrarios y recortados por los
bordes de la tarjeta — es decir, una fuente peor de la información que ya existe
bien presentada dos veces más abajo.

**Risks/Limitations:** Si algún día la rueda contuviera un tratamiento que no
aparece en Servicios ni en el pie, esa información quedaría inaccesible. Hoy
`wheelItems` se deriva de la misma lista, así que no puede desincronizarse.

**Improvement opportunities:** Si los pills se vuelven enlaces, tendrán que
dejar de estar ocultos y pasar a ser una lista navegable de verdad.


---

## [2026-09-09] La rueda se monta dentro del hero, no en una sección propia

**Context:** La primera versión puso la rueda en su propia sección, sobre una
segunda fotografía. En el original gira sobre la imagen del hero — se comprueba
en que la modelo es la misma.

**Decision:** `TreatmentWheel` ya no trae imagen. Es un fragmento de elementos
posicionados que se monta dentro del contenedor de la imagen del hero, el cual
lleva ahora la clase `wheel` (aporta las variables de geometría) además de
`relative` y `overflow-hidden`. Una foto menos que cargar y una sección menos
de scroll antes de llegar a Servicios.

La altura del contenedor pasó de `vh` a valores fijos por breakpoint
(400/520/580). El radio de la rueda es una longitud absoluta: atado al alto de
la ventana, en una pantalla apaisada los pills se saldrían por arriba.

El distintivo de reseñas se movió de abajo-izquierda a arriba-izquierda, porque
el borde inferior lo ocupa ahora el disco.

**Alternatives considered:** Escalar el radio con `vmin` mantendría el `vh`,
pero haría que el tamaño de los pills bailara con cada cambio de ventana y que
el texto de 14px se descolocara respecto a un pill que cambia de largo.

**Risks/Limitations:** El hero y la rueda quedan acoplados: cambiar la altura
del contenedor obliga a revisar que los pills sigan cabiendo.

---

## [2026-09-09] Cristal transparente y pills de largo uniforme

**Context:** Una captura en alta resolución del original mostró dos cosas que
las primeras mediciones no dejaban ver: **todos los pills miden exactamente lo
mismo** (los nombres largos se recortan a media palabra) y el cristal es mucho
más transparente de lo que parecía — se lee la textura de la piel a través.

**Decision:**

1. **Largo uniforme.** `width: var(--pill-l)` con `overflow: hidden`. Los
   extremos interior y exterior caen sobre dos circunferencias limpias. Un
   `min-width: 0` en el `<span>` evita que el texto con `nowrap` imponga su
   ancho mínimo y rompa la uniformidad.
2. **Cristal casi incoloro:** `rgba(152,106,62,0.12)` con
   `backdrop-filter: blur(6px)` y borde de 1px al 35% de blanco. Lo que separa
   el pill del fondo no es un relleno opaco, es el desenfoque y el filo del borde.
3. **Velo radial reducido a `--veil: 0.18`**, gobernado por una sola variable.

**Alternatives considered:** La versión anterior hacía crecer cada pill con su
texto — evitaba recortes, pero producía un contorno exterior irregular que no
es el del original. La opción de mantener el relleno oscuro (0.30) cumplía AA en
toda la superficie, pero perdía justo el efecto vidrio pedido.

**Risks/Limitations — el contraste, medido sobre los píxeles reales.** Volcando
la foto a un `<canvas>` (`next/image` la sirve desde el mismo origen, así que no
se contamina) y componiendo velo y cristal sobre cada píxel del anillo:

| | Media | Peor punto | Superficie bajo AA |
|---|---|---|---|
| Original puro, sin velo | 4.68:1 | 1.41:1 | 74.4% |
| **Actual**, `--veil: 0.18` | 5.62:1 | 2.01:1 | **61.6%** |
| `--veil: 0.28` | 6.29:1 | 2.50:1 | 34.8% |

Es decir: **el texto blanco de 14px no cumple AA en la mayor parte de la rueda.**
Es el precio del aspecto pedido, y es una decisión tomada con el dato delante,
no por descuido. Se mitiga en tres frentes: la rueda va `aria-hidden` y no es la
fuente canónica del catálogo (está en Servicios y en el pie, ambos con contraste
holgado); un `text-shadow` que no cuenta para WCAG pero sí para la lectura real;
y el velo, que ya deja el sitio mejor que el original.

**Improvement opportunities:** `--veil` en el bloque `.wheel` es el único dial.
Subirlo a 0.28 reduce la superficie problemática del 62% al 35% oscureciendo la
foto de forma apenas perceptible. Si se cambia la fotografía del hero **hay que
volver a medir**: el contraste depende de esos píxeles, no del CSS.

---

## [2026-09-16] Servicios en pestañas en lugar de tarjetas apiladas

**Context:** Con los precios del PDF, la sección de Servicios medía 2,560 px en
escritorio: cinco tarjetas con foto grande una debajo de otra. El scrollytelling
previsto a continuación la habría vuelto interminable.

**Decision:** Una categoría visible a la vez, con pestañas arriba
(`components/service-tabs.tsx`). Resultado medido: **1,064 px en escritorio
(−58%)**.

- Patrón ARIA de *tabs* completo: `tablist`/`tab`/`tabpanel`, foco itinerante
  y flechas, Inicio y Fin, con activación automática.
- **Los cinco paneles están siempre en el HTML**; los inactivos llevan `hidden`.
  Google indexa todos los precios, no solo los de la pestaña abierta.
- Enlace directo por slug (`/#inyectables`) para compartir precios concretos.
- Cada panel tiene su propio botón a WhatsApp con el tratamiento ya indicado.
- En móvil la fila de pestañas se desplaza en horizontal en vez de partirse.

**Alternatives considered:** Acordeón (una categoría desplegable por fila):
resuelve la altura, pero oculta las fotos y en escritorio desperdicia el ancho.
Un menú de precios sin fotos: más compacto, pero pierde el tono visual del sitio.

**Risks/Limitations:** Los paneles miden distinto (796–982 px en móvil), así
que lo que hay debajo se desplaza al cambiar de pestaña. Al ser un cambio
iniciado por el usuario, no penaliza el CLS.

Un bug encontrado en pruebas: el teclado calculaba la siguiente pestaña desde
el estado de React, que con pulsaciones rápidas va un evento atrasado — dos
flechas seguidas no envolvían. Ahora el índice sale de la pestaña con foco.

---

## [2026-09-16] Contenido sin fuente, oculto tras interruptores

**Context:** Varios bloques de la plantilla seguían en producción con datos
inventados que una clínica real no puede sostener: testimonios con nombre,
cifras ("2,000+ procedimientos"; "50+ tratamientos" ya era falso, el catálogo
tiene 26), calificación "5.0 · 86 reseñas", una cirujana ficticia con cédula
`0000000` y un caso antes/después con fotos de stock que afirmaba consentimiento
de una paciente real.

**Decision:** Ninguno se borra; cada uno queda detrás de un interruptor en
`content/site.ts`:

| Bloque | Interruptor |
|---|---|
| Testimonios | `testimonials` vacío |
| Franja de cifras | `stats` vacío |
| Calificación del hero | `hero.rating: null` |
| Ficha de la cirujana, pie y JSON-LD `Physician` | `doctor.isPublished` |
| Antes/después y su entrada en el menú | `beforeAfter.isPublished` |

El menú se deriva de lo publicado, para no enlazar nunca a un ancla inexistente.

**Alternatives considered:** Dejarlos con aviso de "ejemplo". En una web médica
en producción, un testimonio o una cédula de ejemplo se leen como reales.

**Risks/Limitations:** Sin prueba social la página convence menos. Es
deliberado: la prueba social inventada es peor que ninguna, y es sancionable
(Profeco, COFEPRIS).

---

## [2026-09-16] Tonos de sección asignados automáticamente

**Context:** Dos veces se fundieron secciones contiguas del mismo color al
reordenar o añadir bloques. Al ocultar secciones con los interruptores anteriores
iba a volver a pasar.

**Decision:** Los componentes ya no eligen su fondo. `page.tsx` alterna
`cream`/`sage` **solo entre las secciones visibles**, y cada sección expone en
`--surface` el color contrario para sus tarjetas (`bg-(--surface)`).

**Alternatives considered:** Seguir fijando el tono a mano en cada componente:
funciona hasta el siguiente cambio de orden, que es justo cuando falla.

**Risks/Limitations:** Una tarjeta nueva con color fijo en vez de
`bg-(--surface)` vuelve a romper el contraste. La franja de cifras y el cierre
son café y quedan fuera de la alternancia.

---

## [2026-09-16] Logo oficial usado como máscara

**Context:** El logo de la clínica es un PNG apilado en dorado (#BAA276). Sobre
el fondo salvia da **1.67:1**: en la cabecera prácticamente desaparece (se ve
igual en el sitio original). Además, sus dos líneas de lema miden ~4 px a
tamaño de cabecera.

**Decision:** El PNG se usa como máscara CSS pintada con `currentColor` (café,
5.6:1), recortada por encima del lema. La URL de la máscara la genera
`getImageProps` de `next/image`, que es del mismo origen: una máscara con una
imagen de otro dominio requiere CORS, y el CDN no lo garantiza.

**Alternatives considered:** Aplicar `filter` al PNG para oscurecerlo: los
filtros no llegan a un color exacto y el dorado se vuelve verdoso. Mantener el
dorado: es el color de marca, pero no se lee.

**Risks/Limitations:** Es un cambio sobre la identidad de la clínica. Para
volver al dorado: `<Logo className="text-[#BAA276]" />`.

**Improvement opportunities:** Pedir el logo en SVG y en versión horizontal. Con
el SVG, el componente se reduce a `<svg fill="currentColor">`.

---

## [2026-09-16] Botón flotante de WhatsApp que se oculta al bajar

**Context:** En móvil el botón tapaba la columna de precios justo mientras se
leía.

**Decision:** Se oculta al bajar y reaparece al subir, con un umbral de 8 px
contra el rebote de iOS. Cerca del inicio siempre está visible. Oculto sigue
siendo tabulable y reaparece al recibir foco.

**Risks/Limitations:** Deja de ser un componente de servidor. Coste: un
listener de scroll pasivo.
