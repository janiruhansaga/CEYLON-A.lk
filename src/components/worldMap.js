/* ==========================================================================
   Section 06 — Beyond Borders Animated World Map Arcs
   ========================================================================== */

export function initWorldMapArcs() {
  const section = document.getElementById('beyond-borders');
  const arcLines = document.querySelectorAll('.arc-line');

  if (!section || !arcLines.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          arcLines.forEach((line, index) => {
            setTimeout(() => {
              line.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
              line.style.strokeDashoffset = '0';
            }, index * 300);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}
