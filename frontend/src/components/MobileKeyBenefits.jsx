import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const MobileKeyBenefits = ({ bulletPoints }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="md:hidden border border-white/5" data-testid="mobile-key-benefits">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-center gap-3 p-4 bg-[#0A0A0A] hover:bg-[#111] transition-colors"
        data-testid="mobile-key-benefits-toggle"
      >
        <span className="font-heading text-base font-bold uppercase tracking-wide text-white">Key Benefits</span>
        <ChevronDown size={18} className={`text-[#00B4D8] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="divide-y divide-white/5">
          {bulletPoints.map((point, i) => (
            <div key={i} className="flex items-start gap-4 p-4" data-testid={`mobile-bullet-${i}`}>
              <div className="flex-shrink-0 w-8 h-8 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center mt-0.5">
                <span className="font-mono text-xs text-[#00B4D8] font-bold">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <div className="min-w-0">
                <p className="font-heading text-sm font-bold uppercase tracking-wide text-white">{point.label}</p>
                <p className="text-neutral-500 text-xs leading-relaxed mt-1">{point.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
