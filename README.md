# 🏙️ Akıllı Kent Ağı (AKA)
### Yeni Nesil Belediye Arıza & Şikayet Yönetim Sistemi

Vatandaşlar ile belediye koordinasyon birimleri arasındaki iletişimi dijitalleştiren, arızaların harita tabanlı bildirilmesini ve şeffaf şekilde takip edilmesini sağlayan akıllı platform.

---

## 🚀 Hızlı Başlangıç

Projeyi açmanın 2 pratik yolu:

### Yöntem 1: Doğrudan Tarayıcıda Açma
Proje klasöründeki [index.html](file:///C:/Users/Pazarlar%20MYO/.gemini/antigravity/scratch/akilli-kent-agi/index.html) dosyasına çift tıklayarak herhangi bir tarayıcıda doğrudan çalıştırabilirsiniz.

### Yöntem 2: Yerel Sunucu ile Başlatma
PowerShell terminalinde şu komutu çalıştırabilirsiniz:
```powershell
.\start-server.ps1
```
Bu komut `http://localhost:8080` adresinde yerel sunucuyu başlatıp otomatik olarak tarayıcınızda açacaktır.

---

## ✨ Temel Özellikler

### 👤 1. Vatandaş Portalı (Citizen Portal)
- **Hızlı Arıza Bildirimi:** Kategori seçimi (Yol/Asfalt, Su/Kanalizasyon, Lamba, Park, Temizlik, Zabıta), görsel fotoğraf yükleme / hazır örnek fotoğraf seçimi.
- **İnteraktif Harita:** Leaflet & OpenStreetMap entegrasyonuyla harita üzerinden nokta seçimi ve GPS konum desteği.
- **Canlı İhbar Takibi:** Benzersiz `#AKA-2026-XXXX` takip kodu ile arıza sürecini 4 aşamalı zaman çizelgesinde (İhbar Alındı -> İnceleniyor -> Sahada -> Çözüldü) izleme.
- **Öncesi / Sonrası Doğrulama:** Çözülen arızalarda saha personelinin yüklediği çözüm fotoğrafı ve vatandaş memnuniyet puanlaması (1-5 yıldız).
- **Şeffaf Şehir Haritası:** Kent genelindeki tüm aktif ve çözülen arızaları filtreleyerek harita üzerinde görüntüleme.

### 🏛️ 2. Belediye Yönetim & Koordinasyon Paneli (Admin Portal)
- **Canlı KPI & Metrikler:** Toplam ihbar, incelemede olanlar, sahada müdahale edilenler, çözülenler ve acil durumlar.
- **İhbar Masası:** Arama ve çoklu filtreleme (Birim, Durum, Aciliyet, Mahalle).
- **Müdahale & Atama Modalı:** Arızayı ilgili birime yönlendirme (Fen İşleri, Su-Kanalizasyon vb.), saha ekibi atama, aciliyet belirleme ve saha çözüm fotoğrafı ekleme.
- **Şehir Analitiği:** Chart.js ile mahalle bazlı arıza yoğunluk grafiği ve kategori dağılım pasta grafiği.
- **Kalıcı Veri:** `LocalStorage` entegrasyonu sayesinde verileriniz tarayıcıda korunur, "Demo Sıfırla" butonuyla ilk duruma dönebilirsiniz.
