import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Moon, Zap, Check } from "lucide-react";
import { fadeUp } from "@/constants";

export const Benefits = () => {
  const [openPanel, setOpenPanel] = useState(null);
  const mobileSectionRef = useRef(null);

  const isSleepOpen = openPanel === 'sleep' || openPanel === 'both';
  const isSportOpen = openPanel === 'sport' || openPanel === 'both';

  const sportBenefits = [
    "Increases airflow by up to 35%",
    "Reduces breathing effort during cardio",
    "Helps maintain nasal breathing under stress",
    "Improves oxygen delivery to muscles",
  ];
  
  const sleepBenefits = [
    "Reduces snoring intensity",
    "Promotes deeper, restorative sleep",
    "Reduces morning dry mouth",
    "Helps maintain optimal sleep breathing",
  ];
  
  return (
    <section id="benefits" className="py-8 md:py-10 border-t-2 border-b-2 border-[#00B4D8]" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">The Science</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Why Nose<br/>Strips Work
          </h2>
        </motion.div>

        {/* Desktop: 3-column layout */}
        <motion.div {...fadeUp} className="hidden lg:grid grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* Left - Sleep */}
          <div
            className="border border-white/10 self-center"
            data-testid="sleep-benefits-desktop"
            onMouseEnter={() => setOpenPanel(prev => prev === 'sport' ? 'both' : 'sleep')}
            onMouseLeave={() => setOpenPanel(prev => prev === 'both' ? 'sport' : null)}
          >
            <button
              onClick={() => setOpenPanel(openPanel === 'sleep' ? null : 'sleep')}
              className="w-full flex items-center justify-between p-5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                  <Moon className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div className="text-left">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8]">Recovery</p>
                  <h3 className="font-heading text-lg font-bold uppercase">For Sleep</h3>
                </div>
              </div>
              <div className={`w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${isSleepOpen ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                <span className={`text-lg leading-none ${isSleepOpen ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
              </div>
            </button>
            <div className="grid" style={{ gridTemplateRows: isSleepOpen ? '1fr' : '0fr', transition: 'grid-template-rows 300ms ease' }}>
              <div className="overflow-hidden">
                <ul className="space-y-3 pl-[52px] pb-5 px-5">
                {sleepBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                    <span className="text-neutral-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>

          {/* Center - Nose strip with glow */}
          <div className="flex justify-center self-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[80px] rounded-full scale-150" />
              <img 
                src="/images/transparent assets/actual product image.webp"
                alt="Bondi Wave Nose Strip"
                className="relative z-10 w-64 md:w-80 drop-shadow-2xl"
                data-testid="benefits-image"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Right - Sport */}
          <div
            className="border border-white/10 self-center"
            data-testid="sport-benefits-desktop"
            onMouseEnter={() => setOpenPanel(prev => prev === 'sleep' ? 'both' : 'sport')}
            onMouseLeave={() => setOpenPanel(prev => prev === 'both' ? 'sleep' : null)}
          >
            <button
              onClick={() => setOpenPanel(openPanel === 'sport' ? null : 'sport')}
              className="w-full flex items-center justify-between p-5 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-[#00B4D8]" />
                </div>
                <div className="text-left">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8]">Performance</p>
                  <h3 className="font-heading text-lg font-bold uppercase">For Sport</h3>
                </div>
              </div>
              <div className={`w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${isSportOpen ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                <span className={`text-lg leading-none ${isSportOpen ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
              </div>
            </button>
            <div className="grid" style={{ gridTemplateRows: isSportOpen ? '1fr' : '0fr', transition: 'grid-template-rows 300ms ease' }}>
              <div className="overflow-hidden">
                <ul className="space-y-3 pl-[52px] pb-5 px-5">
                {sportBenefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                    <span className="text-neutral-300 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Mobile: stacked layout */}
        <div className="lg:hidden" ref={mobileSectionRef}>
          <motion.div {...fadeUp} className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#00B4D8]/20 blur-[80px] rounded-full scale-150" />
              <img 
                src="/images/transparent assets/actual product image.webp"
                alt="Bondi Wave Nose Strip"
                className="relative z-10 w-64 drop-shadow-2xl"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="space-y-3">
            <div className="border border-white/10" data-testid="sleep-benefits">
              <button
                onClick={() => setOpenPanel(isSleepOpen && !isSportOpen ? null : isSleepOpen && isSportOpen ? 'sport' : 'sleep')}
                className="w-full flex items-center justify-between p-5 group"
                data-testid="sleep-toggle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                    <Moon className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8]">Recovery</p>
                    <h3 className="font-heading text-lg font-bold uppercase">For Sleep</h3>
                  </div>
                </div>
                <div className={`w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${isSleepOpen ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                  <span className={`text-lg leading-none ${isSleepOpen ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
                </div>
              </button>
              {isSleepOpen && (
                <ul key={Date.now()} className="space-y-3 pl-[52px] pb-5 px-5">
                  {sleepBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                      <span className="text-neutral-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border border-white/10" data-testid="sport-benefits">
              <button
                onClick={() => setOpenPanel(isSportOpen && !isSleepOpen ? null : isSportOpen && isSleepOpen ? 'sleep' : 'sport')}
                className="w-full flex items-center justify-between p-5 group"
                data-testid="sport-toggle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#00B4D8]" />
                  </div>
                  <div className="text-left">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8]">Performance</p>
                    <h3 className="font-heading text-lg font-bold uppercase">For Sport</h3>
                  </div>
                </div>
                <div className={`w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${isSportOpen ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                  <span className={`text-lg leading-none ${isSportOpen ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
                </div>
              </button>
              {isSportOpen && (
                <ul key={Date.now()} className="space-y-3 pl-[52px] pb-5 px-5">
                  {sportBenefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                      <Check className="w-4 h-4 text-[#00B4D8] flex-shrink-0" />
                      <span className="text-neutral-300 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
