import blogRuzafa from "@/assets/blog-ruzafa.jpg";
import blogBeckham from "@/assets/blog-beckham.jpg";

export type BlogPost = {
  slug: string;
  image: string;
  date: string;
  tag: { en: string; es: string };
  title: { en: string; es: string };
  excerpt: { en: string; es: string };
  body: { en: string; es: string };
};

export const blogPosts: BlogPost[] = [
  {
    slug: "ruzafa-digital-nomad-guide",
    image: blogRuzafa,
    date: "2026-03-12",
    tag: { en: "Neighborhoods", es: "Barrios" },
    title: {
      en: "The 2026 digital nomad guide to Ruzafa",
      es: "Guía 2026 de nómada digital en Ruzafa",
    },
    excerpt: {
      en: "The best cafés, coworking spaces and hidden corners of Valencia's most vibrant neighborhood.",
      es: "Los mejores cafés, espacios de coworking y rincones ocultos del barrio más vibrante de Valencia.",
    },
    body: {
      en: `Ruzafa is Valencia's most-talked-about neighborhood for a reason. Once a working-class district, it has become a magnet for designers, founders and remote workers — without losing its edge.

What makes Ruzafa work for a digital nomad is the density: within a fifteen-minute walk you have specialty coffee, three serious coworking spaces, a covered market, the Estación del Norte, and direct metro access to Patacona beach.

Stay close to Plaza del Doctor Landete or Calle Cuba for the most balanced trade-off between energy and sleep. Avoid the strip directly behind the Mercado de Ruzafa on weekends if you value quiet nights.`,
      es: `Ruzafa es el barrio más comentado de Valencia por una razón. Lo que antes fue un barrio obrero hoy es un imán para diseñadores, fundadores y trabajadores remotos — sin perder su carácter.

Lo que hace que Ruzafa funcione para un nómada digital es la densidad: en quince minutos a pie tienes café de especialidad, tres coworkings serios, un mercado cubierto, la Estación del Norte y metro directo a la playa de la Patacona.

Quédate cerca de la Plaza del Doctor Landete o de Calle Cuba para el mejor equilibrio entre energía y descanso. Evita la zona detrás del Mercado de Ruzafa los fines de semana si valoras dormir.`,
    },
  },
  {
    slug: "beckham-law-explained",
    image: blogBeckham,
    date: "2026-02-04",
    tag: { en: "Tax", es: "Fiscalidad" },
    title: {
      en: "Understanding the Beckham Law for remote workers",
      es: "La Ley Beckham para trabajadores remotos",
    },
    excerpt: {
      en: "How remote workers can save up to 24% on Spanish taxes when relocating in 2026.",
      es: "Cómo los trabajadores remotos pueden ahorrar hasta un 24% en impuestos al mudarse en 2026.",
    },
    body: {
      en: `The Beckham Law (Régimen especial para trabajadores desplazados) lets qualifying new tax residents in Spain pay a flat 24% on Spanish-source employment income up to €600,000 — instead of the progressive rate that climbs to 47%.

The 2023 update extended eligibility to digital nomads on the new visa, certain entrepreneurs and highly-qualified professionals. The election must be made within six months of registering with Social Security.

This is general information, not legal advice — eligibility depends on your specific situation. A Strategy Session is the fastest way to confirm whether the regime applies to you before you arrive.`,
      es: `La Ley Beckham (Régimen especial para trabajadores desplazados) permite a los nuevos residentes fiscales que cumplen los requisitos pagar un tipo fijo del 24% sobre rendimientos del trabajo de origen español hasta 600.000€ — en lugar del tipo progresivo que llega al 47%.

La actualización de 2023 amplió la elegibilidad a los nómadas digitales con el nuevo visado, a ciertos emprendedores y a profesionales altamente cualificados. La opción debe ejercerse en los seis meses siguientes al alta en la Seguridad Social.

Esto es información general, no asesoramiento legal — la elegibilidad depende de tu situación concreta. Una Sesión Estratégica es la forma más rápida de confirmar si el régimen te aplica antes de llegar.`,
    },
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
