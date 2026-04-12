import { Wind, Instagram } from "lucide-react";
import { ASSETS, SOCIAL_LINKS } from "@/constants";
import { TikTokIcon } from "@/components/TikTokIcon";

export const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10 bg-[#050505]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <img src={ASSETS.logo} alt="Bondi Wave" className="h-12 md:h-14 mb-4" />
            <p className="text-neutral-500 text-sm leading-relaxed">
              Premium nasal strips engineered for athletes and anyone who values quality sleep.
            </p>
          </div>
          
          {/* Quick Links + Follow Us side by side on mobile */}
          <div className="flex gap-8 md:block">
            <div className="flex-1">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#benefits" className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm">
                    Benefits
                  </a>
                </li>
                <li>
                  <a href="#signup" className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm">
                    Get Offers
                  </a>
                </li>
                <li>
                  <a 
                    href={SOCIAL_LINKS.amazon} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-[#00B4D8] transition-colors text-sm"
                  >
                    Shop on Amazon
                  </a>
                </li>
              </ul>
            </div>
            <div className="md:hidden">
              <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a 
                  href={SOCIAL_LINKS.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href={SOCIAL_LINKS.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
          
          {/* Social - desktop only */}
          <div className="hidden md:block">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a 
                href={SOCIAL_LINKS.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                data-testid="footer-instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href={SOCIAL_LINKS.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-[#0A0A0A] border border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#00B4D8] hover:border-[#00B4D8] transition-all"
                data-testid="footer-tiktok"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-600 text-sm">
            © 2026 Bondi Wave. All rights reserved.
          </p>
          <p className="text-neutral-600 text-sm">
            Made with <Wind className="inline w-4 h-4 text-[#00B4D8]" /> in Australia
          </p>
        </div>
      </div>
    </footer>
  );
};
