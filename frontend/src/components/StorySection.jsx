import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Instagram } from "lucide-react";
import { fadeUp } from "@/constants";

// Background video for the heading band (1980x817 — wide/thin Bondi Beach clip)
const BG_VIDEO_MP4 = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mp4";
const BG_VIDEO_MOV = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mov";

// UGC creator reels — { src, handle }. The .mov original is served as .mp4 for browser support.
const reels = [
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/benzingtens-UGC.mp4?updatedAt=1781482413564", handle: "benzingtens" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/aliciajane_e-UGC.mp4?updatedAt=1781482526409", handle: "aliciajane_e" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/dane.stewart_UGC.mp4?updatedAt=1781482400889", handle: "dane.stewart" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/chantelleoffical_-UGC.mp4?updatedAt=1781482394520", handle: "chantelleoffical_" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/b1ll_cheese-UGC.MP4?updatedAt=1781482511157", handle: "b1ll_cheese" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/samantha_rowney-UGC.MP4?updatedAt=1781482517495", handle: "samantha_rowney" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/joey.robson-UGC.MP4?updatedAt=1781482518549", handle: "joey.robson" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/just_zavier-UGC.MP4?updatedAt=1781482498736", handle: "just_zavier" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/maddischmierer-UGC.MP4?updatedAt=1781482512967", handle: "maddischmierer" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/jordansavic-UGC.MP4?updatedAt=1781482507258", handle: "jordansavic" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/flynn.fitness-UGC.MP4?updatedAt=1781482445721", handle: "flynn.fitness" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/skinbyjason-UGC.mp4?updatedAt=1781482410124", handle: "skinbyjason" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/calithekid_-UGC.mp4?updatedAt=1781482401628", handle: "calithekid_" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/michaelatkinson_-UGC.mp4?updatedAt=1781482401615", handle: "michaelatkinson_" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/guillermocristiandias-UGC.MP4?updatedAt=1781482478838", handle: "guillermocristiandias" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/itsyahomiejacob-UGC.MP4?updatedAt=1781482451429", handle: "itsyahomiejacob" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/nickl30068-UGC.MP4?updatedAt=1781482528973", handle: "nickl30068" },
  { src: "https://ik.imagekit.io/bondiwave/bondiwave%20UGC/mnimoniquee-UGC.mov/ik-video.mp4?updatedAt=1781482505693", handle: "mnimoniquee" },
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
  const trackRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const hoverRef = useRef(false);
  const openRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [index, setIndex] = useState(null); // lightbox index or null

  const pauseReels = useCallback(() => {
    viewportRef.current?.querySelectorAll("video[data-reel]").forEach((v) => v.pause());
  }, []);
  const playVisibleReels = useCallback(() => {
    viewportRef.current?.querySelectorAll("video[data-reel]").forEach((v) => v.play?.().catch(() => {}));
  }, []);

  const openLightbox = useCallback((i) => { openRef.current = true; setIndex(i); }, []);
  const close = useCallback(() => {
    openRef.current = false;
    setIndex(null);
    playVisibleReels();
  }, [playVisibleReels]);
  const prev = useCallback(() => setIndex((i) => (i === null ? i : (i - 1 + REELN) % REELN)), []);
  const next = useCallback(() => setIndex((i) => (i === null ? i : (i + 1) % REELN)), []);

  // Auto-rotation via GPU transform + wheel/drag scrubbing with a seamless
  // infinite loop (duplicated track + wrap), identical to the Reviews carousel.
  // Pauses on hover / drag / lightbox open.
  useEffect(() => {
    const vp = viewportRef.current;
    const track = trackRef.current;
    if (!vp || !track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const speed = reduce ? 0 : 0.3;

    const computeHalf = () => {
      const md = window.matchMedia("(min-width: 768px)").matches;
      const sm = window.matchMedia("(min-width: 640px)").matches;
      const cardW = md ? 220 : sm ? 180 : 150;
      const gap = md ? 16 : 12;
      halfRef.current = REELN * (cardW + gap);
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
    vp.addEventListener("wheel", onWheel, { passive: false });

    let raf;
    const tick = () => {
      const paused = hoverRef.current || draggingRef.current || openRef.current;
      if (!paused && speed > 0) offsetRef.current += speed;
      wrap();
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", computeHalf);
      vp.removeEventListener("wheel", onWheel);
    };
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
    draggingRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    setIsDragging(true);
    viewportRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) > 5) movedRef.current = true;
    offsetRef.current = startOffsetRef.current - dx;
  };
  const finishDrag = (e, allowTap) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    viewportRef.current.releasePointerCapture?.(e.pointerId);
    if (!allowTap || movedRef.current) return; // drag or cancelled gesture → not a tap
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const ig = el?.closest("[data-ig]");
    if (ig) {
      window.open(igUrl(ig.getAttribute("data-ig")), "_blank", "noopener");
      return;
    }
    const tile = el?.closest("[data-reel-index]");
    if (tile) openLightbox(Number(tile.getAttribute("data-reel-index")));
  };
  const onPointerUp = (e) => finishDrag(e, true);
  const onPointerCancel = (e) => finishDrag(e, false);

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

      </div>

      {/* UGC reels carousel — full-bleed, seamless infinite loop (matches Reviews) */}
      <div
        ref={viewportRef}
        className={`w-full overflow-hidden px-6 md:px-12 select-none mb-8 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        data-testid="reels-carousel"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onMouseEnter={() => { hoverRef.current = true; }}
        onMouseLeave={() => { hoverRef.current = false; }}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          {[...reels, ...reels].map((reel, i) => {
            const realIndex = i % REELN;
            return (
              <div
                key={i}
                data-reel-index={realIndex}
                className="relative w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0 mr-3 md:mr-4 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] cursor-pointer"
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
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">2.5km</div>
            <p className="text-neutral-400 text-sm">
              The iconic Bondi to Bronte coastal walk where our run club community discovered the power of nasal breathing.
            </p>
          </div>
          <div className="bg-[#050505] border border-white/5 rounded-lg p-6 text-center">
            <div className="font-heading text-3xl font-bold text-[#00B4D8] mb-2">200+</div>
            <p className="text-neutral-400 text-sm">
              A community growing rapidly — from Bondi, to Sydney, to all of Australia and beyond. And we're only just getting started.
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
