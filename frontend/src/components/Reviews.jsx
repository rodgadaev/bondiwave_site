import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { fadeUp } from "@/constants";

const reviewImages = [
  "review-aliciajane.webp",
  "review-benzingtens.webp",
  "review-bill-cheese.webp",
  "review-charlotte.webp",
  "review-cindy.webp",
  "review-cyjzach.webp",
  "review-dane.webp",
  "review-danielvalderama.webp",
  "review-davidsaul.webp",
  "review-ethanheffron.webp",
  "review-ethanwong.webp",
  "review-hannahroese.webp",
  "review-jacob.webp",
  "review-jin.webp",
  "review-joey.webp",
  "review-jordan.webp",
  "review-kangalaura.webp",
  "review-kobey.webp",
  "review-maddi.webp",
  "review-micah.webp",
  "review-michaelatkinson.webp",
  "review-nick.webp",
  "review-ram.webp",
  "review-rod.webp",
  "review-samantharowney.webp",
  "review-simone.webp",
  "review-viktoria.webp",
  "review-zahraa.webp",
  "review-zaide.webp",
];

export const Reviews = () => {
  const scrollRef = useRef(null);
  const isUserScrolling = useRef(false);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId;
    let isProgrammaticScroll = false;
    const speed = 0.8;

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

  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="reviews-section" itemScope itemType="https://schema.org/Product">
      <meta itemProp="name" content="Bondi Wave Premium Nasal Strips" />
      <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
        <meta itemProp="ratingValue" content="4.8" />
        <meta itemProp="reviewCount" content="29" />
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
          className="flex gap-3 md:gap-4 overflow-x-auto pb-4 reviews-scroll cursor-grab active:cursor-grabbing"
        >
          {reviewImages.map((filename, i) => (
            <div
              key={i}
              className="w-[200px] md:w-[240px] flex-shrink-0 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16]"
              itemScope
              itemProp="review"
              itemType="https://schema.org/Review"
              data-testid={`review-card-${i}`}
            >
              <img
                src={`/images/reviews/${filename}`}
                alt={`Customer review - ${filename.replace('review-', '').replace('.webp', '')}`}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
