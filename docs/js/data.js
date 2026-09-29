// Araç verileri
const cars = [
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
];

// Araç bulma fonksiyonu
function findCar(slug) {
    return cars.find(car => car.slug === slug);
}

// Arama fonksiyonu
function searchCars(query) {
    const q = query.toLowerCase();
    return cars.filter(car => 
        car.brand.toLowerCase().includes(q) ||
        car.series.toLowerCase().includes(q) ||
        car.model.toLowerCase().includes(q)
    );
}
