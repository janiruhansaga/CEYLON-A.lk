/* ==========================================================================
   Section 04 — Soil to Cup Sticky Vertical Storyteller
   ========================================================================== */

export function initJourneyStoryline() {
  const stageItems = document.querySelectorAll('.journey-stage-item');
  const visualFrames = document.querySelectorAll('.journey-visual-frame');

  if (!stageItems.length || !visualFrames.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stepNum = entry.target.getAttribute('data-step');

          // Highlight current active text stage
          stageItems.forEach(item => item.classList.remove('active'));
          entry.target.classList.add('active');

          // Switch active visual frame
          visualFrames.forEach(frame => {
            if (frame.getAttribute('data-stage') === stepNum) {
              frame.classList.add('active');
            } else {
              frame.classList.remove('active');
            }
          });
        }
      });
    },
    { threshold: 0.6 }
  );

  stageItems.forEach(item => observer.observe(item));
}
