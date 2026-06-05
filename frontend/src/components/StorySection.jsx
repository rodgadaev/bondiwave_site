import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fadeUp } from "@/constants";

// Background video for the heading band (1980x817 — wide/thin Bondi Beach clip)
const BG_VIDEO_MP4 = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mp4";
const BG_VIDEO_MOV = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780626135/bondi_beach_video_mqiepg.mov";

// Reels — extend this array to 18 once the links are provided.
const reels = [
  { src: "/videos/story-bondi-beach.mp4", alt: "Bondi Beach coastal" },
  { src: "/videos/story-bondi-coogee.mp4", alt: "Bondi to Coogee Walk" },
  { src: "/videos/story-bronte-buckler.mp4", alt: "Bronte to Ben Buckler POV" },
  { src: "/videos/story-bondi-lifestyle.mp4", alt: "Bondi Beach lifestyle" },
  { src: "/videos/story-bronte-bondi.mp4", alt: "Bronte to Bondi coastal walk" },
];

export const StorySection = () => {
  const viewportRef = useRef(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startScrollRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

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

  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return; // touch uses native scroll
    draggingRef.current = true;
    startXRef.current = e.clientX;
    startScrollRef.current = viewportRef.current.scrollLeft;
    setIsDragging(true);
    viewportRef.current.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    viewportRef.current.scrollLeft = startScrollRef.current - (e.clientX - startXRef.current);
  };
  const onPointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setIsDragging(false);
    viewportRef.current.releasePointerCapture?.(e.pointerId);
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
          {/* Darkening overlay for text legibility */}
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

        {/* Reels carousel */}
        <motion.div {...fadeUp} className="relative mb-8" data-testid="reels-carousel">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-[#00B4D8] border border-white/20 text-white items-center justify-center transition-colors"
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
            {reels.map((video, i) => (
              <div
                key={i}
                className="w-[150px] sm:w-[180px] md:w-[220px] flex-shrink-0 rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16]"
                data-testid={`reel-${i}`}
              >
                <video
                  data-reel
                  src={video.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover pointer-events-none"
                  aria-label={video.alt}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/60 hover:bg-[#00B4D8] border border-white/20 text-white items-center justify-center transition-colors"
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
    </section>
  );
};
