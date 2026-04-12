export const SleepRecovery = () => {
  return (
    <section className="relative mt-8 md:mt-0" data-testid="sleep-section">
      <div className="hidden md:block absolute inset-0 bg-[#00B4D8]/15 blur-[100px] pointer-events-none" />
      <div className="relative w-full overflow-hidden">
        <img
          src="/images/A+ Basic Content.webp"
          alt="Recover Faster, Sleep Deeper - Bondi Wave"
          className="w-full block object-cover relative z-10"
          style={{ width: '100%', display: 'block' }}
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
};
