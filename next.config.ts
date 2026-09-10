import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hay un package-lock.json en el home del usuario; sin esto Next infiere ese
  // directorio como raiz del workspace y avisa en cada build.
  outputFileTracingRoot: __dirname,
  images: {
    // Las fotos de referencia viven en el CDN de Framer mientras no haya
    // material fotografico propio de la clinica. Al sustituirlas por archivos
    // en /public este bloque se puede borrar entero.
    remotePatterns: [{ protocol: "https", hostname: "framerusercontent.com" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
