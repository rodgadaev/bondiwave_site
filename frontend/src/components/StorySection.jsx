import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Instagram } from "lucide-react";
import { fadeUp } from "@/constants";

// Background video for the heading band (1980x817 — wide/thin Bondi Beach clip)
const BG_VIDEO_MP4 = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mp4";
const BG_VIDEO_MOV = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mov";

// UGC creator reels — { src, handle }. The .mov original is served as .mp4 for browser support.
const reels = [
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780623536/benzingtens-UGC_upeooy.mp4", handle: "benzingtens" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555953/aliciajane_e-UGC_xphgz1.mp4", handle: "aliciajane_e" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555810/dane.stewart__v7a0tc.mp4", handle: "dane.stewart" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555809/chantelleoffical_-UGC_gr1gfl.mp4", handle: "chantelleoffical_" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555933/b1ll_cheese-UGC_ruqs46.mp4", handle: "b1ll_cheese" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555917/samantha_rowney-UGC_ihr6bo.mp4", handle: "samantha_rowney" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780623565/joey.robson-UGC_ffzyme.mp4", handle: "joey.robson" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555927/just_zavier-UGC_rucyzo.mp4", handle: "just_zavier" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555925/maddischmierer-UGC_zjlsdw.mp4", handle: "maddischmierer" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555918/jordansavic-UGC_nfipfq.mp4", handle: "jordansavic" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555838/flynn.fitness-UGC_u0w0t9.mp4", handle: "flynn.fitness" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555830/skinbyjason-UGC_mehduo.mp4", handle: "skinbyjason" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555814/calithekid_-UGC_k5woec.mp4", handle: "calithekid_" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555823/michaelatkinson_-UGC_zqyth8.mp4", handle: "michaelatkinson_" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555904/guillermocristiandias-UGC_kk8y51.mp4", handle: "guillermocristiandias" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555865/itsyahomiejacob-UGC_tsllqc.mp4", handle: "itsyahomiejacob" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555944/nickl30068-UGC_l6fz6e.mp4", handle: "nickl30068" },
  { src: "https://res.cloudinary.com/db7phqm4y/video/upload/v1780555926/mnimoniquee-UGC_l0jlq3.mp4", handle: "mnimoniquee" },
];
const REELN = reels.length;
const igUrl = (handle) => `https://www.instagram.com/${handle}`;

const HandleBubble = ({ handle, testid }) => (
  <a
    data-ig={handle}
    href={igUrl(handle)}
    target="_blank"
    rel="noopener noreferrer"
    onClick={(e) => e.stopPropagation()}
    className="absolute bottom-2 left-2 z-10 flex items-center gap-1 bg-[#00B4D8]/25 hover:bg-[#00B4D8]/55 backdrop-blur-md border border-[#00B4D8]/40 text-white text-[11px] font-mono px-2.5 py-1 rounded-full transition-colors"
    data-testid={testid}
  >
    <Instagram size={12} />
    @{handle}
  </a>
);

export const StorySection = () => {
  const viewportRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [index, setIndex] = useState(null); // lightbox index or null

  const pauseReels = useCallback(() => {
    viewportRef.current?.querySelectorAll("video[data-reel]").forEach((v) => v.pause());
  }, []);
  const playVisibleReels = useCallback(() => {
    viewportRef.current?.querySelectorAll("video[data-reel]").forEach((v) => v.play?.().catch(() => {}));
  }, []);

  const openLightbox = useCallback((i) => setIndex(i), []);
  const close = useCallback(() => {
    setIndex(null);
    playVisibleReels();
  }, [playVisibleReels]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + REELN) % REELN)), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % REELN)), []);

  // Wheel / two-finger trackpad → horizontal scrub (native non-passive listener)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const onWheel = (e) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);
      const delta = absX > absY ? e.deltaX : e.deltaY;
      if (!delta) return;
      vp.scrollLeft += delta;
      e.preventDefault();
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, []);

  // Only play reels that are visible (keeps it smooth with many videos)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const vids = vp.querySelectorAll("video[data-reel]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const v = entry.target;
          if (entry.isIntersecting) v.play?.().catch(() => {});
          else v.pause?.();
        });
      },
      { root: vp, threshold: 0.2 }
    );
    vids.forEach((v) => io.observe(v));
    return () => io.disconnect();
  }, []);

  // Lightbox open: pause the carousel, autoplay selected with sound, keyboard nav
  useEffect(() => {
    if (index === null) return;
    pauseReels();
    const v = lightboxVideoRef.current;
    if (v) {
      v.muted = false;
      v.currentTime = 0;
      v.play?.().catch(() => {});
    }
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, pauseReels, close, prev, next]);

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return; // touch uses native scroll
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startScrollRef.current = viewportRef.current.scrollLeft;
    setIsDragging(true);
    viewportRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 5) movedRef.current = true;
    viewportRef.current.scrollLeft = startScrollRef.current - dx;
  };
  const onPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    viewportRef.current.releasePointerCapture?.(e.pointerId);
    if (movedRef.current) return; // it was a drag, not a tap
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const ig = el?.closest("[data-ig]");
    if (ig) {
      window.open(igUrl(ig.getAttribute("data-ig")), "_blank", "noopener");
      return;
    }
    const tile = el?.closest("[data-reel-index]");
    if (tile) openLightbox(Number(tile.getAttribute("data-reel-index")));
  };

  const scrollByCards = (dir) => {
    const vp = viewportRef.current;
    if (vp) vp.scrollBy({ left: vp.clientWidth * 0.8 * dir, behavior: "smooth" });
  };

  return (
    <section className="pt-4 md:pt-5 pb-8 md:pb-10 bg-[#0A0A0A]" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Heading band with Bondi Beach video background */}
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-2xl border border-white/10 mb-8"
          data-testid="story-hero"
        >
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            data-testid="story-bg-video"
          >
            <source src={BG_VIDEO_MP4} type="video/mp4" />
            <source src={BG_VIDEO_MOV} type="video/quicktime" />
          </video>
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40" />

          <div className="relative z-10 text-center py-14 md:py-20 px-6">
            <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Our Origin</p>
            <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6 text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
              The <span className="text-[#00B4D8]">Bondi Wave</span><br/>Story
            </h2>
            <p className="text-neutral-100 text-lg max-w-2xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Born on the shores of Bondi Beach, built for athletes and sleepers everywhere.
            </p>
          </div>
        </motion.div>

        {/* UGC reels carousel */}
        <motion.div {...fadeUp} className="relative mb-8" data-testid="reels-carousel">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#00B4D8] border border-white/20 text-white items-center justify-center transition-colors"
            data-testid="reels-prev"
            aria-label="Previous reels"
          >
            <ChevronLeft size={24} />
          </button>

          <div
            ref={viewportRef}
            className={`reels-scroll flex gap-3 md:gap-4 overflow-x-auto pb-1 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {reels.map((reel, i) => (
              <div
                key={i}
                data-reel-index={i}
                onClick={() => { if (!movedRef.current) openLightbox(i); }}
                className="relative w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] cursor-pointer"
                data-testid={`reel-${i}`}
              >
                <video
                  data-reel
                  src={reel.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover pointer-events-none"
                  aria-label={`Reel from @${reel.handle}`}
                />
                <HandleBubble handle={reel.handle} testid={`reel-handle-${i}`} />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-[#00B4D8] border border-white/20 text-white items-center justify-center transition-colors"
            data-testid="reels-next"
            aria-label="Next reels"
          >
            <ChevronRight size={24} />
          </button>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">2.5km</div>
            <p className="text-neutral-400 text-sm">
              The iconic Bondi to Bronte coastal walk where our run club community discovered the power of nasal breathing.
            </p>
          </div>
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">1M+</div>
            <p className="text-neutral-400 text-sm">
              Yearly visitors to Bondi Beach, one of the world's most famous stretches of coastline and our home.
            </p>
          </div>
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">100%</div>
            <p className="text-neutral-400 text-sm">
              Australian designed. Inspired by the ocean, engineered for athletes who demand more from every breath.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Reel lightbox */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={close}
            data-testid="reel-lightbox"
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-5 right-5 text-white/80 hover:text-white transition-colors z-10"
              data-testid="reel-lightbox-close"
              aria-label="Close video"
            >
              <X size={28} />
            </button>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#00B4D8] border border-white/20 text-white flex items-center justify-center transition-colors"
              data-testid="reel-lightbox-prev"
              aria-label="Previous video"
            >
              <ChevronLeft size={26} />
            </button>

            <motion.div
              key={index}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={lightboxVideoRef}
                src={reels[index].src}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[88vh] w-auto rounded-xl border-[3px] border-[#00B4D8] object-contain bg-black"
                data-testid="reel-lightbox-video"
              />
              <HandleBubble handle={reels[index].handle} testid="reel-lightbox-handle" />
            </motion.div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-[#00B4D8] border border-white/20 text-white flex items-center justify-center transition-colors"
              data-testid="reel-lightbox-next"
              aria-label="Next video"
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
