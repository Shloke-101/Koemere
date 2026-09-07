const revealEls = document.querySelectorAll('.reveal:not(.in)');
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 90);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
revealEls.forEach(el => io.observe(el));

let ticking = false;
const parallaxEls = document.querySelectorAll('.hero-watermark-wrap, .archive-watermark, .foot-watermark, .page-intro-watermark');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        parallaxEls.forEach(el => { el.style.transform = `translateY(${y * 0.06}px)`; });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
