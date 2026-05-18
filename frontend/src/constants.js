// Brand Assets
export const ASSETS = {
  logo: "/images/bondi-wave-logo.svg",
  heroProduct: "/images/BREATHE BETTER. (4).webp",
  display1: "/images/BREAHTE FREELY - Display Cases.webp",
};

// Social Links
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/thebondiwave/",
  tiktok: "https://tiktok.com/@thebondiwave",
  amazon: "https://www.amazon.com.au/dp/B0GR5HX9PJ",
};

// Animation variants
export const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
};
