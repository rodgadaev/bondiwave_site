import { SOCIAL_LINKS } from "@/constants";

export const PromoBanner = () => {
  const promoItems = [
    "NOW AVAILABLE — SHOP ON AMAZON",
    "SAME DAY DELIVERY",
    "30 PREMIUM STRIPS — JUST $29.95 AUD",
  ];
  
  return (
    <a 
      href={SOCIAL_LINKS.amazon}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-[#00B4D8] py-2 overflow-hidden cursor-pointer hover:bg-[#00a0c0] transition-colors"
      data-testid="promo-banner"
    >
      <div className="animate-marquee flex whitespace-nowrap">
        {[...promoItems, ...promoItems, ...promoItems, ...promoItems].map((item, i) => (
          <span key={i} className="font-heading text-xs md:text-sm uppercase tracking-[0.2em] text-black font-bold mx-8">
            {item} <span className="mx-4">★</span>
          </span>
        ))}
      </div>
    </a>
  );
};
