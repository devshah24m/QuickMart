// ═══════════════════════════════════════════════════════════════
// QuickMart Shared Utilities — Google Sheets backend
// ═══════════════════════════════════════════════════════════════

const GS_URL = 'https://script.google.com/macros/s/AKfycbx-bWhpCtFioAdt_hNPMrwS81IqL2E4RSVUZcFlFcPrVdmfZ-CW9aB6mLTSQzUIqXYT/exec';

// ── IN-MEMORY STORE (cart, products, settings, zones) ─────────
const _QM = {
  cart    : [],
  settings: null,
  products: null,
  zones   : null,
};

// ── SESSION KEY (sessionStorage — survives page navigation) ───
const SESSION_KEY = '_qm_session';

// ── API HELPERS ──────────────────────────────────────────────
async function gsGet(params) {
  const url = GS_URL + '?' + new URLSearchParams(params).toString();
  console.log('[QM] GET →', url);
  try {
    const res  = await fetch(url);
    const text = await res.text();
    console.log('[QM] GET raw response:', text.slice(0, 200));
    return JSON.parse(text);
  } catch(err) {
    console.error('[QM] GET error:', err);
    return { ok: false, msg: 'Network error: ' + err.message };
  }
}

async function gsPost(body) {
  console.log('[QM] POST body:', JSON.stringify(body));
  try {
    const res  = await fetch(GS_URL, {
      method  : 'POST',
      redirect: 'follow',
      headers : { 'Content-Type': 'text/plain;charset=utf-8' },
      body    : JSON.stringify(body)
    });
    const text = await res.text();
    console.log('[QM] POST raw response:', text);
    return JSON.parse(text);
  } catch(err) {
    console.error('[QM] POST error:', err);
    return { ok: false, msg: 'Network error: ' + err.message };
  }
}

// ── SESSION (sessionStorage — clears when tab/browser closes) ─
function getSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(_) { return null; }
}
function saveSession(s) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      id: s.id, name: s.name, email: s.email, role: s.role
    }));
  } catch(_) {}
}
function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch(_) {}
}
function isLoggedIn()  { return !!getSession(); }
function isAdmin()     { const s = getSession(); return s && s.role === 'admin'; }
function currentUser() { return getSession(); }

// ── PRODUCTS ─────────────────────────────────────────────────
async function getAllProducts() {
  if (_QM.products) return _QM.products;
  try {
    const data = await gsGet({ action: 'getProducts' });
    if (data.ok && data.products.length) {
      _QM.products = data.products;
      return data.products;
    }
  } catch(e) {}
  return typeof PRODUCTS !== 'undefined' ? PRODUCTS : [];
}

function clearProductCache() {
  _QM.products = null;
}

// ── AUTH ──────────────────────────────────────────────────────
async function registerUser(name, email, password) {
  try {
    const res = await gsPost({ action: 'registerUser', data: { name, email, password } });
    if (res.ok) saveSession(res.user);
    return res;
  } catch(e) {
    return { ok: false, msg: 'Network error. Please try again.' };
  }
}

async function loginUser(email, password) {
  try {
    const res = await gsPost({ action: 'loginUser', email, password });
    if (res.ok) saveSession(res.user);
    return res;
  } catch(e) {
    return { ok: false, msg: 'Network error. Please try again.' };
  }
}

function logoutUser() { clearSession(); }
function doLogout()   { logoutUser(); window.location.href = 'index.html'; }

// ── ORDERS ────────────────────────────────────────────────────
async function saveOrder(data) {
  return gsPost({ action: 'saveOrder', data });
}

async function getMyOrders() {
  const user = currentUser();
  if (!user) return [];
  const res = await gsGet({ action: 'getOrders', userId: user.id, email: user.email });
  return res.ok ? res.orders : [];
}

async function getAllOrders() {
  const res = await gsGet({ action: 'getOrders' });
  return res.ok ? res.orders : [];
}

// ── REVIEWS ───────────────────────────────────────────────────
async function getReviews(productId) {
  const res = await gsGet({ action: 'getReviews', productId });
  return res.ok ? res.reviews : [];
}

async function saveReview(data) {
  return gsPost({ action: 'saveReview', data });
}

// ── USERS (admin) ─────────────────────────────────────────────
async function getAllUsers() {
  const res = await gsGet({ action: 'getUsers' });
  return res.ok ? res.users : [];
}

async function deleteUserRemote(id) {
  return gsPost({ action: 'deleteUser', id });
}

// ── PRODUCTS (admin) ──────────────────────────────────────────
async function saveProductRemote(data) {
  const res = await gsPost({ action: 'saveProduct', data });
  clearProductCache();
  return res;
}

async function deleteProductRemote(id) {
  const res = await gsPost({ action: 'deleteProduct', id });
  clearProductCache();
  return res;
}

// ── SETTINGS ─────────────────────────────────────────────────
async function getSettings() {
  if (_QM.settings) return _QM.settings;
  const res = await gsGet({ action: 'getSettings' });
  if (res.ok) _QM.settings = res.settings;
  return res.ok ? res.settings : {};
}

async function saveSettingsRemote(data) {
  _QM.settings = null;
  return gsPost({ action: 'saveSettings', data });
}

// ── ZONES ────────────────────────────────────────────────────
async function getZones() {
  if (_QM.zones) return _QM.zones;
  const res = await gsGet({ action: 'getZones' });
  const zones = res.ok && res.zones.length ? res.zones : ['Hyderabad','Secunderabad','Bangalore','Mumbai','Delhi','Chennai','Pune','Kolkata'];
  _QM.zones = zones;
  return zones;
}

async function saveZonesRemote(zones) {
  _QM.zones = null;
  return gsPost({ action: 'saveZones', zones });
}

// ── NAV ───────────────────────────────────────────────────────
function initNav() {
  const actionsEl = document.getElementById('nav-actions');
  if (!actionsEl) return;
  const session = getSession();
  let authHTML = '';
  if (session) {
    const initials = session.name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
    authHTML = `
      <div class="nav-user-menu" id="navUserMenu">
        <button class="nav-user-btn" onclick="toggleUserMenu()" title="${session.name}">
          <span class="nav-avatar">${initials}</span>
          <span class="nav-user-name">${session.name.split(' ')[0]}</span> ▾
        </button>
        <div class="user-dropdown" id="userDropdown" style="display:none">
          <div class="ud-header"><strong>${session.name}</strong><br><small>${session.email}</small></div>
          ${session.role === 'admin' ? '<a class="ud-link" href="admin.html">🛠 Admin Panel</a>' : ''}
          <a class="ud-link" href="orders.html">📦 My Orders</a>
          <a class="ud-link ud-logout" href="#" onclick="doLogout(); return false">🚪 Logout</a>
        </div>
      </div>`;
  } else {
    authHTML = `<a href="login.html" class="nav-btn" style="border:1px solid var(--primary);color:var(--primary)">Login / Register</a>`;
  }
  const cartLink = actionsEl.querySelector('a.cart');
  if (cartLink) cartLink.insertAdjacentHTML('beforebegin', authHTML);
  else actionsEl.insertAdjacentHTML('beforeend', authHTML);
}

function toggleUserMenu() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
}
document.addEventListener('click', e => {
  const menu = document.getElementById('navUserMenu');
  const dd   = document.getElementById('userDropdown');
  if (dd && menu && !menu.contains(e.target)) dd.style.display = 'none';
});

// ── CART (in-memory) ─────────────────────────────────────────
function getCart()     { return _QM.cart; }
function setCart(cart) { _QM.cart = cart; }

function updateBadge() {
  const cart = getCart();
  const el   = document.getElementById('nav-count');
  if (el) el.textContent = cart.reduce((a,b) => a + b.qty, 0);
}

function addToCart(id, btn, productsArray) {
  const products = productsArray || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : []);
  const p = products.find(x => x.id == id);
  if (!p) return;
  const cart = getCart();
  const ex = cart.find(i => i.id == id);
  if (ex) ex.qty++; else cart.push({ ...p, qty: 1 });
  setCart(cart);
  if (btn) {
    btn.textContent = '✓ Added!';
    btn.classList.add('added');
    setTimeout(() => { btn.textContent = 'Add to Cart'; btn.classList.remove('added'); }, 1500);
  }
  updateBadge();
}

// ── HELPERS ───────────────────────────────────────────────────
function starsHTML(n) {
  n = parseFloat(n) || 0;
  const full = Math.floor(n), half = n % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '½';
  for (let i = 0; i < (5 - full - (half?1:0)); i++) s += '☆';
  return s;
}

function discountPct(p) {
  if (!p.mrp || p.mrp <= p.price) return 0;
  return Math.round((p.mrp - p.price) / p.mrp * 100);
}

function navSearchGo() {
  const q = document.getElementById('navSearch');
  if (q && q.value.trim()) window.location.href = 'products.html?q=' + encodeURIComponent(q.value.trim());
}
document.addEventListener('DOMContentLoaded', () => {
  const ns = document.getElementById('navSearch');
  if (ns) ns.addEventListener('keydown', e => { if (e.key === 'Enter') navSearchGo(); });
});

// ── LOADING UI ────────────────────────────────────────────────
function showLoading(containerId, msg) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--muted)"><div style="font-size:2rem;margin-bottom:10px">⏳</div><p>${msg || 'Loading…'}</p></div>`;
}

function showError(containerId, msg) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div style="text-align:center;padding:40px;color:#e53e3e"><p>⚠ ${msg}</p></div>`;
}
