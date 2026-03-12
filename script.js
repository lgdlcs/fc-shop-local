// ============ BUILD FLAT LIST ============
var allBiz = [];
var deptNames = { doubs: 'Doubs', 'haute-saone': 'Haute-Saône', jura: 'Jura' };

Object.keys(BUSINESSES).forEach(function(dept) {
  BUSINESSES[dept].forEach(function(b) {
    allBiz.push({
      name: b.name,
      url: b.url,
      cat: b.cat,
      city: b.city || '',
      dept: deptNames[dept] || dept
    });
  });
});

// ============ EXTRACT CATEGORIES ============
var cats = {};
allBiz.forEach(function(b) { cats[b.cat] = true; });
var catList = Object.keys(cats).sort();

var tagsEl = document.getElementById('tags');
catList.forEach(function(cat) {
  var btn = document.createElement('button');
  btn.className = 'tag';
  btn.dataset.cat = cat;
  btn.textContent = cat;
  tagsEl.appendChild(btn);
});

// ============ STATS ============
document.getElementById('count-total').textContent = allBiz.length;
document.getElementById('count-doubs').textContent = (BUSINESSES.doubs || []).length;
document.getElementById('count-hs').textContent = (BUSINESSES['haute-saone'] || []).length;
document.getElementById('count-jura').textContent = (BUSINESSES.jura || []).length;

// ============ RENDER ============
var listEl = document.getElementById('directory-list');
var emptyEl = document.getElementById('empty-state');
var activeCat = 'all';

function render(filter) {
  filter = (filter || '').toLowerCase();
  var html = '';
  var rank = 0;

  allBiz.forEach(function(b) {
    var matchSearch = !filter ||
      b.name.toLowerCase().indexOf(filter) !== -1 ||
      b.cat.toLowerCase().indexOf(filter) !== -1 ||
      b.city.toLowerCase().indexOf(filter) !== -1 ||
      b.dept.toLowerCase().indexOf(filter) !== -1;
    var matchCat = activeCat === 'all' || b.cat === activeCat;

    if (!matchSearch || !matchCat) return;
    rank++;

    html += '<a href="' + b.url + '" target="_blank" rel="noopener" class="biz-row" data-rank="' + rank + '">' +
      '<div class="biz-rank">' + rank + '</div>' +
      '<div><div class="biz-name">' + b.name + '</div>' +
        (b.city ? '<div class="biz-city">' + b.city + '</div>' : '') +
      '</div>' +
      '<div class="biz-cat">' + b.cat + '</div>' +
      '<div><span class="biz-dept">' + b.dept + '</span></div>' +
      '<div class="biz-arrow">↗</div>' +
    '</a>';
  });

  listEl.innerHTML = html;
  emptyEl.style.display = rank === 0 ? '' : 'none';
}

render('');

// ============ SEARCH ============
var searchInput = document.getElementById('search');
searchInput.addEventListener('input', function() {
  render(searchInput.value);
});

// ============ FLOATING SIDE CARDS ============
(function() {
  var pastels = ['pastel-pink','pastel-blue','pastel-green','pastel-purple','pastel-amber','pastel-teal'];
  var badges = ['⭐ À découvrir','🔥 Populaire','💎 Artisan local','🌿 Éco-responsable','🏆 Recommandé','✨ Nouveau'];
  var leftEl = document.getElementById('float-left');
  var rightEl = document.getElementById('float-right');

  // Pick random businesses for side cards
  var shuffled = allBiz.slice().sort(function() { return 0.5 - Math.random(); });
  var picks = shuffled.slice(0, 10);

  picks.forEach(function(b, i) {
    var side = i % 2 === 0 ? leftEl : rightEl;
    var pastel = pastels[i % pastels.length];
    var badge = badges[i % badges.length];

    var card = document.createElement('a');
    card.href = b.url;
    card.target = '_blank';
    card.rel = 'noopener';
    card.className = 'float-card ' + pastel;
    card.innerHTML =
      '<div class="float-card-name">' + b.name + '</div>' +
      '<div class="float-card-cat">' + b.cat + '</div>' +
      '<span class="float-card-badge">' + badge + '</span>';
    side.appendChild(card);
  });
})();

// ============ TAG FILTER ============
tagsEl.addEventListener('click', function(e) {
  if (!e.target.classList.contains('tag')) return;
  activeCat = e.target.dataset.cat;
  tagsEl.querySelectorAll('.tag').forEach(function(t) { t.classList.remove('active'); });
  e.target.classList.add('active');
  render(searchInput.value);
});
