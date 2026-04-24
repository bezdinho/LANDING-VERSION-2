(() => {
  // Reveal on scroll — very small, idempotent observer.
  const reveals = document.querySelectorAll(".reveal");
  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (reduce) {
    reveals.forEach(el => el.classList.add("in-view"));
    return;
  }

  // Immediately reveal anything already on-screen at load — avoids flashes
  // and makes printouts / headless captures reliable.
  const revealIfVisible = (el) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh + 120) el.classList.add("in-view");
  };
  reveals.forEach(revealIfVisible);

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach(el => { if (!el.classList.contains("in-view")) io.observe(el); });

  // Safety net: guarantee reveal within 1.5s even if the observer never fires.
  setTimeout(() => reveals.forEach(el => el.classList.add("in-view")), 1500);

  // Nav background opacity shift as the page scrolls past the hero.
  const nav = document.querySelector(".nav__inner");
  if (nav) {
    const onScroll = () => {
      const y = window.scrollY;
      nav.style.background = y > 60
        ? "rgba(10,10,11,0.78)"
        : "rgba(12,12,14,0.55)";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
