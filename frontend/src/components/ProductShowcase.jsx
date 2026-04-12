import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { ASSETS, SOCIAL_LINKS, fadeUp } from "@/constants";
import { useCountUp } from "@/hooks";

export const ProductShowcase = () => {
  const price = useCountUp(29.95, 1200);
  const perStrip = useCountUp(1.00, 1200);
  return (
    <section ref={price.ref} className="pt-4 md:pt-10 md:pb-8 bg-[#0A0A0A] overflow-visible md:overflow-hidden relative md:border-b-2 md:border-[#00B4D8]" data-testid="product-section">
      <div className="absolute -bottom-16 md:bottom-0 left-0 right-0 h-56 md:h-40 bg-[#00B4D8]/20 md:bg-[#00B4D8]/10 blur-[60px] md:blur-[80px] pointer-events-none md:translate-y-0" />
      <div ref={perStrip.ref} className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Desktop Layout */}
        <div className="hidden lg:grid grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Product</p>
            <h2 className="font-heading text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
              30 Strips.<br/>1 Month Supply.
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed mb-8">
              Each box contains 30 premium nasal strips — one for every day of the month. 
              Designed for both sleep and sport, so you're covered 24/7.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="bg-[#050505] border border-white/10 px-6 py-4">
                <div className="font-heading text-3xl font-bold text-[#00B4D8]">${price.value.toFixed(2)}</div>
                <div className="text-sm text-neutral-500">AUD / box</div>
              </div>
              <div className="bg-[#050505] border border-white/10 px-6 py-4">
                <div className="font-heading text-3xl font-bold">${perStrip.value.toFixed(2)}</div>
                <div className="text-sm text-neutral-500">per strip</div>
              </div>
            </div>
            
            <a 
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group"
              data-testid="shop-amazon-btn"
            >
              <ShoppingBag size={20} />
              Shop on Amazon
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
          
          <motion.div {...fadeUp} className="relative">
            <div className="relative flex justify-center">
              <div className="absolute -inset-10 -bottom-40 bg-[#00B4D8]/20 blur-[120px] rounded-full" />
              <img 
                src={ASSETS.display1} 
                alt="Bondi Wave Display Case" 
                className="relative z-10 w-full max-w-2xl mx-auto"
                data-testid="product-display"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <motion.div {...fadeUp} className="lg:hidden">
          <div className="relative mb-4">
            <div className="absolute -inset-4 bg-[#00B4D8]/15 blur-[80px] rounded-full" />
            <img 
              src={ASSETS.display1} 
              alt="Bondi Wave Display Case" 
              className="relative z-10 w-full"
              data-testid="product-display-mobile"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="relative z-10 border border-white/10 bg-[#050505] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-2">The Product</p>
            <h2 className="font-heading text-2xl font-bold uppercase tracking-tight mb-2">
              30 Strips. 1 Month Supply.
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Each box contains 30 premium nasal strips — designed for both sleep and sport, so you're covered 24/7.
            </p>
            
            <div className="flex gap-3 mb-4">
              <div className="flex-1 bg-[#0A0A0A] border border-[#00B4D8]/20 px-4 py-3 text-center">
                <div className="font-heading text-2xl font-bold text-[#00B4D8]">${price.value.toFixed(2)}</div>
                <div className="text-xs text-neutral-500">AUD / box</div>
              </div>
              <div className="flex-1 bg-[#0A0A0A] border border-white/10 px-4 py-3 text-center">
                <div className="font-heading text-2xl font-bold">${perStrip.value.toFixed(2)}</div>
                <div className="text-xs text-neutral-500">per strip</div>
              </div>
            </div>
            
            <a 
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-6 py-4 hover:bg-white transition-all duration-300 group w-full"
              data-testid="shop-amazon-btn-mobile"
            >
              <ShoppingBag size={18} />
              Shop on Amazon
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
