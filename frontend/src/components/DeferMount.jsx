import { useState, useRef, useEffect } from "react";

// Mounts its children only once they're about to scroll into view.
// Keeps heavy below-the-fold sections (carousels, videos, large image grids)
// out of the initial render so the hero paints fast on mobile. Once mounted,
// the content stays mounted (no re-hiding) and the placeholder height is dropped.
export const DeferMount = ({ children, minHeight = 400, rootMargin = "600px" }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show, rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
};
