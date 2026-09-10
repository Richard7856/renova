/**
 * Fuente unica de verdad del contenido del sitio.
 *
 * Regla del proyecto: ningun componente escribe texto literal de negocio.
 * Cambiar de clinica ficticia a clinica real = editar SOLO este archivo.
 *
 * Los `TODO:` marcan los datos inventados que deben sustituirse antes de
 * publicar. Estan agrupados para poder auditarlos con `grep -n "TODO:" content/site.ts`.
 */

/** Imagenes servidas desde el CDN de la plantilla de origen.
 *  TODO: reemplazar por material fotografico propio en /public y borrar
 *  el bloque `remotePatterns` de next.config.ts. Usar fotos de stock o de
 *  otra clinica en una web medica es un riesgo legal, no solo estetico. */
const CDN = "https://framerusercontent.com/images";

export const clinic = {
  // TODO: nombre comercial real
  name: "Renova",
  legalName: "Renova Clínica de Cirugía Plástica",
  tagline: "Cirugía plástica y medicina estética",
  /** Dominio de produccion. Alimenta canonical, Open Graph y sitemap. */
  // TODO: dominio real
  url: "https://renova.example.com",
  locale: "es-MX",

  // TODO: datos de contacto reales
  phoneDisplay: "+52 55 1234 5678",
  /** Formato E.164 sin signos: es lo que consume wa.me */
  whatsapp: "525512345678",
  email: "hola@renova.example.com",

  address: {
    street: "Av. Ejemplo 123, Piso 4",
    locality: "Ciudad de México",
    region: "CDMX",
    postalCode: "01000",
    country: "MX",
  },

  hours: [
    { days: "Lunes a viernes", time: "9:00 – 19:00" },
    { days: "Sábados", time: "9:00 – 14:00" },
  ],

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

export const doctor = {
  // TODO: nombre, cedula y especialidad reales del cirujano responsable
  name: "Dra. Ana Beltrán",
  role: "Cirujana plástica y reconstructiva",
  /** En Mexico la cedula de especialidad es obligatoria en publicidad medica
   *  (NOM-004 / COFEPRIS). No publicar el sitio sin este dato. */
  license: "Céd. Esp. 0000000",
  credentials: [
    "Certificada por el Consejo Mexicano de Cirugía Plástica",
    "Miembro de la Asociación Mexicana de Cirugía Plástica",
  ],
  portrait: `${CDN}/GxQO8asItSl76Fw0bPEJgPjibvI.jpg`,
} as const;

export const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Resultados", href: "#resultados" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Preguntas", href: "#preguntas" },
] as const;

export const hero = {
  eyebrow: "Cirugía plástica · Medicina estética",
  title: "Renova sin dejar de ser tú",
  /** El original dejaba esta frase cortada a media oracion ("designed to improve"). */
  subtitle:
    "Cirugía plástica y tratamientos estéticos avanzados, planeados sobre tu anatomía y tus tiempos. Resultados que se ven naturales porque parten de lo que ya eres.",
  image: `${CDN}/nzLcI2gIko5jP7H7JHhs97DQ0.jpg`,
  imageAlt:
    "Consultorio de la clínica con luz natural y mobiliario en tonos cálidos",
  rating: { score: "5.0", count: 86 },
} as const;

/** Cinta de tratamientos que recorre el ancho de la pantalla. */
export const treatmentTicker = [
  "Toxina Botulínica",
  "Labios (Kiss)",
  "Armonización Facial",
  "Sculptra",
  "Radiesse (Cuello)",
  "Duraform",
  "Skinbooster NCTF Ojeras",
  "Skinbooster NCTF Tercio Medio",
  "Exosomas",
  "PDRN",
  "Serenity Glow",
  "Limpieza Facial Profunda",
  "Hidrodermoabrasión",
  "Microneedling con Exosomas",
  "Limpieza de Espalda",
] as const;

export type Service = {
  slug: string;
  title: string;
  summary: string;
  treatments: string[];
  image: string;
  imageAlt: string;
};

/**
 * El sitio de origen repetia literalmente la misma descripcion en tres de las
 * cinco tarjetas y no decia que incluia cada categoria. Aqui cada bloque tiene
 * texto propio y lista los tratamientos reales que le corresponden.
 */
export const services: Service[] = [
  {
    slug: "cirugia-plastica",
    title: "Cirugía Plástica y Reconstructiva",
    summary:
      "Procedimientos quirúrgicos planeados en consulta, con estudio previo, quirófano certificado y seguimiento postoperatorio incluido.",
    // TODO: confirmar el catalogo quirurgico que realmente se ofrece
    treatments: [
      "Rinoplastia",
      "Mamoplastia de aumento y reducción",
      "Lipoescultura",
      "Abdominoplastia",
      "Blefaroplastia",
      "Reconstrucción mamaria",
    ],
    image: `${CDN}/vZWId5rca0iP0PQazENoHugDL5c.jpg`,
    imageAlt: "Equipo quirúrgico durante la planeación de un procedimiento",
  },
  {
    slug: "inyectables",
    title: "Inyectables y Armonización Facial",
    summary:
      "Ajustes milimétricos que descansan la expresión y equilibran las proporciones del rostro sin borrar tus rasgos.",
    treatments: [
      "Toxina Botulínica",
      "Labios (Kiss)",
      "Armonización de mentón, mandíbula y contorno",
    ],
    image: `${CDN}/x5bU5fSGGaNxXqI2iAQqSZi8nA4.jpg`,
    imageAlt: "Aplicación de tratamiento inyectable facial en consultorio",
  },
  {
    slug: "bioestimuladores",
    title: "Bioestimuladores de Colágeno",
    summary:
      "En lugar de rellenar, estimulan que tu piel produzca colágeno propio. El resultado aparece de forma gradual y sostiene la firmeza por más tiempo.",
    treatments: ["Sculptra", "Radiesse (Cuello)", "Duraform"],
    image: `${CDN}/ipAbYHifCDoQsFyitpmqxk7yTIQ.jpg`,
    imageAlt: "Detalle de piel firme tras tratamiento con bioestimuladores",
  },
  {
    slug: "skin-quality",
    title: "Skin Quality y Regeneración Cutánea",
    summary:
      "Terapias de calidad de piel para ojeras, tercio medio y textura, apoyadas en biotecnología regenerativa.",
    treatments: [
      "Skinbooster (NCTF) Ojeras",
      "Skinbooster (NCTF) Tercio Medio",
      "Exosomas",
      "PDRN (Polidesoxirribonucleótidos)",
      "Serenity Glow",
    ],
    image: `${CDN}/46kLkViNx68JPqB0G5rji3IA.jpg`,
    imageAlt: "Preparación de tratamiento de regeneración cutánea",
  },
  {
    slug: "faciales-clinicos",
    title: "Faciales Clínicos y Cuidado de la Piel",
    summary:
      "Protocolos de mantenimiento realizados por personal clínico, no cosmético: limpieza profunda, renovación y control de brotes.",
    treatments: [
      "Limpieza Facial Profunda",
      "Hidrodermoabrasión",
      "Microneedling con Exosomas",
      "Limpieza de Espalda",
    ],
    image: `${CDN}/azUXPD7iJOKsfqLM48TJJitzBCs.jpg`,
    imageAlt: "Sesión de limpieza facial profunda en cabina clínica",
  },
];

export const about = {
  eyebrow: "Cómo trabajamos",
  title: "Una clínica que primero escucha",
  body: "Creemos que un buen resultado empieza por entender qué te incomoda y qué no quieres cambiar. Por eso cada tratamiento arranca con una consulta detallada, un plan a plazo definido y criterios médicos, no comerciales.",
  pillars: [
    {
      title: "Diagnóstico antes que catálogo",
      body: "Si un procedimiento no es para ti, te lo decimos. Vale más una consulta honesta que una cita agendada.",
    },
    {
      title: "Técnica respaldada por evidencia",
      body: "Solo trabajamos con productos y protocolos con registro sanitario y literatura clínica que los sostenga.",
    },
    {
      title: "Un plan, no una sesión suelta",
      body: "Definimos número de sesiones, tiempos de recuperación y costo total desde el primer día.",
    },
  ],
  image: `${CDN}/bxWl7NQ8Cya6sHR7IukfwXk.jpg`,
  imageAlt: "Consulta médica personalizada en la clínica",
} as const;

export const beforeAfter = {
  eyebrow: "Resultados",
  title: "Pacientes reales, resultados reales",
  body: "Arrastra el control para comparar. Cada caso publicado cuenta con consentimiento informado por escrito de la paciente.",
  before: {
    src: `${CDN}/KLz3YY5GDbbEwOvVSAqGFLXE0eI.jpg`,
    alt: "Rostro de paciente antes del tratamiento",
    label: "Antes",
  },
  after: {
    src: `${CDN}/mtj5hoiyHHRIFp2NkDEtYGmM.jpg`,
    alt: "Rostro de la misma paciente después del tratamiento",
    label: "Después",
  },
  caseNote: "Armonización facial · 12 semanas · Paciente de 34 años",
  /** Obligatorio en publicidad medica: los resultados no son transferibles. */
  disclaimer:
    "Los resultados varían según la anatomía, la edad y el apego al plan de cada paciente. Las imágenes no constituyen una promesa de resultado.",
} as const;

export const stats = [
  { value: "10+", label: "Años de práctica médica" },
  { value: "2,000+", label: "Procedimientos realizados" },
  { value: "50+", label: "Tratamientos en catálogo" },
  { value: "99%", label: "Pacientes que recomiendan" },
] as const;

export const testimonials = [
  {
    quote:
      "Me escucharon de verdad y me explicaron cada paso antes de tocarme. Salí sabiendo exactamente qué esperar.",
    name: "Sofía H.",
    detail: "Armonización facial",
  },
  {
    quote:
      "Llegué nerviosa porque no quería verme operada. El resultado se ve completamente natural, nadie sabe qué me hice.",
    name: "Olivia C.",
    detail: "Toxina botulínica",
  },
  {
    quote:
      "Clínica impecable y equipo profesional. El postoperatorio fue mucho más llevadero de lo que imaginaba.",
    name: "Priya M.",
    detail: "Mamoplastia",
  },
  {
    quote:
      "El plan fue claro desde el inicio: cuántas sesiones, cuánto costaba y en cuánto tiempo iba a ver cambios.",
    name: "Daniel B.",
    detail: "Bioestimuladores",
  },
] as const;

export const faq = [
  {
    q: "¿Cómo sé qué tratamiento necesito?",
    a: "No lo decides tú sola ni lo decidimos por catálogo. En la consulta evaluamos tu anatomía, tus antecedentes médicos y lo que quieres lograr, y de ahí sale una recomendación concreta. Si nada de lo que ofrecemos resuelve tu caso, te lo decimos.",
  },
  {
    q: "¿Cuántas sesiones voy a necesitar?",
    a: "Depende del tratamiento. La toxina botulínica es una sola aplicación cada 4 a 6 meses; los bioestimuladores suelen requerir de 2 a 3 sesiones separadas por un mes; los protocolos de calidad de piel se planean por ciclos. El número exacto queda por escrito en tu plan.",
  },
  {
    q: "¿Duelen los procedimientos?",
    a: "Los inyectables se realizan con anestesia tópica y la molestia es comparable a un piquete breve. Los procedimientos quirúrgicos se hacen bajo anestesia con médico anestesiólogo presente. En ambos casos recibes indicaciones de manejo del dolor para los días posteriores.",
  },
  {
    q: "¿Cuánto cuesta y puedo pagar a plazos?",
    a: "El costo se cotiza en consulta porque depende del volumen de producto y de la complejidad de tu caso; una cifra dada por teléfono sin verte sería inventada. Manejamos pago con tarjeta y meses sin intereses en procedimientos quirúrgicos.",
  },
  {
    q: "¿Cuánto dura la recuperación?",
    a: "Los tratamientos faciales e inyectables permiten volver a tu rutina el mismo día, con inflamación leve de 24 a 48 horas. En cirugía, la incapacidad va de una a tres semanas según el procedimiento; te entregamos el calendario de recuperación antes de que decidas.",
  },
  {
    q: "¿Qué pasa en mi primera visita?",
    a: "Dura entre 40 y 60 minutos. Revisamos historia clínica, hacemos una valoración física y, si aplica, registro fotográfico. Sales con un plan por escrito, un rango de costo y sin compromiso de agendar.",
  },
] as const;

export const finalCta = {
  title: "Empecemos por una consulta",
  body: "Cuéntanos qué te gustaría cambiar. La valoración inicial es sin costo y sin compromiso de agendar tratamiento.",
} as const;

/** Opciones del selector del formulario. Derivadas del catalogo para que
 *  no puedan desincronizarse al agregar un servicio. */
export const interestOptions = [
  ...services.map((s) => s.title),
  "Aún no lo sé, quiero orientación",
];

/**
 * Rueda de tratamientos que gira sobre la foto (bloque bajo el hero).
 *
 * Cada elemento es un radio de una circunferencia cuyo centro cae en el borde
 * inferior de la tarjeta. El disco central no es adorno: cubre el punto donde
 * convergen los radios, que sin el seria un amasijo de pills solapadas.
 *
 * El orden importa visualmente: al ser radios equiespaciados, dos nombres muy
 * largos seguidos cargan un lado de la rueda. Estan intercalados a proposito.
 */
export const wheelItems = treatmentTicker.map((name, i) => ({
  name,
  // TODO: sustituir por una foto propia de cada tratamiento.
  // Se cicla sobre el set disponible: hay menos imagenes que tratamientos.
  thumb: `${CDN}/${
    [
      "Jvm6ENMcLTrn2S9rqOPXlCQ538M",
      "jSFZ7ROTAOOS0hkJqlUtWsKmKe8",
      "UE0hiu8Gc8M7F2YUVcZ3ePMlsc",
      "GXrVkAKOuyZ6jsH2mk3ALm0ncw",
      "BpGNqeqsBfGoXmblZ5zbtLzBM",
      "fRkN7RTfKeL08Kpz6CrDLlrDc",
      "rmaNoowueaeJpAJe2LHvvrc60",
      "gzen5eX2cjNUuGHxoxYDiHqSP9I",
      "V40vRazc9cFurG60JnK0c85s",
      "j6oC7YZz1cfpeQSnSeYsb7iddk4",
      "PyjMSo6pfuPNLWf9DUJPOOnxCng",
    ][i % 11]
  }.jpg`,
}));

export const wheel = {
  image: `${CDN}/4gRqLtjxPBtwZmePma4I5n97gcI.jpg`,
  imageAlt:
    "Detalle de piel sana tras tratamiento, fondo del carrusel de tratamientos",
  discLabel: "Lista de tratamientos",
  discHref: "#servicios",
} as const;
