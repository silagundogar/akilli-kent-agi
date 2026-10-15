/**
 * Akıllı Kent Ağı (AKA) - Ana Uygulama & İş Mantığı v2.0
 * Yapay Zeka Vision Hasar Tespiti, WhatsApp Chatbot, Excel & PDF Raporu Entegreli
 */

// ==========================================
// 1. KATEGORİ VE VARSAYILAN TANIMLAR
// ==========================================
const CATEGORIES = [
  { id: 'yol', name: 'Yol & Asfalt', icon: 'cone', dept: 'Fen İşleri Dairesi', color: 'orange' },
  { id: 'su', name: 'Su & Kanalizasyon', icon: 'droplet', dept: 'Su ve Kanalizasyon İdaresi', color: 'blue' },
  { id: 'lamba', name: 'Sokak Lambası', icon: 'lightbulb', dept: 'Fen İşleri Dairesi', color: 'amber' },
  { id: 'park', name: 'Park & Bahçeler', icon: 'trees', dept: 'Park ve Bahçeler Müdürlüğü', color: 'emerald' },
  { id: 'temizlik', name: 'Temizlik & Çöp', icon: 'trash-2', dept: 'Temizlik İşleri Müdürlüğü', color: 'teal' },
  { id: 'zabita', name: 'Zabıta & Çevre', icon: 'shield-alert', dept: 'Zabıta & Çevre Müdürlüğü', color: 'purple' },
];

// Gerçekçi test fotoğrafları
const SAMPLE_PHOTOS = {
  pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  repaired_road: "https://images.unsplash.com/photo-1584463699042-32a2656360c6?auto=format&fit=crop&w=800&q=80",
  streetlight_broken: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
  streetlight_fixed: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
  park_broken: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
  park_fixed: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
  water_leak: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  water_fixed: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
};

// Zengin Demo Başlangıç Verileri
const INITIAL_DEMO_ISSUES = [
  {
    id: "iss-1",
    code: "AKA-2026-1042",
    title: "Cumhuriyet Caddesinde Derin Asfalt Çukuru",
    desc: "Araçların lastiklerine zarar veriyor, özellikle yağmurlu havada su biriktiği için fark edilmiyor. Acil yama gerekiyor.",
    category: "Yol & Asfalt",
    department: "Fen İşleri Dairesi",
    urgency: "Acil",
    status: "Sahada",
    neighborhood: "Cumhuriyet Mahallesi",
    address: "Cumhuriyet Cad. No: 48 karşısı",
    lat: 39.0682,
    lng: 29.0145,
    citizenName: "Ahmet Yılmaz",
    citizenPhone: "0532 456 78 90",
    isAnonymous: false,
    createdAt: "2026-10-15T08:15:00.000Z",
    assignedTeam: "3. Bölge Sıcak Asfalt Ekibi",
    fieldNote: "Ekip bölgeye sevk edildi, zemin kazıma ve yama aracı sahada çalışıyor.",
    imgBefore: SAMPLE_PHOTOS.pothole,
    imgAfter: null,
    rating: null,
    feedback: null
  },
  {
    id: "iss-2",
    code: "AKA-2026-1038",
    title: "Sokak Lambası 3 Gündür Yanmıyor",
    desc: "Okul çıkış saatinde sokak çok karanlık kalıyor, çocuklar ve yayalar için güvenlik riski oluşturuyor.",
    category: "Sokak Lambası",
    department: "Fen İşleri Dairesi",
    urgency: "Normal",
    status: "Cozuldu",
    neighborhood: "Atatürk Mahallesi",
    address: "Gül Sokak No: 14 önü",
    lat: 39.0625,
    lng: 29.0089,
    citizenName: "Merve Çelik",
    citizenPhone: "0543 210 98 76",
    isAnonymous: false,
    createdAt: "2026-10-14T19:30:00.000Z",
    assignedTeam: "Elektrik ve Aydınlatma Timi A",
    fieldNote: "Trafo sigortası ve lamba armatürü yenisiyle değiştirildi, test edildi ve aktif hale getirildi.",
    imgBefore: SAMPLE_PHOTOS.streetlight_broken,
    imgAfter: SAMPLE_PHOTOS.streetlight_fixed,
    rating: 5,
    feedback: "Çok hızlı ilgilendiniz, aynı gün içerisinde çözüldü. Teşekkür ederiz!"
  },
  {
    id: "iss-3",
    code: "AKA-2026-1025",
    title: "Parktaki Çocuk Salıncağının Zinciri Koptu",
    desc: "Barış Parkındaki iki salıncaktan birinin zinciri kopmuş durumda, çocuklar düşme tehlikesi yaşıyor.",
    category: "Park & Bahçeler",
    department: "Park ve Bahçeler Müdürlüğü",
    urgency: "Normal",
    status: "Cozuldu",
    neighborhood: "Barış Mahallesi",
    address: "Barış Çocuk Parkı İçi",
    lat: 39.0710,
    lng: 29.0220,
    citizenName: "Gizli Vatandaş",
    citizenPhone: "",
    isAnonymous: true,
    createdAt: "2026-10-13T14:20:00.000Z",
    assignedTeam: "Park Bakım & Onarım Ekibi 2",
    fieldNote: "Emniyet zinciri ve oturak yenilenerek sabitlendi.",
    imgBefore: SAMPLE_PHOTOS.park_broken,
    imgAfter: SAMPLE_PHOTOS.park_fixed,
    rating: 5,
    feedback: "Hızlı dönüş için belediyemize teşekkürler."
  },
  {
    id: "iss-4",
    code: "AKA-2026-1051",
    title: "Ana Boru Patlağı / Kaldırımdan Su Fışkırıyor",
    desc: "Şebeke borusu patladı, temiz su boşa akıyor ve yolda göllenme yaptı.",
    category: "Su & Kanalizasyon",
    department: "Su ve Kanalizasyon İdaresi",
    urgency: "Acil",
    status: "Inceleniyor",
    neighborhood: "Fevzi Çakmak Mahallesi",
    address: "İstiklal Cad. No: 82",
    lat: 39.0590,
    lng: 29.0180,
    citizenName: "Mehmet Demir",
    citizenPhone: "0555 123 45 67",
    isAnonymous: false,
    createdAt: "2026-10-15T09:40:00.000Z",
    assignedTeam: "Acil Su Arıza Nöbetçi Ekibi",
    fieldNote: "Vana kısma işlemi için hat operatörüne bilgi verildi.",
    imgBefore: SAMPLE_PHOTOS.water_leak,
    imgAfter: null,
    rating: null,
    feedback: null
  },
  {
    id: "iss-5",
    code: "AKA-2026-1060",
    title: "Çöp Konteyneri Dolup Taşmış",
    desc: "Konteyner tamamen dolmuş, etrafa poşetler saçılmış ve sokakta koku oluşuyor.",
    category: "Temizlik & Çöp",
    department: "Temizlik İşleri Müdürlüğü",
    urgency: "Düşük",
    status: "Yeni",
    neighborhood: "Yeni Mahalle",
    address: "Çınar Sokak Kesişimi",
    lat: 39.0640,
    lng: 29.0260,
    citizenName: "Seda Aksoy",
    citizenPhone: "0505 987 65 43",
    isAnonymous: false,
    createdAt: "2026-10-15T10:10:00.000Z",
    assignedTeam: null,
    fieldNote: null,
    imgBefore: SAMPLE_PHOTOS.pothole,
    imgAfter: null,
    rating: null,
    feedback: null
  }
];

// ==========================================
// 2. STATE & VERİ YÖNETİMİ
// ==========================================
let issues = [];
let selectedCategoryId = 'yol';
let currentPhotoDataUrl = null;
let currentActiveMarker = null;
let citizenFormMap = null;
let citizenFormMarker = null;
let publicCityMap = null;
let publicMarkersLayer = null;
let activeModalIssueId = null;

// Son AI Analiz Çıktısı State'i
let lastAiAnalysis = null;

// Mahalle koordinat merkezi
const CITY_CENTER = [39.0650, 29.0150];

function loadIssues() {
  const stored = localStorage.getItem('aka_issues_data');
  if (stored) {
    try {
      issues = JSON.parse(stored);
    } catch (e) {
      issues = [...INITIAL_DEMO_ISSUES];
    }
  } else {
    issues = [...INITIAL_DEMO_ISSUES];
    saveIssues();
  }
}

function saveIssues() {
  localStorage.setItem('aka_issues_data', JSON.stringify(issues));
  updateStats();
  renderAdminTable();
  if (publicCityMap) {
    renderPublicMapMarkers();
  }
}

function resetToDemoData() {
  if (confirm("Örnek veriler sıfırlansın ve varsayılan kayıtlar yüklensin mi?")) {
    issues = JSON.parse(JSON.stringify(INITIAL_DEMO_ISSUES));
    saveIssues();
    renderRecentTrackChips();
    triggerNotification("Demo verileri başarıyla sıfırlandı ve güncellendi.", "AKA-SİSTEM");
  }
}

// ==========================================
// 3. SAYFA BAŞLATMA & ETKİLEŞİM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadIssues();
  renderCategorySelectors();
  initCitizenFormMap();
  updateStats();
  renderRecentTrackChips();
  renderAdminTable();
  initChatbot();

  // Lucide Icons Render
  if (window.lucide) {
    lucide.createIcons();
  }
});

// ==========================================
// 4. KARANLIK / AYDINLIK TEMA YÖNETİMİ
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('aka_theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
    updateThemeIcon(true);
  } else {
    document.documentElement.classList.remove('dark');
    updateThemeIcon(false);
  }
}

function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('aka_theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
  if (window.lucide) lucide.createIcons();
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('theme-icon');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  }
}

// Portal Switcher (Vatandaş vs Belediye)
function switchPortal(portal) {
  const citizenPortal = document.getElementById('portal-citizen');
  const adminPortal = document.getElementById('portal-admin');
  const btnCitizen = document.getElementById('btn-citizen-mode');
  const btnAdmin = document.getElementById('btn-admin-mode');

  if (portal === 'citizen') {
    citizenPortal.classList.remove('hidden');
    adminPortal.classList.add('hidden');
    btnCitizen.className = "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm";
    btnAdmin.className = "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
    setTimeout(() => {
      if (citizenFormMap) citizenFormMap.invalidateSize();
    }, 150);
  } else {
    citizenPortal.classList.add('hidden');
    adminPortal.classList.remove('hidden');
    btnAdmin.className = "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm";
    btnCitizen.className = "flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white";
    renderAdminTable();
    initAnalyticsCharts();
  }
  if (window.lucide) lucide.createIcons();
}

// Vatandaş Alt Sekmeleri (Form / Takip / Harita)
function switchCitizenTab(tab) {
  const viewForm = document.getElementById('citizen-view-form');
  const viewTrack = document.getElementById('citizen-view-track');
  const viewMap = document.getElementById('citizen-view-map');

  const tabForm = document.getElementById('c-tab-form');
  const tabTrack = document.getElementById('c-tab-track');
  const tabMap = document.getElementById('c-tab-map');

  viewForm.classList.add('hidden');
  viewTrack.classList.add('hidden');
  viewMap.classList.add('hidden');

  const defaultTabClass = "flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800";
  const activeTabClass = "flex items-center space-x-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all bg-blue-600 text-white shadow-md shadow-blue-500/20";

  tabForm.className = defaultTabClass;
  tabTrack.className = defaultTabClass;
  tabMap.className = defaultTabClass;

  if (tab === 'form') {
    viewForm.classList.remove('hidden');
    tabForm.className = activeTabClass;
    setTimeout(() => { if (citizenFormMap) citizenFormMap.invalidateSize(); }, 200);
  } else if (tab === 'track') {
    viewTrack.classList.remove('hidden');
    tabTrack.className = activeTabClass;
    renderRecentTrackChips();
  } else if (tab === 'map') {
    viewMap.classList.remove('hidden');
    tabMap.className = activeTabClass;
    setTimeout(() => {
      initPublicCityMap();
      if (publicCityMap) publicCityMap.invalidateSize();
    }, 200);
  }
  if (window.lucide) lucide.createIcons();
}

// Belediye Alt Sekmeleri (Tablo vs Analitik)
function switchAdminTab(tab) {
  const viewTable = document.getElementById('admin-view-table');
  const viewAnalytics = document.getElementById('admin-view-analytics');
  const btnTable = document.getElementById('adm-tab-table-btn');
  const btnAnalytics = document.getElementById('adm-tab-analytics-btn');

  if (tab === 'table') {
    viewTable.classList.remove('hidden');
    viewAnalytics.classList.add('hidden');
    btnTable.className = "px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white shadow-sm flex items-center space-x-2";
    btnAnalytics.className = "px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2";
    renderAdminTable();
  } else {
    viewTable.classList.add('hidden');
    viewAnalytics.classList.remove('hidden');
    btnAnalytics.className = "px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white shadow-sm flex items-center space-x-2";
    btnTable.className = "px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-2";
    initAnalyticsCharts();
  }
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 5. KATEGORİ SEÇİCİ & FORM İŞLEMLERİ
// ==========================================
function renderCategorySelectors() {
  const container = document.getElementById('category-selector-container');
  if (!container) return;

  container.innerHTML = CATEGORIES.map((cat) => {
    const isSelected = cat.id === selectedCategoryId;
    return `
      <div onclick="selectCategory('${cat.id}')" 
           class="p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-1.5 ${
             isSelected 
               ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 text-blue-900 dark:text-blue-300 shadow-sm ring-1 ring-blue-500' 
               : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
           }">
        <div class="w-10 h-10 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'} flex items-center justify-center">
          <i data-lucide="${cat.icon}" class="w-5 h-5"></i>
        </div>
        <span class="text-xs font-bold leading-tight">${cat.name}</span>
        <span class="text-[10px] text-slate-400 font-medium truncate w-full">${cat.dept.split(' ')[0]}</span>
      </div>
    `;
  }).join('');

  if (window.lucide) lucide.createIcons();
}

function selectCategory(id) {
  selectedCategoryId = id;
  renderCategorySelectors();
}

// Anonim İhbar Kontrolü
function toggleAnonymous(checked) {
  const inputs = document.getElementById('contact-inputs');
  if (checked) {
    inputs.style.opacity = '0.4';
    inputs.style.pointerEvents = 'none';
  } else {
    inputs.style.opacity = '1';
    inputs.style.pointerEvents = 'auto';
  }
}

// Fotoğraf Yükleme & Önizleme
function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    currentPhotoDataUrl = evt.target.result;
    showPhotoPreview(currentPhotoDataUrl);
    runAiDamageAnalysis(selectedCategoryId);
  };
  reader.readAsDataURL(file);
}

function loadSamplePhoto() {
  let sample = SAMPLE_PHOTOS.pothole;
  if (selectedCategoryId === 'lamba') sample = SAMPLE_PHOTOS.streetlight_broken;
  else if (selectedCategoryId === 'su') sample = SAMPLE_PHOTOS.water_leak;
  else if (selectedCategoryId === 'park') sample = SAMPLE_PHOTOS.park_broken;

  currentPhotoDataUrl = sample;
  showPhotoPreview(sample);
  runAiDamageAnalysis(selectedCategoryId);
}

function showPhotoPreview(src) {
  const placeholder = document.getElementById('photo-upload-placeholder');
  const container = document.getElementById('photo-preview-container');
  const img = document.getElementById('photo-preview-img');

  img.src = src;
  placeholder.classList.add('hidden');
  container.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();
}

function removePhoto(e) {
  if (e) e.stopPropagation();
  currentPhotoDataUrl = null;
  const placeholder = document.getElementById('photo-upload-placeholder');
  const container = document.getElementById('photo-preview-container');
  const input = document.getElementById('input-photo');
  const aiCard = document.getElementById('ai-damage-result-card');
  const scannerOverlay = document.getElementById('ai-scanner-overlay');

  input.value = '';
  placeholder.classList.remove('hidden');
  container.classList.add('hidden');
  if (aiCard) aiCard.classList.add('hidden');
  if (scannerOverlay) scannerOverlay.classList.add('hidden');
  lastAiAnalysis = null;
}

// ==========================================
// 6. 🤖 YAPAY ZEKA (AI) HASAR TESPİT MOTORU
// ==========================================
function runAiDamageAnalysis(categoryId) {
  const scannerOverlay = document.getElementById('ai-scanner-overlay');
  const aiCard = document.getElementById('ai-damage-result-card');

  if (!scannerOverlay || !aiCard) return;

  // Lazer tarayıcıyı başlat
  scannerOverlay.classList.remove('hidden');
  aiCard.classList.add('hidden');

  // AI Analiz Simülasyonu (1.2 saniye gerçekçi gecikme)
  setTimeout(() => {
    scannerOverlay.classList.add('hidden');
    aiCard.classList.remove('hidden');

    let analysis = {
      detectedType: "Yol Yüzeyi Çökmesi / Derin Asfalt Çukuru (Pothole)",
      severity: 88,
      severityLabel: "🚨 Hasar Şiddeti: %88 (Kritik)",
      dept: "Fen İşleri Dairesi (~2.5 Saat)",
      categoryId: "yol",
      urgency: "Acil",
      suggestedTitle: "Caddede Araç Trafiğini Tehlikeye Atan Derin Asfalt Çukuru",
      suggestedDesc: "AKA Vision AI Analizi: Yaklaşık 45cm çapında ve 8cm derinliğinde yol yüzeyi deformasyonu tespit edildi. Yağış ve araç yükü sebebiyle kazaya yol açabilir. Sıcak asfalt yama ekibi yönlendirilmesi önerilir."
    };

    if (categoryId === 'lamba') {
      analysis = {
        detectedType: "Sokak Armatürü & Hat Kesintisi / Işık Akısı Yok",
        severity: 72,
        severityLabel: "⚠️ Hasar Şiddeti: %72 (Önemli)",
        dept: "Fen İşleri (Aydınlatma Timi) (~3 Saat)",
        categoryId: "lamba",
        urgency: "Normal",
        suggestedTitle: "Sokak Lambası Yanmıyor / Gece Güvenlik Riski",
        suggestedDesc: "AKA Vision AI Analizi: Lamba direği fiziki olarak sağlam, ancak gece aktif değil. Balast veya ampul arızası tahmin edilmektedir."
      };
    } else if (categoryId === 'su') {
      analysis = {
        detectedType: "Temiz Su Şebekesi Boru Deformasyonu / Sızıntı",
        severity: 92,
        severityLabel: "🚨 Hasar Şiddeti: %92 (Acil Müdahale)",
        dept: "Su ve Kanalizasyon İdaresi (~1.5 Saat)",
        categoryId: "su",
        urgency: "Acil",
        suggestedTitle: "Yeraltı Temiz Su Şebekesi Patlağı / Kaldırımdan Su Çıkışı",
        suggestedDesc: "AKA Vision AI Analizi: Yüksek debili yüzey akışı tespit edildi. Şebeke basınç vanasının derhal kapatılması ve boru değişimi gereklidir."
      };
    } else if (categoryId === 'park') {
      analysis = {
        detectedType: "Çocuk Oyun Grubu Mekanik Hasarı / Kopuk Parça",
        severity: 78,
        severityLabel: "⚠️ Hasar Şiddeti: %78 (Tehlike)",
        dept: "Park ve Bahçeler Müdürlüğü (~4 Saat)",
        categoryId: "park",
        urgency: "Normal",
        suggestedTitle: "Parktaki Çocuk Salıncağı Zincirinde Kopukluk",
        suggestedDesc: "AKA Vision AI Analizi: Taşıyıcı zincir bağlantı noktasından ayrılmıştır. Çocukların kullanımına karşı güvenlik bandı çekilmeli ve aparat yenilenmelidir."
      };
    }

    lastAiAnalysis = analysis;

    document.getElementById('ai-detected-type').textContent = analysis.detectedType;
    document.getElementById('ai-detected-dept').textContent = analysis.dept;
    document.getElementById('ai-badge-severity').textContent = analysis.severityLabel;

    triggerNotification("Yapay zeka görseli taradı ve hasar raporunu çıkardı.", "AI-VISION");
    if (window.lucide) lucide.createIcons();
  }, 1200);
}

function applyAiSuggestionsToForm() {
  if (!lastAiAnalysis) return;

  document.getElementById('input-title').value = lastAiAnalysis.suggestedTitle;
  document.getElementById('input-desc').value = lastAiAnalysis.suggestedDesc;
  selectCategory(lastAiAnalysis.categoryId);

  // Konfeti ve ses efekti
  if (window.confetti) {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  }
  triggerNotification("Yapay zeka önerileri forma aktarıldı!", "AI-OTOMATİK");
}

// ==========================================
// 7. İNTERAKTİF HARİTALAR (LEAFLET)
// ==========================================
function initCitizenFormMap() {
  const mapElement = document.getElementById('citizen-form-map');
  if (!mapElement || citizenFormMap) return;

  citizenFormMap = L.map('citizen-form-map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(CITY_CENTER, 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(citizenFormMap);

  citizenFormMarker = L.marker(CITY_CENTER, {
    draggable: true
  }).addTo(citizenFormMap);

  citizenFormMarker.on('dragend', function () {
    const pos = citizenFormMarker.getLatLng();
    updateFormCoordinates(pos.lat, pos.lng);
  });

  citizenFormMap.on('click', function (e) {
    citizenFormMarker.setLatLng(e.latlng);
    updateFormCoordinates(e.latlng.lat, e.latlng.lng);
  });
}

function updateFormCoordinates(lat, lng) {
  const coordDisplay = document.getElementById('coord-display');
  if (coordDisplay) {
    coordDisplay.textContent = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  const inputAddress = document.getElementById('input-address');
  if (inputAddress && (!inputAddress.value || inputAddress.value.includes('Konum Noktası'))) {
    inputAddress.value = `Seçilen Konum Noktası (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
  }
}

function locateUserGPS() {
  if (!navigator.geolocation) {
    alert("Tarayıcınız konum servisini desteklemiyor.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      if (citizenFormMap && citizenFormMarker) {
        citizenFormMap.setView([lat, lng], 16);
        citizenFormMarker.setLatLng([lat, lng]);
        updateFormCoordinates(lat, lng);
        triggerNotification("Mevcut konumunuz başarıyla tespit edildi.", "GPS-AKTİF");
      }
    },
    () => {
      const jitterLat = CITY_CENTER[0] + (Math.random() - 0.5) * 0.01;
      const jitterLng = CITY_CENTER[1] + (Math.random() - 0.5) * 0.01;
      citizenFormMap.setView([jitterLat, jitterLng], 15);
      citizenFormMarker.setLatLng([jitterLat, jitterLng]);
      updateFormCoordinates(jitterLat, jitterLng);
      triggerNotification("Örnek GPS konumu tespit edildi.", "GPS-SİMÜLE");
    }
  );
}

// Şeffaf Şehir Haritası
function initPublicCityMap() {
  const mapElement = document.getElementById('public-city-map');
  if (!mapElement) return;

  if (!publicCityMap) {
    publicCityMap = L.map('public-city-map', {
      zoomControl: true
    }).setView(CITY_CENTER, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(publicCityMap);

    publicMarkersLayer = L.layerGroup().addTo(publicCityMap);
  }

  renderPublicMapMarkers();
}

function renderPublicMapMarkers(filterStatus = 'all') {
  if (!publicMarkersLayer) return;
  publicMarkersLayer.clearLayers();

  const filtered = filterStatus === 'all' 
    ? issues 
    : issues.filter(i => i.status === filterStatus);

  filtered.forEach(issue => {
    let pinColor = '#3b82f6';
    let statusLabel = 'Ekipler Sahada';

    if (issue.status === 'Cozuldu') {
      pinColor = '#10b981';
      statusLabel = 'Çözüldü';
    } else if (issue.status === 'Inceleniyor') {
      pinColor = '#f59e0b';
      statusLabel = 'İnceleniyor';
    } else if (issue.status === 'Yeni') {
      pinColor = '#ef4444';
      statusLabel = 'Yeni İhbar';
    }

    const customIcon = L.divIcon({
      className: 'custom-leaflet-pin',
      html: `
        <div style="background-color: ${pinColor};" class="custom-marker-pin ${issue.urgency === 'Acil' ? 'urgent-pulse' : ''}">
          <span style="color: white; font-weight: bold; font-size: 11px;">#</span>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 38],
      popupAnchor: [0, -34]
    });

    const marker = L.marker([issue.lat, issue.lng], { icon: customIcon });

    const popupHtml = `
      <div style="min-width: 200px; padding: 4px; font-family: inherit;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
          <span style="font-family: monospace; font-weight: bold; color: #2563eb; font-size: 11px;">#${issue.code}</span>
          <span style="background: ${pinColor}20; color: ${pinColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 999px;">${statusLabel}</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-weight: 800; font-size: 13px; color: #0f172a;">${issue.title}</h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">${issue.neighborhood} • ${issue.category}</p>
        ${issue.imgBefore ? `<img src="${issue.imgBefore}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">` : ''}
        <button onclick="trackSpecificIssue('${issue.code}')" style="width: 100%; background: #2563eb; color: white; border: none; padding: 6px 10px; border-radius: 8px; font-weight: 700; font-size: 11px; cursor: pointer;">
          Canlı Durumu İncele →
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml);
    publicMarkersLayer.addLayer(marker);
  });
}

function filterPublicMap(status) {
  document.querySelectorAll('.map-filter-btn').forEach(btn => {
    if (btn.getAttribute('data-filter') === status) {
      btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white shadow-sm map-filter-btn";
    } else {
      btn.className = "px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 map-filter-btn";
    }
  });
  renderPublicMapMarkers(status);
}

// ==========================================
// 8. YENİ ARIZA GÖNDERME & KOD ÜRETİMİ
// ==========================================
function submitIssueReport() {
  const title = document.getElementById('input-title').value.trim();
  const desc = document.getElementById('input-desc').value.trim();
  const neighborhood = document.getElementById('select-neighborhood').value;
  const address = document.getElementById('input-address').value.trim();
  const isAnonymous = document.getElementById('check-anonymous').checked;
  const citizenName = isAnonymous ? "Anonim Vatandaş" : (document.getElementById('input-fullname').value.trim() || "Vatandaş");
  const citizenPhone = isAnonymous ? "" : document.getElementById('input-phone').value.trim();

  if (!title) {
    alert("Lütfen arıza için kısa bir başlık giriniz.");
    document.getElementById('input-title').focus();
    return;
  }

  const categoryObj = CATEGORIES.find(c => c.id === selectedCategoryId) || CATEGORIES[0];
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const newCode = `AKA-2026-${randomSuffix}`;

  let lat = CITY_CENTER[0];
  let lng = CITY_CENTER[1];
  if (citizenFormMarker) {
    const pos = citizenFormMarker.getLatLng();
    lat = pos.lat;
    lng = pos.lng;
  }

  const newIssue = {
    id: "iss-" + Date.now(),
    code: newCode,
    title: title,
    desc: desc || "Detaylı açıklama belirtilmedi.",
    category: categoryObj.name,
    department: categoryObj.dept,
    urgency: lastAiAnalysis ? lastAiAnalysis.urgency : "Normal",
    status: "Yeni",
    neighborhood: neighborhood,
    address: address || `${neighborhood}, Şehir İçi`,
    lat: lat,
    lng: lng,
    citizenName: citizenName,
    citizenPhone: citizenPhone,
    isAnonymous: isAnonymous,
    createdAt: new Date().toISOString(),
    assignedTeam: null,
    fieldNote: null,
    imgBefore: currentPhotoDataUrl || SAMPLE_PHOTOS.pothole,
    imgAfter: null,
    rating: null,
    feedback: null
  };

  issues.unshift(newIssue);
  saveIssues();

  if (window.confetti) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  triggerNotification(`Sayın ${citizenName}, #${newCode} nolu ihbarınız belediyemize ulaştı. Ekiplerimiz incelemeye aldı.`, newCode);

  document.getElementById('input-title').value = '';
  document.getElementById('input-desc').value = '';
  document.getElementById('input-address').value = '';
  removePhoto();

  switchCitizenTab('track');
  document.getElementById('track-search-input').value = newCode;
  displayTrackingResult(newIssue);
}

// ==========================================
// 9. İHBAR TAKİP SİSTEMİ & TIMELINE
// ==========================================
function renderRecentTrackChips() {
  const container = document.getElementById('track-recent-chips');
  if (!container) return;

  const recent = issues.slice(0, 5);
  container.innerHTML = recent.map(iss => `
    <button onclick="trackSpecificIssue('${iss.code}')" class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition border border-slate-200 dark:border-slate-700">
      #${iss.code}
    </button>
  `).join('');
}

function trackSpecificIssue(code) {
  switchPortal('citizen');
  switchCitizenTab('track');
  document.getElementById('track-search-input').value = code;
  performTrackingSearch();
}

function performTrackingSearch() {
  const query = document.getElementById('track-search-input').value.trim().toUpperCase();
  if (!query) return;

  const found = issues.find(i => i.code.toUpperCase() === query || i.code.replace('-', '').includes(query));
  const container = document.getElementById('track-result-container');

  if (!found) {
    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
        <div class="w-12 h-12 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
          <i data-lucide="alert-triangle" class="w-6 h-6"></i>
        </div>
        <h3 class="text-base font-bold text-slate-800 dark:text-slate-100">Kayıt Bulunamadı</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">"${query}" koduna ait arıza kaydı bulunamadı. Lütfen takip kodunu kontrol ediniz.</p>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  displayTrackingResult(found);
}

function displayTrackingResult(issue) {
  const container = document.getElementById('track-result-container');

  let stepIndex = 1;
  if (issue.status === 'Inceleniyor') stepIndex = 2;
  else if (issue.status === 'Sahada') stepIndex = 3;
  else if (issue.status === 'Cozuldu') stepIndex = 4;

  const dateStr = new Date(issue.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-mono font-black text-blue-600 dark:text-blue-400 text-base sm:text-lg">#${issue.code}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
              issue.status === 'Cozuldu' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              issue.status === 'Sahada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
              issue.status === 'Inceleniyor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
            }">${getStatusBadgeText(issue.status)}</span>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white mt-1">${issue.title}</h2>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-3">
            <span>📍 ${issue.neighborhood}</span>
            <span>•</span>
            <span>🏛️ ${issue.department}</span>
            <span>•</span>
            <span>🕒 ${dateStr}</span>
          </div>
        </div>

        <button onclick="shareTracking('${issue.code}')" class="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-xs flex items-center space-x-1.5 self-start">
          <i data-lucide="share-2" class="w-4 h-4"></i>
          <span>Paylaş</span>
        </button>
      </div>

      <!-- GÖRSEL SÜREÇ ZAMAN ÇİZELGESİ -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Arıza Müdahale Süreci</h4>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div class="p-3.5 rounded-2xl border ${stepIndex >= 1 ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full ${stepIndex >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'} flex items-center justify-center text-xs font-bold">1</div>
              <span class="text-xs font-bold ${stepIndex >= 1 ? 'text-blue-900 dark:text-blue-300' : 'text-slate-500'}">İhbar Alındı</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Sisteme kaydedildi</p>
          </div>

          <div class="p-3.5 rounded-2xl border ${stepIndex >= 2 ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/40' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full ${stepIndex >= 2 ? 'bg-amber-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'} flex items-center justify-center text-xs font-bold">2</div>
              <span class="text-xs font-bold ${stepIndex >= 2 ? 'text-amber-900 dark:text-amber-300' : 'text-slate-500'}">İnceleniyor</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Birim koordinasyonunda</p>
          </div>

          <div class="p-3.5 rounded-2xl border ${stepIndex >= 3 ? 'border-blue-600 bg-blue-50/80 dark:bg-blue-950/60' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full ${stepIndex >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'} flex items-center justify-center text-xs font-bold">3</div>
              <span class="text-xs font-bold ${stepIndex >= 3 ? 'text-blue-900 dark:text-blue-300' : 'text-slate-500'}">Ekipler Sahada</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">${issue.assignedTeam || 'Ekip görevlendirildi'}</p>
          </div>

          <div class="p-3.5 rounded-2xl border ${stepIndex >= 4 ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full ${stepIndex >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'} flex items-center justify-center text-xs font-bold">4</div>
              <span class="text-xs font-bold ${stepIndex >= 4 ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-500'}">Çözüldü</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Görsel kanıtla kapandı</p>
          </div>

        </div>
      </div>

      <!-- AÇIKLAMA VE SAHA NOTU -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Vatandaş Notu</span>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${issue.desc}</p>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Saha Ekibi Bildirimi</span>
          <p class="text-xs ${issue.fieldNote ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 italic'} leading-relaxed">
            ${issue.fieldNote || 'Henüz saha ekibi notu girilmedi. Ekipler bölgeye intikal etmektedir.'}
          </p>
        </div>
      </div>

      <!-- FOTOĞRAF KANITLARI (ÖNCESİ & SONRASI) -->
      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Fotoğraflı Kanıt & Doğrulama</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Öncesi (İhbar Anı):</span>
            <img src="${issue.imgBefore}" class="w-full h-48 object-cover rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm" alt="Öncesi">
          </div>

          <div class="space-y-1.5">
            <span class="text-[11px] font-bold text-slate-600 dark:text-slate-300">Sonrası (Çözüm Kanıtı):</span>
            ${issue.imgAfter 
              ? `<img src="${issue.imgAfter}" class="w-full h-48 object-cover rounded-2xl border border-emerald-300 shadow-sm ring-2 ring-emerald-500/20" alt="Sonrası">`
              : `<div class="w-full h-48 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 text-xs">
                   <i data-lucide="clock" class="w-6 h-6 mb-1 text-slate-300"></i>
                   <span>Çözüm sonrası saha fotoğrafı bekleniyor</span>
                 </div>`
            }
          </div>
        </div>
      </div>

      <!-- MEMNUNİYET ANKETİ -->
      ${issue.status === 'Cozuldu' ? `
        <div class="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-200 dark:border-emerald-800 space-y-3">
          <div class="flex items-center space-x-2">
            <i data-lucide="star" class="w-5 h-5 text-amber-500 fill-amber-400"></i>
            <h4 class="text-sm font-extrabold text-emerald-900 dark:text-emerald-300">Belediye Hizmet Memnuniyeti Değerlendirmesi</h4>
          </div>
          <p class="text-xs text-emerald-800 dark:text-emerald-400">Bu arızanın giderilme hızı ve kalitesinden memnun kaldınız mı? Lütfen puanlayın.</p>
          
          <div class="flex items-center space-x-2 pt-1" id="rating-stars-${issue.id}">
            ${[1, 2, 3, 4, 5].map(star => `
              <button onclick="rateIssue('${issue.id}', ${star})" class="text-xl ${issue.rating && issue.rating >= star ? 'text-amber-400' : 'text-slate-300'} hover:text-amber-400 transition">
                ★
              </button>
            `).join('')}
            ${issue.rating ? `<span class="text-xs font-bold text-emerald-900 dark:text-emerald-300 ml-2">Puanınız: ${issue.rating}/5</span>` : ''}
          </div>
        </div>
      ` : ''}

    </div>
  `;

  if (window.lucide) lucide.createIcons();
}

function rateIssue(issueId, stars) {
  const target = issues.find(i => i.id === issueId);
  if (target) {
    target.rating = stars;
    saveIssues();
    displayTrackingResult(target);
    triggerNotification(`Değerlendirmeniz kaydedildi (${stars}/5 yıldız). Katkınız için teşekkürler!`, target.code);
  }
}

function shareTracking(code) {
  navigator.clipboard.writeText(window.location.href);
  triggerNotification(`Takip linki kopyalandı: #${code}`, code);
}

// ==========================================
// 10. BELEDİYE KOORDİNASYON & YÖNETİM (ADMIN)
// ==========================================
function updateStats() {
  const total = issues.length;
  const pending = issues.filter(i => i.status === 'Yeni' || i.status === 'Inceleniyor').length;
  const inProgress = issues.filter(i => i.status === 'Sahada').length;
  const resolved = issues.filter(i => i.status === 'Cozuldu').length;
  const urgent = issues.filter(i => i.urgency === 'Acil' && i.status !== 'Cozuldu').length;

  const badgePending = document.getElementById('badge-pending-count');
  if (badgePending) badgePending.textContent = pending;

  const statTotalSolved = document.getElementById('stat-total-solved');
  if (statTotalSolved) statTotalSolved.textContent = resolved + 38;

  const admTotal = document.getElementById('adm-stat-total');
  const admPending = document.getElementById('adm-stat-pending');
  const admInProgress = document.getElementById('adm-stat-in-progress');
  const admResolved = document.getElementById('adm-stat-resolved');
  const admUrgent = document.getElementById('adm-stat-urgent');

  if (admTotal) admTotal.textContent = total;
  if (admPending) admPending.textContent = pending;
  if (admInProgress) admInProgress.textContent = inProgress;
  if (admResolved) admResolved.textContent = resolved;
  if (admUrgent) admUrgent.textContent = urgent;
}

function renderAdminTable() {
  const tbody = document.getElementById('admin-table-body');
  if (!tbody) return;

  const search = (document.getElementById('adm-search-filter')?.value || '').toLowerCase();
  const dept = document.getElementById('adm-dept-filter')?.value || 'all';
  const status = document.getElementById('adm-status-filter')?.value || 'all';
  const urgency = document.getElementById('adm-urgency-filter')?.value || 'all';

  const filtered = issues.filter(iss => {
    const matchesSearch = !search || 
      iss.code.toLowerCase().includes(search) || 
      iss.title.toLowerCase().includes(search) || 
      iss.neighborhood.toLowerCase().includes(search);

    const matchesDept = dept === 'all' || iss.department === dept;
    const matchesStatus = status === 'all' || iss.status === status;
    const matchesUrgency = urgency === 'all' || iss.urgency === urgency;

    return matchesSearch && matchesDept && matchesStatus && matchesUrgency;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="px-5 py-8 text-center text-slate-400">
          Arama kriterlerine uygun arıza ihbarı bulunamadı.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(iss => `
    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer" onclick="openActionModal('${iss.id}')">
      <td class="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">#${iss.code}</td>
      <td class="px-5 py-3.5">
        <div class="font-bold text-slate-900 dark:text-white">${iss.title}</div>
        <div class="text-[11px] text-slate-400">${iss.category}</div>
      </td>
      <td class="px-5 py-3.5 text-slate-600 dark:text-slate-300">
        <div>${iss.neighborhood}</div>
        <div class="text-[11px] text-slate-400 truncate max-w-xs">${iss.address}</div>
      </td>
      <td class="px-5 py-3.5">
        <div class="font-semibold text-slate-700 dark:text-slate-200">${iss.department}</div>
        <div class="text-[11px] text-blue-600 dark:text-blue-400">${iss.assignedTeam || 'Ekip Atanmadı'}</div>
      </td>
      <td class="px-5 py-3.5">
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${
          iss.urgency === 'Acil' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 font-extrabold animate-pulse' :
          iss.urgency === 'Normal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
        }">${iss.urgency === 'Acil' ? '🚨 Acil' : iss.urgency}</span>
      </td>
      <td class="px-5 py-3.5">
        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold ${
          iss.status === 'Cozuldu' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
          iss.status === 'Sahada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
          iss.status === 'Inceleniyor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }">${getStatusBadgeText(iss.status)}</span>
      </td>
      <td class="px-5 py-3.5 text-right">
        <button onclick="event.stopPropagation(); openActionModal('${iss.id}')" class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition font-bold text-xs">
          Yönet & Çöz
        </button>
      </td>
    </tr>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function getStatusBadgeText(status) {
  switch (status) {
    case 'Yeni': return 'Yeni İhbar';
    case 'Inceleniyor': return 'İnceleniyor';
    case 'Sahada': return 'Ekipler Sahada';
    case 'Cozuldu': return 'Çözüldü & Kapatıldı';
    case 'Iptal': return 'İptal / Mükerrer';
    default: return status;
  }
}

// ==========================================
// 11. DETAY & AKSİYON MODALI (ADMIN DISPATCH)
// ==========================================
function openActionModal(issueId) {
  const issue = issues.find(i => i.id === issueId);
  if (!issue) return;

  activeModalIssueId = issueId;

  document.getElementById('modal-code-badge').textContent = `#${issue.code}`;
  
  const urgencyBadge = document.getElementById('modal-urgency-badge');
  urgencyBadge.textContent = issue.urgency === 'Acil' ? '🚨 Acil Öncelik' : issue.urgency;
  urgencyBadge.className = `text-xs font-bold px-2 py-0.5 rounded-full ${
    issue.urgency === 'Acil' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
  }`;

  document.getElementById('modal-title').textContent = issue.title;
  document.getElementById('modal-desc').textContent = issue.desc;
  document.getElementById('modal-location-text').textContent = `${issue.neighborhood} — ${issue.address}`;
  document.getElementById('modal-coords-text').textContent = `Koordinat: ${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)}`;

  const imgBefore = document.getElementById('modal-img-before');
  imgBefore.src = issue.imgBefore || SAMPLE_PHOTOS.pothole;

  const imgAfter = document.getElementById('modal-img-after');
  const noAfterImg = document.getElementById('modal-no-after-img');

  if (issue.imgAfter) {
    imgAfter.src = issue.imgAfter;
    imgAfter.classList.remove('hidden');
    noAfterImg.classList.add('hidden');
  } else {
    imgAfter.classList.add('hidden');
    noAfterImg.classList.remove('hidden');
  }

  document.getElementById('modal-select-dept').value = issue.department;
  document.getElementById('modal-input-team').value = issue.assignedTeam || '';
  document.getElementById('modal-select-status').value = issue.status;
  document.getElementById('modal-select-urgency').value = issue.urgency;
  document.getElementById('modal-field-note').value = issue.fieldNote || '';

  const modal = document.getElementById('action-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closeActionModal() {
  const modal = document.getElementById('action-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  activeModalIssueId = null;
}

function loadSampleResolutionPhoto() {
  if (!activeModalIssueId) return;
  const issue = issues.find(i => i.id === activeModalIssueId);
  if (!issue) return;

  let sample = SAMPLE_PHOTOS.repaired_road;
  if (issue.category.includes('Lamba')) sample = SAMPLE_PHOTOS.streetlight_fixed;
  else if (issue.category.includes('Su')) sample = SAMPLE_PHOTOS.water_fixed;
  else if (issue.category.includes('Park')) sample = SAMPLE_PHOTOS.park_fixed;

  issue.imgAfter = sample;
  const imgAfter = document.getElementById('modal-img-after');
  const noAfterImg = document.getElementById('modal-no-after-img');
  imgAfter.src = sample;
  imgAfter.classList.remove('hidden');
  noAfterImg.classList.add('hidden');

  document.getElementById('modal-select-status').value = 'Cozuldu';
  document.getElementById('modal-field-note').value = 'Saha ekibi tarafından onarım tamamlandı ve test edildi. Yol/alan kullanıma açıldı.';
}

function saveModalChanges() {
  if (!activeModalIssueId) return;
  const issue = issues.find(i => i.id === activeModalIssueId);
  if (!issue) return;

  const oldStatus = issue.status;
  const newStatus = document.getElementById('modal-select-status').value;
  const newDept = document.getElementById('modal-select-dept').value;
  const newTeam = document.getElementById('modal-input-team').value.trim();
  const newUrgency = document.getElementById('modal-select-urgency').value;
  const newNote = document.getElementById('modal-field-note').value.trim();

  issue.status = newStatus;
  issue.department = newDept;
  issue.assignedTeam = newTeam;
  issue.urgency = newUrgency;
  issue.fieldNote = newNote;

  if (newStatus === 'Cozuldu' && !issue.imgAfter) {
    issue.imgAfter = SAMPLE_PHOTOS.repaired_road;
  }

  saveIssues();
  closeActionModal();

  if (oldStatus !== newStatus) {
    triggerNotification(`Sayın vatandaşımız, #${issue.code} numaralı bildiriminizin durumu "${getStatusBadgeText(newStatus)}" olarak güncellendi.`, issue.code);
  }
}

// ==========================================
// 12. 📊 EXCEL (.CSV) DIŞA AKTARMA
// ==========================================
function exportToExcel() {
  // UTF-8 BOM ekleyerek Türkçe karakterlerin Excel'de düzgün açılmasını sağlıyoruz
  let csvContent = "\uFEFF";
  
  // Başlıklar
  const headers = [
    "Takip Kodu", "Kategori", "Başlık", "Mahalle", "Adres", 
    "Sorumlu Birim", "Saha Ekibi", "Öncelik", "Durum", 
    "Kayıt Tarihi", "Vatandaş Adı", "Vatandaş Telefon"
  ];
  csvContent += headers.map(h => `"${h}"`).join(";") + "\r\n";

  // Satırlar
  issues.forEach(iss => {
    const row = [
      iss.code,
      iss.category,
      iss.title.replace(/"/g, '""'),
      iss.neighborhood,
      iss.address.replace(/"/g, '""'),
      iss.department,
      iss.assignedTeam || "Atanmadı",
      iss.urgency,
      getStatusBadgeText(iss.status),
      new Date(iss.createdAt).toLocaleString('tr-TR'),
      iss.citizenName,
      iss.citizenPhone || "-"
    ];
    csvContent += row.map(val => `"${val}"`).join(";") + "\r\n";
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute("href", url);
  link.setAttribute("download", `AKA_Belediye_Ariza_Raporu_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  triggerNotification("Excel raporu (.csv) başarıyla indirildi.", "EXCEL-EXPORT");
}

// ==========================================
// 13. 📄 RESMİ BELEDİYE PDF RAPORU OLUŞTURMA
// ==========================================
function openOfficialPdfReport() {
  const modal = document.getElementById('official-report-modal');
  const container = document.getElementById('printable-report-content');
  if (!modal || !container) return;

  const dateNow = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'Cozuldu').length;
  const inProgress = issues.filter(i => i.status === 'Sahada').length;
  const pending = issues.filter(i => i.status === 'Yeni' || i.status === 'Inceleniyor').length;

  container.innerHTML = `
    <!-- Resmi Antet -->
    <div class="border-b-2 border-slate-900 pb-4 text-center space-y-1">
      <div class="text-xs uppercase tracking-widest font-bold text-slate-500">T.C. BÜYÜKŞEHİR / İLÇE BELEDİYE BAŞKANLIĞI</div>
      <div class="text-sm uppercase tracking-wider font-extrabold text-slate-700">Fen İşleri & Akıllı Kent Koordinasyon Merkezi</div>
      <h1 class="text-xl font-black text-slate-900 uppercase tracking-tight mt-1">AKILLI KENT AĞI (AKA) ARIZA VE ÇÖZÜM İCRA RAPORU</h1>
      <div class="flex items-center justify-between text-xs text-slate-500 font-mono pt-2">
        <span>Rapor No: AKA-REP-${Date.now().toString().slice(-6)}</span>
        <span>Rapor Tarihi: ${dateNow}</span>
      </div>
    </div>

    <!-- Özet İstatistik Tablosu -->
    <div class="grid grid-cols-4 gap-3 text-center">
      <div class="p-3 border border-slate-300 rounded-xl bg-slate-50">
        <div class="text-xs text-slate-500 font-bold uppercase">Toplam Bildirim</div>
        <div class="text-2xl font-black text-slate-900 mt-1">${total}</div>
      </div>
      <div class="p-3 border border-amber-300 rounded-xl bg-amber-50">
        <div class="text-xs text-amber-700 font-bold uppercase">İncelemede</div>
        <div class="text-2xl font-black text-amber-700 mt-1">${pending}</div>
      </div>
      <div class="p-3 border border-blue-300 rounded-xl bg-blue-50">
        <div class="text-xs text-blue-700 font-bold uppercase">Sahada Müdahale</div>
        <div class="text-2xl font-black text-blue-700 mt-1">${inProgress}</div>
      </div>
      <div class="p-3 border border-emerald-300 rounded-xl bg-emerald-50">
        <div class="text-xs text-emerald-700 font-bold uppercase">Tamamlanan / Çözülen</div>
        <div class="text-2xl font-black text-emerald-700 mt-1">${resolved}</div>
      </div>
    </div>

    <!-- Detaylı Arıza Listesi Tablosu -->
    <div class="space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Mevcut Arıza Kayıtları ve Müdahale Durumları</h3>
      <table class="w-full text-left text-xs border border-slate-300">
        <thead class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
          <tr>
            <th class="p-2 border-r border-slate-200">Kod</th>
            <th class="p-2 border-r border-slate-200">Kategori & Başlık</th>
            <th class="p-2 border-r border-slate-200">Mahalle</th>
            <th class="p-2 border-r border-slate-200">Sorumlu Birim</th>
            <th class="p-2 border-r border-slate-200">Öncelik</th>
            <th class="p-2">Son Durum</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          ${issues.map(i => `
            <tr>
              <td class="p-2 font-mono font-bold text-slate-900 border-r border-slate-200">#${i.code}</td>
              <td class="p-2 border-r border-slate-200">
                <div class="font-bold">${i.title}</div>
                <div class="text-[10px] text-slate-500">${i.category}</div>
              </td>
              <td class="p-2 border-r border-slate-200">${i.neighborhood}</td>
              <td class="p-2 border-r border-slate-200">${i.department}</td>
              <td class="p-2 border-r border-slate-200 font-bold ${i.urgency === 'Acil' ? 'text-red-600' : ''}">${i.urgency}</td>
              <td class="p-2 font-bold">${getStatusBadgeText(i.status)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Resmi İmza & Onay Bölümü -->
    <div class="pt-8 border-t border-slate-300 grid grid-cols-2 text-center text-xs">
      <div>
        <div class="font-bold text-slate-700">Hazırlayan</div>
        <div class="mt-8 font-semibold">AKA Saha Koordinasyon Sorumlusu</div>
        <div class="text-[10px] text-slate-400">İmza / Mühür</div>
      </div>
      <div>
        <div class="font-bold text-slate-700">Onaylayan</div>
        <div class="mt-8 font-semibold">Fen İşleri ve Bilgi İşlem Daire Başkanı</div>
        <div class="text-[10px] text-slate-400">İmza / Mühür</div>
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closeOfficialPdfReport() {
  const modal = document.getElementById('official-report-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

// ==========================================
// 14. 💬 WHATSAPP & AKA ASİSTAN CHATBOT
// ==========================================
let chatMessages = [
  {
    sender: 'bot',
    text: 'Merhaba! 👋 Ben **AKA Akıllı Kent Asistanı**.\n\nŞehrimizdeki arızayı bana buradan yazarak hemen bildirebilirsiniz. Nerede nasıl bir sorun gördünüz?',
    time: 'Şimdi'
  }
];

function initChatbot() {
  renderChatMessages();
}

function toggleChatbot() {
  const win = document.getElementById('chatbot-window');
  if (!win) return;

  if (win.classList.contains('hidden')) {
    win.classList.remove('hidden');
    win.classList.add('flex');
    renderChatMessages();
    setTimeout(() => {
      document.getElementById('chat-user-input')?.focus();
    }, 100);
  } else {
    win.classList.add('hidden');
    win.classList.remove('flex');
  }
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;

  container.innerHTML = chatMessages.map(msg => {
    const isBot = msg.sender === 'bot';
    return `
      <div class="flex ${isBot ? 'justify-start' : 'justify-end'}">
        <div class="max-w-[85%] p-3 text-xs leading-relaxed ${isBot ? 'chat-bubble-bot' : 'chat-bubble-user'} space-y-1">
          <div>${formatChatMessage(msg.text)}</div>
          <div class="text-[10px] text-slate-400 text-right">${msg.time}</div>
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function formatChatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br/>');
}

function handleChatInputKey(e) {
  if (e.key === 'Enter') {
    sendUserChatMessage();
  }
}

function sendUserChatMessage() {
  const input = document.getElementById('chat-user-input');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  processChatInput(text);
}

function sendQuickReply(text) {
  processChatInput(text);
}

function processChatInput(text) {
  const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  // Kullanıcı mesajı ekle
  chatMessages.push({
    sender: 'user',
    text: text,
    time: timeNow
  });
  renderChatMessages();

  // Bot Cevabı Simülasyonu
  const lower = text.toLowerCase();
  
  setTimeout(() => {
    // 1. Sorgulama
    if (lower.includes('sorgula') || lower.includes('durum') || lower.includes('aka-')) {
      const match = text.match(/AKA-\d+-\d+/i);
      if (match) {
        const found = issues.find(i => i.code.toUpperCase() === match[0].toUpperCase());
        if (found) {
          botReply(`🔍 **#${found.code}** nolu başvurunuz bulundu:\n\n• **Başlık:** ${found.title}\n• **Birim:** ${found.department}\n• **Durum:** ${getStatusBadgeText(found.status)}\n\nEkiplerimizin sahadaki çalışması sürmektedir.`);
          return;
        }
      }
      botReply(`Son başvurunuz **#${issues[0].code}** kodlu arızadır. Durumu: **${getStatusBadgeText(issues[0].status)}** olarak güncellenmiştir.`);
      return;
    }

    // 2. Arıza Bildirimi ve Otomatik Bilet Üretimi
    let cat = CATEGORIES[0]; // Varsayılan Yol
    let urgency = "Normal";

    if (lower.includes('lamba') || lower.includes('ışık') || lower.includes('karanlık')) {
      cat = CATEGORIES.find(c => c.id === 'lamba');
    } else if (lower.includes('su') || lower.includes('boru') || lower.includes('kanal') || lower.includes('kaçak')) {
      cat = CATEGORIES.find(c => c.id === 'su');
      urgency = "Acil";
    } else if (lower.includes('park') || lower.includes('oyun') || lower.includes('salıncak')) {
      cat = CATEGORIES.find(c => c.id === 'park');
    } else if (lower.includes('çöp') || lower.includes('temizlik') || lower.includes('koku')) {
      cat = CATEGORIES.find(c => c.id === 'temizlik');
    }

    // Otomatik Yeni İhbar Oluştur!
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `AKA-2026-${randomSuffix}`;

    const newIssue = {
      id: "iss-" + Date.now(),
      code: newCode,
      title: text.length > 50 ? text.substring(0, 47) + '...' : text,
      desc: `WhatsApp / AKA Asistan üzerinden vatandaş tarafından bildirildi: "${text}"`,
      category: cat.name,
      department: cat.dept,
      urgency: urgency,
      status: "Yeni",
      neighborhood: "Cumhuriyet Mahallesi",
      address: "Cumhuriyet Cad. WhatsApp Bildirim Hattı",
      lat: CITY_CENTER[0] + (Math.random() - 0.5) * 0.008,
      lng: CITY_CENTER[1] + (Math.random() - 0.5) * 0.008,
      citizenName: "WhatsApp Vatandaşı",
      citizenPhone: "05XX XXX XX XX",
      isAnonymous: false,
      createdAt: new Date().toISOString(),
      assignedTeam: null,
      fieldNote: null,
      imgBefore: SAMPLE_PHOTOS.pothole,
      imgAfter: null,
      rating: null,
      feedback: null
    };

    issues.unshift(newIssue);
    saveIssues();

    botReply(`✅ Teşekkür ederiz! İhbarınız başarıyla kaydedildi.\n\n• **Takip Kodu:** **#${newCode}**\n• **Kategori:** ${cat.name}\n• **Sevk Edilen Birim:** ${cat.dept}\n• **Öncelik:** ${urgency}\n\nİhbarınız anında belediye koordinasyon masasına iletildi. Durumu buradan veya sorgu ekranından takip edebilirsiniz.`);
    
    triggerNotification(`WhatsApp üzerinden yeni ihbar alındı: #${newCode}`, newCode);
  }, 900);
}

function botReply(text) {
  const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  chatMessages.push({
    sender: 'bot',
    text: text,
    time: timeNow
  });
  renderChatMessages();
}

// ==========================================
// 15. ŞEHİR ANALİTİĞİ & GRAFİKLER (CHART.JS)
// ==========================================
let chartNeighborhoodsInstance = null;
let chartCategoriesInstance = null;

function initAnalyticsCharts() {
  const ctxNeighborhoods = document.getElementById('chart-neighborhoods');
  const ctxCategories = document.getElementById('chart-categories');

  if (!ctxNeighborhoods || !ctxCategories) return;

  const neighborhoodCounts = {};
  issues.forEach(i => {
    neighborhoodCounts[i.neighborhood] = (neighborhoodCounts[i.neighborhood] || 0) + 1;
  });

  const nLabels = Object.keys(neighborhoodCounts);
  const nData = Object.values(neighborhoodCounts);

  if (chartNeighborhoodsInstance) chartNeighborhoodsInstance.destroy();
  chartNeighborhoodsInstance = new Chart(ctxNeighborhoods, {
    type: 'bar',
    data: {
      labels: nLabels,
      datasets: [{
        label: 'İhbar Sayısı',
        data: nData,
        backgroundColor: '#3b82f6',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 }
        }
      }
    }
  });

  const categoryCounts = {};
  issues.forEach(i => {
    categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
  });

  const cLabels = Object.keys(categoryCounts);
  const cData = Object.values(categoryCounts);

  if (chartCategoriesInstance) chartCategoriesInstance.destroy();
  chartCategoriesInstance = new Chart(ctxCategories, {
    type: 'doughnut',
    data: {
      labels: cLabels,
      datasets: [{
        data: cData,
        backgroundColor: [
          '#f97316',
          '#3b82f6',
          '#f59e0b',
          '#10b981',
          '#14b8a6',
          '#8b5cf6'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 12, font: { size: 11 } }
        }
      }
    }
  });
}

// ==========================================
// 16. SİMÜLE EDİLMİŞ SMS & BİLDİRİM BİLEŞENİ
// ==========================================
let notifTimeout = null;

function triggerNotification(message, code) {
  const drawer = document.getElementById('simulated-sms-drawer');
  const textEl = document.getElementById('sms-text');
  const codeEl = document.getElementById('sms-code-preview');

  if (!drawer || !textEl) return;

  textEl.textContent = message;
  codeEl.textContent = `İlgili Kod: #${code}`;

  drawer.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
  drawer.classList.add('translate-y-0', 'opacity-100');

  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.15);
  } catch (e) {
    // Ignore audio error
  }

  if (notifTimeout) clearTimeout(notifTimeout);
  notifTimeout = setTimeout(() => {
    closeNotificationDrawer();
  }, 6000);
}

function closeNotificationDrawer() {
  const drawer = document.getElementById('simulated-sms-drawer');
  if (drawer) {
    drawer.classList.add('translate-y-32', 'opacity-0', 'pointer-events-none');
    drawer.classList.remove('translate-y-0', 'opacity-100');
  }
}

function toggleQuickNotification() {
  const lastIssue = issues[0];
  if (lastIssue) {
    triggerNotification(`Son durum: #${lastIssue.code} - ${lastIssue.title} (${getStatusBadgeText(lastIssue.status)})`, lastIssue.code);
  }
}
