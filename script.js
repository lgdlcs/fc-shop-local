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

// ─── Populate annuaire grids ────────────────────────
function getInitials(name) {
  return name.split(/[\s·—-]+/).filter(w => w.length > 1).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

function colorFromName(name) {
  const colors = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316','#6366f1','#10b981'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function renderGrid(containerId, businesses) {
  const grid = document.getElementById(containerId);
  if (!grid || !businesses || businesses.length === 0) {
    if (grid) grid.innerHTML = '<p style="color:#6b7280;font-size:0.9rem;padding:20px;">Bientôt disponible — professionnels en cours de référencement.</p>';
    return;
  }
  
  grid.innerHTML = businesses.map(biz => {
    const initials = getInitials(biz.name);
    const color = colorFromName(biz.name);
    return `
      <a href="${biz.url}" target="_blank" rel="noopener" class="biz-card">
        <div class="biz-initial" style="background:${color}15;color:${color}">${initials}</div>
        <h4>${biz.name}</h4>
        <div class="biz-cat">${biz.cat}</div>
        ${biz.city ? `<div class="biz-city">📍 ${biz.city}</div>` : ''}
      </a>
    `;
  }).join('');
}

// Render all departments
renderGrid('grid-doubs', BUSINESSES.doubs);
renderGrid('grid-haute-saone', BUSINESSES['haute-saone']);
renderGrid('grid-jura', BUSINESSES.jura);
