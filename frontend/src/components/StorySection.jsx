import { motion } from "framer-motion";
import { fadeUp } from "@/constants";

export const StorySection = () => {
  return (
    <section className="pt-4 md:pt-5 pb-8 md:pb-10 bg-[#0A0A0A]" data-testid="story-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div {...fadeUp} className="text-center mb-8">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#00B4D8] mb-4">Our Origin</p>
          <h2 className="font-heading text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6">
            The <span className="text-[#00B4D8]">Bondi Wave</span><br/>Story
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Born on the shores of Bondi Beach, built for athletes everywhere.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-5 gap-3 md:gap-4 mb-8">
          {[
            { src: "/videos/story-bondi-beach.mp4", alt: "Bondi Beach coastal" },
            { src: "/videos/story-bondi-coogee.mp4", alt: "Bondi to Coogee Walk" },
            { src: "/videos/story-bronte-buckler.mp4", alt: "Bronte to Ben Buckler POV" },
            { src: "/videos/story-bondi-lifestyle.mp4", alt: "Bondi Beach lifestyle" },
            { src: "/videos/story-bronte-bondi.mp4", alt: "Bronte to Bondi coastal walk" },
          ].map((video, i) => (
            <div key={i} className="rounded-xl overflow-hidden border-[3px] border-[#00B4D8] aspect-[9/16]">
              <video
                src={video.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          ))}
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
