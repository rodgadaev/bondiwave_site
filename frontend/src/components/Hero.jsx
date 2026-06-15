import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { ASSETS, SOCIAL_LINKS } from "@/constants";

export const Hero = ({ onTakeQuiz }) => {
  return (
    <section className="relative flex items-center" data-testid="hero-section">
      <div className="absolute inset-0 hero-glow" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-6 pb-0 md:pt-8 md:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">
              Now Available
            </p>
            <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9]">
              <span className="tracking-[0.02em]">Breathe</span><br/>
              <span className="text-[#00B4D8] tracking-[0.02em]">Better.</span>
            </h1>
          </div>
          
          <p className="text-lg md:text-xl text-neutral-400 max-w-md leading-relaxed">
            Premium nasal strips engineered for peak performance. Whether you're chasing records or chasing sleep.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={SOCIAL_LINKS.amazon}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-all duration-300 group"
              data-testid="hero-cta"
            >
              <ShoppingBag size={18} />
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={onTakeQuiz}
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white font-bold uppercase tracking-wider px-8 py-4 hover:border-[#00B4D8] hover:text-[#00B4D8] transition-all duration-300"
              data-testid="hero-take-quiz"
            >
              Take The Quiz
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative flex justify-center lg:justify-end mb-0 lg:mb-[-80px] z-20"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[100px] rounded-full" />
            <img 
              src={ASSETS.heroProduct} 
              alt="Bondi Wave Nose Strips" 
              className="relative z-10 w-full max-w-lg lg:max-w-xl drop-shadow-2xl"
              data-testid="hero-product-image"
              fetchpriority="high"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
