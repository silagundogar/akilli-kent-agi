# Akıllı Kent Ağı (AKA) — Siber Güvenlik Yönergesi & Proje Kuralları

> [!CAUTION]
> **SİBER GÜVENLİK AMİRLİĞİ DİREKTİFİ:** Bu depoda çalışan tüm yapay zeka asistanları ve geliştiriciler **Zero-Trust (Sıfır Güven)** ve **Secret Hygiene (Gizli Bilgi Hijyeni)** ilkelerine kayıtsız şartsız uymak zorundadır.

---

## 1. 🛡️ Siber Güvenlik & Gizli Bilgi Standartları

1. **Sıfır Sızıntı İlkesi (Zero-Leakage):**
   * Cloudflare API Tokenları, Oracle Cloud OCI Private Key/OCID bilgileri, SSH anahtarları (`.pem`, `.key`, `id_rsa*`) ve veritabanı gizli anahtarları **KESİNLİKLE** Git deposuna veya kod dosyalarına yazılmaz.
   * Tüm hassas kimlik bilgileri yalnızca yerel `.env` dosyasında saklanır.
2. **Git ve .gitignore Koruması:**
   * `.env`, `.env.*`, `*.pem`, `*.key`, `oracle_instance.json` ve tüm kimlik dosyaları `.gitignore` dosyasında zorunlu olarak engellenmiştir.
   * `git add` veya `git commit` yapmadan önce `git status` ve `git diff` çıktıları taranarak kaza eseri bir anahtarın sahnelenmediği (staged) denetlenmelidir.
3. **Şablonlama (Safe Mocking):**
   * Depoda yalnızca sahte/örnek değerler içeren `.env.example` dosyası versiyonlanır.
4. **Uygulama Katmanı Güvenliği:**
   * XSS (Cross-Site Scripting) ataklarına karşı kullanıcı girdileri `escapeHtml` fonksiyonundan geçirilmelidir.
   * Excel/CSV dışa aktarımlarında formül enjeksiyonu (`=`, `+`, `-`, `@`) filtrelenmelidir.
   * Nginx ve Cloudflare üzerinde HTTPS (TLS 1.3), HSTS, ve DDoS koruma katmanı daima aktif tutulmalıdır.

---

## 2. 🌐 Canlı Ortam & Altyapı Bilgisi

- **Resmi Alan Adı:** `https://silagundogar.com.tr` & `https://aka.silagundogar.com.tr`
- **DNS / WAF / SSL Sağlayıcı:** Cloudflare (Zone ID: `663aceaf45146a3f98307448986e2be7`)
- **Bulut Sunucu:** Oracle Cloud Infrastructure (Always Free Ampere A1.Flex - 2 OCPU, 12GB RAM, ARM64)
- **Sunucu Public IP:** `141.144.234.209`
- **İşletim Sistemi & Web Sunucusu:** Ubuntu 24.04 LTS, Nginx 1.24
- **Merkezi Veritabanı:** Supabase PostgreSQL (`https://tusrbenoyvnlsjwujsrv.supabase.co`)

---

## 3. 🚀 Dağıtım & Ağ Operasyon İlkeleri

1. **Kampüs Ağı Kısıtlamaları:** Kullanıcının kampüs ağı (DPU / KYK) giden Port 22 SSH bağlantılarını kestiğinden, sunucu yönetimi için OCI Cloud-Init veya OCI Compute Instance Agent üzerinden güvenli otomasyon tercih edilir.
2. **Üretim Dağıtımı:** Yerel geliştirmeler `main` dalına push edildikten sonra sunucuda `/var/www/akilli-kent-agi` dizini eşitlenir.
