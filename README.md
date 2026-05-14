# Araba Satış Web Projesi

Bu proje, araç ilanı verme deneyimini bir frontend sayfası ve küçük bir Python backend ile tamamlar.

## Nasıl Çalıştırılır

1. Python 3.10+ kurulu olduğundan emin olun.
2. Proje klasörüne gidin:
   - `cd "c:\Users\ismet\OneDrive\Masaüstü\projeler\Web proje"`
3. Sanal ortam oluşturun:
   - `python -m venv venv`
4. Sanal ortamı etkinleştirin:
   - `venv\Scripts\Activate.ps1` (PowerShell)
   - `venv\Scripts\activate` (cmd)
5. Gereksinimleri yükleyin:
   - `pip install -r requirements.txt`
6. Sunucuyu çalıştırın:
   - `python app.py`
7. Tarayıcıyı açın:
   - `http://127.0.0.1:5000/`

## Proje Özellikleri

- Flask tabanlı, şablonlu frontend (`templates/`)
- `static/css/style.css` ve `static/js/form.js` ile profesyonel yapı
- Araç listeleme ve detay sayfaları
- İlan gönderme formu ve dosya yükleme
- SQLite veritabanında ilan saklama
- `ilanlar` sayfasında kayıtlı ilanları listeleme

## İyileştirme Önerileri

- Tasarımı ayrı `static/` CSS ve JS dosyalarına taşıyın
- Mobil uyumlu responsive tasarım ekleyin
- Giriş / yönetici paneli ekleyin
- Form için daha güçlü doğrulama ve güvenlik filtreleri uygulayın
- Veritabanını PostgreSQL, MySQL veya MongoDB ile yükseltin
