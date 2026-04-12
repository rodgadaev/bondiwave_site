export const Marquee = () => {
  const items = ["LATEX FREE", "HYPO ALLERGENIC", "MEDICAL GRADE", "SWEAT PROOF", "12HR USE", "INSTANT RESULTS", "NEXT DAY DELIVERY"];
  
  return (
    <div className="border-y border-white/10 py-4 overflow-hidden bg-[#0A0A0A]">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span key={i} className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-white/60 mx-8">
            {item} <span className="text-[#00B4D8]">•</span>
          </span>
        ))}
      </div>
    </div>
  );
};
