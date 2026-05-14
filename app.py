import os
import sqlite3
import json
from datetime import datetime
from functools import wraps
from flask import Flask, request, redirect, url_for, render_template, jsonify, abort, session
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
DB_PATH = os.path.join(BASE_DIR, "ads.db")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["MAX_CONTENT_LENGTH"] = 5 * 1024 * 1024
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.secret_key = "araba-dunyası-secret-key-2026"

CAR_LIST = [
    {
        "slug": "bmw",
        "brand": "BMW",
        "series": "5 Serisi",
        "model": "525d xDrive Premium",
        "price": 1425000,
        "price_text": "1.425.000 TL",
        "year": 2015,
        "fuel": "Dizel",
        "transmission": "Otomatik",
        "km": 186000,
        "body": "Sedan",
        "power": "218 hp",
        "drive": "4x4",
        "color": "Beyaz",
        "doors": 5,
        "guarantee": "Hayır",
        "summary": "Lüks bir BMW 5 Serisi, güçlü dizel motoru ve premium donanımıyla sunuluyor.",
        "images": ["bmw1.png", "bmw2.png", "bmw3.png", "bmw4.png"],
    },
    {
        "slug": "clio",
        "brand": "Renault",
        "series": "Clio",
        "model": "1.5 dCi Joy",
        "price": 735000,
        "price_text": "735.000 TL",
        "year": 2018,
        "fuel": "Dizel",
        "transmission": "Manuel",
        "km": 76000,
        "body": "Hatchback",
        "power": "75 hp",
        "drive": "Önden Çekiş",
        "color": "Beyaz",
        "doors": 5,
        "guarantee": "Hayır",
        "summary": "Ekonomik bir Renault Clio, ideal şehir içi kullanım için uygundur.",
        "images": ["clio1.png", "clio2.png", "clio3.png", "clio4.png"],
    },
    {
        "slug": "egea",
        "brand": "Fiat",
        "series": "Egea",
        "model": "1.3 Multijet Easy",
        "price": 708600,
        "price_text": "708.600 TL",
        "year": 2022,
        "fuel": "Dizel",
        "transmission": "Manuel",
        "km": 87000,
        "body": "Sedan",
        "power": "95 hp",
        "drive": "Önden Çekiş",
        "color": "Beyaz",
        "doors": 5,
        "guarantee": "Evet",
        "summary": "Modern ve ekonomik bir Fiat Egea, düşük kilometresiyle dikkat çekiyor.",
        "images": ["egea1.png", "egea2.png", "egea3.png", "egea4.png"],
    },
    {
        "slug": "kuga",
        "brand": "Ford",
        "series": "Kuga",
        "model": "1.5 EcoBoost Titanium",
        "price": 859750,
        "price_text": "859.750 TL",
        "year": 2015,
        "fuel": "Benzin & LPG",
        "transmission": "Otomatik",
        "km": 160000,
        "body": "SUV",
        "power": "182 hp",
        "drive": "4x4",
        "color": "Beyaz",
        "doors": 5,
        "guarantee": "Hayır",
        "summary": "Konforlu bir SUV olan Ford Kuga, aileler için ideal bir seçenek sunuyor.",
        "images": ["kuga1.png", "kuga2.png", "kuga3.png", "kuga4.png"],
    },
    {
        "slug": "nissan",
        "brand": "Nissan",
        "series": "Qashqai",
        "model": "1.5 dCi Tekna",
        "price": 915000,
        "price_text": "915.000 TL",
        "year": 2015,
        "fuel": "Dizel",
        "transmission": "Manuel",
        "km": 220000,
        "body": "SUV",
        "power": "115 hp",
        "drive": "Önden Çekiş",
        "color": "Beyaz",
        "doors": 5,
        "guarantee": "Hayır",
        "summary": "Güvenilir bir Nissan Qashqai, güçlü ve ekonomik sürüş için hazır.",
        "images": ["NISSAN1.png", "NISSAN2.png", "NISSAN3.png", "NISSAN4.png"],
    },
]


def init_db():
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT,
            is_admin INTEGER DEFAULT 0,
            created_at TEXT
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS ads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            marka TEXT,
            seri TEXT,
            model TEXT,
            yil INTEGER,
            yakit TEXT,
            transmission TEXT,
            kilometre INTEGER,
            kasa TEXT,
            motorgucu TEXT,
            cekis TEXT,
            renk TEXT,
            fiyat REAL,
            description TEXT,
            email TEXT,
            image_paths TEXT,
            created_at TEXT
        )
        """
    )
    conn.commit()
    
    # Admin kullanıcısını oluştur
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", ("admin",))
    if not cursor.fetchone():
        admin_password = generate_password_hash("admin")
        conn.execute(
            "INSERT INTO users (username, password, email, is_admin, created_at) VALUES (?, ?, ?, ?, ?)",
            ("admin", admin_password, "admin@arabadunyas.com", 1, datetime.utcnow().isoformat())
        )
        conn.commit()
    
    # Önceden tanımlı araçları veritabanına ekle
    cursor.execute("SELECT COUNT(*) FROM ads")
    if cursor.fetchone()[0] == 0:
        default_cars = [
            ("BMW", "5 Serisi", "525d xDrive Premium", 2015, "Dizel", "Otomatik", 186000, "Sedan", "218 hp", "4x4", "Beyaz", 1425000, "Lüks bir BMW 5 Serisi, güçlü dizel motoru ve premium donanımıyla sunuluyor.", "admin@arabadunyas.com", json.dumps(["bmw1.png", "bmw2.png", "bmw3.png", "bmw4.png"])),
            ("Renault", "Clio", "1.5 dCi Joy", 2018, "Dizel", "Manuel", 76000, "Hatchback", "75 hp", "Önden Çekiş", "Beyaz", 735000, "Ekonomik bir Renault Clio, ideal şehir içi kullanım için uygundur.", "admin@arabadunyas.com", json.dumps(["clio1.png", "clio2.png", "clio3.png", "clio4.png"])),
            ("Fiat", "Egea", "1.3 Multijet Easy", 2022, "Dizel", "Manuel", 87000, "Sedan", "95 hp", "Önden Çekiş", "Beyaz", 708600, "Modern ve ekonomik bir Fiat Egea, düşük kilometresiyle dikkat çekiyor.", "admin@arabadunyas.com", json.dumps(["egea1.png", "egea2.png", "egea3.png", "egea4.png"])),
            ("Ford", "Kuga", "1.5 EcoBoost Titanium", 2015, "Benzin & LPG", "Otomatik", 160000, "SUV", "182 hp", "4x4", "Beyaz", 859750, "Konforlu bir SUV olan Ford Kuga, aileler için ideal bir seçenek sunuyor.", "admin@arabadunyas.com", json.dumps(["kuga1.png", "kuga2.png", "kuga3.png", "kuga4.png"])),
            ("Nissan", "Qashqai", "1.5 dCi Tekna", 2015, "Dizel", "Manuel", 220000, "SUV", "115 hp", "Önden Çekiş", "Beyaz", 915000, "Güvenilir bir Nissan Qashqai, güçlü ve ekonomik sürüş için hazır.", "admin@arabadunyas.com", json.dumps(["NISSAN1.png", "NISSAN2.png", "NISSAN3.png", "NISSAN4.png"])),
        ]
        for car in default_cars:
            conn.execute(
                "INSERT INTO ads (marka, seri, model, yil, yakit, transmission, kilometre, kasa, motorgucu, cekis, renk, fiyat, description, email, image_paths, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (*car, datetime.utcnow().isoformat())
            )
        conn.commit()
    
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function


def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (session["user_id"],)).fetchone()
        conn.close()
        if not user or not user["is_admin"]:
            abort(403)
        return f(*args, **kwargs)
    return decorated_function


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        
        conn = get_db_connection()
        user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
        conn.close()
        
        if user and check_password_hash(user["password"], password):
            session["user_id"] = user["id"]
            session["username"] = user["username"]
            session["is_admin"] = user["is_admin"]
            return redirect(url_for("dashboard"))
        else:
            return render_template("login.html", error="Hatalı kullanıcı adı veya şifre")
    
    return render_template("login.html")


@app.route("/register", methods=["GET", "POST"])
@admin_required
def register():
    if request.method == "POST":
        username = request.form.get("username", "").strip()
        password = request.form.get("password", "")
        email = request.form.get("email", "").strip()
        
        if not username or not password:
            return render_template("register.html", error="Tüm alanlar gereklidir")
        
        conn = get_db_connection()
        try:
            hashed_password = generate_password_hash(password)
            conn.execute(
                "INSERT INTO users (username, password, email, is_admin, created_at) VALUES (?, ?, ?, ?, ?)",
                (username, hashed_password, email, 0, datetime.utcnow().isoformat())
            )
            conn.commit()
            conn.close()
            return render_template("register.html", success="Kullanıcı başarıyla kaydedildi!")
        except sqlite3.IntegrityError:
            conn.close()
            return render_template("register.html", error="Bu kullanıcı adı zaten mevcut")
    
    return render_template("register.html")


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("home"))


@app.route("/dashboard")
@admin_required
def dashboard():
    conn = get_db_connection()
    ads = conn.execute("SELECT * FROM ads ORDER BY id DESC").fetchall()
    users = conn.execute("SELECT * FROM users").fetchall()
    conn.close()
    ads = [dict(row) for row in ads]
    users = [dict(row) for row in users]
    return render_template("dashboard.html", ads=ads, users=users)


@app.route("/dashboard/ads/<int:ad_id>/delete", methods=["POST"])
@admin_required
def delete_ad(ad_id):
    conn = get_db_connection()
    ad = conn.execute("SELECT * FROM ads WHERE id = ?", (ad_id,)).fetchone()
    if ad:
        image_paths = json.loads(ad["image_paths"] or "[]")
        for image in image_paths:
            try:
                os.remove(os.path.join(UPLOAD_FOLDER, image))
            except:
                pass
        conn.execute("DELETE FROM ads WHERE id = ?", (ad_id,))
        conn.commit()
    conn.close()
    return redirect(url_for("dashboard"))


@app.route("/dashboard/ads/<int:ad_id>/edit", methods=["GET", "POST"])
@admin_required
def edit_ad(ad_id):
    conn = get_db_connection()
    ad = conn.execute("SELECT * FROM ads WHERE id = ?", (ad_id,)).fetchone()
    conn.close()
    
    if not ad:
        abort(404)
    
    if request.method == "POST":
        conn = get_db_connection()
        conn.execute(
            "UPDATE ads SET marka=?, seri=?, model=?, yil=?, yakit=?, transmission=?, kilometre=?, kasa=?, motorgucu=?, cekis=?, renk=?, fiyat=?, description=?, email=? WHERE id=?",
            (
                request.form.get("marka", "").strip(),
                request.form.get("seri", "").strip(),
                request.form.get("model", "").strip(),
                int(request.form.get("yil", 0)),
                request.form.get("yakit", "").strip(),
                request.form.get("transmission", "").strip(),
                int(request.form.get("kilometre", 0)),
                request.form.get("kasa", "").strip(),
                request.form.get("motorgucu", "").strip(),
                request.form.get("cekis", "").strip(),
                request.form.get("renk", "").strip(),
                float(request.form.get("fiyat", 0)),
                request.form.get("description", "").strip(),
                request.form.get("email", "").strip(),
                ad_id
            )
        )
        conn.commit()
        conn.close()
        return redirect(url_for("dashboard"))
    
    ad = dict(ad)
    return render_template("edit_ad.html", ad=ad)


@app.route("/")
def home():
    query = request.args.get("q", "").strip().lower()
    filtered = [car for car in CAR_LIST if query in car["brand"].lower() or query in car["series"].lower() or query in car["model"].lower()]
    cars = CAR_LIST if not query else filtered
    return render_template("home.html", cars=cars, query=query)


@app.route("/car/<slug>")
def car_detail(slug):
    car = next((item for item in CAR_LIST if item["slug"] == slug), None)
    if car is None:
        abort(404)
    return render_template("detail.html", car=car)


@app.route("/ilanver")
def ilanver():
    return render_template("form.html")


@app.route("/submit", methods=["POST"])
def submit():
    marka = request.form.get("Marka", "").strip()
    seri = request.form.get("Seri", "").strip()
    model = request.form.get("model", "").strip()
    yil = request.form.get("year", "").strip()
    yakit = request.form.get("fuel", "").strip()
    transmission = request.form.get("transmission", "").strip()
    kilometre = request.form.get("Kilometre", "").strip()
    kasa = request.form.get("Kasatipi", "").strip()
    motorgucu = request.form.get("motorgücü", "").strip()
    cekis = request.form.get("çekiş", "").strip()
    renk = request.form.get("color", "").strip()
    fiyat = request.form.get("price", "").strip()
    description = request.form.get("description", "").strip()
    email = request.form.get("email", "").strip()

    if not (marka and seri and model and email):
        return redirect(url_for("ilanver"))

    image_paths = []
    for file in request.files.getlist("images"):
        if file and file.filename and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
            stored_name = f"{timestamp}_{filename}"
            destination = os.path.join(app.config["UPLOAD_FOLDER"], stored_name)
            file.save(destination)
            image_paths.append(stored_name)

    conn = get_db_connection()
    conn.execute(
        "INSERT INTO ads (marka, seri, model, yil, yakit, transmission, kilometre, kasa, motorgucu, cekis, renk, fiyat, description, email, image_paths, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (
            marka,
            seri,
            model,
            int(yil) if yil.isdigit() else None,
            yakit,
            transmission,
            int(kilometre) if kilometre.isdigit() else None,
            kasa,
            motorgucu,
            cekis,
            renk,
            float(fiyat) if fiyat else None,
            description,
            email,
            json.dumps(image_paths, ensure_ascii=False),
            datetime.utcnow().isoformat(),
        ),
    )
    conn.commit()
    conn.close()

    return redirect(url_for("ilanlar", status="success"))


@app.route("/ilanlar")
def ilanlar():
    status = request.args.get("status", "")
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM ads ORDER BY id DESC").fetchall()
    conn.close()
    ads = [dict(row) for row in rows]
    for ad in ads:
        ad["image_paths"] = json.loads(ad["image_paths"] or "[]")
    return render_template("ads.html", ads=ads, status=status)


@app.route("/api/ads")
def api_ads():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM ads ORDER BY id DESC").fetchall()
    conn.close()
    ads = [dict(row) for row in rows]
    for ad in ads:
        ad["image_paths"] = json.loads(ad["image_paths"] or "[]")
    return jsonify(ads)


@app.errorhandler(404)
def not_found(error):
    return render_template("404.html"), 404


if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
