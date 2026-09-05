/* ==========================================================================
   Section 05 — Ritual Step Switcher & Steam Canvas Simulation
   ========================================================================== */

export function initRitualExperience() {
  const stepButtons = document.querySelectorAll('.ritual-step-btn');
  const copyBox = document.getElementById('ritual-description');
  const canvas = document.getElementById('steam-canvas');

  const ritualDescriptions = {
    '1': 'Enjoying CEYLONÉA is intentionally simple. Place one cinnamon infusion stick into your ceramic cup and prepare to witness the golden infusion unfold.',
    '2': 'Pour approximately 200ml of freshly boiled water over the infusion stick. Watch the warm water gently activate the fragrant essential oils contained within the bark layers.',
    '3': 'Allow the pure Ceylon cinnamon to gently infuse for 3 to 5 minutes. The delicate sweet aroma will expand, carrying the soothing warmth of Sri Lankan plantations.',
    '4': 'Stir gently with the infusion stick to release the full bouquet of natural Ceylon cinnamon notes into the golden amber liquor.',
    '5': 'Sip and enjoy the pure essence of Ceylon Cinnamon. Unadulterated, soothing, naturally sweet, and crafted beyond borders.'
  };

  stepButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-ritual');

      stepButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (copyBox && ritualDescriptions[step]) {
        copyBox.style.opacity = '0';
        setTimeout(() => {
          copyBox.textContent = ritualDescriptions[step];
          copyBox.style.opacity = '1';
        }, 200);
      }
    });
  });

  // Steam particle canvas simulation
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const particles = [];
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: width * 0.45 + (Math.random() - 0.5) * 60,
        y: height * 0.7 + Math.random() * 50,
        radius: Math.random() * 20 + 10,
        alpha: Math.random() * 0.3 + 0.05,
        speedY: -Math.random() * 0.8 - 0.3,
        speedX: (Math.random() - 0.5) * 0.3
      });
    }

    function renderSteam() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.radius += 0.2;
        p.alpha -= 0.002;

        if (p.alpha <= 0 || p.y < height * 0.1) {
          p.x = width * 0.45 + (Math.random() - 0.5) * 60;
          p.y = height * 0.7;
          p.radius = Math.random() * 15 + 10;
          p.alpha = Math.random() * 0.25 + 0.05;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        grad.addColorStop(0, 'rgba(255, 245, 230, 0.4)');
        grad.addColorStop(1, 'rgba(255, 245, 230, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      requestAnimationFrame(renderSteam);
    }

    renderSteam();

    window.addEventListener('resize', () => {
      if (canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = canvas.parentElement.clientHeight;
      }
    });
  }
}
