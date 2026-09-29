# Araba Dünyası

Basit bir araç ilan sitesi. Sayfalar düz HTML, CSS ve JavaScript ile yazıldı. Kullanıcı ilanları Supabase üzerindeki `ilanlar` tablosunda durur.

## Sayfalar

- `docs/index.html` — Anasayfa. Örnek araçlar `docs/js/data.js` içinden listelenir, marka veya modele göre aranır.
- `docs/detail.html` — Seçilen örneğin detayı.
- `docs/form.html` — Yeni ilan ekler. Adreste `?id=` varsa mevcut ilanı günceller.
- `docs/ads.html` — Veritabanındaki ilanları listeler. Düzenle ve Sil buradan yapılır.

Fotoğraflar forma eklenir ama veritabanına kaydedilmez.

## Yerelde açmak

`docs` klasöründe bir sunucu başlat:

```powershell
cd docs
python -m http.server 8765
```

Tarayıcıda [http://127.0.0.1:8765/](http://127.0.0.1:8765/) adresini aç.

## Veritabanı

Supabase projesinde `supabase/schema.sql` dosyasını SQL Editor'da bir kez çalıştır. Proje adresi ve publishable anahtar `docs/js/supabase.js` içindedir. Secret anahtar bu dosyaya konmaz.
