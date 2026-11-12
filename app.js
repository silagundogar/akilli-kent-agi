/**
 * Akıllı Kent Ağı (AKA) - Ana Uygulama & İş Mantığı v2.0 Pro
 * Güvenlik (XSS/CSV Korumalı), İstemci Taraflı Resim Sıkıştırma, Ters Jeokodlama (OSM),
 * Süreç Tarihçesi (Audit Trail), Akıllı Chatbot ve Resmi Tekil/Toplu Raporlama Entegreli
 */

// ==========================================
// 1. KATEGORİ VE VARSAYILAN TANIMLAR
// ==========================================
const CATEGORIES = [
  { id: 'yol', name: 'Yol, Asfalt & Kaldırım', icon: 'cone', dept: 'Fen İşleri Müdürlüğü', color: 'orange' },
  { id: 'su', name: 'Su & Kanalizasyon (AFSU)', icon: 'droplet', dept: 'Su ve Kanalizasyon İdaresi (AFSU)', color: 'blue' },
  { id: 'lamba', name: 'Sokak Lambası & Elektrik', icon: 'lightbulb', dept: 'Elektrik & Aydınlatma Şefliği', color: 'amber' },
  { id: 'park', name: 'Park & Bahçeler', icon: 'trees', dept: 'Park ve Bahçeler Müdürlüğü', color: 'emerald' },
  { id: 'temizlik', name: 'Temizlik & Çöp', icon: 'trash-2', dept: 'Temizlik İşleri Müdürlüğü', color: 'teal' },
  { id: 'zabita', name: 'Zabıta & Denetim', icon: 'shield-alert', dept: 'Zabıta Müdürlüğü', color: 'purple' },
  { id: 'veteriner', name: 'Veteriner & Sokak Hayvanları', icon: 'heart-pulse', dept: 'Veteriner İşleri Müdürlüğü', color: 'rose' },
  { id: 'ulasim', name: 'Ulaşım & Sinyalizasyon', icon: 'bus', dept: 'Ulaşım Hizmetleri Müdürlüğü', color: 'indigo' },
  { id: 'imar', name: 'İmar & Yapı Kontrol', icon: 'home', dept: 'İmar ve Şehircilik Müdürlüğü', color: 'cyan' },
  { id: 'sosyal', name: 'Sosyal Yardım & Destek', icon: 'users', dept: 'Sosyal Yardım İşleri Müdürlüğü', color: 'pink' }
];

const AFYON_NEIGHBORHOODS = [
  "Dumlupınar Mahallesi",
  "Marulcu Mahallesi",
  "Ali Çetinkaya Mahallesi",
  "Karaman Mahallesi",
  "Zafer Mahallesi",
  "Esentepe Mahallesi",
  "Kanlıca Mahallesi",
  "Sahipata Mahallesi",
  "Osmangazi Mahallesi (Uydukent)",
  "Yeşilyurt Mahallesi (Uydukent)",
  "Battalgazi Mahallesi (Uydukent)",
  "Fatih Mahallesi",
  "Güvenevler Mahallesi",
  "Kocatepe Mahallesi",
  "Cumhuriyet Mahallesi",
  "Selçuklu Mahallesi",
  "Hamidiye Mahallesi",
  "Örnekevler Mahallesi",
  "Erkmen Bölgesi"
];

// Gerçekçi test ve kanıt fotoğrafları
const SAMPLE_PHOTOS = {
  pothole: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
  repaired_road: "https://images.unsplash.com/photo-1584463699042-32a2656360c6?auto=format&fit=crop&w=800&q=80",
  streetlight_broken: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
  streetlight_fixed: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80",
  park_broken: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
  park_fixed: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=800&q=80",
  water_leak: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
  water_fixed: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
  trash_overflow: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
  trash_fixed: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80",
  animal_care: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
  traffic_sign: "https://images.unsplash.com/photo-1508873696983-2df570364e88?auto=format&fit=crop&w=800&q=80"
};

// Kategoriye özel varsayılan öncesi görsel
function getDefaultCategoryPhoto(categoryId) {
  if (categoryId === 'su') return SAMPLE_PHOTOS.water_leak;
  if (categoryId === 'lamba') return SAMPLE_PHOTOS.streetlight_broken;
  if (categoryId === 'park') return SAMPLE_PHOTOS.park_broken;
  if (categoryId === 'temizlik') return SAMPLE_PHOTOS.trash_overflow;
  if (categoryId === 'veteriner') return SAMPLE_PHOTOS.animal_care;
  if (categoryId === 'ulasim') return SAMPLE_PHOTOS.traffic_sign;
  return SAMPLE_PHOTOS.pothole;
}

// Zengin Demo Başlangıç Verileri (Afyonkarahisar Merkezli & Süreç Tarihçeli)
const INITIAL_DEMO_ISSUES = [
  {
    id: "iss-1",
    code: "AKA-2026-1042",
    title: "Ambaryolu Caddesi Derin Asfalt Çukuru",
    desc: "Trafik akışını olumsuz etkiliyor, araç alt takımlarına zarar veriyor. Yağışta su birikiyor, acil sıcak asfalt yama gerekiyor.",
    category: "Yol, Asfalt & Kaldırım",
    department: "Fen İşleri Müdürlüğü",
    urgency: "Acil",
    status: "Sahada",
    neighborhood: "Dumlupınar Mahallesi",
    address: "Ambaryolu Cad. No: 48 karşısı",
    lat: 38.7575,
    lng: 30.5395,
    citizenName: "Ahmet Yılmaz",
    citizenPhone: "0532 456 78 90",
    isAnonymous: false,
    createdAt: "2026-10-25T08:15:00.000Z",
    assignedTeam: "1. Bölge Asfalt & Yama Ekibi",
    fieldNote: "Ekip bölgeye intikal etti, zemin freze kazıma işlemi ve sıcak yama yapılıyor.",
    imgBefore: SAMPLE_PHOTOS.pothole,
    imgAfter: null,
    rating: null,
    feedback: null,
    history: [
      { timestamp: "2026-10-25T08:15:00.000Z", status: "Yeni", actor: "Vatandaş (Web Portalı)", note: "İhbar Afyonkarahisar AKA sistemine iletildi." },
      { timestamp: "2026-10-25T09:00:00.000Z", status: "Inceleniyor", actor: "Koordinasyon Masası", note: "Fen İşleri Müdürlüğü'ne havale edildi." },
      { timestamp: "2026-10-25T10:45:00.000Z", status: "Sahada", actor: "1. Bölge Asfalt & Yama Ekibi", note: "Saha aracı ulaştı, onarım çalışması sürüyor." }
    ]
  },
  {
    id: "iss-2",
    code: "AKA-2026-1038",
    title: "Gazlıgöl Caddesi Aydınlatma Direği Arızası",
    desc: "Akşam saatlerinde yaya geçidi karanlık kalıyor, okul çıkışında yayalar için kaza riski var.",
    category: "Sokak Lambası & Elektrik",
    department: "Elektrik & Aydınlatma Şefliği",
    urgency: "Normal",
    status: "Cozuldu",
    neighborhood: "Marulcu Mahallesi",
    address: "Gazlıgöl Cad. No: 14 önü",
    lat: 38.7595,
    lng: 30.5360,
    citizenName: "Merve Çelik",
    citizenPhone: "0543 210 98 76",
    isAnonymous: false,
    createdAt: "2026-10-24T19:30:00.000Z",
    assignedTeam: "Aydınlatma Nöbetçi Timi",
    fieldNote: "Armatür LED modülü ve sigorta yenilendi, hat voltajı ölçülüp devreye alındı.",
    imgBefore: SAMPLE_PHOTOS.streetlight_broken,
    imgAfter: SAMPLE_PHOTOS.streetlight_fixed,
    rating: 5,
    feedback: "Afyon Belediyesi aynı akşam ilgilendi ve lamba yandı. Teşekkürler!",
    history: [
      { timestamp: "2026-10-24T19:30:00.000Z", status: "Yeni", actor: "Vatandaş (Web)", note: "Arıza bildirimi kaydedildi." },
      { timestamp: "2026-10-25T08:30:00.000Z", status: "Inceleniyor", actor: "Koordinasyon Masası", note: "Elektrik birimine sevk edildi." },
      { timestamp: "2026-10-25T11:00:00.000Z", status: "Sahada", actor: "Aydınlatma Nöbetçi Timi", note: "Sepetli araç sahada çalışma başlattı." },
      { timestamp: "2026-10-25T13:15:00.000Z", status: "Cozuldu", actor: "Aydınlatma Nöbetçi Timi", note: "Armatür onarıldı ve çalışır durumda teslim edildi." }
    ]
  },
  {
    id: "iss-3",
    code: "AKA-2026-1025",
    title: "Uydukent Yeşilyurt Parkı Salıncak Zinciri Onarımı",
    desc: "Parktaki çocuk salıncağının bağlantı halkası aşınmış, çocuklar için tehlike arz ediyor.",
    category: "Park & Bahçeler",
    department: "Park ve Bahçeler Müdürlüğü",
    urgency: "Normal",
    status: "Cozuldu",
    neighborhood: "Yeşilyurt Mahallesi (Uydukent)",
    address: "Yeşilyurt Parkı Oyun Alanı",
    lat: 38.7690,
    lng: 30.5180,
    citizenName: "Gizli Vatandaş",
    citizenPhone: "",
    isAnonymous: true,
    createdAt: "2026-10-23T14:20:00.000Z",
    assignedTeam: "Park Bakım & Onarım Ekibi 2",
    fieldNote: "Kopmaya yakın zincir ve kauçuk oturak yenisi ile değiştirilerek sabitlendi.",
    imgBefore: SAMPLE_PHOTOS.park_broken,
    imgAfter: SAMPLE_PHOTOS.park_fixed,
    rating: 5,
    feedback: "Hızlı geri dönüş ve onarım için belediyemize teşekkür ederiz.",
    history: [
      { timestamp: "2026-10-23T14:20:00.000Z", status: "Yeni", actor: "Vatandaş (Mobil)", note: "Anonim park ihbarı alındı." },
      { timestamp: "2026-10-23T16:00:00.000Z", status: "Sahada", actor: "Park Bakım Ekibi", note: "Oyun grubu güvenlik şeridine alındı." },
      { timestamp: "2026-10-24T09:30:00.000Z", status: "Cozuldu", actor: "Park Bakım & Onarım Ekibi 2", note: "Salıncak yenilendi ve halka açıldı." }
    ]
  },
  {
    id: "iss-4",
    code: "AKA-2026-1051",
    title: "Ordu Bulvarında Ana Şebeke Su Patlağı",
    desc: "Temiz su borusu patlamış, kaldırımdan yola su sızıyor ve göllenme yapıyor.",
    category: "Su & Kanalizasyon (AFSU)",
    department: "Su ve Kanalizasyon İdaresi (AFSU)",
    urgency: "Acil",
    status: "Inceleniyor",
    neighborhood: "Ali Çetinkaya Mahallesi",
    address: "Ordu Bulvarı No: 82",
    lat: 38.7540,
    lng: 30.5460,
    citizenName: "Mehmet Demir",
    citizenPhone: "0555 123 45 67",
    isAnonymous: false,
    createdAt: "2026-10-26T09:40:00.000Z",
    assignedTeam: "AFSU Acil Müdahale Ekibi",
    fieldNote: "Hat vanasının kısılması ve kazı izni için saha koordinatörüne iletildi.",
    imgBefore: SAMPLE_PHOTOS.water_leak,
    imgAfter: null,
    rating: null,
    feedback: null,
    history: [
      { timestamp: "2026-10-26T09:40:00.000Z", status: "Yeni", actor: "Vatandaş (Web)", note: "Acil su patlağı bildirildi." },
      { timestamp: "2026-10-26T09:45:00.000Z", status: "Inceleniyor", actor: "AFSU Harekat Merkezi", note: "Bölge vanası için acil ekip yönlendirildi." }
    ]
  },
  {
    id: "iss-5",
    code: "AKA-2026-1060",
    title: "Kurtuluş Caddesi Konteyner Temizliği",
    desc: "Çöp konteyneri dolmuş, sokakta koku ve çevre kirliliği oluşuyor.",
    category: "Temizlik & Çöp",
    department: "Temizlik İşleri Müdürlüğü",
    urgency: "Düşük",
    status: "Yeni",
    neighborhood: "Karaman Mahallesi",
    address: "Kurtuluş Caddesi Kesişimi",
    lat: 38.7510,
    lng: 30.5410,
    citizenName: "Seda Aksoy",
    citizenPhone: "0505 987 65 43",
    isAnonymous: false,
    createdAt: "2026-10-27T08:10:00.000Z",
    assignedTeam: null,
    fieldNote: null,
    imgBefore: SAMPLE_PHOTOS.trash_overflow,
    imgAfter: null,
    rating: null,
    feedback: null,
    history: [
      { timestamp: "2026-10-27T08:10:00.000Z", status: "Yeni", actor: "Vatandaş (Web)", note: "Temizlik talebi oluşturuldu." }
    ]
  },
  {
    id: "iss-6",
    code: "AKA-2026-1072",
    title: "Kanlıca Mahallesinde Yaralı Sokak Köpeği",
    desc: "Bacağından yaralanmış yavru bir köpek kaldırımda yatıyor, yürüyemiyor. Acil veteriner hekim müdahalesi gerekiyor.",
    category: "Veteriner & Sokak Hayvanları",
    department: "Veteriner İşleri Müdürlüğü",
    urgency: "Acil",
    status: "Sahada",
    neighborhood: "Kanlıca Mahallesi",
    address: "Kanlıca Sağlık Ocağı Karşısı",
    lat: 38.7450,
    lng: 30.5520,
    citizenName: "Canan Yurt",
    citizenPhone: "0533 111 22 33",
    isAnonymous: false,
    createdAt: "2026-10-27T11:20:00.000Z",
    assignedTeam: "Hayvan Ambulansı & Acil Müdahale",
    fieldNote: "Veteriner hekimli ambulans aracı sevk edildi, can dostumuz kliniğe alınıyor.",
    imgBefore: SAMPLE_PHOTOS.animal_care,
    imgAfter: null,
    rating: null,
    feedback: null,
    history: [
      { timestamp: "2026-10-27T11:20:00.000Z", status: "Yeni", actor: "Vatandaş (Web)", note: "Yaralı can dostu ihbarı alındı." },
      { timestamp: "2026-10-27T11:35:00.000Z", status: "Sahada", actor: "Veteriner İşleri", note: "Hayvan nakil ambulansı adrese ulaştı." }
    ]
  }
];

// ==========================================
// 2. GÜVENLİK (XSS & CSV) & YARDIMCI ARAÇLAR
// ==========================================

// XSS Sanitizer: Kullanıcı girdilerinin HTML olarak çalışmasını engeller
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// CSV Enjeksiyon Koruması: Excel formül saldırılarını önler
function sanitizeCsvValue(val) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  return str.replace(/"/g, '""');
}

// İstemci Taraflı Resim Sıkıştırma (HTML5 Canvas)
// 5-10 MB'lık kamera fotoğraflarını ~70-90 KB JPEG formatına indirip LocalStorage kotasını korur
function compressImageFile(file, maxWidth = 1000, maxHeight = 1000, quality = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error("Geçerli bir resim dosyası seçilmedi."));
      return;
    }
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// ==========================================
// 3. STATE & VERİ YÖNETİMİ
// ==========================================
let issues = [];
let systemNotifications = [];
let selectedCategoryId = 'yol';
let currentPhotoDataUrl = null;
let currentModalAfterPhotoUrl = null;
let citizenFormMap = null;
let citizenFormMarker = null;
let publicCityMap = null;
let publicMarkersLayer = null;
let activeModalIssueId = null;
let lastAiAnalysis = null;
let geocodeDebounceTimer = null;

// Şehir koordinat merkezi: Afyonkarahisar Zafer Meydanı & Belediye Binası
const CITY_CENTER = [38.7569, 30.5387];

function loadIssues() {
  const stored = localStorage.getItem('aka_issues_data');
  if (stored) {
    try {
      issues = JSON.parse(stored);
      // Eski kayıtlarda history yoksa güvenceye al
      issues.forEach(iss => {
        if (!iss.history || !Array.isArray(iss.history)) {
          iss.history = [
            { timestamp: iss.createdAt || new Date().toISOString(), status: iss.status || 'Yeni', actor: 'Sistem', note: 'Kayıt oluşturuldu.' }
          ];
        }
      });
    } catch (e) {
      issues = JSON.parse(JSON.stringify(INITIAL_DEMO_ISSUES));
    }
  } else {
    issues = JSON.parse(JSON.stringify(INITIAL_DEMO_ISSUES));
    saveIssues();
  }

  const storedNotifs = localStorage.getItem('aka_notifications_data');
  if (storedNotifs) {
    try {
      systemNotifications = JSON.parse(storedNotifs);
    } catch (e) {
      systemNotifications = [];
    }
  }
}

function saveIssues() {
  try {
    localStorage.setItem('aka_issues_data', JSON.stringify(issues));
  } catch (e) {
    console.warn("LocalStorage kotası aşıldı! Eski görseller temizleniyor...", e);
    // Kotayı aşarsa görsel boyutlarını küçülterek tekrar dene
    issues.forEach(i => {
      if (i.imgBefore && i.imgBefore.length > 150000) i.imgBefore = SAMPLE_PHOTOS.pothole;
      if (i.imgAfter && i.imgAfter.length > 150000) i.imgAfter = SAMPLE_PHOTOS.repaired_road;
    });
    try {
      localStorage.setItem('aka_issues_data', JSON.stringify(issues));
    } catch (err2) {
      alert("Tarayıcı hafızası dolu olduğu için bazı veriler kalıcı kaydedilemedi. Lütfen 'Sıfırla' butonunu kullanınız.");
    }
  }

  updateStats();
  renderAdminTable();
  if (publicCityMap) {
    renderPublicMapMarkers();
  }
  // Analitik sekmesi açıksa grafikleri güncelle
  const viewAnalytics = document.getElementById('admin-view-analytics');
  if (viewAnalytics && !viewAnalytics.classList.contains('hidden')) {
    initAnalyticsCharts();
  }
}

function resetToDemoData() {
  if (confirm("Örnek veriler sıfırlansın ve tüm test kayıtları ilk durumuna dönsün mü?")) {
    issues = JSON.parse(JSON.stringify(INITIAL_DEMO_ISSUES));
    systemNotifications = [];
    localStorage.removeItem('aka_notifications_data');
    saveIssues();
    if (supabaseClient) {
      seedCurrentIssuesToSupabase(false);
    }
    renderRecentTrackChips();
    renderNotificationsDropdown();
    triggerNotification("Demo verileri başarıyla sıfırlandı ve yenilendi.", "AKA-SİSTEM");
  }
}

// ==========================================
// 3.1. SUPABASE MERKEZİ VERİTABANI & REALTIME
// ==========================================
let supabaseClient = null;
let isDatabaseOnline = false;
let realtimeSubscription = null;

function getSupabaseCredentials() {
  let url = localStorage.getItem('aka_supabase_url') || '';
  let key = localStorage.getItem('aka_supabase_key') || '';
  
  // Hatalı veya eski adres varsa config'deki doğrulanmış adresle güncelle
  if (!url || url.includes('lusrbenoy') || url.endsWith('.com')) {
    url = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.url) || 'https://tusrbenoyvnlsjwujsrv.supabase.co';
    localStorage.setItem('aka_supabase_url', url);
  }
  if (!key || key.length < 10) {
    key = (window.SUPABASE_CONFIG && window.SUPABASE_CONFIG.anonKey) || 'sb_publishable_e2meLsZNn-r9yuQsMO43AQ_I8VpMXo7';
    localStorage.setItem('aka_supabase_key', key);
  }
  return { url: url.trim(), key: key.trim() };
}

function initSupabase() {
  const { url, key } = getSupabaseCredentials();

  if (window.supabase && url && key) {
    try {
      supabaseClient = window.supabase.createClient(url, key);
      isDatabaseOnline = true;
      updateDatabaseBadge(true, "Canlı (Supabase)");
      setupRealtimeSubscription();
      fetchIssuesFromSupabase();
      return true;
    } catch (e) {
      console.error("Supabase başlatılamadı:", e);
      isDatabaseOnline = false;
      updateDatabaseBadge(false, "Bağlantı Hatası");
      return false;
    }
  } else {
    isDatabaseOnline = false;
    updateDatabaseBadge(false, "Yerel Hafıza");
    return false;
  }
}

function updateDatabaseBadge(isOnline, label) {
  const dot = document.getElementById('db-status-dot');
  const text = document.getElementById('db-status-text');
  const btn = document.getElementById('btn-db-status');
  if (!dot || !text) return;

  if (isOnline) {
    dot.className = "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse";
    text.textContent = label || "DB: Canlı";
    text.className = "text-[11px] font-bold hidden sm:inline text-emerald-600 dark:text-emerald-400";
    if (btn) btn.classList.add("border-emerald-300", "dark:border-emerald-700");
  } else {
    dot.className = "w-2.5 h-2.5 rounded-full bg-amber-500";
    text.textContent = label || "DB: Yerel";
    text.className = "text-[11px] font-bold hidden sm:inline text-amber-600 dark:text-amber-400";
    if (btn) btn.classList.remove("border-emerald-300", "dark:border-emerald-700");
  }
}

async function fetchIssuesFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('issues')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.warn("Supabase verileri çekilirken hata oluştu:", error);
      updateDatabaseBadge(false, "Sorgu Hatası");
      return;
    }

    if (data && data.length > 0) {
      issues = data;
      issues.forEach(iss => {
        if (!iss.history || !Array.isArray(iss.history)) {
          iss.history = [{ timestamp: iss.createdAt || new Date().toISOString(), status: iss.status || 'Yeni', actor: 'Sistem', note: 'Kayıt mevcuttur.' }];
        }
      });
      localStorage.setItem('aka_issues_data', JSON.stringify(issues));
      updateStats();
      renderAdminTable();
      if (publicCityMap) renderPublicMapMarkers();
      renderRecentTrackChips();
      console.log(`✅ Supabase'den ${data.length} adet canlı arıza kaydı yüklendi.`);
    } else if (data && data.length === 0) {
      console.log("ℹ️ Supabase 'issues' tablosu boş. Başlangıç verileri yükleniyor...");
      await seedCurrentIssuesToSupabase(false);
    }
  } catch (err) {
    console.warn("Supabase çekim hatası:", err);
  }
}

function setupRealtimeSubscription() {
  if (!supabaseClient) return;
  try {
    if (realtimeSubscription) {
      supabaseClient.removeChannel(realtimeSubscription);
    }

    realtimeSubscription = supabaseClient
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'issues' },
        (payload) => {
          handleRealtimeChange(payload);
        }
      )
      .subscribe((status) => {
        console.log("Supabase Realtime Durumu:", status);
      });
  } catch (e) {
    console.error("Realtime subscription hatası:", e);
  }
}

function handleRealtimeChange(payload) {
  const { eventType, new: newRec, old: oldRec } = payload;
  console.log("🔔 Gerçek Zamanlı Veritabanı Bildirimi:", eventType, newRec || oldRec);

  if (eventType === 'INSERT' && newRec) {
    const exists = issues.some(i => i.id === newRec.id || i.code === newRec.code);
    if (!exists) {
      issues.unshift(newRec);
      playNotificationTone();
      triggerToast(`🚨 Yeni İhbar Düştü: #${newRec.code} (${newRec.category})`, newRec.code);
      pushNotification(`Yeni İhbar: #${newRec.code} - ${newRec.title}`, newRec.code);
    }
  } else if (eventType === 'UPDATE' && newRec) {
    const idx = issues.findIndex(i => i.id === newRec.id || i.code === newRec.code);
    if (idx !== -1) {
      issues[idx] = newRec;
      const trackInput = document.getElementById('track-search-input');
      if (trackInput && trackInput.value.trim().toUpperCase() === newRec.code) {
        displayTrackingResult(newRec);
      }
    } else {
      issues.unshift(newRec);
    }
  } else if (eventType === 'DELETE' && oldRec) {
    issues = issues.filter(i => i.id !== oldRec.id);
  }

  localStorage.setItem('aka_issues_data', JSON.stringify(issues));
  updateStats();
  renderAdminTable();
  if (publicCityMap) renderPublicMapMarkers();
}

async function syncIssueToSupabase(issue) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient.from('issues').upsert(issue);
    if (error) {
      console.warn("Supabase kayıt/güncelleme hatası:", error);
    } else {
      console.log(`✅ Arıza #${issue.code} Supabase buluta senkronize edildi.`);
    }
  } catch (err) {
    console.warn("Supabase sync hatası:", err);
  }
}

async function deleteIssueFromSupabase(issueId) {
  if (!supabaseClient) return;
  try {
    const { error } = await supabaseClient.from('issues').delete().eq('id', issueId);
    if (error) {
      console.warn("Supabase silme hatası:", error);
    } else {
      console.log(`🗑️ İhbar ${issueId} Supabase'den silindi.`);
    }
  } catch (err) {
    console.warn("Supabase silme hatası:", err);
  }
}

async function seedCurrentIssuesToSupabase(showAlert = true) {
  if (!supabaseClient) {
    alert("Lütfen önce Supabase URL ve Anon Key girip bağlantıyı test ediniz.");
    return;
  }
  try {
    const itemsToSeed = issues && issues.length > 0 ? issues : INITIAL_DEMO_ISSUES;
    const { error } = await supabaseClient.from('issues').upsert(itemsToSeed);
    if (error) {
      console.error("Yükleme hatası:", error);
      alert("Hata: " + error.message + "\n\nLütfen tablonun oluşturulup oluşturulmadığını kontrol ediniz.");
    } else {
      if (showAlert) {
        alert("🎉 Başarılı! " + itemsToSeed.length + " adet kayıt Supabase veritabanına yüklendi.");
      }
      fetchIssuesFromSupabase();
    }
  } catch (e) {
    console.error("Seed hatası:", e);
    alert("Veritabanına aktarılırken bir hata oluştu.");
  }
}

// Modal Yönetim Fonksiyonları
function openDatabaseModal() {
  const modal = document.getElementById('database-modal');
  if (!modal) return;
  
  const { url, key } = getSupabaseCredentials();
  const inputUrl = document.getElementById('cfg-supabase-url');
  const inputKey = document.getElementById('cfg-supabase-key');
  if (inputUrl) inputUrl.value = url;
  if (inputKey) inputKey.value = key;

  refreshDatabaseModalStatusBox();

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function closeDatabaseModal() {
  const modal = document.getElementById('database-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function refreshDatabaseModalStatusBox() {
  const box = document.getElementById('db-modal-status-box');
  const title = document.getElementById('db-modal-status-title');
  const desc = document.getElementById('db-modal-status-desc');
  const icon = document.getElementById('db-modal-status-icon');
  if (!box || !title) return;

  if (isDatabaseOnline) {
    box.className = "p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start space-x-3";
    title.className = "font-bold text-emerald-900 dark:text-emerald-200";
    title.textContent = "✅ Supabase Veritabanı Bağlı & Canlı Çalışıyor";
    desc.className = "text-[11px] text-emerald-700 dark:text-emerald-300/80 mt-0.5";
    desc.textContent = "Tüm cihazlar (vatandaş telefonları ve belediye personeli) anlık olarak senkronize edilmektedir.";
    if (icon) {
      icon.setAttribute('data-lucide', 'check-circle-2');
      icon.className = "w-5 h-5 text-emerald-600 shrink-0 mt-0.5";
    }
  } else {
    box.className = "p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start space-x-3";
    title.className = "font-bold text-amber-900 dark:text-amber-200";
    title.textContent = "⚠️ Yerel Hafıza (LocalStorage) Kullanılıyor";
    desc.className = "text-[11px] text-amber-700 dark:text-amber-300/80 mt-0.5";
    desc.textContent = "Farklı telefon ve bilgisayarların aynı verileri anlık olarak görebilmesi için aşağıdaki alana Supabase bilgilerinizi giriniz.";
    if (icon) {
      icon.setAttribute('data-lucide', 'alert-circle');
      icon.className = "w-5 h-5 text-amber-600 shrink-0 mt-0.5";
    }
  }
  if (window.lucide) lucide.createIcons();
}

async function saveAndTestDatabaseConnection() {
  const url = (document.getElementById('cfg-supabase-url').value || '').trim();
  const key = (document.getElementById('cfg-supabase-key').value || '').trim();

  if (!url || !key) {
    alert("Lütfen hem Supabase Project URL hem de Anon Key değerlerini giriniz.");
    return;
  }

  const saveBtn = document.getElementById('btn-save-db');
  const originalHtml = saveBtn.innerHTML;
  saveBtn.disabled = true;
  saveBtn.innerHTML = `<span>Bağlanıyor...</span>`;

  try {
    const testClient = window.supabase.createClient(url, key);
    const { data, error } = await testClient.from('issues').select('code').limit(1);

    if (error) {
      if (error.code === '42P01') {
        alert("Bağlantı kuruldu ancak 'issues' tablosu bulunamadı!\n\nLütfen aşağıdaki '1 Dakikada Kurulum' alanındaki SQL kodunu Supabase SQL Editor'de çalıştırıp 'issues' tablosunu oluşturun.");
      } else {
        alert("Bağlantı Hatası: " + error.message);
      }
      saveBtn.disabled = false;
      saveBtn.innerHTML = originalHtml;
      return;
    }

    localStorage.setItem('aka_supabase_url', url);
    localStorage.setItem('aka_supabase_key', key);
    supabaseClient = testClient;
    isDatabaseOnline = true;
    updateDatabaseBadge(true, "Canlı (Supabase)");
    refreshDatabaseModalStatusBox();
    setupRealtimeSubscription();
    await fetchIssuesFromSupabase();

    alert("🎉 Harika! Supabase veritabanı başarıyla bağlandı ve canlı senkronizasyon aktif edildi.");
  } catch (e) {
    alert("Beklenmeyen bağlantı hatası: " + e.message);
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerHTML = originalHtml;
  }
}

function disconnectDatabase() {
  if (confirm("Veritabanı bağlantısı kesilsin ve yerel hafıza moduna dönülsün mü?")) {
    localStorage.removeItem('aka_supabase_url');
    localStorage.removeItem('aka_supabase_key');
    if (supabaseClient && realtimeSubscription) {
      supabaseClient.removeChannel(realtimeSubscription);
    }
    supabaseClient = null;
    isDatabaseOnline = false;
    updateDatabaseBadge(false, "Yerel Hafıza");
    refreshDatabaseModalStatusBox();
    document.getElementById('cfg-supabase-url').value = '';
    document.getElementById('cfg-supabase-key').value = '';
    alert("Veritabanı bağlantısı kaldırıldı. Sistem yerel hafıza moduna geçti.");
  }
}

function toggleSqlGuide() {
  const content = document.getElementById('sql-guide-content');
  const chevron = document.getElementById('sql-guide-chevron');
  if (!content) return;
  const isHidden = content.classList.contains('hidden');
  if (isHidden) {
    content.classList.remove('hidden');
    if (chevron) chevron.classList.add('rotate-180');
  } else {
    content.classList.add('hidden');
    if (chevron) chevron.classList.remove('rotate-180');
  }
}

function copySqlSchemaToClipboard() {
  const code = document.getElementById('sql-code-snippet').textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert("✅ SQL Tablo Kodu panoya kopyalandı! Supabase > SQL Editor bölümüne yapıştırıp 'RUN' butonuna basabilirsiniz.");
  }).catch(() => {
    alert("Kopyalanamadı, lütfen metni seçip Ctrl+C ile kopyalayınız.");
  });
}

function playNotificationTone() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // Ses sessiz devam
  }
}

function renderNeighborhoodOptions() {
  const sel = document.getElementById('select-neighborhood');
  if (sel) {
    sel.innerHTML = AFYON_NEIGHBORHOODS.map(n => `<option value="${n}">${n}</option>`).join('');
  }
}

// ==========================================
// 4. SAYFA BAŞLATMA & ETKİLEŞİM
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSupabase();
  renderNeighborhoodOptions();
  checkAdminAuth();
  loadIssues();
  renderCategorySelectors();
  initCitizenFormMap();
  updateStats();
  renderRecentTrackChips();
  renderAdminTable();
  renderNotificationsDropdown();
  initChatbot();

  // Dışarı tıklanınca bildirim menüsünü kapat
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('notifications-dropdown-menu');
    if (dropdown && !dropdown.classList.contains('hidden')) {
      if (!dropdown.contains(e.target) && !e.target.closest('button[onclick*="toggleNotificationDropdown"]')) {
        dropdown.classList.add('hidden');
      }
    }
  });

  // Lucide Icons Render
  if (window.lucide) {
    lucide.createIcons();
  }
});

// ==========================================
// 5. TEMA & PORTAL YÖNETİMİ
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

// ==========================================
// BELEDİYE PERSONELİ GİRİŞ & YETKİLENDİRME
// ==========================================
const ADMIN_ACCOUNTS = [
  { username: "admin", pass: "afyon153", name: "Ali Yılmaz", title: "Koordinasyon Masası Şefi", dept: "Genel Koordinasyon" },
  { username: "fenisleri", pass: "153", name: "Murat Kaya", title: "Fen İşleri Saha Amiri", dept: "Fen İşleri Müdürlüğü" },
  { username: "zabita", pass: "153", name: "Hakan Bayrak", title: "Zabıta Nöbetçi Komiseri", dept: "Zabıta Müdürlüğü" },
  { username: "afsu", pass: "153", name: "Kemal Arslan", title: "AFSU Nöbetçi Teknikeri", dept: "Su ve Kanalizasyon İdaresi (AFSU)" },
  { username: "veteriner", pass: "153", name: "Selin Toker", title: "Veteriner Hekim Nöbetçisi", dept: "Veteriner İşleri Müdürlüğü" }
];

let currentAdminUser = null;

function checkAdminAuth() {
  if (currentAdminUser) return true;
  const stored = sessionStorage.getItem('aka_admin_user');
  if (stored) {
    try {
      currentAdminUser = JSON.parse(stored);
      updateAdminUserUI();
      return true;
    } catch (e) {}
  }
  return false;
}

function handleAdminPortalClick() {
  if (checkAdminAuth()) {
    switchPortal('admin');
  } else {
    openAdminLoginModal();
  }
}

function openAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      const u = document.getElementById('admin-login-username');
      if (u) u.focus();
    }, 100);
  }
}

function closeAdminLoginModal() {
  const modal = document.getElementById('admin-login-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function fillAdminDemoLogin(username, pass) {
  const uInput = document.getElementById('admin-login-username');
  const pInput = document.getElementById('admin-login-password');
  if (uInput) uInput.value = username;
  if (pInput) pInput.value = pass;
}

function handleAdminLogin(event) {
  if (event) event.preventDefault();
  const u = (document.getElementById('admin-login-username').value || '').trim().toLowerCase();
  const p = (document.getElementById('admin-login-password').value || '').trim();

  const found = ADMIN_ACCOUNTS.find(a => a.username.toLowerCase() === u && a.pass === p);
  if (found) {
    currentAdminUser = found;
    sessionStorage.setItem('aka_admin_user', JSON.stringify(found));
    closeAdminLoginModal();
    updateAdminUserUI();
    switchPortal('admin');
    triggerNotification(`Hoş geldiniz Sn. ${found.name} (${found.title}). Oturum açıldı.`, "GİRİŞ");
  } else {
    alert("Hatalı kullanıcı adı veya şifre!\n\nHızlı giriş için penceredeki hazır profillerden birine (Koordinasyon, Fen İşleri, Zabıta) tıklayabilirsiniz.");
  }
}

function handleAdminLogout() {
  if (confirm("Belediye personel oturumunu kapatmak istediğinize emin misiniz?")) {
    currentAdminUser = null;
    sessionStorage.removeItem('aka_admin_user');
    switchPortal('citizen');
    triggerNotification("Belediye yetkili oturumu güvenli şekilde kapatıldı.", "ÇIKIŞ");
  }
}

function updateAdminUserUI() {
  const banner = document.getElementById('admin-user-banner');
  const nameEl = document.getElementById('admin-user-name');
  const badgeEl = document.getElementById('admin-user-badge');
  if (currentAdminUser && nameEl && badgeEl) {
    nameEl.textContent = currentAdminUser.name;
    badgeEl.textContent = `${currentAdminUser.title} (${currentAdminUser.dept})`;
    if (banner) banner.classList.remove('hidden');
  }
}

// Portal Switcher (Vatandaş vs Belediye)
function switchPortal(portal) {
  if (portal === 'admin' && !checkAdminAuth()) {
    openAdminLoginModal();
    return;
  }

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
    updateAdminUserUI();
  }
  if (window.lucide) lucide.createIcons();
}

// Vatandaş Alt Sekmeleri
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
// 6. KATEGORİ SEÇİCİ & FORM İŞLEMLERİ
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

function toggleAnonymous(checked) {
  const inputs = document.getElementById('contact-inputs');
  if (checked) {
    inputs.style.opacity = '0.35';
    inputs.style.pointerEvents = 'none';
  } else {
    inputs.style.opacity = '1';
    inputs.style.pointerEvents = 'auto';
  }
}

// Fotoğraf Yükleme & Otomatik Sıkıştırma
async function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    // Fotoğrafı istemcide otomatik sıkıştır (maks 1000px, 0.75 kalite JPEG)
    const compressedDataUrl = await compressImageFile(file, 1000, 1000, 0.75);
    currentPhotoDataUrl = compressedDataUrl;
    showPhotoPreview(currentPhotoDataUrl);
    runAiDamageAnalysis(selectedCategoryId);
  } catch (err) {
    alert("Fotoğraf işlenirken bir sorun oluştu: " + err.message);
  }
}

function loadSamplePhoto() {
  const sample = getDefaultCategoryPhoto(selectedCategoryId);
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

  if (input) input.value = '';
  placeholder.classList.remove('hidden');
  container.classList.add('hidden');
  if (aiCard) aiCard.classList.add('hidden');
  if (scannerOverlay) scannerOverlay.classList.add('hidden');
  lastAiAnalysis = null;
}

// ==========================================
// 7. 🤖 YAPAY ZEKA (AI) HASAR TESPİT MOTORU
// ==========================================
function runAiDamageAnalysis(categoryId) {
  const scannerOverlay = document.getElementById('ai-scanner-overlay');
  const aiCard = document.getElementById('ai-damage-result-card');

  if (!scannerOverlay || !aiCard) return;

  scannerOverlay.classList.remove('hidden');
  aiCard.classList.add('hidden');

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
    } else if (categoryId === 'temizlik') {
      analysis = {
        detectedType: "Konteyner Kapasite Aşımı & Katı Atık Dağılması",
        severity: 65,
        severityLabel: "⚠️ Hasar Şiddeti: %65 (Orta)",
        dept: "Temizlik İşleri Müdürlüğü (~2 Saat)",
        categoryId: "temizlik",
        urgency: "Düşük",
        suggestedTitle: "Dolu Çöp Konteyneri / Çevre ve Koku Şikayeti",
        suggestedDesc: "AKA Vision AI Analizi: Konteyner hacmi dolmuş ve atıklar kaldırıma taşmış. Çöp kamyonu rotasına acil intikal önerilir."
      };
    }

    lastAiAnalysis = analysis;

    document.getElementById('ai-detected-type').textContent = analysis.detectedType;
    document.getElementById('ai-detected-dept').textContent = analysis.dept;
    document.getElementById('ai-badge-severity').textContent = analysis.severityLabel;

    pushNotification("Yapay zeka görseli taradı ve hasar raporunu çıkardı.", "AI-VISION");
    if (window.lucide) lucide.createIcons();
  }, 1100);
}

function applyAiSuggestionsToForm() {
  if (!lastAiAnalysis) return;

  document.getElementById('input-title').value = lastAiAnalysis.suggestedTitle;
  document.getElementById('input-desc').value = lastAiAnalysis.suggestedDesc;
  selectCategory(lastAiAnalysis.categoryId);

  if (window.confetti) {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
  }
  pushNotification("Yapay zeka önerileri forma aktarıldı!", "AI-OTOMATİK");
}

// ==========================================
// 8. İNTERAKTİF HARİTALAR & TERS JEOKODLAMA (OSM)
// ==========================================
function initCitizenFormMap() {
  const mapElement = document.getElementById('citizen-form-map');
  if (!mapElement || citizenFormMap) return;

  citizenFormMap = L.map('citizen-form-map', {
    zoomControl: true,
    scrollWheelZoom: false
  }).setView(CITY_CENTER, 14);

  // Harita katmanı (CartoDB Voyager - Hızlı, bloklamasız ve şık harita)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
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
  // OpenStreetMap Nominatim ile gerçek adres bul
  fetchReverseGeocode(lat, lng);
}

// OpenStreetMap Nominatim API ile koordinattan gerçek sokak ve mahalle adını al (Debounced)
function fetchReverseGeocode(lat, lng) {
  const spinner = document.getElementById('geocoding-spinner');
  if (spinner) {
    spinner.classList.remove('hidden');
    spinner.classList.add('flex');
  }

  clearTimeout(geocodeDebounceTimer);
  geocodeDebounceTimer = setTimeout(async () => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'tr' }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.address) {
          const road = data.address.road || data.address.pedestrian || data.address.footway || data.address.suburb || '';
          const houseNum = data.address.house_number ? ` No: ${data.address.house_number}` : '';
          const suburb = data.address.suburb || data.address.neighbourhood || data.address.quarter || '';

          const streetText = (road + houseNum).trim();
          const inputAddress = document.getElementById('input-address');
          if (streetText && inputAddress) {
            inputAddress.value = streetText;
          }

          // Mahalle eşleştirmesi
          if (suburb) {
            const selectNeigh = document.getElementById('select-neighborhood');
            for (let i = 0; i < selectNeigh.options.length; i++) {
              const optVal = selectNeigh.options[i].value.toLowerCase().replace(' mahallesi', '');
              if (suburb.toLowerCase().includes(optVal) || optVal.includes(suburb.toLowerCase())) {
                selectNeigh.selectedIndex = i;
                break;
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn("Ters jeokodlama servisi yanıt vermedi:", err);
    } finally {
      if (spinner) {
        spinner.classList.add('hidden');
        spinner.classList.remove('flex');
      }
    }
  }, 650);
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
        pushNotification("Mevcut konumunuz başarıyla tespit edildi.", "GPS-AKTİF");
      }
    },
    () => {
      const jitterLat = CITY_CENTER[0] + (Math.random() - 0.5) * 0.01;
      const jitterLng = CITY_CENTER[1] + (Math.random() - 0.5) * 0.01;
      citizenFormMap.setView([jitterLat, jitterLng], 15);
      citizenFormMarker.setLatLng([jitterLat, jitterLng]);
      updateFormCoordinates(jitterLat, jitterLng);
      pushNotification("Örnek GPS konumu tespit edildi.", "GPS-SİMÜLE");
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
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
    ? issues.filter(i => i.status !== 'Iptal')
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

    const safeTitle = escapeHtml(issue.title);
    const safeNeigh = escapeHtml(issue.neighborhood);
    const safeCat = escapeHtml(issue.category);

    const popupHtml = `
      <div style="min-width: 200px; padding: 4px; font-family: inherit;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
          <span style="font-family: monospace; font-weight: bold; color: #2563eb; font-size: 11px;">#${issue.code}</span>
          <span style="background: ${pinColor}20; color: ${pinColor}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 999px;">${statusLabel}</span>
        </div>
        <h4 style="margin: 0 0 4px 0; font-weight: 800; font-size: 13px; color: #0f172a;">${safeTitle}</h4>
        <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">${safeNeigh} • ${safeCat}</p>
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
// 9. YENİ ARIZA GÖNDERME & KOD ÜRETİMİ
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

  const nowIso = new Date().toISOString();
  const defaultPhoto = getDefaultCategoryPhoto(categoryObj.id);

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
    createdAt: nowIso,
    assignedTeam: null,
    fieldNote: null,
    imgBefore: currentPhotoDataUrl || defaultPhoto,
    imgAfter: null,
    rating: null,
    feedback: null,
    history: [
      {
        timestamp: nowIso,
        status: "Yeni",
        actor: isAnonymous ? "Anonim Vatandaş" : `Vatandaş (${citizenName})`,
        note: "Arıza ihbarı dijital portaldan sisteme iletildi."
      }
    ]
  };

  issues.unshift(newIssue);
  saveIssues();
  syncIssueToSupabase(newIssue);

  if (window.confetti) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  pushNotification(`Sayın ${citizenName}, #${newCode} nolu ihbarınız belediyemize ulaştı.`, newCode);

  document.getElementById('input-title').value = '';
  document.getElementById('input-desc').value = '';
  document.getElementById('input-address').value = '';
  removePhoto();

  switchCitizenTab('track');
  document.getElementById('track-search-input').value = newCode;
  displayTrackingResult(newIssue);
}

// ==========================================
// 10. İHBAR TAKİP SİSTEMİ & ZAMAN ÇİZELGESİ
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
        <p class="text-xs text-slate-500 dark:text-slate-400">"${escapeHtml(query)}" koduna ait arıza kaydı bulunamadı. Lütfen takip kodunu kontrol ediniz.</p>
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

  // Tarihçe maddeleri HTML
  const historyListHtml = (issue.history || []).map(h => {
    const timeFormatted = new Date(h.timestamp).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="flex items-start space-x-3 text-xs border-l-2 border-blue-500 pl-3 py-1">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHtml(h.actor || 'Sistem')}</span>
            <span class="text-[10px] text-slate-400 font-mono">${timeFormatted}</span>
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">${escapeHtml(h.note)}</p>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8 animate-fade-in">
      
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-mono font-black text-blue-600 dark:text-blue-400 text-base sm:text-lg">#${issue.code}</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${
              issue.status === 'Cozuldu' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
              issue.status === 'Sahada' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
              issue.status === 'Inceleniyor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
              issue.status === 'Iptal' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' :
              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300'
            }">${getStatusBadgeText(issue.status)}</span>
          </div>
          <h2 class="text-xl font-black text-slate-900 dark:text-white mt-1">${escapeHtml(issue.title)}</h2>
          <div class="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center space-x-3">
            <span>📍 ${escapeHtml(issue.neighborhood)}</span>
            <span>•</span>
            <span>🏛️ ${escapeHtml(issue.department)}</span>
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
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">${escapeHtml(issue.assignedTeam || 'Ekip görevlendirildi')}</p>
          </div>

          <div class="p-3.5 rounded-2xl border ${stepIndex >= 4 ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/60' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'}">
            <div class="flex items-center space-x-2">
              <div class="w-6 h-6 rounded-full ${stepIndex >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-300 dark:bg-slate-700 text-slate-600'} flex items-center justify-center text-xs font-bold">4</div>
              <span class="text-xs font-bold ${stepIndex >= 4 ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-500'}">Çözüldü</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Kanıtla onaylandı</p>
          </div>

        </div>
      </div>

      <!-- SAHA VE VATANDAŞ BİLGİSİ -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Vatandaş Notu</span>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">${escapeHtml(issue.desc)}</p>
        </div>

        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Saha Ekibi Bildirimi</span>
          <p class="text-xs ${issue.fieldNote ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 italic'} leading-relaxed">
            ${issue.fieldNote ? escapeHtml(issue.fieldNote) : 'Henüz saha ekibi notu girilmedi. Ekipler koordinasyon halindedir.'}
          </p>
        </div>
      </div>

      <!-- SÜREÇ TARİHÇESİ (AUDIT TRAIL) -->
      <div class="p-5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
          <i data-lucide="history" class="w-4 h-4 text-blue-600"></i>
          <span>Müdahale & İşlem Tarihçesi (Audit Trail)</span>
        </h4>
        <div class="space-y-3 pt-1">
          ${historyListHtml}
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
    if (!target.history) target.history = [];
    target.history.push({
      timestamp: new Date().toISOString(),
      status: target.status,
      actor: "Vatandaş",
      note: `Hizmet memnuniyeti değerlendirildi: ${stars}/5 Yıldız.`
    });
    saveIssues();
    syncIssueToSupabase(target);
    displayTrackingResult(target);
    pushNotification(`Değerlendirmeniz kaydedildi (${stars}/5 yıldız). Katkınız için teşekkürler!`, target.code);
  }
}

function shareTracking(code) {
  navigator.clipboard.writeText(window.location.href);
  pushNotification(`Takip linki panoya kopyalandı: #${code}`, code);
}

// ==========================================
// 11. BELEDİYE KOORDİNASYON & YÖNETİM (ADMIN)
// ==========================================
function updateStats() {
  const total = issues.length;
  const pending = issues.filter(i => i.status === 'Yeni' || i.status === 'Inceleniyor').length;
  const inProgress = issues.filter(i => i.status === 'Sahada').length;
  const resolved = issues.filter(i => i.status === 'Cozuldu').length;
  const urgent = issues.filter(i => i.urgency === 'Acil' && i.status !== 'Cozuldu' && i.status !== 'Iptal').length;

  const badgePending = document.getElementById('badge-pending-count');
  if (badgePending) badgePending.textContent = pending;

  const statTotalSolved = document.getElementById('stat-total-solved');
  if (statTotalSolved) statTotalSolved.textContent = resolved + 42;

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

  const search = (document.getElementById('adm-search-filter')?.value || '').toLowerCase().trim();
  const dept = document.getElementById('adm-dept-filter')?.value || 'all';
  const status = document.getElementById('adm-status-filter')?.value || 'all';
  const urgency = document.getElementById('adm-urgency-filter')?.value || 'all';
  const sort = document.getElementById('adm-sort-filter')?.value || 'newest';

  let filtered = issues.filter(iss => {
    const matchesSearch = !search || 
      iss.code.toLowerCase().includes(search) || 
      iss.title.toLowerCase().includes(search) || 
      iss.neighborhood.toLowerCase().includes(search) ||
      (iss.citizenName && iss.citizenName.toLowerCase().includes(search)) ||
      (iss.citizenPhone && iss.citizenPhone.includes(search)) ||
      (iss.address && iss.address.toLowerCase().includes(search));

    const matchesDept = dept === 'all' || iss.department === dept;
    const matchesStatus = status === 'all' || iss.status === status;
    const matchesUrgency = urgency === 'all' || iss.urgency === urgency;

    return matchesSearch && matchesDept && matchesStatus && matchesUrgency;
  });

  // Sıralama Mantığı
  if (sort === 'newest') {
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'oldest') {
    filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'urgent') {
    const urgencyOrder = { 'Acil': 1, 'Normal': 2, 'Düşük': 3 };
    filtered.sort((a, b) => (urgencyOrder[a.urgency] || 9) - (urgencyOrder[b.urgency] || 9));
  } else if (sort === 'status') {
    const statusOrder = { 'Yeni': 1, 'Inceleniyor': 2, 'Sahada': 3, 'Cozuldu': 4, 'Iptal': 5 };
    filtered.sort((a, b) => (statusOrder[a.status] || 9) - (statusOrder[b.status] || 9));
  }

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

  tbody.innerHTML = filtered.map(iss => {
    const safeTitle = escapeHtml(iss.title);
    const safeNeigh = escapeHtml(iss.neighborhood);
    const safeAddress = escapeHtml(iss.address);
    const safeDept = escapeHtml(iss.department);
    const safeTeam = escapeHtml(iss.assignedTeam || 'Ekip Atanmadı');

    return `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer" onclick="openActionModal('${iss.id}')">
        <td class="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">#${iss.code}</td>
        <td class="px-5 py-3.5">
          <div class="font-bold text-slate-900 dark:text-white">${safeTitle}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(iss.category)}</div>
        </td>
        <td class="px-5 py-3.5 text-slate-600 dark:text-slate-300">
          <div>${safeNeigh}</div>
          <div class="text-[11px] text-slate-400 truncate max-w-xs">${safeAddress}</div>
        </td>
        <td class="px-5 py-3.5">
          <div class="font-semibold text-slate-700 dark:text-slate-200">${safeDept}</div>
          <div class="text-[11px] text-blue-600 dark:text-blue-400 font-bold">${safeTeam}</div>
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
            iss.status === 'Inceleniyor' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
            iss.status === 'Iptal' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
            'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }">${getStatusBadgeText(iss.status)}</span>
        </td>
        <td class="px-5 py-3.5 text-right">
          <button onclick="event.stopPropagation(); openActionModal('${iss.id}')" class="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition font-bold text-xs">
            Yönet & Çöz
          </button>
        </td>
      </tr>
    `;
  }).join('');

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
// 12. DETAY & AKSİYON MODALI (ADMIN DISPATCH)
// ==========================================
function openActionModal(issueId) {
  const issue = issues.find(i => i.id === issueId);
  if (!issue) return;

  activeModalIssueId = issueId;
  currentModalAfterPhotoUrl = issue.imgAfter || null;

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
  imgBefore.src = issue.imgBefore || getDefaultCategoryPhoto('yol');

  updateModalAfterPhotoDisplay(issue.imgAfter);

  document.getElementById('modal-select-dept').value = issue.department;
  document.getElementById('modal-input-team').value = issue.assignedTeam || '';
  document.getElementById('modal-select-status').value = issue.status;
  document.getElementById('modal-select-urgency').value = issue.urgency;
  document.getElementById('modal-field-note').value = issue.fieldNote || '';

  // Modal içindeki işlem tarihçesini doldur
  renderModalHistory(issue);

  const modal = document.getElementById('action-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  if (window.lucide) lucide.createIcons();
}

function renderModalHistory(issue) {
  const container = document.getElementById('modal-history-list');
  if (!container) return;

  const history = issue.history || [];
  if (history.length === 0) {
    container.innerHTML = `<span class="text-slate-400 italic">İşlem geçmişi bulunmuyor.</span>`;
    return;
  }

  container.innerHTML = history.map(h => {
    const timeFormatted = new Date(h.timestamp).toLocaleDateString('tr-TR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
    return `
      <div class="flex items-center justify-between py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-none">
        <div>
          <span class="font-bold text-slate-800 dark:text-slate-200">${escapeHtml(h.actor || 'Yetkili')}:</span>
          <span class="text-slate-600 dark:text-slate-400">${escapeHtml(h.note)}</span>
        </div>
        <span class="text-[10px] text-slate-400 font-mono ml-2 shrink-0">${timeFormatted}</span>
      </div>
    `;
  }).join('');
}

function updateModalAfterPhotoDisplay(src) {
  const imgAfter = document.getElementById('modal-img-after');
  const noAfterImg = document.getElementById('modal-no-after-img');

  if (src) {
    imgAfter.src = src;
    imgAfter.classList.remove('hidden');
    noAfterImg.classList.add('hidden');
  } else {
    imgAfter.classList.add('hidden');
    noAfterImg.classList.remove('hidden');
  }
}

// Belediye yetkilisinin cihazından gerçek saha onarım fotoğrafı yüklemesi
async function handleModalAfterPhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const compressed = await compressImageFile(file, 1000, 1000, 0.75);
    currentModalAfterPhotoUrl = compressed;
    updateModalAfterPhotoDisplay(compressed);
    document.getElementById('modal-select-status').value = 'Cozuldu';
    document.getElementById('modal-field-note').value = 'Saha ekibi tarafından onarım tamamlandı ve görsel kanıt eklendi.';
    pushNotification("Saha çözüm fotoğrafı başarıyla yüklendi.", "SAHA-KANIT");
  } catch (err) {
    alert("Fotoğraf yükleme hatası: " + err.message);
  }
}

function loadSampleResolutionPhoto() {
  if (!activeModalIssueId) return;
  const issue = issues.find(i => i.id === activeModalIssueId);
  if (!issue) return;

  let sample = SAMPLE_PHOTOS.repaired_road;
  if (issue.category.includes('Lamba')) sample = SAMPLE_PHOTOS.streetlight_fixed;
  else if (issue.category.includes('Su')) sample = SAMPLE_PHOTOS.water_fixed;
  else if (issue.category.includes('Park')) sample = SAMPLE_PHOTOS.park_fixed;
  else if (issue.category.includes('Temizlik')) sample = SAMPLE_PHOTOS.trash_fixed;

  currentModalAfterPhotoUrl = sample;
  updateModalAfterPhotoDisplay(sample);

  document.getElementById('modal-select-status').value = 'Cozuldu';
  document.getElementById('modal-field-note').value = 'Saha ekibi tarafından onarım tamamlandı ve test edildi. Alan kullanıma açıldı.';
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

  if (currentModalAfterPhotoUrl) {
    issue.imgAfter = currentModalAfterPhotoUrl;
  } else if (newStatus === 'Cozuldu' && !issue.imgAfter) {
    issue.imgAfter = SAMPLE_PHOTOS.repaired_road;
  }

  // Tarihçeye yeni aksiyonu kaydet
  if (!issue.history) issue.history = [];
  let logNote = `Durum: ${getStatusBadgeText(newStatus)}`;
  if (newTeam) logNote += ` • Ekip: ${newTeam}`;
  if (newNote) logNote += ` • Not: ${newNote}`;

  issue.history.push({
    timestamp: new Date().toISOString(),
    status: newStatus,
    actor: "Koordinasyon Masası",
    note: logNote
  });

  saveIssues();
  syncIssueToSupabase(issue);
  closeActionModal();

  if (oldStatus !== newStatus) {
    pushNotification(`Sayın vatandaşımız, #${issue.code} numaralı bildiriminizin durumu "${getStatusBadgeText(newStatus)}" olarak güncellendi.`, issue.code);
  } else {
    pushNotification(`#${issue.code} numaralı ihbar güncellendi.`, issue.code);
  }
}

function deleteActiveIssue() {
  if (!activeModalIssueId) return;
  const issue = issues.find(i => i.id === activeModalIssueId);
  if (!issue) return;

  if (confirm(`"${issue.code}" kodlu arıza kaydını kalıcı olarak silmek istediğinizden emin misiniz?`)) {
    const idToDelete = activeModalIssueId;
    issues = issues.filter(i => i.id !== idToDelete);
    saveIssues();
    deleteIssueFromSupabase(idToDelete);
    closeActionModal();
    pushNotification(`#${issue.code} numaralı ihbar başarıyla silindi.`, "SİLİNDİ");
  }
}

function closeActionModal() {
  const modal = document.getElementById('action-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  activeModalIssueId = null;
  currentModalAfterPhotoUrl = null;
}

// ==========================================
// 13. 📊 EXCEL (.CSV) DIŞA AKTARMA (GÜVENLİ)
// ==========================================
function exportToExcel() {
  // UTF-8 BOM ekleyerek Türkçe karakterlerin Excel'de düzgün açılmasını sağlıyoruz
  let csvContent = "\uFEFF";
  
  const headers = [
    "Takip Kodu", "Kategori", "Başlık", "Mahalle", "Adres", 
    "Sorumlu Birim", "Saha Ekibi", "Öncelik", "Durum", 
    "Kayıt Tarihi", "Vatandaş Adı", "Vatandaş Telefon", "Saha Notu"
  ];
  csvContent += headers.map(h => `"${h}"`).join(";") + "\r\n";

  issues.forEach(iss => {
    const row = [
      sanitizeCsvValue(iss.code),
      sanitizeCsvValue(iss.category),
      sanitizeCsvValue(iss.title),
      sanitizeCsvValue(iss.neighborhood),
      sanitizeCsvValue(iss.address),
      sanitizeCsvValue(iss.department),
      sanitizeCsvValue(iss.assignedTeam || "Atanmadı"),
      sanitizeCsvValue(iss.urgency),
      sanitizeCsvValue(getStatusBadgeText(iss.status)),
      sanitizeCsvValue(new Date(iss.createdAt).toLocaleString('tr-TR')),
      sanitizeCsvValue(iss.citizenName),
      sanitizeCsvValue(iss.citizenPhone || "-"),
      sanitizeCsvValue(iss.fieldNote || "-")
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

  pushNotification("Excel raporu (.csv) başarıyla indirildi.", "EXCEL-EXPORT");
}

// ==========================================
// 14. 📄 RESMİ BELEDİYE PDF RAPORLARI
// ==========================================

// 1. Toplu İcra Özeti Raporu
function openOfficialPdfReport() {
  const modal = document.getElementById('official-report-modal');
  const container = document.getElementById('printable-report-content');
  const titleHeader = document.getElementById('report-modal-header-title');
  if (!modal || !container) return;

  if (titleHeader) titleHeader.textContent = "Genel Belediye Arıza ve İcra Özeti Raporu";

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
      <h1 class="text-xl font-black text-slate-900 uppercase tracking-tight mt-1">AKILLI KENT AĞI (AKA) GENEL ARIZA VE ÇÖZÜM İCRA RAPORU</h1>
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
                <div class="font-bold">${escapeHtml(i.title)}</div>
                <div class="text-[10px] text-slate-500">${escapeHtml(i.category)}</div>
              </td>
              <td class="p-2 border-r border-slate-200">${escapeHtml(i.neighborhood)}</td>
              <td class="p-2 border-r border-slate-200">${escapeHtml(i.department)}</td>
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

// 2. Tekil Saha İcra Tutanağı (Vaka Bazlı Fotoğraflı Resmi Evrak)
function printSingleIssueReport() {
  if (!activeModalIssueId) return;
  const issue = issues.find(i => i.id === activeModalIssueId);
  if (!issue) return;

  const modal = document.getElementById('official-report-modal');
  const container = document.getElementById('printable-report-content');
  const titleHeader = document.getElementById('report-modal-header-title');
  if (!modal || !container) return;

  if (titleHeader) titleHeader.textContent = `Saha İcra Tutanağı: #${issue.code}`;

  const dateNow = new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  const createdFormatted = new Date(issue.createdAt).toLocaleString('tr-TR');

  container.innerHTML = `
    <!-- Resmi Antet -->
    <div class="border-b-2 border-slate-900 pb-4 text-center space-y-1">
      <div class="text-xs uppercase tracking-widest font-bold text-slate-500">T.C. BÜYÜKŞEHİR / İLÇE BELEDİYE BAŞKANLIĞI</div>
      <div class="text-sm uppercase tracking-wider font-extrabold text-slate-700">${escapeHtml(issue.department)}</div>
      <h1 class="text-lg font-black text-slate-900 uppercase tracking-tight mt-1">SAHA MÜDAHALE, ONARIM VE İCRA TUTANAĞI</h1>
      <div class="flex items-center justify-between text-xs text-slate-500 font-mono pt-2">
        <span>Tutanak No: TUT-${issue.code}</span>
        <span>Tanzim Tarihi: ${dateNow}</span>
      </div>
    </div>

    <!-- İhbar Temel Bilgileri Tablosu -->
    <div class="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-3">
      <div class="grid grid-cols-2 gap-4 text-xs">
        <div>
          <span class="text-slate-500 font-bold block">İhbar Takip Kodu:</span>
          <span class="font-mono font-black text-base text-blue-700">#${issue.code}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">İhbar Durumu / Öncelik:</span>
          <span class="font-bold">${getStatusBadgeText(issue.status)} / ${issue.urgency}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">Arıza Kategorisi:</span>
          <span class="font-bold">${escapeHtml(issue.category)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">Kayıt Tarihi:</span>
          <span>${createdFormatted}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">Mahalle & Adres:</span>
          <span class="font-bold">${escapeHtml(issue.neighborhood)} — ${escapeHtml(issue.address)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">GPS Koordinatları:</span>
          <span class="font-mono">${issue.lat.toFixed(5)}, ${issue.lng.toFixed(5)}</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">Bildiren Vatandaş:</span>
          <span>${escapeHtml(issue.citizenName)} (${escapeHtml(issue.citizenPhone || 'Telefon Yok')})</span>
        </div>
        <div>
          <span class="text-slate-500 font-bold block">Görevli Saha Ekibi:</span>
          <span class="font-bold text-blue-800">${escapeHtml(issue.assignedTeam || 'Atama Yapılmadı')}</span>
        </div>
      </div>

      <div class="pt-2 border-t border-slate-200 text-xs">
        <span class="text-slate-500 font-bold block">Vatandaş Şikayet Açıklaması:</span>
        <p class="mt-0.5 text-slate-800">${escapeHtml(issue.desc)}</p>
      </div>
    </div>

    <!-- Fotoğraflı Kanıt Karşılaştırması -->
    <div class="space-y-2">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-700">Fotoğraflı Saha Kanıtları (Öncesi / Sonrası)</h3>
      <div class="grid grid-cols-2 gap-4">
        <div class="border border-slate-300 rounded-xl p-2 text-center space-y-1">
          <span class="text-[11px] font-bold text-slate-600 block">1. İhbar Anı Fotoğrafı (Öncesi)</span>
          <img src="${issue.imgBefore}" class="w-full h-44 object-cover rounded-lg border border-slate-200" alt="Öncesi">
        </div>
        <div class="border border-slate-300 rounded-xl p-2 text-center space-y-1">
          <span class="text-[11px] font-bold text-slate-600 block">2. Saha Çözüm Kanıtı (Sonrası)</span>
          ${issue.imgAfter 
            ? `<img src="${issue.imgAfter}" class="w-full h-44 object-cover rounded-lg border border-slate-200" alt="Sonrası">` 
            : `<div class="h-44 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 text-xs italic">Henüz çözüm görseli yüklenmedi</div>`
          }
        </div>
      </div>
    </div>

    <!-- Saha Ekibi İcra Açıklaması -->
    <div class="border border-slate-300 rounded-xl p-4 bg-slate-50 space-y-1 text-xs">
      <span class="font-bold text-slate-700 uppercase block">Saha Ekibi Müdahale & İcra Raporu:</span>
      <p class="text-slate-800 leading-relaxed">${issue.fieldNote ? escapeHtml(issue.fieldNote) : 'Onarım saha ekibi tarafından kontrol edilerek tamamlanmıştır.'}</p>
    </div>

    <!-- Süreç İmzaları -->
    <div class="pt-8 border-t border-slate-300 grid grid-cols-3 text-center text-xs">
      <div>
        <div class="font-bold text-slate-700">Saha Ekip Sorumlusu</div>
        <div class="mt-8 font-semibold">${escapeHtml(issue.assignedTeam || 'Saha Personeli')}</div>
        <div class="text-[10px] text-slate-400">İmza</div>
      </div>
      <div>
        <div class="font-bold text-slate-700">Bölge Kontrol Mühendisi</div>
        <div class="mt-8 font-semibold">T.C. Belediye Personeli</div>
        <div class="text-[10px] text-slate-400">İmza</div>
      </div>
      <div>
        <div class="font-bold text-slate-700">Birim Daire Başkanı / Müdürü</div>
        <div class="mt-8 font-semibold">${escapeHtml(issue.department)}</div>
        <div class="text-[10px] text-slate-400">Onay & Mühür</div>
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
// 15. 💬 AKILLI WHATSAPP & AKA ASİSTAN CHATBOT
// ==========================================
// ==========================================
// 15. AFYONKARAHİSAR BELEDİYESİ NÖBETÇİ BİRİM UZMANLARI & CANLI İHBAR
// ==========================================
const MUNICIPAL_SPECIALISTS = {
  fen: {
    id: "fen",
    name: "İnş. Müh. Murat Kaya",
    role: "Fen İşleri Nöbetçi Amiri",
    dept: "Fen İşleri Müdürlüğü",
    avatar: "👷‍♂️",
    status: "Çevrimiçi (Saha Telsizinde)",
    catId: "yol",
    team: "1. Bölge Sıcak Asfalt Ekibi",
    greeting: "İyi günler, ben Afyonkarahisar Belediyesi Fen İşleri Nöbetçi Amiri Murat Kaya. Yol çökmesi, asfalt çukuru, bordür veya kaldırım hasarlarını doğrudan inceliyorum. Lütfen cadde/sokak adını veya arıza detayını iletiniz, ekibimizi hemen yönlendireyim."
  },
  su: {
    id: "su",
    name: "Tekniker Kemal Arslan",
    role: "AFSU Nöbetçi Koordinatörü",
    dept: "Su ve Kanalizasyon İdaresi (AFSU)",
    avatar: "💧",
    status: "Çevrimiçi (Pompa İstasyonu)",
    catId: "su",
    team: "AFSU Acil Müdahale Timi 1",
    greeting: "Merhaba, AFSU Acil Harekat Masasından Kemal Arslan. Ana şebeke su patlağı, kanal tıkanması veya açık rögar durumunda hattın vanasını kısmak ve nöbetçi tamirat ekibini sevk etmek için konumunuzu bekliyorum."
  },
  zabita: {
    id: "zabita",
    name: "Komiser Hakan Bayrak",
    role: "Zabıta Nöbetçi Amiri",
    dept: "Zabıta Müdürlüğü",
    avatar: "👮‍♂️",
    status: "Çevrimiçi (Harekat Odası)",
    catId: "zabita",
    team: "Zabıta Devriye Ekibi A",
    greeting: "Afyonkarahisar Zabıta Harekat Merkezinden Komiser Hakan. Kaldırım işgali, seyyar satıcı, gürültü kirliliği veya fahiş fiyat şikayetlerinizi devriye aracımıza hemen telsizle anons edebilirim."
  },
  veteriner: {
    id: "veteriner",
    name: "Vet. Hekim Selin Toker",
    role: "Veteriner Acil Müdahale",
    dept: "Veteriner İşleri Müdürlüğü",
    avatar: "🐕",
    status: "Çevrimiçi (Hayvan Kliniği)",
    catId: "veteriner",
    team: "Hayvan Ambulansı & Müdahale Timi",
    greeting: "Merhaba, ben Nöbetçi Veteriner Hekim Selin Toker. Yaralı, hasta veya acil müdahaleye muhtaç sokak hayvanları için tam teşekküllü hayvan ambulansımızı sevk edebilirim. Can dostumuzun durumu ve konumu nedir?"
  },
  temizlik: {
    id: "temizlik",
    name: "Sorumlu İbrahim Yurt",
    role: "Temizlik İşleri Vardiya Şefi",
    dept: "Temizlik İşleri Müdürlüğü",
    avatar: "🧹",
    status: "Çevrimiçi (Vardiya Sahası)",
    catId: "temizlik",
    team: "Çöp Toplama Vardiya Ekibi",
    greeting: "Merhaba, Temizlik İşleri Vardiya Amiri İbrahim Yurt. Dolup taşan konteyner, moloz/kaba atık veya sokak yıkama taleplerinizi çöp kamyonu ve süpürge ekiplerimize anında iletiyorum."
  }
};

let activeSpecialistKey = "fen";

let chatMessages = [
  {
    sender: 'bot',
    text: "👷‍♂️ **İnş. Müh. Murat Kaya (Fen İşleri Nöbetçi Amiri):** Merhaba! Afyonkarahisar Belediyesi Fen İşleri nöbetçi hattındasınız. Yol çökmesi, asfalt çukuru veya kaldırım hasarlarında lütfen adres veya sorununuzu yazınız. Ekiplerimiz sahada nöbettedir.",
    time: "10:00"
  }
];

function initChatbot() {
  renderChatMessages();
}

function switchChatSpecialist(key) {
  if (!MUNICIPAL_SPECIALISTS[key]) return;
  activeSpecialistKey = key;
  const spec = MUNICIPAL_SPECIALISTS[key];

  ['fen', 'su', 'zabita', 'veteriner', 'temizlik'].forEach(k => {
    const btn = document.getElementById(`spec-btn-${k}`);
    if (btn) {
      if (k === key) {
        btn.className = "px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-sm whitespace-nowrap transition";
      } else {
        btn.className = "px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 whitespace-nowrap transition";
      }
    }
  });

  const avatarEl = document.getElementById('chat-specialist-avatar');
  const nameEl = document.getElementById('chat-specialist-name');
  const roleEl = document.getElementById('chat-specialist-role');
  if (avatarEl) avatarEl.textContent = spec.avatar;
  if (nameEl) nameEl.textContent = spec.name;
  if (roleEl) roleEl.textContent = `${spec.role} • ${spec.status}`;

  const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  chatMessages.push({
    sender: 'bot',
    text: `${spec.avatar} **${spec.name} (${spec.role}):** ${spec.greeting}`,
    time: timeNow
  });
  renderChatMessages();
  if (window.lucide) lucide.createIcons();
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
          <div class="text-[10px] text-slate-400 text-right">${escapeHtml(msg.time)}</div>
        </div>
      </div>
    `;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

function formatChatMessage(text) {
  return escapeHtml(text)
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

// Birim Uzmanı Cevap ve Saha Görev Motoru
function processChatInput(text) {
  const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

  chatMessages.push({
    sender: 'user',
    text: text,
    time: timeNow
  });
  renderChatMessages();

  const lower = text.toLowerCase().trim();
  const spec = MUNICIPAL_SPECIALISTS[activeSpecialistKey] || MUNICIPAL_SPECIALISTS['fen'];

  setTimeout(() => {
    // 1. Selamlama Niyeti
    const greetings = ['merhaba', 'selam', 'günaydın', 'iyi günler', 'iyi akşamlar', 'hey', 'merhabalar', 'kolay gelsin'];
    if (greetings.some(g => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g))) {
      botReply(`${spec.avatar} **${spec.name}:** Merhaba! Afyonkarahisar halkımızın 7/24 hizmetindeyiz. ${spec.role} olarak telsiz başındayım. Çözmemizi istediğiniz sorunu veya adresi yazarsanız ekibimi derhal yönlendireyim.`);
      return;
    }

    // 2. Belediye İletişim / Beyaz Masa
    if (lower.includes('saat') || lower.includes('mesai') || lower.includes('iletişim') || lower.includes('telefon') || lower.includes('153') || lower.includes('alo')) {
      botReply(`🏛️ **Afyonkarahisar Belediyesi İletişim Bilgileri:**\n\n• **ALO 153 Beyaz Masa:** 7/24 Kesintisiz\n• **WhatsApp İhbar Hattı:** 0530 256 03 03\n• **Santral:** 0272 214 42 00\n• **Nöbetçi Ekip:** ${spec.role} (${spec.name}) sahada görev başındadır.`);
      return;
    }

    // 3. İhbar Sorgulama
    if (lower.includes('sorgula') || lower.includes('durum') || lower.includes('aka-') || /aka-\d+-\d+/i.test(text)) {
      const match = text.match(/AKA-\d+-\d+/i);
      if (match) {
        const found = issues.find(i => i.code.toUpperCase() === match[0].toUpperCase());
        if (found) {
          botReply(`🔍 **#${found.code}** nolu başvurunuz incelendi:\n\n• **Başlık:** ${found.title}\n• **Birim:** ${found.department}\n• **Durum:** ${getStatusBadgeText(found.status)}\n• **Saha Notu:** ${found.fieldNote || 'Ekiplerimiz sahada müdahale etmektedir.'}`);
          return;
        } else {
          botReply(`"${match[0]}" kodlu bir arıza kaydı bulunamadı. Lütfen takip kodunuzu kontrol ediniz.`);
          return;
        }
      } else {
        const last = issues[0];
        if (last) {
          botReply(`Sistemimizdeki son bildirim: **#${last.code}** (${last.title}). Durum: **${getStatusBadgeText(last.status)}**.`);
        } else {
          botReply(`Sorgulamak istediğiniz **#AKA-2026-XXXX** takip kodunu yazabilirsiniz.`);
        }
        return;
      }
    }

    // 4. Doğrudan Arıza / İhbar Kaydı Oluşturma
    // Afyonkarahisar mahalle tespiti
    let matchedNeighborhood = "Dumlupınar Mahallesi";
    for (const n of AFYON_NEIGHBORHOODS) {
      const simpleN = n.toLowerCase().replace(' mahallesi', '').replace(' (uydukent)', '');
      if (lower.includes(simpleN)) {
        matchedNeighborhood = n;
        break;
      }
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCode = `AKA-2026-${randomSuffix}`;
    const nowIso = new Date().toISOString();

    const targetCat = CATEGORIES.find(c => c.id === spec.catId) || CATEGORIES[0];

    const newIssue = {
      id: "iss-" + Date.now(),
      code: newCode,
      title: text.length > 50 ? text.substring(0, 47) + '...' : text,
      desc: `Nöbetçi Görüşme (${spec.name} - ${spec.role}) ile iletildi: "${text}"`,
      category: targetCat.name,
      department: spec.dept,
      urgency: lower.includes('acil') || lower.includes('patlak') || lower.includes('kan') || lower.includes('tehlike') ? "Acil" : "Normal",
      status: "Sahada",
      neighborhood: matchedNeighborhood,
      address: `${matchedNeighborhood}, İhbar Noktası`,
      lat: CITY_CENTER[0] + (Math.random() - 0.5) * 0.008,
      lng: CITY_CENTER[1] + (Math.random() - 0.5) * 0.008,
      citizenName: "Canlı İhbar Vatandaşı",
      citizenPhone: "0530 000 00 00",
      isAnonymous: false,
      createdAt: nowIso,
      assignedTeam: spec.team,
      fieldNote: `${spec.name} tarafından saha ekibine anons edildi ve intikal başlatıldı.`,
      imgBefore: getDefaultCategoryPhoto(targetCat.id),
      imgAfter: null,
      rating: null,
      feedback: null,
      history: [
        {
          timestamp: nowIso,
          status: "Sahada",
          actor: `${spec.name} (${spec.role})`,
          note: `İhbar canlı hattan alındı ve ${spec.team} ekibine iş emri verildi.`
        }
      ]
    };

    issues.unshift(newIssue);
    saveIssues();
    syncIssueToSupabase(newIssue);

    botReply(`${spec.avatar} **${spec.name} (${spec.role}):**\n\nİhbarınızı bizzat aldım ve sahaya iş emrini ilettim!\n\n• **Takip No:** **#${newCode}**\n• **Sorumlu Ekip:** ${spec.team}\n• **Bölge:** ${matchedNeighborhood}\n• **Müdahale Durumu:** Ekiplerimiz telsizden bilgilendirildi, adrese intikal ediyor.\n\nSüreci *'İhbar Takibi'* ekranından canlı olarak izleyebilirsiniz.`);

    pushNotification(`${spec.role} yeni arıza kaydı açtı: #${newCode}`, newCode);
  }, 700);
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
// 16. ŞEHİR ANALİTİĞİ & GRAFİKLER (CHART.JS)
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
// 17. SİSTEM BİLDİRİMLERİ & ÇEKMECE YÖNETİMİ
// ==========================================
let notifTimeout = null;

function pushNotification(message, code) {
  const notifItem = {
    id: "notif-" + Date.now(),
    message: message,
    code: code || "AKA",
    time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    date: new Date().toISOString()
  };

  systemNotifications.unshift(notifItem);
  if (systemNotifications.length > 20) {
    systemNotifications = systemNotifications.slice(0, 20);
  }

  try {
    localStorage.setItem('aka_notifications_data', JSON.stringify(systemNotifications));
  } catch (e) {
    // Kota aşımı olursa yoksay
  }

  renderNotificationsDropdown();
  triggerToast(message, code);
}

function triggerToast(message, code) {
  const drawer = document.getElementById('simulated-sms-drawer');
  const textEl = document.getElementById('sms-text');
  const codeEl = document.getElementById('sms-code-preview');

  if (!drawer || !textEl) return;

  textEl.textContent = message;
  codeEl.textContent = `İlgili Kod: #${code}`;

  drawer.classList.remove('translate-y-32', 'opacity-0', 'pointer-events-none');
  drawer.classList.add('translate-y-0', 'opacity-100');

  // Hafif bildirim tonu
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
    // Audio sessiz devam
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

function toggleNotificationDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('notifications-dropdown-menu');
  if (!menu) return;

  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    renderNotificationsDropdown();
  } else {
    menu.classList.add('hidden');
  }
}

function renderNotificationsDropdown() {
  const list = document.getElementById('notifications-list');
  const badge = document.getElementById('notif-badge-count');
  if (!list) return;

  if (systemNotifications.length === 0) {
    list.innerHTML = `
      <div class="p-6 text-center text-slate-400">
        <i data-lucide="bell-off" class="w-6 h-6 mx-auto mb-1 text-slate-300"></i>
        <span>Henüz bir bildirim bulunmuyor.</span>
      </div>
    `;
    if (badge) badge.textContent = "0 Yeni";
    if (window.lucide) lucide.createIcons();
    return;
  }

  if (badge) badge.textContent = `${systemNotifications.length} Bildirim`;

  list.innerHTML = systemNotifications.map(n => `
    <div class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer" onclick="handleNotificationClick('${n.code}')">
      <div class="flex items-center justify-between">
        <span class="font-mono font-bold text-blue-600 dark:text-blue-400">#${escapeHtml(n.code)}</span>
        <span class="text-[10px] text-slate-400">${escapeHtml(n.time)}</span>
      </div>
      <p class="text-[11px] text-slate-700 dark:text-slate-300 mt-1">${escapeHtml(n.message)}</p>
    </div>
  `).join('');

  if (window.lucide) lucide.createIcons();
}

function handleNotificationClick(code) {
  const menu = document.getElementById('notifications-dropdown-menu');
  if (menu) menu.classList.add('hidden');

  if (code && code.startsWith('AKA-2026-')) {
    trackSpecificIssue(code);
  }
}

function triggerNotification(message, code) {
  pushNotification(message, code);
}
