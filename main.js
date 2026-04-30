/* ═══════════════════════════════════════════
   ContaBahia — Scripts Principal
   main.js
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     HERO SLIDER
  ───────────────────────────────────────── */
  const slidesTrack = document.getElementById('heroSlides');
  const dots        = document.querySelectorAll('.hero-dot');
  const totalSlides = 3;
  let current  = 0;
  let autoplay = null;

  function goTo(index) {
    current = ((index % totalSlides) + totalSlides) % totalSlides;
    slidesTrack.style.transform = `translateX(-${current * (100 / totalSlides)}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    autoplay = setInterval(next, 5000);
  }

  function resetAuto() {
    clearInterval(autoplay);
    startAuto();
  }

  document.getElementById('heroNext')?.addEventListener('click', () => { next(); resetAuto(); });
  document.getElementById('heroPrev')?.addEventListener('click', () => { prev(); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      resetAuto();
    });
  });

  /* Suporte a swipe em telas touch */
  let touchStartX = 0;

  slidesTrack?.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  slidesTrack?.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  startAuto();

  /* ─────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ─────────────────────────────────────────
     ANIMAÇÃO DE CONTAGEM — SEÇÃO NÚMEROS
  ───────────────────────────────────────── */
  function animateCount(el, target, duration = 1800) {
    /* Preserva prefixo (+) e sufixo (%) que estão em <span> */
    const prefixEl = el.querySelector('span:first-child');
    const suffixEl = el.querySelector('span:last-child');
    const prefix   = (prefixEl && prefixEl !== suffixEl) ? prefixEl.textContent : '';
    const suffix   = suffixEl ? suffixEl.textContent : '';

    let count = 0;
    const step  = target / (duration / 16);

    const timer = setInterval(() => {
      count = Math.min(count + step, target);
      el.innerHTML =
        (prefix ? `<span>${prefix}</span>` : '') +
        Math.floor(count) +
        (suffix ? `<span>${suffix}</span>` : '');

      if (count >= target) clearInterval(timer);
    }, 16);
  }

  const numObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCount(el, target);
        numObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.numero-value[data-target]').forEach(el => numObserver.observe(el));

});
