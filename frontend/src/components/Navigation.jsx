import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, ShoppingBag } from "lucide-react";
import { ASSETS, SOCIAL_LINKS } from "@/constants";

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass' : 'bg-[#050505]'}`}
      data-testid="navigation"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-1 flex items-center justify-between">
        <a href="/" data-testid="logo-link">
          <img src={ASSETS.logo} alt="Bondi Wave" className="h-16 md:h-24 lg:h-28" />
        </a>
        
        <div className="flex items-center gap-4 md:gap-6">
          <a 
            href={SOCIAL_LINKS.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#00B4D8] transition-colors"
            data-testid="nav-instagram"
          >
            <Instagram size={20} />
          </a>
          <a 
            href={SOCIAL_LINKS.amazon} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-2 bg-[#00B4D8] text-black font-bold text-sm uppercase tracking-wider px-5 py-2 hover:bg-white transition-colors"
            data-testid="nav-amazon"
          >
            <ShoppingBag size={16} />
            Shop
          </a>
        </div>
      </div>
    </motion.nav>
  );
};
