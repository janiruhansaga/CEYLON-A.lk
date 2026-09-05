/* ==========================================================================
   Sri Lanka Map SVG Drawing & Scroll Zoom Controller
   ========================================================================== */

export function initSriLankaMap() {
  const mapPath = document.getElementById('sri-lanka-path');
  const overlay = document.getElementById('plantation-overlay');
  const section = document.getElementById('sri-lanka');

  if (!mapPath || !section) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          mapPath.classList.add('drawn');
          setTimeout(() => {
            if (overlay) overlay.classList.add('active');
          }, 1200);
        }
      });
    },
    { threshold: 0.3 }
  );

  observer.observe(section);
}
