---
name: cloud-infra
description: >-
  Use this skill whenever managing, deploying, updating, or troubleshooting the Oracle Cloud
  infrastructure and Cloudflare DNS/SSL configuration for the Akıllı Kent Ağı project.
---

# Cloud Infrastructure Operations & Runbook (Secured)

Bu beceri, projenin Oracle Cloud ve Cloudflare servisleriyle siber güvenlik ilkelerine (Zero Trust & Secret Hygiene) tam uyumlu şekilde yönetilmesini sağlar.

> [!IMPORTANT]
> **Siber Güvenlik Kuralı:** Hiçbir API anahtarı, gizli token veya özel SSH anahtarı bu dosyaya ya da Git deposuna doğrudan YAZILAMAZ. Tüm kimlik bilgileri yerel `.env` dosyasından okunmalıdır.

---

## 1. Cloudflare DNS & SSL Yönetimi

- **Alan Adı (Zone):** `silagundogar.com.tr`
- **Atanan Name Serverlar:** `barbara.ns.cloudflare.com`, `kaiser.ns.cloudflare.com`
- **Gerekli Değişkenler (.env):** `CLOUDFLARE_ZONE_ID`, `CLOUDFLARE_API_TOKEN`

### Güvenli DNS Kaydı Yönetim Betiği (Python)
Kimlik bilgilerini `.env` dosyasından okuyarak çalışan güvenli yapı:

```python
import os
import urllib.request
import json
from pathlib import Path

# .env dosyasından güvenli okuma
def get_env_var(key):
    env_path = Path(".env")
    if env_path.exists():
        for line in env_path.read_text(encoding="utf-8").splitlines():
            if line.startswith(f"{key}="):
                return line.split("=", 1)[1].strip()
    return os.environ.get(key)

token = get_env_var("CLOUDFLARE_API_TOKEN")
zone_id = get_env_var("CLOUDFLARE_ZONE_ID")

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
# DNS işlemleri bu oturum üzerinden güvenle yürütülür.
```

---

## 2. Oracle Cloud (OCI) Altyapı Yönetimi

- **Bölge (Region):** `eu-frankfurt-1`
- **Sunucu Tipi (Shape):** `VM.Standard.A1.Flex` (2 OCPU, 12 GB RAM, ARM64 Always Free)
- **Gerekli Değişkenler (.env):** `OCI_USER_OCID`, `OCI_TENANCY_OCID`, `OCI_FINGERPRINT`, `OCI_KEY_FILE`, `OCI_INSTANCE_ID`, `OCI_SERVER_IP`

### Sunucuya Kod Güncelleme Dağıtımı
Depodaki yeni kodları sunucuya çekmek için OCI Compute Agent veya Cloud-Init kullanılır:
```bash
cd /var/www/akilli-kent-agi && git pull origin main && sudo systemctl restart nginx
```

---

## 3. Siber Güvenlik Kontrol Listesi (Pre-Push Checklist)

Bir geliştirici veya yapay zeka asistanı herhangi bir `git commit` veya `git push` yapmadan önce şu kontrolleri tamamlamak zorundadır:
1. `git status` çıktısında `.env`, `*.pem`, `*.key` veya kimlik dosyaları olmamalıdır.
2. `git diff` ile eklenen satırlarda token veya parola bulunmadığı teyit edilmelidir.
3. Hassas veriler yalnızca yerel `.env` dosyası üzerinden erişilmelidir.
