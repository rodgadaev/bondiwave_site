import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { fadeUp } from "@/constants";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "How do Bondi Wave nasal strips work?",
      answer: "Bondi Wave strips feature a flexible, spring-like band that gently lifts and opens the nasal passages. By widening the nasal valve, the strips reduce airflow resistance, allowing you to breathe more deeply and easily through your nose without the use of medication."
    },
    {
      question: "What are the main benefits of wearing nasal strips?",
      answer: "Nasal strips provide immediate relief from snoring by reducing the need for mouth breathing. They also improve athletic endurance by maximizing oxygen intake, relieve congestion from colds or allergies, and promote deeper, more restorative sleep."
    },
    {
      question: "Will Bondi Wave strips stay on during heavy exercise or sweating?",
      answer: "Yes. Bondi Wave is engineered with a high-performance adhesive specifically designed to withstand sweat and movement. Whether you are running, lifting, or surfing, the strips are built to stay secure until you're ready to take them off."
    },
    {
      question: "Can nasal strips help with snoring?",
      answer: "Many people snore because their nasal passages are restricted, forcing them to breathe through their mouth. Bondi Wave strips physically pull the nostrils open to keep the airway clear, which can significantly reduce or eliminate snoring for a quieter night's sleep."
    },
    {
      question: "How do I apply the strip for the strongest grip?",
      answer: "For the best results, wash your nose with soap and water to remove any natural oils or moisturizers, then dry the area completely. Position the strip across the bridge of your nose just above the flare of the nostrils and press firmly for 10 seconds to set the adhesive."
    },
    {
      question: "What is the best way to remove the strip?",
      answer: "To protect your skin, remove the strip while washing your face with warm water or during a shower. The warmth helps loosen the bond, allowing you to gently lift the edges and peel the strip away without irritation."
    },
    {
      question: "Are Bondi Wave nasal strips drug-free?",
      answer: "Yes, Bondi Wave strips are 100% drug-free. They work through simple mechanical action to lift the skin and open the airway, making them safe to use every night or during every workout."
    },
    {
      question: "What should I do if I have sensitive skin?",
      answer: "If you have sensitive skin, we recommend applying a drop of warm water to the strip before removal to soften the adhesive. After removal, you can apply a gentle moisturizer to the bridge of your nose to keep the skin hydrated."
    },
    {
      question: "Can I use these strips if I have a deviated septum?",
      answer: "While nasal strips cannot cure a deviated septum, they can help manage the symptoms. By lifting the side walls of the nose, they can open up the restricted airway, making it easier to draw air through the nose."
    },
    {
      question: "How often can I use Bondi Wave strips?",
      answer: "Our strips are designed for single use and can be worn daily. For the best hygiene and adhesive performance, use a fresh strip for each sleep or training session."
    },
  ];

  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section className="py-8 md:py-10" data-testid="faq-section" itemScope itemType="https://schema.org/FAQPage">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Support</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Frequently Asked<br/>Questions
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="divide-y divide-white/10 border-t border-b border-white/10">
          {visibleFaqs.map((faq, i) => (
            <div
              key={i}
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left group"
                data-testid={`faq-toggle-${i}`}
              >
                <h3 itemProp="name" className="font-heading text-sm md:text-base font-bold uppercase tracking-wide pr-4 group-hover:text-[#00B4D8] transition-colors">
                  {faq.question}
                </h3>
                <div className={`flex-shrink-0 w-8 h-8 border border-white/10 flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-[#00B4D8] border-[#00B4D8] rotate-45' : 'group-hover:border-[#00B4D8]'}`}>
                  <span className={`text-lg leading-none ${openIndex === i ? 'text-black' : 'text-[#00B4D8]'}`}>+</span>
                </div>
              </button>
              <div
                itemScope
                itemProp="acceptedAnswer"
                itemType="https://schema.org/Answer"
                className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-48 pb-5' : 'max-h-0'}`}
              >
                <p itemProp="text" className="text-neutral-400 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {!showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full mt-4 flex items-center justify-center gap-2 py-4 border border-white/10 hover:border-[#00B4D8] transition-colors group"
            data-testid="faq-show-more"
          >
            <span className="font-heading text-sm font-bold uppercase tracking-wide group-hover:text-[#00B4D8] transition-colors">
              View More Questions ({faqs.length - 5})
            </span>
            <ChevronDown size={18} className="text-[#00B4D8]" />
          </button>
        )}
      </div>
    </section>
  );
};
