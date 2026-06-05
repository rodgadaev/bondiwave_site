import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { fadeUp } from "@/constants";

const VIDEO = "https://res.cloudinary.com/db7phqm4y/video/upload/v1780632559/how_to_apply_uneoyu.mp4";
const COVER = "https://res.cloudinary.com/db7phqm4y/image/upload/v1780633621/how_to_apply_cover_qne8bh.png";
const LEFT_IMG = "https://res.cloudinary.com/db7phqm4y/image/upload/v1780632634/yoga_4x5_m8xoiv.png";
const RIGHT_IMG = "https://res.cloudinary.com/db7phqm4y/image/upload/v1780632633/crouching_4x5_clr6vy.png";

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

const Frame = ({ children, className = "" }) => (
  <div className={`relative w-full aspect-[4/5] rounded-2xl border-[3px] border-[#00B4D8] overflow-hidden bg-black ${className}`}>
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
    <span className={`${size === "lg" ? "w-16 h-16 md:w-20 md:h-20" : "w-10 h-10"} rounded-full bg-[#00B4D8]/90 group-hover:bg-[#00B4D8] flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110`}>
      <Play className={`${size === "lg" ? "w-7 h-7 md:w-9 md:h-9 ml-1" : "w-5 h-5 ml-0.5"} text-white fill-white`} />
    </span>
  </button>
);

export const HowToApply = () => {
  const [started, setStarted] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);

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

  // Play (with sound) once revealed — within the click gesture
  useEffect(() => {
    if (started && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play?.().catch(() => {});
    }
  }, [started]);

  const VideoEl = (
    <video
      ref={videoRef}
      src={VIDEO}
      poster={COVER}
      autoPlay
      controls
      loop
      playsInline
      className="w-full h-full object-cover"
      data-testid="how-video"
    />
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
                <Frame className="rounded-xl border-[3px]">{VideoEl}</Frame>
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
              style={{ flexGrow: started ? 1.9 : 1.2, flexBasis: 0 }}
              data-testid="how-center"
            >
              <Frame>
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
