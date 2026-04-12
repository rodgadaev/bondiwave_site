import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Droplets, Heart, Zap } from "lucide-react";
import { fadeUp } from "@/constants";

export const Features = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { icon: Shield, title: "Medical Grade", desc: "Hospital-quality adhesive that's gentle on skin" },
    { icon: Droplets, title: "Sweat Proof", desc: "Stays put during intense workouts and humid nights" },
    { icon: Heart, title: "Hypo Allergenic", desc: "Safe for sensitive skin, latex-free formula" },
    { icon: Zap, title: "Instant Results", desc: "Feel the difference with your first breath" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [features.length]);
  
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="features-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUp}
              className={`p-3 md:p-8 transition-all duration-500 group flex flex-row md:flex-col items-center md:items-start gap-3 md:gap-0 ${
                activeFeature === i
                  ? 'bg-[#00B4D8] border-2 border-[#00B4D8]'
                  : 'bg-[#050505] border-2 border-[#00B4D8]/40'
              }`}
              data-testid={`feature-card-${i}`}
            >
              <feature.icon className={`w-8 h-8 md:w-10 md:h-10 md:mb-6 flex-shrink-0 group-hover:scale-110 transition-all duration-500 ${
                activeFeature === i ? 'text-black' : 'text-[#00B4D8]'
              }`} />
              <div>
                <h3 className={`font-heading text-sm md:text-xl font-bold uppercase tracking-wide md:mb-3 transition-colors duration-500 ${
                  activeFeature === i ? 'text-white' : 'text-white'
                }`}>{feature.title}</h3>
                <p className={`text-xs md:text-sm leading-relaxed transition-colors duration-500 md:block ${
                  activeFeature === i ? 'text-white/80' : 'text-neutral-400'
                }`}>{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
