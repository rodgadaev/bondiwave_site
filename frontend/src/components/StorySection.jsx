import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, Instagram, Play, Pause } from "lucide-react";
import Player from "@vimeo/player";
import { fadeUp } from "@/constants";

// Background video for the heading band (1980x817 — wide/thin Bondi Beach clip)
const BG_VIDEO = "https://player.vimeo.com/video/1201275131?background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0";

// UGC creator reels — { src, handle }. The .mov original is served as .mp4 for browser support.
const reels = [
  { src: "https://player.vimeo.com/video/1201272952?h=7eb1fc6d9f&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "benzingtens" },
  { src: "https://player.vimeo.com/video/1201272954?h=6ce80cd54e&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "aliciajane_e" },
  { src: "https://player.vimeo.com/video/1201273179?h=5b36fb870c&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "dane.stewart" },
  { src: "https://player.vimeo.com/video/1201273187?h=707979a8a8&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "chantelleoffical_" },
  { src: "https://player.vimeo.com/video/1201273217?h=5229d487ac&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "b1ll_cheese" },
  { src: "https://player.vimeo.com/video/1201273214?h=844695dc1e&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "samantha_rowney" },
  { src: "https://player.vimeo.com/video/1201272955?h=186833be72&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "joey.robson" },
  { src: "https://player.vimeo.com/video/1201273204?h=733d35154a&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "just_zavier" },
  { src: "https://player.vimeo.com/video/1201273168?h=9c81476efb&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "maddischmierer" },
  { src: "https://player.vimeo.com/video/1201273258?h=3e23746aa7&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "jordansavic" },
  { src: "https://player.vimeo.com/video/1201273129?h=431e9ffa28&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "flynn.fitness" },
  { src: "https://player.vimeo.com/video/1201273186?h=c8c06fda5c&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "skinbyjason" },
  { src: "https://player.vimeo.com/video/1201273088?h=617fb9ba6c&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "calithekid_" },
  { src: "https://player.vimeo.com/video/1201273195?h=1a0cae0150&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "michaelatkinson_" },
  { src: "https://player.vimeo.com/video/1201272982?h=0382eb3e90&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "guillermocristiandias" },
  { src: "https://player.vimeo.com/video/1201273120?h=e2b539048f&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "itsyahomiejacob" },
  { src: "https://player.vimeo.com/video/1201272951?h=44eab30e4b&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "nickl30068" },
  { src: "https://player.vimeo.com/video/1201273308?h=045346ed19&background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0", handle: "mnimoniquee" },
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

// Lazy-loaded reel tile: the Vimeo iframe is only mounted once the tile
// scrolls into view (IntersectionObserver, threshold 0.1). Until then a
// same-sized empty div holds the space.
const ReelTile = ({ reel, i, realIndex, preload }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(preload);

  useEffect(() => {
    if (preload) return; // already mounted eagerly
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [preload]);

  return (
    <div
      ref={ref}
      data-reel-index={realIndex}
      className="relative w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0 mr-3 md:mr-4 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] cursor-pointer"
      data-testid={`reel-${i}`}
    >
      {visible ? (
        <iframe
          data-reel
          src={reel.src}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; playsinline"
          allowFullScreen={true}
          className="w-full h-full object-cover pointer-events-none"
          aria-label={`Reel from @${reel.handle}`}
        />
      ) : (
        <div className="w-full h-full" />
      )}
      <HandleBubble handle={reel.handle} testid={`reel-handle-${i}`} />
    </div>
  );
};

// Expanded lightbox video — its own component so the `loaded` poster state
// resets automatically each time a different reel is opened (keyed remount).
// Uses the Vimeo Player SDK to unmute on open, re-mute on close, and toggle play/pause.
const LightboxVideo = ({ src, innerRef }) => {
  const [paused, setPaused] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const player = new Player(el);
    playerRef.current = player;
    player.setMuted(false).catch(() => {});
    player.play().catch(() => {});
    return () => {
      player.setMuted(true).catch(() => {});
      playerRef.current = null;
    };
  }, [innerRef]);

  const togglePlay = (e) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    if (paused) {
      p.play().catch(() => {});
      setPaused(false);
    } else {
      p.pause().catch(() => {});
      setPaused(true);
    }
  };

  return (
    <div style={{ position: "relative", height: "88vh", aspectRatio: "9 / 16", overflow: "hidden", borderRadius: "0.75rem", border: "3px solid #00B4D8", background: "#000" }}>
      <iframe
        ref={innerRef}
        src={src}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; playsinline"
        allowFullScreen={true}
        data-testid="reel-lightbox-video"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", height: "100%", width: "316.05%", border: "none" }}
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
          <div className="absolute inset-0 overflow-hidden" style={{ containerType: "size" }} aria-hidden="true">
            <iframe
              src={BG_VIDEO}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; playsinline"
              allowFullScreen={true}
              data-testid="story-bg-video"
              style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "177.78cqh", height: "56.25cqw", minWidth: "100%", minHeight: "100%", border: "none" }}
            />
          </div>
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
            <ReelTile key={i} reel={reel} i={i} realIndex={i % REELN} preload={i < 7} />
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
              <LightboxVideo src={reels[index].src} innerRef={lightboxVideoRef} />
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

