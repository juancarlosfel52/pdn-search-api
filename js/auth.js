/* ================================================================
   PASO DEL NORTE — Auth Layer
   Firebase Auth + Firestore user data
   Load AFTER config.js and after Firebase SDK scripts
   ================================================================ */

// ── Init Firebase ─────────────────────────────────────────────────
let _firebaseApp = null;
let _auth = null;
let _db = null;

function pdnFirebaseInit() {
  if (_firebaseApp) return;
  try {
    _firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
    _auth = firebase.auth();
    _db   = firebase.firestore();
  } catch(e) {
    console.warn('[PDN Auth] Firebase not configured yet:', e.message);
  }
}

function pdnAuth() { pdnFirebaseInit(); return _auth; }
function pdnDB()   { pdnFirebaseInit(); return _db; }

// ── Auth actions ──────────────────────────────────────────────────
async function pdnSignIn(email, password) {
  return pdnAuth().signInWithEmailAndPassword(email, password);
}

async function pdnSignUp(email, password, profile) {
  const cred = await pdnAuth().createUserWithEmailAndPassword(email, password);
  await cred.user.updateProfile({ displayName: profile.name });
  // Create Firestore user doc
  await pdnDB().collection('users').doc(cred.user.uid).set({
    name: profile.name,
    email,
    company: profile.company || '',
    phone: profile.phone || '',
    location: profile.location || '',
    tier: 'free',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    usage: { posts_today: 0, docs_today: 0, date: '' }
  });
  return cred;
}

async function pdnSignOut() {
  await pdnAuth().signOut();
  location.href = 'index.html';
}

function pdnOnAuthChange(callback) {
  pdnFirebaseInit();
  if (!_auth) { callback(null); return; }
  return _auth.onAuthStateChanged(callback);
}

function pdnCurrentUser() {
  pdnFirebaseInit();
  return _auth?.currentUser || null;
}

// ── User data ─────────────────────────────────────────────────────
async function pdnGetUserData(uid) {
  const doc = await pdnDB().collection('users').doc(uid).get();
  return doc.exists ? { uid, ...doc.data() } : null;
}

async function pdnUpdateUserData(uid, data) {
  await pdnDB().collection('users').doc(uid).update(data);
}

// ── User's trucks ─────────────────────────────────────────────────
async function pdnGetUserTrucks(uid) {
  const snap = await pdnDB().collection('users').doc(uid).collection('trucks')
    .orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function pdnAddUserTruck(uid, truck) {
  const ref = await pdnDB().collection('users').doc(uid).collection('trucks').add({
    ...truck,
    status: 'available',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  return ref.id;
}

async function pdnUpdateUserTruck(uid, truckId, data) {
  await pdnDB().collection('users').doc(uid).collection('trucks').doc(truckId).update(data);
}

async function pdnDeleteUserTruck(uid, truckId) {
  await pdnDB().collection('users').doc(uid).collection('trucks').doc(truckId).delete();
}

// ── Tier gates ────────────────────────────────────────────────────
const TIER_LIMITS = {
  free:     { posts_per_day: 3,  trucks: 3,  docs_per_day: 5  },
  pro:      { posts_per_day: 999, trucks: 999, docs_per_day: 999 },
  business: { posts_per_day: 999, trucks: 999, docs_per_day: 999 }
};

async function pdnCheckPostLimit(uid) {
  const data = await pdnGetUserData(uid);
  if (!data) return true;
  const today = new Date().toDateString();
  const limits = TIER_LIMITS[data.tier] || TIER_LIMITS.free;
  const usage = data.usage || {};
  const count = usage.date === today ? (usage.posts_today || 0) : 0;
  return count < limits.posts_per_day;
}

async function pdnIncrementPostCount(uid) {
  const today = new Date().toDateString();
  const data = await pdnGetUserData(uid);
  const usage = data?.usage || {};
  const count = usage.date === today ? (usage.posts_today || 0) : 0;
  await pdnUpdateUserData(uid, { usage: { ...usage, posts_today: count + 1, date: today } });
}

// ── Nav: inject auth state into every page ────────────────────────
function pdnInitNavAuth() {
  pdnOnAuthChange(async user => {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Remove existing auth btn if any
    navActions.querySelector('.nav-auth-btn')?.remove();

    const btn = document.createElement('a');
    btn.className = 'btn btn-sm nav-auth-btn';

    if (user) {
      const initials = (user.displayName || user.email || 'U').slice(0, 2).toUpperCase();
      const name     = (user.displayName || 'My Account').split(' ')[0]; // first name only
      btn.href = 'dashboard.html';
      btn.style.cssText = 'background:var(--amber);color:var(--black);font-weight:800;font-family:var(--font-display);letter-spacing:.04em;text-transform:uppercase;';
      btn.innerHTML = `
        <span class="nav-auth-avatar" style="background:rgba(0,0,0,.25);color:var(--black);">${initials}</span>
        <span class="nav-auth-name">${name}</span>`;
    } else {
      btn.href = 'login.html';
      btn.className += ' btn-primary';
      btn.style.cssText = 'font-size:11px;padding:6px 12px;';
      btn.textContent = 'Sign In';
    }
    navActions.insertBefore(btn, navActions.querySelector('.nav-hamburger'));
  });
}

// Auto-init nav auth on every page
document.addEventListener('DOMContentLoaded', pdnInitNavAuth);
