export const DeliveryBanner = () => {
  return (
    <div className="border-y border-[#00B4D8]/30 py-4 overflow-hidden bg-[#00B4D8]" data-testid="delivery-banner">
      <div className="animate-marquee-reverse flex whitespace-nowrap">
        {[...Array(4)].flatMap((_, j) => [
          <span key={`a${j}`} className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-black mx-8">SAME DAY DELIVERY WITH AMAZON PRIME <span className="text-white">•</span></span>,
          <span key={`b${j}`} className="font-heading text-sm md:text-base uppercase tracking-[0.3em] text-black mx-8">WHILE STOCKS LAST <span className="text-white">•</span></span>,
        ])}
      </div>
    </div>
  );
};
