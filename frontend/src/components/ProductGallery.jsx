import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight, Lock, RotateCcw } from "lucide-react";
import { SOCIAL_LINKS, fadeUp } from "@/constants";
import { MobileKeyBenefits } from "@/components/MobileKeyBenefits";

export const ProductGallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const thumbColumnRef = useRef(null);

  const galleryImages = [
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/a5kp5gdz_MAIN%20IMAGE%20%2817%29.png",
      alt: "Bondi Wave Nose Strips - Product Box & Strips"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/35il9p3e_MAIN%20IMAGE%20%2811%29.png",
      alt: "Bondi Wave Nose Strips - Sweat Proof on Water"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/9o82bugn_6.png",
      alt: "Bondi Wave Nose Strips - Lifestyle"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/fdkzlofh_1.png",
      alt: "Bondi Wave - Increase Airflow by 35%"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/kvr3eima_2.png",
      alt: "Bondi Wave vs Other Nose Strips"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/4vitb6g4_3.png",
      alt: "Bondi Wave - Advanced Layer Technology"
    },
    {
      src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/h55duslj_5.png",
      alt: "Bondi Wave - From Bondi to Bronte to Deep Sleep"
    },
  ];

  const bulletPoints = [
    { label: "Maximize Oxygen Intake", text: "Instantly opens nasal passages by up to 35% for improved breathing during high-intensity training, running, or cycling" },
    { label: "Recover Better, Sleep Quieter", text: "Reduces snoring and improves sleep quality by facilitating deep nasal breathing, helping you wake up refreshed" },
    { label: "Active-Hold Adhesive", text: "Engineered with extra-strength, sweat-resistant adhesive that stays secure through intense gym sessions and humid nights" },
    { label: "Sleek Matte Black Design", text: "Premium matte black strips designed for athletes who care about performance and aesthetics" },
  ];

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovering, galleryImages.length]);

  useEffect(() => {
    const container = thumbColumnRef.current;
    if (!container) return;
    const thumb = container.children[activeIndex];
    if (thumb) {
      const thumbTop = thumb.offsetTop - container.offsetTop;
      container.scrollTo({ top: thumbTop - 8, behavior: 'smooth' });
    }
  }, [activeIndex]);

  return (
    <section id="product-gallery" className="py-8 md:py-10 bg-[#050505]" data-testid="product-gallery-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-6 hidden md:block">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Up Close</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            The Details
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="mb-4 md:hidden">
          <h3 className="font-heading text-2xl font-bold uppercase tracking-tight mb-1">
            Premium Nasal Strips
          </h3>
          <p className="text-neutral-400 text-sm">
            Extra Strength Airflow for Sport, Performance & Deep Recovery Sleep
          </p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="font-heading text-3xl font-bold text-[#00B4D8]">$29.95</span>
            <span className="text-sm text-neutral-500">AUD</span>
            <span className="text-neutral-600 mx-1">|</span>
            <span className="text-sm text-neutral-400">30 Pack Matte Black</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div {...fadeUp} className="self-start space-y-3">
            <div className="grid grid-cols-[1fr_5fr] md:grid-cols-[1fr_6fr] gap-x-1 gap-y-0">
            <div ref={thumbColumnRef} className="flex flex-col gap-0 overflow-hidden">
              {galleryImages.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  onMouseEnter={() => { setActiveIndex(i); setIsHovering(true); }}
                  onMouseLeave={() => setIsHovering(false)}
                  className={`relative aspect-square border-2 overflow-hidden transition-all duration-300 bg-[#0A0A0A] ${
                    i > 4 ? 'hidden md:block' : ''
                  } ${
                    activeIndex === i
                      ? 'border-[#00B4D8] shadow-[0_0_12px_rgba(0,180,216,0.3)]'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                  data-testid={`gallery-thumb-${i}`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>

            <div className="flex-1">
              <div
                className="relative bg-[#0A0A0A] border border-white/10 overflow-hidden w-full aspect-square"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                data-testid="gallery-main-image"
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeIndex}
                    src={galleryImages[activeIndex].src}
                    alt={galleryImages[activeIndex].alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </AnimatePresence>

              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm border border-white/10 px-3 py-1">
                <span className="font-mono text-xs text-[#00B4D8]">{activeIndex + 1}</span>
                <span className="font-mono text-xs text-neutral-500"> / {galleryImages.length}</span>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {galleryImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1 rounded-full transition-all duration-500 ${
                      activeIndex === i ? 'w-6 bg-[#00B4D8]' : 'w-1.5 bg-white/20'
                    }`}
                  />
                ))}
              </div>
              </div>
            </div>
            </div>

            <MobileKeyBenefits bulletPoints={bulletPoints} />
            <div className="flex justify-evenly gap-4 mt-1 py-3 border border-white/5 bg-[#0A0A0A]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <Lock size={28} className="text-[#00B4D8]" />
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Secure<br/>Transaction</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <RotateCcw size={28} className="text-[#00B4D8]" />
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Money Back<br/>Guarantee</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 border border-[#00B4D8]/20 bg-[#00B4D8]/5 flex items-center justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="font-mono text-xs text-neutral-400 uppercase tracking-wider text-center leading-tight">Designed in<br/>Australia</span>
              </div>
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-6">
            <div className="hidden md:block">
              <h3 className="font-heading text-2xl md:text-3xl font-bold uppercase tracking-tight mb-2">
                Premium Nasal Strips
              </h3>
              <p className="text-neutral-400 text-sm">
                Extra Strength Airflow for Sport, Performance & Deep Recovery Sleep
              </p>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-heading text-3xl font-bold text-[#00B4D8]">$29.95</span>
                <span className="text-sm text-neutral-500">AUD</span>
                <span className="text-neutral-600 mx-1">|</span>
                <span className="text-sm text-neutral-400">30 Pack Matte Black</span>
              </div>
            </div>

            <div className="hidden md:block space-y-0 border border-white/5 divide-y divide-white/5">
              {bulletPoints.map((point, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 hover:bg-[#0A0A0A] transition-colors"
                  data-testid={`gallery-bullet-${i}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center mt-0.5">
                    <span className="font-mono text-xs text-[#00B4D8] font-bold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading text-sm font-bold uppercase tracking-wide text-white group-hover:text-[#00B4D8] transition-colors">
                      {point.label}
                    </p>
                    <p className="text-neutral-500 text-xs leading-relaxed mt-1">
                      {point.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group w-full justify-center"
              data-testid="gallery-shop-btn"
            >
              <ShoppingBag size={18} />
              Shop on Amazon
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
