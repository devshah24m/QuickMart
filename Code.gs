// ═══════════════════════════════════════════════════════════════
// QuickMart — Google Apps Script Backend
// Paste this ENTIRE file into Extensions → Apps Script → Code.gs
// Then: Deploy → New Deployment → Web App → Anyone → Deploy
// ═══════════════════════════════════════════════════════════════

const SHEET_ID = '10K-yhy5I1qI9kxiiOAZK6Orc1wnIx-JRE19uoBj4mUg';

const SHEETS = {
  products : 'Products',
  users    : 'Users',
  orders   : 'Orders',
  reviews  : 'Reviews',
  settings : 'Settings',
  zones    : 'Zones'
};

// ── CORS helper ──────────────────────────────────────────────
function cors(output) {
  return ContentService
    .createTextOutput(JSON.stringify(output))
    .setMimeType(ContentService.MimeType.JSON);
}

// ── GET handler ──────────────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action;
  try {
    switch (action) {
      case 'getProducts': return cors(getProducts());
      case 'getOrders':   return cors(getOrders(e.parameter.userId, e.parameter.email));
      case 'getUsers':    return cors(getUsers());
      case 'getReviews':  return cors(getReviews(e.parameter.productId));
      case 'getSettings': return cors(getSettings());
      case 'getZones':    return cors(getZones());
      default:            return cors({ ok: false, msg: 'Unknown action: ' + action });
    }
  } catch(err) {
    return cors({ ok: false, msg: err.toString() });
  }
}

// ── POST handler ─────────────────────────────────────────────
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch(_) { return cors({ ok: false, msg: 'Invalid JSON' }); }

  try {
    switch (body.action) {
      case 'saveProduct':   return cors(saveProduct(body.data));
      case 'deleteProduct': return cors(deleteProduct(body.id));
      case 'saveOrder':     return cors(saveOrder(body.data));
      case 'registerUser':  return cors(registerUser(body.data));
      case 'loginUser':     return cors(loginUser(body.email, body.password));
      case 'saveReview':    return cors(saveReview(body.data));
      case 'saveSettings':  return cors(saveSettings(body.data));
      case 'saveZones':     return cors(saveZones(body.zones));
      case 'deleteUser':    return cors(deleteUser(body.id));
      default:              return cors({ ok: false, msg: 'Unknown action: ' + body.action });
    }
  } catch(err) {
    return cors({ ok: false, msg: err.toString() });
  }
}

// ══════════════════════════════════════════════════════════════
// SHEET HELPERS
// ══════════════════════════════════════════════════════════════

function getOrCreateSheet(name, headers) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sheet;
}

function sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1; // 1-indexed
  }
  return -1;
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════

function getProducts() {
  const sheet = getOrCreateSheet(SHEETS.products, ['id','name','price','mrp','category','brand','desc','rating','reviewCount','delivery','photos','highlights','colors','emoji','specs']);
  const rows  = sheetToObjects(sheet);
  const products = rows.map(r => ({
    id          : Number(r.id),
    name        : r.name,
    price       : Number(r.price),
    mrp         : Number(r.mrp) || Number(r.price),
    category    : r.category,
    brand       : r.brand,
    desc        : r.desc,
    rating      : Number(r.rating) || 0,
    reviewCount : Number(r.reviewCount) || 0,
    deliveryDays: Number(r.delivery) || 3,
    images      : r.photos ? r.photos.split('|||') : [],
    highlights  : r.highlights ? r.highlights.split('|||') : [],
    colors      : r.colors ? r.colors.split(',').map(s=>s.trim()) : [],
    emoji       : r.emoji || '📦',
    specs       : r.specs ? JSON.parse(r.specs) : {}
  }));
  return { ok: true, products };
}

function saveProduct(data) {
  const sheet = getOrCreateSheet(SHEETS.products, ['id','name','price','mrp','category','brand','desc','rating','reviewCount','delivery','photos','highlights','colors','emoji','specs']);
  const photos     = (data.images || []).join('|||');
  const highlights = (data.highlights || []).join('|||');
  const colors     = (data.colors || []).join(', ');
  const specs      = JSON.stringify(data.specs || {});

  if (data.id) {
    // Update existing
    const row = findRowById(sheet, data.id);
    if (row > 0) {
      sheet.getRange(row, 1, 1, 15).setValues([[
        data.id, data.name, data.price, data.mrp, data.category, data.brand,
        data.desc, data.rating || 0, data.reviewCount || 0, data.deliveryDays || 3,
        photos, highlights, colors, data.emoji || '📦', specs
      ]]);
      return { ok: true, msg: 'Product updated', id: data.id };
    }
  }
  // New product
  const allRows   = sheet.getDataRange().getValues();
  const maxId     = allRows.slice(1).reduce((m, r) => Math.max(m, Number(r[0])||0), 0);
  const newId     = maxId + 1;
  sheet.appendRow([newId, data.name, data.price, data.mrp, data.category, data.brand,
    data.desc, 0, 0, data.deliveryDays || 3, photos, highlights, colors, data.emoji || '📦', specs]);
  return { ok: true, msg: 'Product saved', id: newId };
}

function deleteProduct(id) {
  const sheet = getOrCreateSheet(SHEETS.products, ['id','name','price','mrp','category','brand','desc','rating','reviewCount','delivery','photos','highlights','colors','emoji','specs']);
  const row = findRowById(sheet, id);
  if (row > 0) { sheet.deleteRow(row); return { ok: true }; }
  return { ok: false, msg: 'Product not found' };
}

// ══════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════

function getUsers() {
  const sheet = getOrCreateSheet(SHEETS.users, ['id','name','email','password','role','joinedAt']);
  const rows  = sheetToObjects(sheet);
  // Never return passwords to client
  return { ok: true, users: rows.map(r => ({ id: r.id, name: r.name, email: r.email, role: r.role, joinedAt: r.joinedAt })) };
}

function registerUser(data) {
  const sheet = getOrCreateSheet(SHEETS.users, ['id','name','email','password','role','joinedAt']);
  const rows  = sheetToObjects(sheet);
  if (rows.find(r => r.email === data.email)) return { ok: false, msg: 'Email already registered.' };
  const newId = Date.now();
  sheet.appendRow([newId, data.name, data.email, data.password, 'customer', new Date().toISOString()]);
  return { ok: true, user: { id: newId, name: data.name, email: data.email, role: 'customer' } };
}

function loginUser(email, password) {
  // Admin shortcut
  if (email === 'admin@quickmart.in' && password === 'Admin@123') {
    return { ok: true, user: { id: 0, name: 'Admin', email, role: 'admin' } };
  }
  const sheet = getOrCreateSheet(SHEETS.users, ['id','name','email','password','role','joinedAt']);
  const rows  = sheetToObjects(sheet);
  const user  = rows.find(r => r.email === email && r.password === password);
  if (!user) return { ok: false, msg: 'Invalid email or password.' };
  return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

function deleteUser(id) {
  const sheet = getOrCreateSheet(SHEETS.users, ['id','name','email','password','role','joinedAt']);
  const row   = findRowById(sheet, id);
  if (row > 0) { sheet.deleteRow(row); return { ok: true }; }
  return { ok: false, msg: 'User not found' };
}

// ══════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════

function getOrders(userId, email) {
  const sheet = getOrCreateSheet(SHEETS.orders, ['orderId','userId','name','phone','email','address','payment','items','total','time','status']);
  const rows  = sheetToObjects(sheet);
  let filtered = rows;
  // If userId/email passed, filter to that customer only
  if (userId && String(userId) !== '0') {
    filtered = rows.filter(r => String(r.userId) === String(userId) || r.email === email);
  }
  return { ok: true, orders: filtered.map(r => ({
    orderId : r.orderId,
    userId  : r.userId,
    name    : r.name,
    phone   : r.phone,
    email   : r.email,
    address : r.address,
    payment : r.payment,
    cart    : r.items ? JSON.parse(r.items) : [],
    total   : Number(r.total),
    time    : r.time,
    status  : r.status || 'Placed'
  }))};
}

function saveOrder(data) {
  const sheet = getOrCreateSheet(SHEETS.orders, ['orderId','userId','name','phone','email','address','payment','items','total','time','status']);
  sheet.appendRow([
    data.orderId, data.userId || '', data.name, data.phone, data.email || '',
    data.address, data.payment, JSON.stringify(data.cart || []),
    data.total, data.time || new Date().toLocaleString(), 'Placed'
  ]);
  return { ok: true, orderId: data.orderId };
}

// ══════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════

function getReviews(productId) {
  const sheet = getOrCreateSheet(SHEETS.reviews, ['productId','userId','name','rating','title','body','date','verified']);
  const rows  = sheetToObjects(sheet);
  const filtered = productId ? rows.filter(r => String(r.productId) === String(productId)) : rows;
  return { ok: true, reviews: filtered };
}

function saveReview(data) {
  const sheet = getOrCreateSheet(SHEETS.reviews, ['productId','userId','name','rating','title','body','date','verified']);
  // Prevent duplicate review from same user on same product
  const rows = sheetToObjects(sheet);
  if (rows.find(r => String(r.productId) === String(data.productId) && String(r.userId) === String(data.userId))) {
    return { ok: false, msg: 'You have already reviewed this product.' };
  }
  sheet.appendRow([data.productId, data.userId, data.name, data.rating, data.title, data.body, data.date, true]);

  // Update average rating on product sheet
  const allRevs     = rows.filter(r => String(r.productId) === String(data.productId));
  allRevs.push(data);
  const avg         = (allRevs.reduce((a,r) => a + Number(r.rating), 0) / allRevs.length).toFixed(1);
  const prodSheet   = getOrCreateSheet(SHEETS.products, ['id','name','price','mrp','category','brand','desc','rating','reviewCount','delivery','photos','highlights','colors','emoji','specs']);
  const prodRow     = findRowById(prodSheet, data.productId);
  if (prodRow > 0) {
    prodSheet.getRange(prodRow, 8).setValue(avg);            // rating col
    prodSheet.getRange(prodRow, 9).setValue(allRevs.length); // reviewCount col
  }
  return { ok: true };
}

// ══════════════════════════════════════════════════════════════
// SETTINGS & ZONES
// ══════════════════════════════════════════════════════════════

function getSettings() {
  const sheet = getOrCreateSheet(SHEETS.settings, ['key','value']);
  const rows  = sheetToObjects(sheet);
  const s     = {};
  rows.forEach(r => s[r.key] = r.value);
  return { ok: true, settings: s };
}

function saveSettings(data) {
  const sheet = getOrCreateSheet(SHEETS.settings, ['key','value']);
  Object.entries(data).forEach(([key, value]) => {
    const rows = sheet.getDataRange().getValues();
    const idx  = rows.findIndex(r => r[0] === key);
    if (idx > 0) sheet.getRange(idx + 1, 2).setValue(value);
    else sheet.appendRow([key, value]);
  });
  return { ok: true };
}

function getZones() {
  const sheet = getOrCreateSheet(SHEETS.zones, ['city']);
  const rows  = sheetToObjects(sheet);
  return { ok: true, zones: rows.map(r => r.city).filter(Boolean) };
}

function saveZones(zones) {
  const sheet = getOrCreateSheet(SHEETS.zones, ['city']);
  sheet.clearContents();
  sheet.appendRow(['city']);
  zones.forEach(city => sheet.appendRow([city]));
  return { ok: true };
}
