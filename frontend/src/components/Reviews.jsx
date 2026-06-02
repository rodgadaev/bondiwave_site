import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, ChevronLeft, ChevronRight } from "lucide-react";
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

const N = reviewImages.length;
const label = (f) => f.replace("review-", "").replace(".webp", "");

export const Reviews = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const hoverRef = useRef(false);
  const openRef = useRef(false);

  const [index, setIndex] = useState(null); // lightbox index, or null when closed
  const [isDragging, setIsDragging] = useState(false);

  // Carousel engine: auto-scroll + drag + wheel/trackpad scrubbing
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduce ? 0 : 0.6;

    const computeHalf = () => {
      const desktop = window.matchMedia("(min-width: 768px)").matches;
      const cardW = desktop ? 240 : 200;
      const gap = desktop ? 16 : 12;
      halfRef.current = N * (cardW + gap);
    };
    computeHalf();
    window.addEventListener("resize", computeHalf);

    const wrap = () => {
      const half = halfRef.current;
      if (half > 0) {
        if (offsetRef.current >= half) offsetRef.current -= half;
        else if (offsetRef.current < 0) offsetRef.current += half;
      }
    };

    let raf;
    const tick = () => {
      const track = trackRef.current;
      if (track) {
        if (!draggingRef.current && !hoverRef.current && !openRef.current) {
          offsetRef.current += speed;
        }
        wrap();
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Wheel / two-finger trackpad → horizontal scrub.
    // Native non-passive listener so preventDefault() works.
    const vp = viewportRef.current;
    const onWheel = (e) => {
      if (openRef.current) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX > absY ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      offsetRef.current += delta;
      wrap();
      e.preventDefault();
    };
    vp?.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", computeHalf);
      vp?.removeEventListener("wheel", onWheel);
    };
  }, []);

  const openAt = (i) => {
    openRef.current = true;
    setIndex(i);
  };
  const close = () => {
    openRef.current = false;
    setIndex(null);
  };
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + N) % N)), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % N)), []);

  // Keyboard nav while the lightbox is open
  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, prev, next]);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    setIsDragging(true);
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.clientX - startXRef.current;
    if (Math.abs(delta) > 5) movedRef.current = true;
    offsetRef.current = startOffsetRef.current - delta;
  };
  const onPointerUp = (e) => {
    draggingRef.current = false;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (!movedRef.current) {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const card = el?.closest("[data-index]");
      if (card) openAt(Number(card.getAttribute("data-index")));
    }
  };

  const onCardActivate = (i) => {
    if (movedRef.current) return; // keyboard activation; drags are ignored
    openAt(i);
  };

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
      </div>

      <div
        ref={viewportRef}
        className={`reviews-viewport w-full overflow-hidden px-6 md:px-12 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        data-testid="reviews-carousel"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[...reviewImages, ...reviewImages].map((filename, i) => {
            const realIndex = i % N;
            return (
              <button
                key={i}
                type="button"
                data-index={realIndex}
                onClick={() => onCardActivate(realIndex)}
                className="w-[200px] md:w-[240px] flex-shrink-0 mr-3 md:mr-4 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] block transition-transform duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#00B4D8]/60"
                itemScope
                itemProp="review"
                itemType="https://schema.org/Review"
                data-testid={`review-card-${i}`}
                aria-label={`Enlarge customer review from ${label(filename)}`}
              >
                <img
                  src={`/images/reviews/${filename}`}
                  alt={`Customer review - ${label(filename)}`}
                  className="w-full h-full object-cover pointer-events-none"
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={close}
            data-testid="review-lightbox"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors z-10"
              data-testid="review-lightbox-close"
              aria-label="Close enlarged review"
            >
              <X size={28} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#00B4D8] border border-white/20 text-white flex items-center justify-center transition-colors"
              data-testid="review-lightbox-prev"
              aria-label="Previous review"
            >
              <ChevronLeft size={26} />
            </button>

            <motion.img
              key={index}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              src={`/images/reviews/${reviewImages[index]}`}
              alt={`Customer review - ${label(reviewImages[index])}`}
              className="max-h-[88vh] w-auto rounded-xl border-[3px] border-[#00B4D8] object-contain"
              onClick={(e) => e.stopPropagation()}
              data-testid="review-lightbox-image"
              draggable={false}
            />

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#00B4D8] border border-white/20 text-white flex items-center justify-center transition-colors"
              data-testid="review-lightbox-next"
              aria-label="Next review"
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
