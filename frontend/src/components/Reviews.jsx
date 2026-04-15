import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp } from "@/constants";

export const Reviews = () => {
  const scrollRef = useRef(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId;
    let isProgrammaticScroll = false;
    const speed = 1;

    const autoScroll = () => {
      if (!isUserScrolling.current && el) {
        isProgrammaticScroll = true;
        el.scrollLeft += speed;
        isProgrammaticScroll = false;
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(autoScroll);
    };

    const pauseAutoScroll = () => {
      if (isProgrammaticScroll) return;
      isUserScrolling.current = true;
      clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        isUserScrolling.current = false;
      }, 2000);
    };

    el.addEventListener('mousedown', pauseAutoScroll);
    el.addEventListener('wheel', pauseAutoScroll);
    el.addEventListener('touchstart', pauseAutoScroll);

    animId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimeout.current);
      el.removeEventListener('mousedown', pauseAutoScroll);
      el.removeEventListener('wheel', pauseAutoScroll);
      el.removeEventListener('touchstart', pauseAutoScroll);
    };
  }, []);

  const reviews = [
    { name: "Sarah M.", location: "Sydney, AU", stars: 5, category: "Sleep", text: "I couldn't believe how much better I slept the very first night. Less tossing and turning, more restful sleep, and I finally wake up feeling energised instead of groggy." },
    { name: "James T.", location: "Melbourne, AU", stars: 5, category: "Sport", text: "I used these for a 25km run and my average pace was significantly faster while my heart rate stayed lower than usual. Being able to maintain nasal breathing during cardio is a total game-changer." },
    { name: "Emma L.", location: "Brisbane, AU", stars: 5, category: "Sleep", text: "My partner reckons I snore way less now, and I wake up feeling completely refreshed. It's the first time in years I've slept through the entire night breathing only through my nose." },
    { name: "Daniel K.", location: "Perth, AU", stars: 5, category: "Sport", text: "The adhesive is unreal. Not sure how but I can sweat through a full session, and the strip doesn't budge." },
    { name: "Olivia R.", location: "Adelaide, AU", stars: 4, category: "Congestion", text: "I have a deviated septum and haven't been able to breathe properly through my nose my whole life. These strips physically lift the sides of my nose and open everything up — worth every cent." },
    { name: "Chris W.", location: "Gold Coast, AU", stars: 5, category: "Sleep", text: "I wear a WHOOP and my recovery scores have improved by 5% over the last three months of using these. No more dry mouth or bad breath in the morning either." },
    { name: "Mia H.", location: "Bondi, AU", stars: 5, category: "Sport", text: "I wore one during the Sydney Marathon and was able to nose-breathe the entire race. It stops my nose from collapsing when I take deep breaths during heavy efforts." },
    { name: "Liam P.", location: "Coogee, AU", stars: 4, category: "Congestion", text: "Perfect for when you've got a cold or sinus infection. It's a drug-free way to actually get some sleep when you're blocked up." },
    { name: "Sophie N.", location: "Manly, AU", stars: 5, category: "Sleep", text: "These strips stay in place all night long, which was my biggest issue with other things I've tried. They work instantly the moment you press them on." },
    { name: "Ryan B.", location: "Newcastle, AU", stars: 5, category: "Sport", text: "It almost hurt the first time I ran with one because of how much air was actually reaching my lungs! I always struggled to get enough air through my nose, but this makes it feel effortless." },
    { name: "Grace F.", location: "Cronulla, AU", stars: 5, category: "Congestion", text: "I was worried about my skin because I'm quite sensitive, but these are gentle and don't leave any irritation after I peel them off in the shower." },
    { name: "Tom A.", location: "Wollongong, AU", stars: 4, category: "Sleep", text: "Simple to use and bloody effective. If you feel like you aren't getting enough air, especially at night, this is the most immediate solution I've found." },
  ];

  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="reviews-section" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content="Bondi Wave Premium Nasal Strips" />
      <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
        <meta itemProp="ratingValue" content="4.8" />
        <meta itemProp="reviewCount" content="12" />
      </div>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Real Results</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-4">
            What Our<br/>Customers Say
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="text-[#00B4D8] fill-[#00B4D8]" />
            ))}
            <span className="font-mono text-sm text-neutral-400 ml-2">4.8 / 5</span>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 reviews-scroll cursor-grab active:cursor-grabbing"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="w-[320px] md:w-[380px] bg-[#050505] border border-white/5 p-6 md:p-8 flex flex-col justify-between flex-shrink-0"
              itemScope
              itemProp="review"
              itemType="https://schema.org/Review"
              data-testid={`review-card-${i}`}
            >
              <div>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s < review.stars ? "text-[#00B4D8] fill-[#00B4D8]" : "text-neutral-700"}
                    />
                  ))}
                  <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-wider ml-2">{review.category}</span>
                </div>
                <p itemProp="reviewBody" className="text-neutral-300 text-sm leading-relaxed mb-6">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-9 h-9 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-sm font-bold text-[#00B4D8]">{review.name.charAt(0)}</span>
                </div>
                <div itemProp="author" itemScope itemType="https://schema.org/Person">
                  <p itemProp="name" className="text-white text-sm font-bold">{review.name}</p>
                  <p className="text-neutral-500 text-xs">{review.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
