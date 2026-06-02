/* ============================================================
   IRON ROAD — Main JS
   Navigation, GSAP animations, global utilities
   ============================================================ */

// ─── Nav scroll behavior ──────────────────────────────────
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // Scroll state
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 40);
    nav.style.transform = (y > lastY && y > 120) ? 'translateY(-100%)' : '';
    lastY = y;
  }, { passive: true });

  // Active link
  const links = nav.querySelectorAll('.nav-link');
  const page = location.pathname.split('/').pop() || 'index.html';
  links.forEach(l => {
    const href = l.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      l.classList.add('active');
    }
  });

  // Mobile drawer
  const hamburger = nav.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  const overlay   = document.querySelector('.nav-overlay');

  function openDrawer() {
    drawer?.classList.add('open');
    overlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    drawer?.classList.remove('open');
    overlay?.classList.remove('open');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', openDrawer);
  overlay?.addEventListener('click', closeDrawer);
  drawer?.querySelector('.nav-drawer-close')?.addEventListener('click', closeDrawer);
  drawer?.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', closeDrawer));

  // Tab switching
  drawer?.querySelectorAll('.nav-drawer-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      drawer.querySelectorAll('.nav-drawer-tab').forEach(t => t.classList.remove('active'));
      drawer.querySelectorAll('.nav-drawer-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      drawer.querySelector('.nav-drawer-panel[data-panel="' + tab.dataset.tab + '"]')?.classList.add('active');
    });
  });
})();

// ─── GSAP Animations ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero entrance
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  heroTimeline
    .from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.6, delay: 0.2 })
    .from('.hero-title', { y: 40, opacity: 0, duration: 0.9 }, '-=0.3')
    .from('.hero-sub', { y: 20, opacity: 0, duration: 0.6 }, '-=0.5')
    .from('.hero-actions', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4')
    .from('.hero-stats', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');

  // Scroll reveals
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Staggered grid reveals
  gsap.utils.toArray('.stagger-parent').forEach(parent => {
    const children = parent.querySelectorAll('.stagger-child');
    gsap.from(children, {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%'
      }
    });
  });

  // Counter animation
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter() {
        gsap.from({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].val).toLocaleString() + suffix; }
        });
      }
    });
  });

  // Parallax on sections with [data-parallax]
  document.querySelectorAll('[data-parallax]').forEach(el => {
    gsap.to(el, {
      y: el.dataset.parallax || '-20%',
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // Nav transition
  gsap.from('.nav', { y: -80, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
});

// ─── Auth nav injection (Firebase pages load auth.js separately) ─
document.addEventListener('DOMContentLoaded', () => {
  if (typeof pdnInitNavAuth === 'function') pdnInitNavAuth();
});

// ─── Toast notification ───────────────────────────────────
function showToast(msg, icon = '●') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="toast-dot"></span><span>${msg}</span>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3200);
}

// ─── Save truck toggle ────────────────────────────────────
function initSaveButtons() {
  document.querySelectorAll('[data-save]').forEach(btn => {
    const id = btn.dataset.save;
    if (typeof Saved !== 'undefined' && Saved.has(id)) btn.classList.add('saved');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (typeof Saved === 'undefined') return;
      const now = Saved.toggle(id);
      btn.classList.toggle('saved', now);
      showToast(now ? 'Truck saved to your list' : 'Removed from saved trucks');
    });
  });
}

// ─── Quick search ─────────────────────────────────────────
function initQuickSearch() {
  const form = document.querySelector('.quick-search-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const params = new URLSearchParams();
    for (const [k, v] of data.entries()) { if (v) params.set(k, v); }
    window.location.href = `inventory.html?${params.toString()}`;
  });
}

// ─── Financing calculator init ────────────────────────────
function initCalc() {
  const calcForm = document.querySelector('.calc-form');
  if (!calcForm) return;

  function update() {
    const price = parseInt(calcForm.querySelector('[name=price]')?.value || 0, 10);
    const down = parseInt(calcForm.querySelector('[name=down]')?.value || 10, 10);
    const term = parseInt(calcForm.querySelector('[name=term]')?.value || 60, 10);
    const rate = parseFloat(calcForm.querySelector('[name=rate]')?.value || 8.9);
    if (!price || price < 1000) return;
    const result = calcPayment({ price, downPercent: down, rateAPR: rate, termMonths: term });
    const out = document.querySelector('.calc-output');
    if (!out) return;
    out.innerHTML = `
      <div class="calc-result-monthly">
        <span class="calc-big">${formatPrice(result.monthly)}</span>
        <span class="calc-label">/month est.</span>
      </div>
      <div class="calc-result-details">
        <div><span>Down Payment</span><strong>${formatPrice(result.down)}</strong></div>
        <div><span>Loan Amount</span><strong>${formatPrice(result.principal)}</strong></div>
        <div><span>Term</span><strong>${term} months</strong></div>
        <div><span>Total Cost</span><strong>${formatPrice(result.totalCost)}</strong></div>
      </div>
    `;
  }

  calcForm.querySelectorAll('input, select').forEach(el => el.addEventListener('input', update));
  update();
}

// ─── Scroll-reveal (IntersectionObserver fallback) ────────
function initReveal() {
  if (typeof gsap !== 'undefined') return; // GSAP handles it
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── Highway canvas background ────────────────────────────
function initHighwayCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, lines = [], particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initLines();
  }

  function initLines() {
    lines = [];
    const vx = W / 2, vy = H * 0.42;
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 0.4 - Math.PI * 0.2;
      lines.push({
        angle, speed: 0.3 + Math.random() * 0.4,
        progress: Math.random(),
        alpha: 0.3 + Math.random() * 0.4,
        vx, vy
      });
    }
    particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.4 + 0.05,
        speed: Math.random() * 0.3 + 0.05
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);

    // Dark gradient sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#05050a');
    sky.addColorStop(0.6, '#0a0a0f');
    sky.addColorStop(1, '#111118');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Horizon amber glow
    const glow = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, W * 0.5);
    glow.addColorStop(0, 'rgba(245,158,11,0.06)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Road lines (perspective)
    lines.forEach(l => {
      l.progress += l.speed * 0.004;
      if (l.progress > 1) l.progress = 0;

      const startY = l.vy;
      const endY = H + 40;
      const dx = Math.tan(l.angle) * (endY - startY);

      const px = l.vx + dx * l.progress;
      const py = startY + (endY - startY) * l.progress;
      const length = 40 + l.progress * 120;

      const seg = ctx.createLinearGradient(0, py - length, 0, py);
      seg.addColorStop(0, 'transparent');
      seg.addColorStop(0.5, `rgba(245,158,11,${l.alpha * l.progress})`);
      seg.addColorStop(1, 'transparent');

      ctx.beginPath();
      ctx.strokeStyle = seg;
      ctx.lineWidth = 1.5 * l.progress;
      ctx.moveTo(px, py - length);
      ctx.lineTo(px, py);
      ctx.stroke();
    });

    // Ambient particles
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += Math.sin(t * 0.0008 + p.y * 0.01) * 0.1;
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,158,11,${p.alpha})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(draw);
}

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initSaveButtons();
  initQuickSearch();
  initCalc();
  initHighwayCanvas('hero-canvas');
});
