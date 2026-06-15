import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Instagram, Play, Pause } from "lucide-react";
import { fadeUp } from "@/constants";

// Background video for the heading band (wide/thin Bondi Beach clip).
// Compressed mp4 served as a static asset (correct video/mp4 MIME + byte-range
// support for iOS Safari).
const BG_VIDEO = "/videos/bondi-beach-bg.mp4";
const BG_POSTER = "/videos/posters/bondi-beach-bg.jpg";

// UGC creator reels — { file, handle }. Compressed mp4s + first-frame poster
// jpgs are served locally from /public/videos. Tiles show the poster only; the
// full clip loads on demand in the lightbox.
const vid = (file) => `/videos/${file}.mp4`;
const poster = (file) => `/videos/posters/${file}.jpg`;
const reels = [
  { file: "benzingtens", handle: "benzingtens" },
  { file: "aliciajane_e", handle: "aliciajane_e" },
  { file: "dane_stewart", handle: "dane.stewart" },
  { file: "chantelleoffical_", handle: "chantelleoffical_" },
  { file: "b1ll_cheese", handle: "b1ll_cheese" },
  { file: "samantha_rowney", handle: "samantha_rowney" },
  { file: "joey_robson", handle: "joey.robson" },
  { file: "just_zavier", handle: "just_zavier" },
  { file: "maddischmierer", handle: "maddischmierer" },
  { file: "jordansavic", handle: "jordansavic" },
  { file: "flynn_fitness", handle: "flynn.fitness" },
  { file: "skinbyjason", handle: "skinbyjason" },
  { file: "calithekid_", handle: "calithekid_" },
  { file: "michaelatkinson_", handle: "michaelatkinson_" },
  { file: "guillermocristiandias", handle: "guillermocristiandias" },
  { file: "itsyahomiejacob", handle: "itsyahomiejacob" },
  { file: "nickl30068", handle: "nickl30068" },
  { file: "mnimoniquee", handle: "mnimoniquee" },
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

// Reel tile — shows the clip's first-frame poster image with a play button.
// No video is fetched here (keeps mobile load fast); tapping opens the lightbox
// where the actual mp4 loads and plays.
const ReelTile = ({ reel, i, realIndex }) => {
  return (
    <div
      data-reel-index={realIndex}
      className="relative w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0 mr-3 md:mr-4 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] cursor-pointer"
      data-testid={`reel-${i}`}
    >
      <img
        data-reel
        src={poster(reel.file)}
        alt={`Reel from @${reel.handle}`}
        loading="lazy"
        draggable="false"
        className="pointer-events-none"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <span className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/70 flex items-center justify-center shadow-lg">
          <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5 text-[#00B4D8] fill-[#00B4D8]" />
        </span>
      </div>
      <HandleBubble handle={reel.handle} testid={`reel-handle-${i}`} />
    </div>
  );
};

// Expanded lightbox video — native <video>, unmuted on open with a pause/play toggle.
const LightboxVideo = ({ src, poster, innerRef }) => {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const v = innerRef.current;
    if (!v) return;
    v.muted = false;
    v.play?.().catch(() => {});
  }, [innerRef]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const v = innerRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      setPaused(false);
    } else {
      v.pause();
      setPaused(true);
    }
  };

  return (
    <div style={{ position: "relative", height: "88vh", aspectRatio: "9 / 16", overflow: "hidden", borderRadius: "0.75rem", border: "3px solid #00B4D8", background: "#000" }}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <video
        ref={innerRef}
        src={src}
        poster={poster}
        autoPlay
        loop
        playsInline
        preload="auto"
        data-testid="reel-lightbox-video"
        style={{ position: "absolute", inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <button
        type="button"
        onClick={togglePlay}
        className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300"
        data-testid="reel-lightbox-toggle"
        aria-label={paused ? "Play video" : "Pause video"}
      >
        {paused
          ? <Play className="w-5 h-5 ml-0.5 text-[#00B4D8] fill-[#00B4D8]" />
          : <Pause className="w-5 h-5 text-[#00B4D8] fill-[#00B4D8]" />}
      </button>
    </div>
  );
};

export const StorySection = () => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const lightboxVideoRef = useRef(null);
  const bgVideoRef = useRef(null);
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

  const openLightbox = useCallback((i) => { openRef.current = true; setIndex(i); }, []);
  const close = useCallback(() => {
    openRef.current = false;
    setIndex(null);
  }, []);
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

  // Play the heading-band background video only while it's in view. Mobile
  // browsers throttle offscreen autoplay (the attribute alone is unreliable),
  // and preload="none" keeps the ~5MB clip from competing during initial load.
  useEffect(() => {
    const v = bgVideoRef.current;
    if (!v) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) v.play?.().catch(() => {});
          else v.pause?.();
        });
      },
      { threshold: 0.1 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // Lightbox open: keyboard nav (Esc / arrows)
  useEffect(() => {
    if (index === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, close, prev, next]);

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
            ref={bgVideoRef}
            src={BG_VIDEO}
            poster={BG_POSTER}
            muted
            loop
            playsInline
            preload="none"
            data-testid="story-bg-video"
            aria-hidden="true"
            className="absolute inset-0"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
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
          {[...reels, ...reels].map((reel, i) => (
            <ReelTile key={i} reel={reel} i={i} realIndex={i % REELN} />
          ))}
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
              <LightboxVideo src={vid(reels[index].file)} poster={poster(reels[index].file)} innerRef={lightboxVideoRef} />
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

