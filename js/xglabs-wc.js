/* ============================================================
   XGLabs WC — Dark Pulse Scripts
   v5.25-WC · Reloj ART + partículas doradas + parallax hero
   Repo: emanuelmpereyra-source/xglabs-assets
   Ruta sugerida: /js/xglabs-wc.js
   ============================================================ */

/* ===== RELOJ ART (UTC-3) — Formato "HH:MM ART DD/MM/YY" ===== */
function updateClock() {
  const now = new Date();
  const art = new Date(now.getTime() - (now.getTimezoneOffset() + 180) * 60000);
  const pad = n => String(n).padStart(2, '0');
  const yy = String(art.getUTCFullYear()).slice(-2);
  const el = document.getElementById('header-datetime');
  if (el) {
    el.textContent =
      `${pad(art.getUTCHours())}:${pad(art.getUTCMinutes())} ART        ${pad(art.getUTCDate())}/${pad(art.getUTCMonth() + 1)}/${yy}`;
  }
}
updateClock();
setInterval(updateClock, 1000);

/* ===== PARALLAX HERO AL SCROLL ===== */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroBg.style.transform = `scale(1.08) translateY(${scrollY * 0.25}px)`;
  }, { passive: true });
})();

/* ===== CANVAS PARTICULAS DORADAS (#ffb300) ===== */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const hero = document.querySelector('.jornada-hero');
  if (!canvas || !hero) return;

  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = 38;
  let particles = [];
  let width = 0;
  let height = 0;

  function resizeCanvas() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: height + Math.random() * 40,
      size: 1.2 + Math.random() * 2.0,          // 1.2 - 3.2px
      speed: 0.18 + Math.random() * 0.37,        // 0.18 - 0.55
      baseOpacity: 0.25 + Math.random() * 0.40,  // 0.25 - 0.65
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 1.2,
    };
  }

  function initField() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());
  }

  function draw() {
    if (width === 0 || height === 0) {
      requestAnimationFrame(draw);
      return;
    }
    ctx.clearRect(0, 0, width, height);
    const t = performance.now() / 1000;

    for (const p of particles) {
      const pulse = (Math.sin(t * p.pulseSpeed + p.phase) + 1) / 2; // 0..1
      const opacity = p.baseOpacity * (0.6 + 0.4 * pulse);

      // Halo dorado radial
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
      halo.addColorStop(0, `rgba(255,179,0,${(0.22 * opacity).toFixed(3)})`);
      halo.addColorStop(1, 'rgba(255,179,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
      ctx.fill();

      // Núcleo de la partícula
      ctx.fillStyle = `rgba(255,179,0,${opacity.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      // Sube desde el pie del hero
      p.y -= p.speed;
      if (p.y < -10) {
        p.x = Math.random() * width;
        p.y = height + Math.random() * 30;
      }
    }

    requestAnimationFrame(draw);
  }

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      resizeCanvas();
      initField();
    });
    ro.observe(hero);
  } else {
    window.addEventListener('resize', () => {
      resizeCanvas();
      initField();
    });
  }

  resizeCanvas();
  initField();
  requestAnimationFrame(draw);
})();
