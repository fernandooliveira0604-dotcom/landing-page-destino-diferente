/* ============================================================
   ORLANDO INTELIGENTE — script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── URGENCY BAR (smart sticky) ─────────────────────────── */
  const urgencyBar = document.getElementById('urgencyBar');
  let lastScroll = 0;

  function handleUrgencyBar() {
    const current = window.scrollY;
    if (current < 60) {
      urgencyBar.classList.remove('hidden');
    } else if (current > lastScroll + 5) {
      urgencyBar.classList.add('hidden');
    } else if (current < lastScroll - 5) {
      urgencyBar.classList.remove('hidden');
    }
    lastScroll = current;
  }

  window.addEventListener('scroll', handleUrgencyBar, { passive: true });

  /* ── PARTICLES (hero) ────────────────────────────────────── */
  function spawnParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const count = window.innerWidth < 600 ? 8 : 16;

    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';

      const size = Math.random() * 6 + 3;
      const x    = Math.random() * 100;
      const y    = Math.random() * 100;
      const dur  = Math.random() * 6 + 4;
      const del  = Math.random() * 5;

      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}%; top:${y}%;
        animation-duration:${dur}s;
        animation-delay:-${del}s;
      `;
      container.appendChild(p);
    }
  }

  spawnParticles();

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ── FAB BUTTON (show after 300px) ──────────────────────── */
  const fabBtn = document.getElementById('fabBtn');

  function handleFab() {
    if (!fabBtn) return;
    if (window.scrollY > 300) {
      fabBtn.style.display = 'flex';
    } else {
      fabBtn.style.display = 'none';
    }
  }

  window.addEventListener('scroll', handleFab, { passive: true });
  handleFab();

  /* ── FAQ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', function () {
      const item   = this.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach((i) => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.classList.remove('open');
        const b = i.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if was closed)
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── SMOOTH SCROLL for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 50;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── PRICING card hover glow ────────────────────────────── */
  document.querySelectorAll('.pricing-card').forEach((card) => {
    card.addEventListener('mouseenter', function () {
      if (!this.classList.contains('pricing-featured')) {
        this.style.boxShadow = '0 0 30px rgba(201,168,76,.12)';
      }
    });
    card.addEventListener('mouseleave', function () {
      if (!this.classList.contains('pricing-featured')) {
        this.style.boxShadow = '';
      }
    });
  });

  /* ── ANIMATE progress bars (trip cost section) ──────────── */
  const tripObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.trip-bar-our').forEach((bar) => {
            bar.style.width = '0';
            bar.style.transition = 'width 1.2s ease .3s';
            setTimeout(() => { bar.style.width = '64%'; }, 50);
          });
          tripObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('.trip-total-card').forEach((el) => {
    tripObserver.observe(el);
  });

  /* ── NUMBER COUNTER (stat items) ────────────────────────── */
  function animateCount(el, target, suffix, dur) {
    const start = performance.now();
    const isFloat = String(target).includes('.');
    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / dur, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      el.textContent = val + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const nums = entry.target.querySelectorAll('.stat-num');
          nums.forEach((num) => {
            const raw = num.textContent.trim();
            if (raw === '16') animateCount(num, 16, '', 900);
            else if (raw === '8') animateCount(num, 8, '', 700);
            else if (raw === 'R$22,4k') {
              // Static — just keep
            }
          });
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('.hero-stats').forEach((el) => {
    counterObserver.observe(el);
  });

  /* ── Planner checklist animation ────────────────────────── */
  const plannerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const todos = entry.target.querySelectorAll('.check-todo');
          todos.forEach((t, i) => {
            setTimeout(() => {
              t.textContent = '✓';
              t.className = 'check-done';
            }, 600 + i * 400);
          });
          plannerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll('.planner-board').forEach((el) => {
    plannerObserver.observe(el);
  });

  /* ── Reduced motion respect ──────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-stagger').forEach((el) => {
      el.classList.add('visible');
    });
  }

})();
