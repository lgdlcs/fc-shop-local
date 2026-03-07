// ─── Nav ────────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// ─── Scroll reveal ──────────────────────────────────
const revealElements = document.querySelectorAll(
  '.brand-card, .service-card, .dept-card, .cta-box, .places-cta'
);

revealElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      // Stagger siblings
      const parent = e.target.parentElement;
      const siblings = Array.from(parent.children).filter(c => revealElements.length && c.style.opacity === '0');
      if (siblings.length > 1) {
        siblings.forEach((s, i) => {
          setTimeout(() => {
            s.style.opacity = '1';
            s.style.transform = 'translateY(0)';
          }, i * 100);
        });
      } else {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

revealElements.forEach(el => observer.observe(el));

// ─── Counter animation ──────────────────────────────
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = el.textContent.replace('+', '');
      const num = parseInt(target);
      if (isNaN(num)) return;
      const suffix = el.textContent.includes('+') ? '+' : '';
      let current = 0;
      const step = Math.max(1, Math.floor(num / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= num) { current = num; clearInterval(timer); }
        el.textContent = current + suffix;
      }, 30);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));
