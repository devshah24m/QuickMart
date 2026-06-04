// ═══════════════════════════════════════════════════════════════
// QuickMart — Google Apps Script Backend  (v3 — CORS fixed)
// ═══════════════════════════════════════════════════════════════

const SHEET_ID = '1P-GbEDwef6d7NTcX3L1Ud2wysFptbm_r_zxMj6nXnGQ';

const SHEETS = {
  products : 'Products',
  users    : 'Users',
  orders   : 'Orders',
  reviews  : 'Reviews',
  settings : 'Settings',
  zones    : 'Zones'
};

// ── CORS headers on every response ───────────────────────────
function corsOutput(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

// ── Simple hash (MD5 via Utilities) ─────────────────────────
function hashPassword(plain) {
  const raw = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, plain, Utilities.Charset.UTF_8);
  return raw.map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

// ── GET handler ──────────────────────────────────────────────
function doGet(e) {
  try {
    // gsPost() sends POST body as ?payload= to work around CORS — handle it here
    if (e.parameter.payload) {
      let body;
      try { body = JSON.parse(e.parameter.payload); } 
      catch(_) { return corsOutput({ ok: false, msg: 'Invalid JSON in payload' }); }
      return handlePost(body);
    }

    const action = e.parameter.action;
    switch (action) {
      case 'getProducts': return corsOutput(getProducts());
      case 'getOrders':   return corsOutput(getOrders(e.parameter.userId, e.parameter.email));
      case 'getUsers':    return corsOutput(getUsers());
      case 'getReviews':  return corsOutput(getReviews(e.parameter.productId));
      case 'getSettings': return corsOutput(getSettings());
      case 'getZones':    return corsOutput(getZones());
      default:            return corsOutput({ ok: false, msg: 'Unknown action: ' + action });
    }
  } catch(err) {
    return corsOutput({ ok: false, msg: err.toString() });
  }
}

// ── POST handler ─────────────────────────────────────────────
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); }
  catch(_) { return corsOutput({ ok: false, msg: 'Invalid JSON' }); }
  return handlePost(body);
}

// ── Shared POST logic (used by both doPost and doGet ?payload=) ──
function handlePost(body) {
  try {
    switch (body.action) {
      case 'saveProduct':   return corsOutput(saveProduct(body.data));
      case 'deleteProduct': return corsOutput(deleteProduct(body.id));
      case 'saveOrder':     return corsOutput(saveOrder(body.data));
      case 'updateOrder':   return corsOutput(updateOrderStatus(body.orderId, body.status));
      case 'registerUser':  return corsOutput(registerUser(body.data));
      case 'loginUser':     return corsOutput(loginUser(body.email, body.password));
      case 'saveReview':    return corsOutput(saveReview(body.data));
      case 'saveSettings':  return corsOutput(saveSettings(body.data));
      case 'saveZones':     return corsOutput(saveZones(body.zones));
      case 'deleteUser':    return corsOutput(deleteUser(body.id));
      default:              return corsOutput({ ok: false, msg: 'Unknown action: ' + body.action });
    }
  } catch(err) {
    return corsOutput({ ok: false, msg: err.toString() });
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
  } else if (sheet.getLastRow() === 0) {
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
    if (String(data[i][0]) === String(id)) return i + 1;
  }
  return -1;
}

function colIndexOf(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  return headers.indexOf(headerName) + 1;
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════

const PRODUCT_HEADERS = ['id','name','price','mrp','category','brand','desc','rating','reviewCount','delivery','photos','highlights','colors','emoji','specs'];

function getProducts() {
  const sheet = getOrCreateSheet(SHEETS.products, PRODUCT_HEADERS);
  const rows  = sheetToObjects(sheet);
  const products = rows
    .filter(r => r.id !== '' && r.id !== null)
    .map(r => ({
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
      images      : r.photos ? String(r.photos).split('|||').filter(Boolean) : [],
      highlights  : r.highlights ? String(r.highlights).split('|||').filter(Boolean) : [],
      colors      : r.colors ? String(r.colors).split(',').map(s => s.trim()).filter(Boolean) : [],
      emoji       : r.emoji || '📦',
      specs       : (() => { try { return r.specs ? JSON.parse(r.specs) : {}; } catch(_){ return {}; } })()
    }));
  return { ok: true, products };
}

function saveProduct(data) {
  const sheet = getOrCreateSheet(SHEETS.products, PRODUCT_HEADERS);
  const safeImages = (data.images || []).map(img => {
    if (img && img.startsWith('data:') && img.length > 45000) return '';
    return img || '';
  }).filter(Boolean);

  const photos     = safeImages.join('|||');
  const highlights = (data.highlights || []).join('|||');
  const colors     = (data.colors || []).join(', ');
  const specs      = JSON.stringify(data.specs || {});

  if (data.id) {
    const row = findRowById(sheet, data.id);
    if (row > 0) {
      const existingRating      = sheet.getRange(row, colIndexOf(sheet, 'rating')).getValue();
      const existingReviewCount = sheet.getRange(row, colIndexOf(sheet, 'reviewCount')).getValue();
      sheet.getRange(row, 1, 1, 15).setValues([[
        data.id, data.name, data.price, data.mrp, data.category, data.brand,
        data.desc, existingRating || 0, existingReviewCount || 0,
        data.deliveryDays || 3, photos, highlights, colors, data.emoji || '📦', specs
      ]]);
      return { ok: true, msg: 'Product updated', id: data.id };
    }
  }

  const allRows = sheet.getDataRange().getValues();
  const maxId   = allRows.slice(1).reduce((m, r) => Math.max(m, Number(r[0]) || 0), 0);
  const newId   = maxId + 1;
  sheet.appendRow([
    newId, data.name, data.price, data.mrp, data.category, data.brand,
    data.desc, 0, 0, data.deliveryDays || 3,
    photos, highlights, colors, data.emoji || '📦', specs
  ]);
  return { ok: true, msg: 'Product saved', id: newId };
}

function deleteProduct(id) {
  const sheet = getOrCreateSheet(SHEETS.products, PRODUCT_HEADERS);
  const row   = findRowById(sheet, id);
  if (row > 0) { sheet.deleteRow(row); return { ok: true }; }
  return { ok: false, msg: 'Product not found' };
}

// ══════════════════════════════════════════════════════════════
// USERS
// ══════════════════════════════════════════════════════════════

const USER_HEADERS = ['id','name','email','password','role','joinedAt'];

function getUsers() {
  const sheet = getOrCreateSheet(SHEETS.users, USER_HEADERS);
  const rows  = sheetToObjects(sheet);
  return {
    ok: true,
    users: rows
      .filter(r => r.id !== '' && r.email !== '')
      .map(r => ({ id: r.id, name: r.name, email: r.email, role: r.role, joinedAt: r.joinedAt }))
  };
}

function registerUser(data) {
  const sheet = getOrCreateSheet(SHEETS.users, USER_HEADERS);
  const rows  = sheetToObjects(sheet);
  if (rows.find(r => r.email === data.email)) {
    return { ok: false, msg: 'Email already registered.' };
  }
  const newId  = Date.now();
  const hashed = hashPassword(data.password);
  sheet.appendRow([newId, data.name, data.email, hashed, 'customer', new Date().toISOString()]);
  return { ok: true, user: { id: newId, name: data.name, email: data.email, role: 'customer' } };
}

function loginUser(email, password) {
  const settings   = getSettings().settings;
  const adminEmail = settings.admin_email || 'admin@quickmart.in';
  const adminPass  = settings.admin_pass  || 'Admin@123';

  if (email === adminEmail && password === adminPass) {
    return { ok: true, user: { id: 0, name: 'Admin', email, role: 'admin' } };
  }

  const sheet  = getOrCreateSheet(SHEETS.users, USER_HEADERS);
  const rows   = sheetToObjects(sheet);
  const hashed = hashPassword(password);
  const user   = rows.find(r => r.email === email && (r.password === hashed || r.password === password));
  if (!user) return { ok: false, msg: 'Invalid email or password.' };

  if (user.password === password) {
    const row    = findRowById(sheet, user.id);
    const passCol = colIndexOf(sheet, 'password');
    if (row > 0 && passCol > 0) sheet.getRange(row, passCol).setValue(hashed);
  }
  return { ok: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

function deleteUser(id) {
  const sheet = getOrCreateSheet(SHEETS.users, USER_HEADERS);
  const row   = findRowById(sheet, id);
  if (row > 0) { sheet.deleteRow(row); return { ok: true }; }
  return { ok: false, msg: 'User not found' };
}

// ══════════════════════════════════════════════════════════════
// ORDERS
// ══════════════════════════════════════════════════════════════

const ORDER_HEADERS = ['orderId','userId','name','phone','email','address','payment','items','total','time','status'];

function getOrders(userId, email) {
  const sheet    = getOrCreateSheet(SHEETS.orders, ORDER_HEADERS);
  const rows     = sheetToObjects(sheet);
  const isAdmin  = !userId && !email;
  const filtered = isAdmin ? rows : rows.filter(r => String(r.userId) === String(userId) || r.email === email);
  return {
    ok: true,
    orders: filtered
      .filter(r => r.orderId !== '' && r.orderId !== null)
      .map(r => ({
        orderId : r.orderId,
        userId  : r.userId,
        name    : r.name,
        phone   : r.phone,
        email   : r.email,
        address : r.address,
        payment : r.payment,
        cart    : (() => { try { return r.items ? JSON.parse(r.items) : []; } catch(_){ return []; } })(),
        total   : Number(r.total),
        time    : r.time,
        status  : r.status || 'Placed'
      }))
  };
}

function saveOrder(data) {
  const sheet = getOrCreateSheet(SHEETS.orders, ORDER_HEADERS);
  const rows  = sheetToObjects(sheet);
  if (rows.find(r => r.orderId === data.orderId)) {
    return { ok: true, orderId: data.orderId, msg: 'Already saved' };
  }
  sheet.appendRow([
    data.orderId, data.userId || '', data.name, data.phone, data.email || '',
    data.address, data.payment, JSON.stringify(data.cart || []),
    data.total, data.time || new Date().toLocaleString(), 'Placed'
  ]);
  return { ok: true, orderId: data.orderId };
}

function updateOrderStatus(orderId, status) {
  const sheet     = getOrCreateSheet(SHEETS.orders, ORDER_HEADERS);
  const statusCol = colIndexOf(sheet, 'status');
  const data      = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(orderId)) {
      sheet.getRange(i + 1, statusCol).setValue(status);
      return { ok: true };
    }
  }
  return { ok: false, msg: 'Order not found' };
}

// ══════════════════════════════════════════════════════════════
// REVIEWS
// ══════════════════════════════════════════════════════════════

const REVIEW_HEADERS = ['productId','userId','name','rating','title','body','date','verified'];

function getReviews(productId) {
  const sheet    = getOrCreateSheet(SHEETS.reviews, REVIEW_HEADERS);
  const rows     = sheetToObjects(sheet);
  const filtered = productId ? rows.filter(r => String(r.productId) === String(productId)) : rows;
  return {
    ok: true,
    reviews: filtered.map(r => ({
      productId: r.productId,
      userId   : r.userId,
      name     : r.name,
      rating   : Number(r.rating),
      title    : r.title,
      body     : r.body,
      date     : r.date,
      verified : r.verified === true || r.verified === 'TRUE'
    }))
  };
}

function saveReview(data) {
  const sheet = getOrCreateSheet(SHEETS.reviews, REVIEW_HEADERS);
  const rows  = sheetToObjects(sheet);
  if (rows.find(r => String(r.productId) === String(data.productId) && String(r.userId) === String(data.userId))) {
    return { ok: false, msg: 'You have already reviewed this product.' };
  }
  sheet.appendRow([data.productId, data.userId, data.name, data.rating, data.title, data.body, data.date, true]);

  const allRevs = [...rows.filter(r => String(r.productId) === String(data.productId)), data];
  const avg     = (allRevs.reduce((a, r) => a + Number(r.rating), 0) / allRevs.length).toFixed(1);
  const prodSheet = getOrCreateSheet(SHEETS.products, PRODUCT_HEADERS);
  const prodRow   = findRowById(prodSheet, data.productId);
  const ratingCol = colIndexOf(prodSheet, 'rating');
  const reviewCol = colIndexOf(prodSheet, 'reviewCount');
  if (prodRow > 0 && ratingCol > 0 && reviewCol > 0) {
    prodSheet.getRange(prodRow, ratingCol).setValue(avg);
    prodSheet.getRange(prodRow, reviewCol).setValue(allRevs.length);
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
  rows.forEach(r => { if (r.key !== '' && r.key !== null) s[r.key] = r.value; });
  return { ok: true, settings: s };
}

function saveSettings(data) {
  const sheet = getOrCreateSheet(SHEETS.settings, ['key','value']);
  Object.entries(data).forEach(([key, value]) => {
    const rows  = sheet.getDataRange().getValues();
    let found   = false;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === key) { sheet.getRange(i + 1, 2).setValue(value); found = true; break; }
    }
    if (!found) sheet.appendRow([key, value]);
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
  sheet.getRange(1, 1, 1, 1).setFontWeight('bold');
  zones.forEach(city => sheet.appendRow([city]));
  return { ok: true };
}


