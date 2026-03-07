// ─── Nav scroll ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── Mobile toggle ──────────────────────────────────
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => links.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});

// ─── 3D Carousel ────────────────────────────────────
const partners = [
  { name: 'Philippe Bouvard', desc: 'Tapissier Décorateur — Besançon', icon: '🪑' },
  { name: 'Ô Comtois Gourmand', desc: 'Produits régionaux', icon: '🧀' },
  { name: 'Créabois et Paysage', desc: 'Conception & Aménagement extérieur', icon: '🌿' },
  { name: 'Moon Holistique', desc: 'Bien-être — Cussey sur l\'Ognon', icon: '🌙' },
  { name: 'SC Émynès', desc: 'Secrétaire indépendante — RH, Gestion', icon: '📋' },
  { name: 'Cléagest', desc: 'Comptabilité & Gestion — Delphine Bazart', icon: '📊' },
  { name: 'SOS Piccand', desc: 'Plomberie, Chauffage, Sanitaire', icon: '🔧' },
  { name: 'OptimLogis', desc: 'Rénovation & Habitat', icon: '🏠' },
  { name: 'Abithéa', desc: 'Conseil immobilier — David Ferrari', icon: '🏡' },
  { name: 'SuisseImmo', desc: 'Immobilier transfrontalier', icon: '🏢' },
  { name: 'Shop Création', desc: 'Création de visuels & supports', icon: '🎨' },
  { name: 'WebRadio Plus', desc: 'La radio locale de Franche-Comté', icon: '📻' },
];

const carouselEl = document.getElementById('carousel-3d');
let currentIndex = 0;
const cardAngle = 360 / partners.length;
const radius = 450;

// Create cards
partners.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'carousel-card';
  card.innerHTML = `
    <div style="font-size:2.5rem;margin-bottom:12px;">${p.icon}</div>
    <h4>${p.name}</h4>
    <p>${p.desc}</p>
  `;
  carouselEl.appendChild(card);
});

function updateCarousel() {
  const cards = carouselEl.querySelectorAll('.carousel-card');
  cards.forEach((card, i) => {
    const angle = (i - currentIndex) * cardAngle;
    const rad = (angle * Math.PI) / 180;
    const x = Math.sin(rad) * radius;
    const z = Math.cos(rad) * radius - radius;
    const opacity = Math.max(0.2, (z + radius) / radius);
    const scale = 0.6 + 0.4 * ((z + radius) / radius);
    
    card.style.transform = `translateX(calc(-50% + ${x}px)) translateZ(${z}px) scale(${scale})`;
    card.style.opacity = opacity;
    card.style.zIndex = Math.round((z + radius));
    card.classList.toggle('active', i === ((currentIndex % partners.length) + partners.length) % partners.length);
  });
}

document.getElementById('carousel-prev').addEventListener('click', () => {
  currentIndex--; updateCarousel();
});
document.getElementById('carousel-next').addEventListener('click', () => {
  currentIndex++; updateCarousel();
});

updateCarousel();

// Auto-rotate
setInterval(() => { currentIndex++; updateCarousel(); }, 4000);

// ─── Scroll reveal ──────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.dept-card, .cat-card, .service-card, .cta-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s, transform 0.6s';
  observer.observe(el);
});

// Stagger animation
document.querySelectorAll('.dept-grid, .cat-grid, .services-grid').forEach(grid => {
  const items = grid.children;
  const gridObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        Array.from(items).forEach((item, i) => {
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 80);
        });
        gridObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });
  gridObserver.observe(grid);
});
