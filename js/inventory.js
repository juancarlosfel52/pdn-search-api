/* ============================================================
   IRON ROAD — Inventory JS
   Search, filter, sort, render
   ============================================================ */

const PAGE_SIZE = 9;
let currentPage = 1;
let viewMode = 'grid'; // 'grid' | 'list'
let currentResults = [];

// ─── Read URL params on load ──────────────────────────────
function getURLFilters() {
  const p = new URLSearchParams(location.search);
  return {
    make: p.get('make') || '',
    cabType: p.get('cabType') || '',
    condition: p.get('condition') || '',
    dotReady: p.get('dotReady') === 'true',
    featured: p.get('featured') === 'true',
    maxPrice: p.get('maxPrice') ? parseInt(p.get('maxPrice'), 10) : null,
    minPrice: p.get('minPrice') ? parseInt(p.get('minPrice'), 10) : null,
    maxMileage: p.get('maxMileage') ? parseInt(p.get('maxMileage'), 10) : null,
    yearMin: p.get('yearMin') ? parseInt(p.get('yearMin'), 10) : null,
    query: p.get('q') || ''
  };
}

// ─── Build filters from sidebar UI ───────────────────────
function getUIFilters() {
  const makes = [...document.querySelectorAll('[name=make]:checked')].map(c => c.value);
  const cabType = document.querySelector('[name=cabType]:checked')?.value || '';
  const conditions = [...document.querySelectorAll('[name=condition]:checked')].map(c => c.value);
  const yearMin = parseInt(document.getElementById('f-yearMin')?.value, 10) || null;
  const minPrice = parseInt(document.getElementById('f-minPrice')?.value, 10) || null;
  const maxPrice = parseInt(document.getElementById('f-maxPrice')?.value, 10) || null;
  const maxMileage = parseInt(document.getElementById('f-maxMileage')?.value, 10) || null;
  const dotReady = document.getElementById('f-dotReady')?.checked || false;
  const featured = document.getElementById('f-featured')?.checked || false;
  const query = document.getElementById('inv-search')?.value?.trim() || '';
  return { makes, cabType, conditions, yearMin, minPrice, maxPrice, maxMileage, dotReady, featured, query };
}

// ─── Apply filters to data ────────────────────────────────
function applyFilters(filters) {
  return TRUCKS.filter(t => {
    if (filters.makes?.length && !filters.makes.includes(t.make)) return false;
    if (filters.cabType && t.cabType !== filters.cabType) return false;
    if (filters.conditions?.length && !filters.conditions.includes(t.condition)) return false;
    if (filters.dotReady && !t.dotReady) return false;
    if (filters.featured && !t.featured) return false;
    if (filters.maxPrice && t.price > filters.maxPrice) return false;
    if (filters.minPrice && t.price < filters.minPrice) return false;
    if (filters.maxMileage && t.mileage > filters.maxMileage) return false;
    if (filters.yearMin && t.year < filters.yearMin) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${t.make} ${t.model} ${t.year} ${t.engine} ${t.location} ${t.trim || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// ─── Sort ─────────────────────────────────────────────────
function sortTrucks(trucks, sortKey) {
  const sorted = [...trucks];
  switch (sortKey) {
    case 'price-asc':  return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc': return sorted.sort((a, b) => b.price - a.price);
    case 'year-desc':  return sorted.sort((a, b) => b.year - a.year);
    case 'mileage-asc':return sorted.sort((a, b) => a.mileage - b.mileage);
    default: // featured first
      return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
}

// ─── Render ───────────────────────────────────────────────
function renderTruckCardGrid(t) {
  const img = t.images[0] || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800';
  const badges = (t.badges || []).map(b => `<span class="truck-card-badge badge-${b}">${b}</span>`).join('');
  const fin = calcPayment({ price: t.price });
  return `
  <article class="truck-card" onclick="location.href='detail.html?id=${t.id}'" role="link" tabindex="0"
    aria-label="${t.year} ${t.make} ${t.model}, ${formatPrice(t.price)}">
    <div class="truck-card-media">
      <img src="${img}" alt="${t.year} ${t.make} ${t.model}" loading="lazy" width="600" height="338" />
      ${badges}
      <button class="truck-card-save${Saved.has(t.id) ? ' saved' : ''}" data-save="${t.id}"
        aria-label="Save ${t.year} ${t.make} ${t.model}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${Saved.has(t.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      ${t.status === 'sold' ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;"><span class="truck-card-badge badge-sold" style="font-size:16px;padding:8px 20px;">SOLD</span></div>' : ''}
    </div>
    <div class="truck-card-body">
      <div class="truck-card-make">${t.make} · ${t.location}</div>
      <div class="truck-card-name">${t.year} ${t.model}</div>
      <div class="truck-card-specs">
        <span class="truck-card-spec">⚙ ${t.engine.split(' ').slice(0,2).join(' ')}</span>
        <span class="truck-card-spec">🛣 ${formatMileage(t.mileage)}</span>
        <span class="truck-card-spec">🛏 ${t.sleeper.split('"')[0]}"</span>
        ${t.dotReady ? '<span class="tag tag-green">DOT ✓</span>' : ''}
        ${t.warranty ? '<span class="tag tag-amber">Warranty</span>' : ''}
      </div>
      <div class="truck-card-footer">
        <div class="truck-card-price">
          ${formatPrice(t.price)}
          <small>~${formatPrice(fin.monthly)}/mo est.</small>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-sm" style="background:rgba(24,119,242,.12);border-color:rgba(24,119,242,.4);color:#1877f2;padding:6px 10px;" onclick="quickShareFacebook('${t.id}',event)" title="Share on Facebook">📘</button>
          <button class="btn btn-sm" style="background:rgba(37,211,102,.08);border-color:rgba(37,211,102,.35);color:#25d366;padding:6px 10px;" onclick="quickShareWhatsApp('${t.id}',event)" title="Share on WhatsApp">📱</button>
          <button class="btn btn-outline-amber btn-sm" onclick="event.stopPropagation();location.href='detail.html?id=${t.id}'">Details</button>
        </div>
      </div>
    </div>
  </article>`;
}

function renderTruckCardList(t) {
  const img = t.images[0] || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800';
  const fin = calcPayment({ price: t.price });
  return `
  <article class="truck-card-list" onclick="location.href='detail.html?id=${t.id}'" role="link" tabindex="0"
    aria-label="${t.year} ${t.make} ${t.model}">
    <div class="truck-card-list-media">
      <img src="${img}" alt="${t.year} ${t.make} ${t.model}" loading="lazy" width="280" height="200" />
      ${(t.badges||[]).map(b=>`<span class="truck-card-badge badge-${b}">${b}</span>`).join('')}
    </div>
    <div class="truck-card-list-body">
      <div class="truck-card-list-top">
        <div class="truck-card-make" style="margin-bottom:4px">${t.make} · ${t.year} · ${t.location}</div>
        <div class="truck-card-name">${t.model} ${t.trim || ''}</div>
        <div class="truck-card-list-specs">
          <span class="truck-card-spec">⚙ ${t.engine}</span>
          <span class="truck-card-spec">🛣 ${formatMileage(t.mileage)}</span>
          <span class="truck-card-spec">⚙ ${t.transmission}</span>
          <span class="truck-card-spec">🛏 ${t.sleeper}</span>
          ${t.dotReady ? '<span class="tag tag-green">DOT Ready</span>' : ''}
          ${t.warranty ? '<span class="tag tag-amber">Warranty</span>' : ''}
        </div>
        <p style="font-size:13px;color:var(--text-2);line-height:1.6;margin-bottom:0;">${t.description.substring(0,140)}…</p>
      </div>
      <div class="truck-card-list-bottom">
        <div class="truck-card-price">
          ${formatPrice(t.price)}
          <small>~${formatPrice(fin.monthly)}/mo</small>
        </div>
        <div style="display:flex;gap:8px;">
          <button class="truck-card-save${Saved.has(t.id) ? ' saved' : ''}" data-save="${t.id}" style="position:static;width:auto;height:auto;padding:6px 12px;border-radius:4px;font-size:11px;gap:4px;display:flex;align-items:center;" aria-label="Save truck">
            ♡ Save
          </button>
          <button class="btn btn-sm" style="background:rgba(24,119,242,.12);border-color:rgba(24,119,242,.4);color:#1877f2;padding:6px 10px;" onclick="quickShareFacebook('${t.id}',event)" title="Share on Facebook">📘 Share</button>
          <button class="btn btn-outline-amber btn-sm" onclick="event.stopPropagation();location.href='detail.html?id=${t.id}'">View Details →</button>
        </div>
      </div>
    </div>
  </article>`;
}

// ─── Render active filter pills ───────────────────────────
function renderActivePills(filters) {
  const pills = [];
  if (filters.makes?.length) filters.makes.forEach(m => pills.push(`<button class="filter-pill" data-clear="make:${m}">${m} <span>✕</span></button>`));
  if (filters.cabType) pills.push(`<button class="filter-pill" data-clear="cabType">${filters.cabType} <span>✕</span></button>`);
  if (filters.conditions?.length) filters.conditions.forEach(c => pills.push(`<button class="filter-pill" data-clear="condition:${c}">${c} <span>✕</span></button>`));
  if (filters.yearMin) pills.push(`<button class="filter-pill" data-clear="yearMin">${filters.yearMin}+ <span>✕</span></button>`);
  if (filters.maxPrice) pills.push(`<button class="filter-pill" data-clear="maxPrice">Under ${formatPrice(filters.maxPrice)} <span>✕</span></button>`);
  if (filters.dotReady) pills.push(`<button class="filter-pill" data-clear="dotReady">DOT Ready <span>✕</span></button>`);
  if (filters.featured) pills.push(`<button class="filter-pill" data-clear="featured">Featured <span>✕</span></button>`);
  if (filters.query) pills.push(`<button class="filter-pill" data-clear="query">"${filters.query}" <span>✕</span></button>`);
  document.getElementById('active-filters').innerHTML = pills.join('');
}

// ─── Render pagination ────────────────────────────────────
function renderPagination(total, page) {
  const pages = Math.ceil(total / PAGE_SIZE);
  const el = document.getElementById('pagination');
  if (pages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  if (page > 1) html += `<button class="page-btn" data-page="${page-1}">‹</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn${i===page?' active':''}" data-page="${i}">${i}</button>`;
  }
  if (page < pages) html += `<button class="page-btn" data-page="${page+1}">›</button>`;
  el.innerHTML = html;
  el.querySelectorAll('[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      currentPage = parseInt(btn.dataset.page, 10);
      render();
      document.getElementById('inv-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Main render ──────────────────────────────────────────
function render() {
  const filters = getUIFilters();
  const sortKey = document.getElementById('inv-sort')?.value || 'featured';
  const sorted = sortTrucks(applyFilters(filters), sortKey);
  currentResults = sorted;

  const start = (currentPage - 1) * PAGE_SIZE;
  const page = sorted.slice(start, start + PAGE_SIZE);

  const container = document.getElementById('trucks-container');
  const countEl = document.getElementById('result-count');

  countEl.textContent = `${sorted.length} truck${sorted.length !== 1 ? 's' : ''} found`;

  if (viewMode === 'list') {
    container.className = 'trucks-list';
    container.innerHTML = page.length
      ? page.map(renderTruckCardList).join('')
      : noResults();
  } else {
    container.className = 'trucks-grid-main';
    container.innerHTML = page.length
      ? page.map(renderTruckCardGrid).join('')
      : noResults();
  }

  renderActivePills(filters);
  renderPagination(sorted.length, currentPage);
  initSaveButtons();
}

function noResults() {
  return `<div class="no-results" style="grid-column:1/-1;">
    <div class="no-results-icon">🔍</div>
    <div class="no-results-title">No Trucks Found</div>
    <p>Try adjusting your filters or <a href="index.html#contact" style="color:var(--amber)">contact us</a> — we may have what you need incoming.</p>
  </div>`;
}

// ─── Sync URL filters to sidebar UI ──────────────────────
function syncURLToUI() {
  const f = getURLFilters();
  if (f.make) {
    const cb = document.querySelector(`[name=make][value="${f.make}"]`);
    if (cb) cb.checked = true;
  }
  if (f.cabType) {
    const rb = document.querySelector(`[name=cabType][value="${f.cabType}"]`);
    if (rb) rb.checked = true;
  }
  if (f.dotReady) document.getElementById('f-dotReady').checked = true;
  if (f.featured) document.getElementById('f-featured').checked = true;
  if (f.maxPrice) document.getElementById('f-maxPrice').value = f.maxPrice;
  if (f.yearMin) document.getElementById('f-yearMin').value = f.yearMin;
  if (f.query) document.getElementById('inv-search').value = f.query;
}

// ─── Event listeners ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  syncURLToUI();
  render();

  // Filter apply
  document.getElementById('apply-filters')?.addEventListener('click', () => {
    currentPage = 1;
    render();
    // Close sidebar on mobile
    document.getElementById('inv-sidebar')?.classList.remove('open');
    document.querySelector('.nav-overlay')?.classList.remove('open');
  });

  // Clear filters
  document.getElementById('clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('[name=make]').forEach(c => c.checked = false);
    document.querySelectorAll('[name=condition]').forEach(c => c.checked = false);
    const cabAll = document.querySelector('[name=cabType][value=""]');
    if (cabAll) cabAll.checked = true;
    document.getElementById('f-dotReady').checked = false;
    document.getElementById('f-featured').checked = false;
    document.getElementById('f-yearMin').value = '';
    document.getElementById('f-maxPrice').value = '';
    document.getElementById('f-minPrice').value = '';
    document.getElementById('f-maxMileage').value = '';
    document.getElementById('inv-search').value = '';
    currentPage = 1;
    render();
  });

  // Live search
  let searchTimer;
  document.getElementById('inv-search')?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { currentPage = 1; render(); }, 300);
  });

  // Sort
  document.getElementById('inv-sort')?.addEventListener('change', () => { currentPage = 1; render(); });

  // View toggle
  document.getElementById('view-grid')?.addEventListener('click', () => {
    viewMode = 'grid';
    document.getElementById('view-grid').classList.add('active');
    document.getElementById('view-list').classList.remove('active');
    render();
  });
  document.getElementById('view-list')?.addEventListener('click', () => {
    viewMode = 'list';
    document.getElementById('view-list').classList.add('active');
    document.getElementById('view-grid').classList.remove('active');
    render();
  });

  // Mobile sidebar toggle
  document.getElementById('filter-toggle')?.addEventListener('click', () => {
    document.getElementById('inv-sidebar').classList.add('open');
    document.querySelector('.nav-overlay').classList.add('open');
  });
  document.getElementById('sidebar-close')?.addEventListener('click', () => {
    document.getElementById('inv-sidebar').classList.remove('open');
    document.querySelector('.nav-overlay').classList.remove('open');
  });
  document.querySelector('.nav-overlay')?.addEventListener('click', () => {
    document.getElementById('inv-sidebar')?.classList.remove('open');
  });

  // Active filter pill removal
  document.getElementById('active-filters')?.addEventListener('click', e => {
    const pill = e.target.closest('[data-clear]');
    if (!pill) return;
    const key = pill.dataset.clear;
    if (key.startsWith('make:')) {
      const val = key.split(':')[1];
      const cb = document.querySelector(`[name=make][value="${val}"]`);
      if (cb) cb.checked = false;
    } else if (key === 'cabType') {
      const rb = document.querySelector('[name=cabType][value=""]');
      if (rb) rb.checked = true;
    } else if (key.startsWith('condition:')) {
      const val = key.split(':')[1];
      const cb = document.querySelector(`[name=condition][value="${val}"]`);
      if (cb) cb.checked = false;
    } else if (key === 'yearMin') { document.getElementById('f-yearMin').value = ''; }
    else if (key === 'maxPrice') { document.getElementById('f-maxPrice').value = ''; }
    else if (key === 'dotReady') { document.getElementById('f-dotReady').checked = false; }
    else if (key === 'featured') { document.getElementById('f-featured').checked = false; }
    else if (key === 'query') { document.getElementById('inv-search').value = ''; }
    currentPage = 1;
    render();
  });

  // Keyboard a11y — Enter to open card
  document.getElementById('trucks-container')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('truck-card')) {
      e.target.click();
    }
  });
});
