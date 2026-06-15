import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import Player from "@vimeo/player";
import { fadeUp } from "@/constants";

const VIDEO = "https://player.vimeo.com/video/1201275764?background=1&autoplay=1&loop=1&muted=1";
const COVER = "https://ik.imagekit.io/bondiwave/How%20To%20Apply%20section/how_to_apply_cover_qne8bh.png?updatedAt=1781482990540";
const LEFT_IMG = "/images/how to apply/yoga 4x5.png";
const RIGHT_IMG = "/images/how to apply/crouching 4x5.png";

const steps = [
  "Wash face and nose with cleanser",
  "Dry face thoroughly",
  "Peel and stick slightly above your nostrils",
  "Press into place for 10 seconds",
  "Rub the strip into your skin strongly with circular and jagged motions.",
];

const StepBox = ({ n, text, active, testid, className = "" }) => (
  <div
    data-testid={testid}
    className={`flex items-start gap-3 md:gap-4 rounded-2xl border-2 p-3 md:p-5 transition-colors duration-500 ${
      active ? "bg-[#00B4D8] border-[#00B4D8]" : "bg-[#050505] border-[#00B4D8]/40"
    } ${className}`}
  >
    <div className={`font-heading text-2xl md:text-4xl font-bold leading-none flex-shrink-0 ${active ? "text-black" : "text-[#00B4D8]"}`}>
      {n}
    </div>
    <div>
      <p className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${active ? "text-white/80" : "text-[#00B4D8]"}`}>Step {n}</p>
      <p className={`text-xs md:text-base leading-snug ${active ? "text-white" : "text-neutral-300"}`}>{text}</p>
    </div>
  </div>
);

const Frame = ({ children, className = "", aspect = "aspect-[4/5]" }) => (
  <div className={`relative w-full ${aspect} rounded-2xl border-[3px] border-[#00B4D8] overflow-hidden bg-black transition-[aspect-ratio] duration-700 ease-in-out ${className}`}>
    {children}
  </div>
);

const PlayButton = ({ onClick, testid, size = "lg" }) => (
  <button
    onClick={onClick}
    className="absolute inset-0 flex items-center justify-center group"
    data-testid={testid}
    aria-label="Play how to apply video"
  >
    <span className={`${size === "lg" ? "w-11 h-11 md:w-12 md:h-12" : "w-9 h-9"} rounded-full bg-white/70 group-hover:bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110`}>
      <Play className={`${size === "lg" ? "w-4 h-4 md:w-5 md:h-5 ml-0.5" : "w-4 h-4 ml-0.5"} text-[#00B4D8] fill-[#00B4D8]`} />
    </span>
  </button>
);

export const HowToApply = () => {
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [paused, setPaused] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Loop the blue highlight through steps 1 → 5
  useEffect(() => {
    if (!started) return;
    const id = setInterval(() => setActiveStep((p) => (p + 1) % steps.length), 1500);
    return () => clearInterval(id);
  }, [started]);

  // Attach the Vimeo Player API once the video is revealed (enables pause/play + unmute)
  useEffect(() => {
    if (started && videoRef.current && !playerRef.current) {
      const p = new Player(videoRef.current);
      playerRef.current = p;
      p.setMuted(false).catch(() => {});
    }
  }, [started]);

  const togglePlay = () => {
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

  const VideoEl = (
    <div style={{ position: "relative", width: "100%", aspectRatio: "9 / 16", overflow: "hidden" }}>
      <iframe
        ref={videoRef}
        src={VIDEO}
        frameBorder="0"
        allow="autoplay; fullscreen"
        data-testid="how-video"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", height: "100%", width: "316.05%", border: "none" }}
      />
      <button
        type="button"
        onClick={togglePlay}
        className="absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full bg-white/70 hover:bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all duration-300"
        data-testid="how-video-toggle"
        aria-label={paused ? "Play video" : "Pause video"}
      >
        {paused
          ? <Play className="w-4 h-4 ml-0.5 text-[#00B4D8] fill-[#00B4D8]" />
          : <Pause className="w-4 h-4 text-[#00B4D8] fill-[#00B4D8]" />}
      </button>
    </div>
  );

  return (
    <section className="py-8 md:py-10 bg-[#050505]" data-testid="how-to-apply-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {isMobile ? (
          /* ---------- Mobile ---------- */
          <motion.div {...fadeUp}>
            {!started ? (
              <div className="grid grid-cols-3 gap-3" data-testid="how-mobile-teaser">
                <Frame className="rounded-xl border-[3px]">
                  <img src={LEFT_IMG} alt="Yoga breathing" className="w-full h-full object-cover" loading="lazy" />
                </Frame>
                <Frame className="rounded-xl border-[3px]">
                  <img src={COVER} alt="How to apply Bondi Wave" className="w-full h-full object-cover" loading="lazy" />
                  <PlayButton onClick={() => setStarted(true)} testid="how-play-button" size="sm" />
                </Frame>
                <Frame className="rounded-xl border-[3px]">
                  <img src={RIGHT_IMG} alt="Athlete crouching" className="w-full h-full object-cover" loading="lazy" />
                </Frame>
              </div>
            ) : (
              <div className="space-y-4">
                <Frame className="rounded-xl border-[3px] max-w-[270px] mx-auto" aspect="aspect-[9/16]">{VideoEl}</Frame>
                <div className="space-y-3">
                  {steps.map((t, i) => (
                    <StepBox key={i} n={i + 1} text={t} active={activeStep === i} testid={`how-step-${i + 1}`} />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ---------- Desktop ---------- */
          <motion.div {...fadeUp} className="flex gap-4 md:gap-6 items-stretch">
            {/* Left */}
            <div
              className="transition-[flex-grow] duration-700 ease-in-out min-w-0"
              style={{ flexGrow: started ? 1 : 1.2, flexBasis: 0 }}
              data-testid="how-left"
            >
              {!started ? (
                <Frame>
                  <img src={LEFT_IMG} alt="Yoga breathing" className="w-full h-full object-cover" loading="lazy" />
                </Frame>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="h-full flex flex-col gap-4">
                  <StepBox n={1} text={steps[0]} active={activeStep === 0} testid="how-step-1" className="flex-1 items-center" />
                  <StepBox n={2} text={steps[1]} active={activeStep === 1} testid="how-step-2" className="flex-1 items-center" />
                </motion.div>
              )}
            </div>

            {/* Center */}
            <div
              className="transition-[flex-grow] duration-700 ease-in-out min-w-0"
              style={{ flexGrow: started ? 1.9 : 1.2, flexBasis: 0, maxWidth: started ? 320 : "none" }}
              data-testid="how-center"
            >
              <Frame aspect={started ? "aspect-[9/16]" : "aspect-[4/5]"}>
                {!started ? (
                  <>
                    <img src={COVER} alt="How to apply Bondi Wave" className="w-full h-full object-cover" loading="lazy" />
                    <PlayButton onClick={() => setStarted(true)} testid="how-play-button" size="lg" />
                  </>
                ) : (
                  VideoEl
                )}
              </Frame>
            </div>

            {/* Right */}
            <div
              className="transition-[flex-grow] duration-700 ease-in-out min-w-0"
              style={{ flexGrow: started ? 1 : 1.2, flexBasis: 0 }}
              data-testid="how-right"
            >
              {!started ? (
                <Frame>
                  <img src={RIGHT_IMG} alt="Athlete crouching" className="w-full h-full object-cover" loading="lazy" />
                </Frame>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="h-full flex flex-col gap-4">
                  <StepBox n={3} text={steps[2]} active={activeStep === 2} testid="how-step-3" className="flex-1 items-center" />
                  <StepBox n={4} text={steps[3]} active={activeStep === 3} testid="how-step-4" className="flex-1 items-center" />
                  <StepBox n={5} text={steps[4]} active={activeStep === 4} testid="how-step-5" className="flex-1 items-center" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
