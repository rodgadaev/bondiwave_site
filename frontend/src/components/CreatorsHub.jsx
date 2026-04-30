import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Instagram, Camera, Film, Image, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { ASSETS, SOCIAL_LINKS } from "@/constants";
import "@/App.css";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }
};

const stagger = (i) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }
});

const HeroVideo = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = false;
      setIsMuted(false);
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  return (
    <div className="relative max-w-sm mx-auto cursor-pointer group" onClick={togglePlay}>
      <div className="absolute -inset-6 bg-[#00B4D8]/15 blur-[80px] rounded-full pointer-events-none" />
      <div className="rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] relative">
        <video
          ref={videoRef}
          src="https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/fhto022v_Captions_5D06D0%20%281%29.mp4"
          playsInline
          muted
          className="w-full h-full object-cover"
          onEnded={() => setIsPlaying(false)}
        />
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-20 h-20 bg-[#00B4D8] rounded-full flex items-center justify-center">
              <Play size={36} className="text-black ml-1" />
            </div>
          </div>
        )}
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2 z-10">
        <button
          onClick={toggleMute}
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>
      </div>
    </div>
  );
};

const contentOptions = [
  {
    icon: Camera,
    title: "A Quick Selfie",
    desc: "Snap a photo in nice lighting wearing the strip. DM it to our Instagram. Simple, easy, and it means the world to us.",
    effort: "Low effort",
  },
  {
    icon: Film,
    title: "30 Second Talking Head",
    desc: "A quick 30-second video review. Just you talking to camera about your experience with the strips. Honest, natural, authentic.",
    effort: "Medium effort",
  },
  {
    icon: Image,
    title: "UGC Video",
    desc: "You, the product, your world. A clip in your element — sport, fashion, a walk. Don't make an ad. Just make it yours. We'll put paid spend behind it.",
    effort: "High impact",
  },
];

const applySteps = [
  { num: "01", title: "Clean & Dry", desc: "Use a cleanser to wash your face to remove oils and dirt" },
  { num: "02", title: "Dry Skin", desc: "Dry skin thoroughly before application" },
  { num: "03", title: "Apply Strip", desc: "Without touching the adhesive part — apply nose strip on the bridge a fraction above your nostrils" },
  { num: "04", title: "Press & Hold", desc: "Once in place hold for 10 seconds, then rub it in to activate the hold" },
];

export default function CreatorsHub() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#050505] border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <a href="/">
            <img src={ASSETS.logo} alt="Bondi Wave" className="h-12 md:h-16" />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-[#00B4D8] transition-colors"
          >
            <Instagram size={20} />
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Exclusive Access</p>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight leading-[0.95]">
              Welcome to the<br/>Bondi Wave<br/><span className="text-[#00B4D8]">Creators Hub</span>
            </h1>
          </motion.div>
          <motion.div {...fadeUp}>
            <HeroVideo />
          </motion.div>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-12 md:py-16 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">What's Inside Your Pack</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Everything You Need
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { num: "01", title: "The Strips", desc: "Premium matte black nasal strips — sweatproof, hypoallergenic, medical-grade adhesive that won't wreck your skin." },
              { num: "02", title: "Scratch-Off Discount", desc: "A scratch-off discount code for your next order and to share with your audience." },
              { num: "03", title: "Personalised Note", desc: "A note written specifically for you, with tailored content ideas based on your profile." },
            ].map((item, i) => (
              <motion.div key={i} {...stagger(i)} className="border border-white/10 p-6 bg-[#050505]">
                <span className="font-mono text-xs text-[#00B4D8] font-bold">{item.num}</span>
                <h3 className="font-heading text-lg font-bold uppercase mt-2 mb-3">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blue divider line */}
      <div className="border-t-2 border-[#00B4D8]" />

      {/* Content Options */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Create With Us</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Three Ways to<br/><span className="text-[#00B4D8]">Collaborate</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contentOptions.map((opt, i) => (
              <motion.div key={i} {...stagger(i)} className="border border-white/10 p-6 bg-[#0A0A0A] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center">
                    <opt.icon className="w-6 h-6 text-[#00B4D8]" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8] border border-[#00B4D8]/30 px-3 py-1">{opt.effort}</span>
                </div>
                <h3 className="font-heading text-xl font-bold uppercase mb-3">{opt.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed flex-1">{opt.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.p {...fadeUp} className="text-center text-neutral-500 text-sm mt-8 max-w-xl mx-auto">
            All options are completely optional. Zero strings. Our priority is that you try these strips and they actually make a difference for you.
          </motion.p>
        </div>
      </section>

      {/* How To Apply */}
      <section className="py-12 md:py-16 bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Important</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
              How to Apply
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Video placeholder */}
            <motion.div {...fadeUp}>
              <div className="rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16] md:aspect-square bg-[#111] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-[#00B4D8]/10 border border-[#00B4D8]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play size={32} className="text-[#00B4D8] ml-1" />
                  </div>
                  <p className="font-heading text-lg font-bold uppercase mb-2">Application Video</p>
                  <p className="text-neutral-500 text-sm">Coming Soon</p>
                </div>
              </div>
            </motion.div>

            {/* Steps */}
            <div className="space-y-0 border border-white/10 divide-y divide-white/10">
              {applySteps.map((step, i) => (
                <motion.div key={i} {...stagger(i)} className="flex items-start gap-4 p-5">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#00B4D8]/10 border border-[#00B4D8]/20 flex items-center justify-center">
                    <span className="font-mono text-xs text-[#00B4D8] font-bold">{step.num}</span>
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold uppercase mb-1">{step.title}</h4>
                    <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Director's Portfolio */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Behind The Lens</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight">
              Director's Portfolio
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-col md:flex-row items-center gap-8 max-w-2xl mx-auto">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-[3px] border-[#00B4D8] flex-shrink-0">
              <img
                src="https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/09fxseh4_000008%20%286%29.jpg"
                alt="Roderick Gadaev - Director"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h3 className="font-heading text-2xl font-bold uppercase mb-1">Roderick Gadaev</h3>
              <p className="font-mono text-xs uppercase tracking-widest text-[#00B4D8] mb-4">Filmmaker & Co-Founder</p>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Nearly a decade in advertising and filmmaking. Rod directs all Bondi Wave creative and is heading up an upcoming TVC shoot.
              </p>
              <div className="border border-white/10 bg-[#0A0A0A] p-4 mb-6 text-left">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#00B4D8] mb-2">TVC Opportunity</p>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Fully paid, MEAA Tier 1 minimums, shooting in Sydney. If you're not based here, we'll fly you out. Working with Rod and a professional crew. This is a great chance for us to see you and the product together.
                </p>
              </div>
              <a
                href="https://www.roderickgadaev.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#00B4D8] text-black font-bold uppercase tracking-wider text-sm px-6 py-3 hover:bg-white transition-colors"
              >
                View Portfolio
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-[#0A0A0A] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp}>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Get In Touch</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
              We'd Love to<br/>Hear From You
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
              Reach out to us with any questions. DM our Instagram any time — we'll get back to you within a couple of hours.
            </p>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#00B4D8] text-black font-bold uppercase tracking-wider px-8 py-4 hover:bg-white transition-colors"
            >
              <Instagram size={20} />
              Message Us on Instagram
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-neutral-600 text-sm">
            © 2026 Bondi Wave. All rights reserved. This page is confidential and intended only for invited creators.
          </p>
        </div>
      </footer>
    </div>
  );
}
