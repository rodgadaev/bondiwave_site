import { motion } from "framer-motion";
import { fadeUp } from "@/constants";

export const StorySection = () => {
  return (
    <section className="py-8 md:py-10 bg-[#0A0A0A]" data-testid="story-section">
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
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/73b5ntyx_video%201.mp4", alt: "Bondi Beach coastal" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/8u09c6yi_%E2%9C%A8%20Bondi%20to%20Coogee%20Walk%20%E2%80%93%20Sydney%E2%80%99s%20Most%20Scenic%20Coastal%20Hike%21%20%E2%9C%A8%F0%9F%9A%B6_%E2%99%80%EF%B8%8F%206%20km%20-%20%F0%9F%8C%8A%20Breathtaking%20Views%20.mp4", alt: "Bondi to Coogee Walk" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/obpwciku_POV%F0%9F%AB%80-%20You%E2%80%99re%20strolling%20along%20the%20picturesque%20coastal%20walk%20from%20Bronte%20to%20Ben%20Buckler%E2%80%99s%20Point%20in.mp4", alt: "Bronte to Ben Buckler POV" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/955gy3x6_Muita%20sorte%20morar%20em%20um%20lugar%20que%20tem%20essas%20praias%20pertinho%20de%20casa%20e%20uma%20do%20lado%20da%20outra%2C%20com%20.mp4", alt: "Bondi Beach lifestyle" },
            { src: "https://customer-assets.emergentagent.com/job_afa1f63c-426b-4bce-8438-0d015601c035/artifacts/4kt0nt6x_Welcome%20to%E2%80%A6This%20is%20the%20classic%20Bronte%20to%20Bondi%20costal%20walk%20in%20Sydney%20it%E2%80%99s%20one%20of%20the%20most%20iconic.mp4", alt: "Bronte to Bondi coastal walk" },
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
