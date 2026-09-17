import { getImageProps } from "next/image";
import { clinic } from "@/content/site";

/**
 * Logo oficial de la clinica, recortado y recoloreado.
 *
 * Recorte: el PNG es apilado (icono, RENOVA, STUDIO, lema en dos lineas). El
 * lema mide ~4 px a tamano de cabecera, asi que solo se muestra la fraccion
 * superior (`visibleRatio`).
 *
 * Color: el dorado original (#BAA276) da 1.67:1 sobre el fondo salvia; en la
 * cabecera practicamente desaparece. Se usa el PNG como MASCARA y se pinta con
 * `currentColor`, asi el color lo decide el contenedor (`text-bark` = 5.6:1).
 * Para volver al dorado de marca: `className="text-[#BAA276]"`.
 *
 * Por que la URL de next/image y no la del CDN: una mascara CSS con imagen de
 * otro origen exige cabeceras CORS que el CDN no garantiza. `getImageProps`
 * devuelve la URL del optimizador, que es del mismo origen.
 *
 * TODO: con el logo en SVG todo esto se reduce a un <svg fill="currentColor">.
 *
 * @param height Alto visible en px. El ancho se deduce de la proporcion.
 */
export function Logo({
  height,
  className = "text-bark",
}: {
  height: number;
  className?: string;
}) {
  const { src, width, height: naturalHeight, visibleRatio } = clinic.logo;
  const fullHeight = height / visibleRatio;
  const renderedWidth = Math.round((fullHeight * width) / naturalHeight);

  const { props } = getImageProps({
    src,
    alt: "",
    width: renderedWidth,
    height: Math.round(fullHeight),
  });
  const mask = `url("${props.src}")`;

  return (
    <span
      role="img"
      aria-label={clinic.legalName}
      className={`block bg-current ${className}`}
      style={{
        width: renderedWidth,
        height,
        maskImage: mask,
        WebkitMaskImage: mask,
        // Mascara a su tamano completo y anclada arriba: lo que sobra por
        // debajo del alto visible (el lema) queda fuera de la caja.
        maskSize: `${renderedWidth}px ${fullHeight}px`,
        WebkitMaskSize: `${renderedWidth}px ${fullHeight}px`,
        maskPosition: "top center",
        WebkitMaskPosition: "top center",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
}
