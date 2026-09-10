import Image from "next/image";
import Link from "next/link";
import { wheel, wheelItems } from "@/content/site";

/**
 * Rueda de tratamientos giratoria. Se monta DENTRO del contenedor de la imagen
 * del hero, igual que en el original: gira sobre la misma fotografia, no sobre
 * una segunda imagen. Por eso no trae foto propia — el padre debe ser
 * `position: relative` con `overflow: hidden` y tener la clase `wheel`.
 *
 * Componente de servidor: rotacion, pausa al pasar el raton y geometria son
 * CSS puro. Cuesta 0 kB de JavaScript.
 *
 * Accesibilidad: la rueda va `aria-hidden`. Los nombres estan rotados en
 * angulos arbitrarios y a mitad de giro varios quedan boca abajo, asi que como
 * fuente de informacion es mala. El catalogo completo ya vive, en texto plano y
 * legible, en la seccion de Servicios y en el pie — el disco central enlaza
 * justo ahi. Exponer ademas la rueda solo lograria que un lector de pantalla
 * leyera la misma lista tres veces.
 */
export function TreatmentWheel() {
  const step = 360 / wheelItems.length;

  return (
    <>
      {/* Velo radial centrado en el eje de la rueda: oscurece justo donde hay
          pills y se desvanece antes de llegar a las esquinas, de modo que la
          fotografia sigue viendose limpia en el resto del encuadre. Es lo que
          hace legible el texto blanco sin renunciar al cristal transparente. */}
      <div aria-hidden="true" className="wheel-scrim" />

      <div className="wheel-hub" aria-hidden="true">
        {wheelItems.map((item, i) => (
          <div
            key={item.name}
            className="wheel-pill flex items-center gap-1.5 rounded-pill py-1.5 pr-3 pl-1.5"
            style={{ "--a": `${i * step}deg` } as React.CSSProperties}
          >
            <Image
              src={item.thumb}
              alt=""
              width={52}
              height={52}
              sizes="26px"
              className="h-[26px] w-[26px] shrink-0 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-white">{item.name}</span>
          </div>
        ))}
      </div>

      <Link href={wheel.discHref} className="wheel-disc bg-sage">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="mb-2"
        >
          {/* Flor de seis petalos: el mismo motivo que marca el disco en el
              original. Va en linea porque son 6 nodos y una peticion de red
              para esto seria absurda. */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx="12"
              cy="7"
              rx="3.1"
              ry="5"
              fill="#986A3E"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
          <circle cx="12" cy="12" r="2.2" fill="#F7ECDF" />
        </svg>
        <span className="px-4 text-center text-[0.875rem] font-medium whitespace-nowrap text-ink md:text-[1.0625rem]">
          {wheel.discLabel}
        </span>
      </Link>
    </>
  );
}
