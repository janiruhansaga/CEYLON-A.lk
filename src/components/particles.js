/* ==========================================================================
   Hero Canvas Ambient Gold Particles & Dust Engine
   ========================================================================== */

export function initHeroParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor(width / 15), 70);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.goldHue = Math.random() > 0.3 ? '#C9A865' : '#E8D098';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.005;

      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.y = height + 10;
        this.x = Math.random() * width;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0.1, Math.min(0.8, this.alpha));
      ctx.fillStyle = this.goldHue;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#C9A865';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let animationFrameId;

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}
