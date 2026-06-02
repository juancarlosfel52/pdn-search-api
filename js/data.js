/* ============================================================
   IRON ROAD — Data Layer
   Mock data + Firebase/Supabase integration hooks
   ============================================================ */

// ─── Firebase Config (replace with real credentials) ──────
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD05qBZ-HKxWxUGs2uujJdWfDl6IDTnThU",
  authDomain: "paso-del-norte-f63c2.firebaseapp.com",
  projectId: "paso-del-norte-f63c2",
  storageBucket: "paso-del-norte-f63c2.firebasestorage.app",
  messagingSenderId: "583919420801",
  appId: "1:583919420801:web:2d7d357fb0cd7dd0b2d480",
  measurementId: "G-W39XHDLNRP"
};

// ─── Mock Truck Data ──────────────────────────────────────
const TRUCKS = [
  {
    id: "T001",
    make: "Peterbilt",
    model: "389",
    year: 2021,
    trim: "Platinum",
    price: 189500,
    mileage: 312000,
    engine: "Cummins X15 565HP",
    transmission: "Eaton Fuller 18-Speed",
    sleeper: "72\" Flat Top Sleeper",
    cabType: "sleeper",
    condition: "excellent",
    status: "available",
    featured: true,
    dotReady: true,
    color: "Black/Chrome",
    vin: "1XP5DB9X5MD123001",
    location: "Houston, TX",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "244\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "150 gal dual",
      suspension: "Air Ride",
      brakes: "Air Disc"
    },
    features: ["APU", "Inverter", "Fridge", "TV", "Premium Audio", "GPS", "LED Headlights", "Chrome Package"],
    repairNotes: "Fully serviced — new injectors, DPF cleaned, tires replaced 50k ago",
    description: "One of the cleanest 389s on the market. This truck has been owner-operated its entire life and shows in every detail. Full chrome package, custom lighting, and a properly maintained Cummins X15. No deferred maintenance. Ready to roll.",
    financing: true,
    warranty: "30-day powertrain",
    badges: ["featured", "hot"]
  },
  {
    id: "T002",
    make: "Kenworth",
    model: "W900",
    year: 2020,
    trim: "Aerocab",
    price: 165000,
    mileage: 498000,
    engine: "Paccar MX-13 510HP",
    transmission: "Eaton Fuller 10-Speed Auto",
    sleeper: "52\" Flat Top",
    cabType: "sleeper",
    condition: "good",
    status: "available",
    featured: true,
    dotReady: true,
    color: "Midnight Blue/Chrome",
    vin: "2NP2HM6X5LM456002",
    location: "Odessa, TX",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "236\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "120 gal",
      suspension: "Air Ride",
      brakes: "Air Drum"
    },
    features: ["APU", "Bunk Heater", "LED Package", "Chrome Stacks", "Custom Visor"],
    repairNotes: "DPF replaced at 480k, fresh oil service, all lights operational",
    description: "Classic W900 with modern upgrades. Oilfield spec with heavy-duty fifth wheel and reinforced frame. Paccar MX runs strong — recently dyno'd at 490hp. Ready for long haul or local oilfield.",
    financing: true,
    warranty: null,
    badges: ["featured"]
  },
  {
    id: "T003",
    make: "Freightliner",
    model: "Cascadia",
    year: 2022,
    trim: "Evolution",
    price: 142000,
    mileage: 210000,
    engine: "Detroit DD15 505HP",
    transmission: "Detroit DT12 Auto",
    sleeper: "72\" Mid-Roof",
    cabType: "sleeper",
    condition: "excellent",
    status: "available",
    featured: false,
    dotReady: true,
    color: "White/Black",
    vin: "3AKJGPD57LSGB789",
    location: "Dallas, TX",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "228\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "120 gal",
      suspension: "Air Ride",
      brakes: "Air Disc"
    },
    features: ["Detroit Virtual Technician", "Lane Departure Warning", "Auto Transmission", "Solar Panel", "APU"],
    repairNotes: "Single owner, fleet maintained, clean inspection records",
    description: "Latest Cascadia Evolution — built for fuel economy and driver comfort. The DT12 auto makes this an easy drive for any team. Low miles for a 2022. One owner, fleet maintained.",
    financing: true,
    warranty: "60-day powertrain",
    badges: ["new"]
  },
  {
    id: "T004",
    make: "International",
    model: "LT625",
    year: 2019,
    trim: "Pro Star",
    price: 98500,
    mileage: 687000,
    engine: "Cummins ISX15 450HP",
    transmission: "Eaton Fuller 13-Speed",
    sleeper: "48\" Flat Top",
    cabType: "sleeper",
    condition: "fair",
    status: "available",
    featured: false,
    dotReady: false,
    color: "Red",
    vin: "3HSDZAPR4KN456123",
    location: "San Antonio, TX",
    images: [
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "220\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "100 gal",
      suspension: "Leaf/Air",
      brakes: "Air Drum"
    },
    features: ["CB Radio", "Auxiliary Lighting"],
    repairNotes: "Needs DPF cleaning, minor rust on fuel tanks, good rubber all around",
    description: "Working truck at a working price. ISX15 runs strong despite mileage. Some cosmetic wear but mechanically sound. Great for fleet buyer or owner-operator looking for an entry-level rig.",
    financing: true,
    warranty: null,
    badges: []
  },
  {
    id: "T005",
    make: "Peterbilt",
    model: "579",
    year: 2023,
    trim: "Ultracab",
    price: 215000,
    mileage: 89000,
    engine: "Paccar MX-13 510HP",
    transmission: "Eaton Fuller Advantage Auto",
    sleeper: "76\" Ultracab",
    cabType: "sleeper",
    condition: "excellent",
    status: "available",
    featured: true,
    dotReady: true,
    color: "Charcoal Matte/Chrome",
    vin: "1XPBDP9X7ND567890",
    location: "Houston, TX",
    images: [
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "252\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "150 gal dual",
      suspension: "Air Ride",
      brakes: "Air Disc"
    },
    features: ["SmartNav", "Driver Coaching", "APU", "Fridge", "Microwave", "TV", "Premium Sound", "LED Everything", "Custom Interior"],
    repairNotes: "Like new. Under factory warranty through 2024. No issues.",
    description: "The flagship 579 Ultracab — as close to a luxury apartment on wheels as it gets. Paccar MX-13 with Eaton auto is the smoothest combo on the highway. If you're running the road, run it right.",
    financing: true,
    warranty: "Factory remaining + 90-day dealer warranty",
    badges: ["featured", "new"]
  },
  {
    id: "T006",
    make: "Kenworth",
    model: "T680",
    year: 2021,
    trim: "Next Gen",
    price: 158000,
    mileage: 345000,
    engine: "Paccar MX-13 455HP",
    transmission: "Eaton Fuller 10-Speed Auto",
    sleeper: "76\" High Roof",
    cabType: "sleeper",
    condition: "good",
    status: "available",
    featured: false,
    dotReady: true,
    color: "Silver/Black",
    vin: "1XKJD49X1MJ789001",
    location: "Midland, TX",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
    ],
    specs: {
      gvwr: "80,000 lbs",
      wheelbase: "238\"",
      axles: "6x4",
      fuel: "Diesel",
      tankCapacity: "120 gal",
      suspension: "Air Ride",
      brakes: "Air Disc"
    },
    features: ["APU", "Panel LED Lighting", "Fridge", "TV", "GPS"],
    repairNotes: "Recent DEF system service, new clutch at 330k, tires at 60%",
    description: "Next Gen T680 with the aerodynamic package — fuel economy king on the highway. Clean title, consistent maintenance history. Oilfield-ready with heavy fifth wheel.",
    financing: true,
    warranty: "30-day powertrain",
    badges: []
  }
];

// ─── Utility: Format currency ─────────────────────────────
function formatPrice(n) {
  return '$' + n.toLocaleString();
}
function formatMileage(n) {
  return n.toLocaleString() + ' mi';
}

// ─── Filter trucks ────────────────────────────────────────
function filterTrucks(filters = {}) {
  return TRUCKS.filter(t => {
    if (filters.make && t.make !== filters.make) return false;
    if (filters.cabType && t.cabType !== filters.cabType) return false;
    if (filters.condition && t.condition !== filters.condition) return false;
    if (filters.dotReady && !t.dotReady) return false;
    if (filters.featured && !t.featured) return false;
    if (filters.maxPrice && t.price > filters.maxPrice) return false;
    if (filters.minPrice && t.price < filters.minPrice) return false;
    if (filters.maxMileage && t.mileage > filters.maxMileage) return false;
    if (filters.yearMin && t.year < filters.yearMin) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const haystack = `${t.make} ${t.model} ${t.year} ${t.engine} ${t.location}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

function getTruck(id) {
  return TRUCKS.find(t => t.id === id) || null;
}

// ─── Lead capture ─────────────────────────────────────────
async function submitLead(data) {
  // Replace with Firebase/Supabase call
  console.log('[Lead]', data);
  return { success: true, id: 'LEAD_' + Date.now() };
}

// ─── Financing calculator ─────────────────────────────────
function calcPayment({ price, downPercent = 10, rateAPR = 8.9, termMonths = 60 }) {
  const principal = price * (1 - downPercent / 100);
  const r = (rateAPR / 100) / 12;
  const payment = principal * (r * Math.pow(1 + r, termMonths)) / (Math.pow(1 + r, termMonths) - 1);
  return {
    monthly: Math.round(payment),
    principal: Math.round(principal),
    down: Math.round(price * downPercent / 100),
    totalCost: Math.round(payment * termMonths)
  };
}

// ─── AI description generator (stub — wire to Claude API) ─
async function generateAIDescription(truck) {
  const prompt = `Write a premium, compelling truck listing description for a ${truck.year} ${truck.make} ${truck.model} with ${formatMileage(truck.mileage)}, ${truck.engine} engine. Audience: owner-operators and diesel enthusiasts. Tone: confident, road-authentic, no fluff. Max 3 sentences.`;
  // Wire to Claude API in production
  return truck.description;
}

// ─── Export formatting ────────────────────────────────────
function generateListing(truck, platform = 'facebook') {
  const base = {
    title: `${truck.year} ${truck.make} ${truck.model} — ${truck.engine} | ${formatMileage(truck.mileage)} | ${truck.location}`,
    price: truck.price,
    body: truck.description + '\n\n' + [
      `Year: ${truck.year}`,
      `Make: ${truck.make}`,
      `Model: ${truck.model}`,
      `Engine: ${truck.engine}`,
      `Transmission: ${truck.transmission}`,
      `Mileage: ${formatMileage(truck.mileage)}`,
      `Sleeper: ${truck.sleeper}`,
      `VIN: ${truck.vin}`,
      `Location: ${truck.location}`,
      `Price: ${formatPrice(truck.price)}`
    ].join('\n')
  };
  if (platform === 'facebook') {
    return base.title + '\n\n' + base.body + '\n\n📞 Call or text for more info.';
  }
  if (platform === 'craigslist') {
    return base.title + '\n\n' + base.body + '\n\nNo spam. Serious buyers only.';
  }
  return base.title + '\n\n' + base.body;
}

// ─── Saved trucks (localStorage) ─────────────────────────
const Saved = {
  get() { try { return JSON.parse(localStorage.getItem('ir_saved') || '[]'); } catch { return []; } },
  toggle(id) {
    let saved = this.get();
    if (saved.includes(id)) { saved = saved.filter(s => s !== id); }
    else { saved.push(id); }
    localStorage.setItem('ir_saved', JSON.stringify(saved));
    return saved.includes(id);
  },
  has(id) { return this.get().includes(id); }
};

// ─── Truck makes list ─────────────────────────────────────
const MAKES = [...new Set(TRUCKS.map(t => t.make))].sort();
