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

## GitHub Üzerinden Yayınlama

Bu proje bir Flask uygulamasıdır ve GitHub Pages üzerinde doğrudan çalışmaz. Ancak GitHub üzerinde depolayarak aşağıdaki servislerden birine otomatik deploy edebilirsiniz:

- Render
- Railway
- PythonAnywhere

Projeyi deploy etmeye hazır hale getirmek için:

1. `Procfile` ve `requirements.txt` hazır.
2. `runtime.txt` Python sürümünü belirler.
3. Deploy edeceğiniz serviste GitHub repo bağlantısını seçin.
4. Çalıştırma komutu olarak `gunicorn app:app` kullanılabilir.

Örnek `Procfile`:

```text
web: gunicorn app:app
```

Örnek `runtime.txt`:

```text
python-3.11.0
```
