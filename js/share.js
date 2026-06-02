/* ================================================================
   PASO DEL NORTE — Share Utility
   Used by detail.html, inventory.js, marketing.html
   ================================================================ */

function pdnDetailURL(truckId) {
  const base = location.origin + location.pathname.replace(/[^/]+$/, '');
  return `${base}detail.html?id=${truckId}`;
}

function pdnShareMsg(truck) {
  return `🚛 ${truck.year} ${truck.make} ${truck.model} — ${formatPrice(truck.price)} | ${formatMileage(truck.mileage)} | Financing available! Paso Del Norte Truck Sales, Houston TX`;
}

/* ── Platform openers ── */
function shareToFacebook(url) {
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    '_blank', 'width=620,height=460,scrollbars=yes'
  );
}

function shareToWhatsApp(text, url) {
  window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank');
}

function shareToTwitter(text, url) {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank', 'width=600,height=400'
  );
}

function shareViaSMS(text, url) {
  location.href = `sms:?body=${encodeURIComponent(text + '\n' + url)}`;
}

async function pdnCopyLink(url, btn) {
  try {
    await navigator.clipboard.writeText(url);
    if (btn) { const orig = btn.textContent; btn.textContent = '✅ Copied!'; setTimeout(() => btn.textContent = orig, 2000); }
  } catch(e) { prompt('Copy this link:', url); }
}

/* Native share sheet — opens on mobile (WhatsApp, Messages, Facebook, etc. all appear) */
async function pdnNativeShare(title, text, url) {
  if (navigator.share) {
    try { await navigator.share({ title, text, url }); return true; }
    catch(e) { return false; }
  }
  return false;
}

/* ── Quick share by truck ID (used in inventory cards) ── */
function quickShareFacebook(truckId, event) {
  event.stopPropagation();
  shareToFacebook(pdnDetailURL(truckId));
}

function quickShareWhatsApp(truckId, event) {
  event.stopPropagation();
  const t = TRUCKS.find(x => x.id === truckId);
  if (!t) return;
  shareToWhatsApp(pdnShareMsg(t), pdnDetailURL(truckId));
}

async function quickNativeShare(truckId, event) {
  event.stopPropagation();
  const t = TRUCKS.find(x => x.id === truckId);
  if (!t) return;
  const url = pdnDetailURL(truckId);
  const shared = await pdnNativeShare(
    `${t.year} ${t.make} ${t.model}`,
    pdnShareMsg(t),
    url
  );
  if (!shared) shareToFacebook(url); // fallback to Facebook if no native share
}
