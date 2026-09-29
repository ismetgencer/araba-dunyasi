function initHome() {
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const carsList = document.getElementById("carsList");
    const message = document.getElementById("message");

    function renderCars(carsToShow) {
        carsList.innerHTML = "";
        message.style.display = "none";

        if (carsToShow.length === 0) {
            message.textContent = `"${searchInput.value}" için herhangi bir araç bulunamadı.`;
            message.style.display = "block";
            return;
        }

        carsToShow.forEach((car) => {
            const card = document.createElement("article");
            card.className = "car-card";
            card.innerHTML = `
                <img src="images/${car.images[0]}" alt="${car.brand} ${car.series}" />
                <strong class="car-price">${car.price_text}</strong>
                <span class="car-km">${Number(car.km).toLocaleString("tr-TR")} km</span>
                <span class="car-year">${car.year}</span>
                <div class="card-content">
                    <h2>${car.brand} ${car.series}</h2>
                    <p class="car-model">${car.model}</p>
                    <p class="car-summary">${car.summary}</p>
                </div>
                <div class="car-action">
                    <a class="button" href="detail.html?slug=${car.slug}">Detayları Gör</a>
                </div>
            `;
            carsList.appendChild(card);
        });
    }

    function loadCars() {
        const query = searchInput.value.trim();
        const carsToShow = query ? searchCars(query) : cars;
        renderCars(carsToShow);
    }

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        loadCars();
    });
    searchInput.addEventListener("input", loadCars);
    loadCars();
}

function initDetail() {
    const detailDiv = document.getElementById("detail");
    const slug = new URLSearchParams(window.location.search).get("slug");

    if (!slug) {
        detailDiv.innerHTML = '<p style="color: red;">Araç bulunamadı!</p>';
        return;
    }

    const car = findCar(slug);
    if (!car) {
        detailDiv.innerHTML = '<p style="color: red;">Böyle bir araç yok!</p>';
        return;
    }

    detailDiv.innerHTML = `
        <div class="detail-hero">
            <div class="detail-summary">
                <span class="badge">${car.guarantee === "Evet" ? "✓ Garantili" : "Garanti Yok"}</span>
                <h1>${car.brand} ${car.series}</h1>
                <p style="color: #64748b; margin: 10px 0 0;">${car.model}</p>
            </div>
        </div>
        <div class="detail-grid">
            <div>
                <div class="gallery">
                    ${car.images.slice(0, 4).map((img, index) => `
                        <button type="button" class="gallery-item" data-index="${index}">
                            <img src="images/${img}" alt="${car.brand}" />
                        </button>
                    `).join("")}
                </div>
            </div>
            <div class="detail-info">
                <table>
                    <tr>
                        <th>Fiyat</th>
                        <td><strong style="color: #2563eb; font-size: 1.3rem;">${car.price_text}</strong></td>
                    </tr>
                    <tr>
                        <th>Yıl</th>
                        <td>${car.year}</td>
                    </tr>
                    <tr>
                        <th>Kilometre</th>
                        <td>${car.km.toLocaleString("tr-TR")} km</td>
                    </tr>
                    <tr>
                        <th>Yakıt Türü</th>
                        <td>${car.fuel}</td>
                    </tr>
                    <tr>
                        <th>Vites</th>
                        <td>${car.transmission}</td>
                    </tr>
                    <tr>
                        <th>Gövde Tipi</th>
                        <td>${car.body}</td>
                    </tr>
                    <tr>
                        <th>Güç</th>
                        <td>${car.power}</td>
                    </tr>
                    <tr>
                        <th>Çekiş</th>
                        <td>${car.drive}</td>
                    </tr>
                    <tr>
                        <th>Renk</th>
                        <td>${car.color}</td>
                    </tr>
                    <tr>
                        <th>Kapı Sayısı</th>
                        <td>${car.doors}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div style="background: #f8fafc; padding: 24px; border-radius: 18px; margin-top: 28px;">
            <h3>Açıklama</h3>
            <p>${car.summary}</p>
        </div>
        <div class="lightbox" id="lightbox" hidden>
            <button type="button" class="lightbox-close" id="lightboxClose" aria-label="Kapat">X</button>
            <button type="button" class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Önceki görsel">‹</button>
            <img id="lightboxImage" alt="${car.brand}" />
            <button type="button" class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Sonraki görsel">›</button>
        </div>
    `;

    const lightboxImages = car.images.slice(0, 4);
    const lightbox = document.getElementById("lightbox");
    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxPrev = document.getElementById("lightboxPrev");
    const lightboxNext = document.getElementById("lightboxNext");
    let lightboxIndex = 0;

    function showLightboxImage(index) {
        lightboxIndex = index;
        lightboxImage.src = "images/" + lightboxImages[index];
        lightboxPrev.disabled = index === 0;
        lightboxNext.disabled = index === lightboxImages.length - 1;
    }

    function openLightbox(index) {
        lightbox.hidden = false;
        lightbox.classList.add("visible");
        showLightboxImage(index);
    }

    function closeLightbox() {
        lightbox.classList.remove("visible");
        lightbox.hidden = true;
    }

    detailDiv.querySelectorAll(".gallery-item").forEach((button) => {
        button.addEventListener("click", () => {
            openLightbox(Number(button.dataset.index));
        });
    });
    document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", () => {
        if (lightboxIndex > 0) {
            showLightboxImage(lightboxIndex - 1);
        }
    });
    lightboxNext.addEventListener("click", () => {
        if (lightboxIndex < lightboxImages.length - 1) {
            showLightboxImage(lightboxIndex + 1);
        }
    });
}

function initForm() {
    const form = document.getElementById("carForm");
    const imagesInput = document.getElementById("images");
    const fuelSelect = document.getElementById("fuel");
    const motorInput = document.getElementById("motorgücü");
    const formTitle = document.getElementById("formTitle");
    const submitButton = document.getElementById("submitButton");
    const editId = new URLSearchParams(window.location.search).get("id");

    function applyFuelState() {
        if (fuelSelect.value === "Elektrik") {
            motorInput.value = "Elektrik motor";
            motorInput.disabled = true;
        } else {
            motorInput.disabled = false;
            if (motorInput.value === "Elektrik motor") {
                motorInput.value = "";
            }
        }
    }

    function readAd() {
        const doors = document.getElementById("doors").value;
        const power = motorInput.value.trim();
        const guarantee = form.querySelector('input[name="guarantee"]:checked');

        return {
            marka: document.getElementById("Marka").value.trim(),
            series: document.getElementById("series").value.trim(),
            model: document.getElementById("model").value.trim(),
            price: Number(document.getElementById("price").value),
            year: Number(document.getElementById("year").value),
            kilometre: Number(document.getElementById("Kilometre").value),
            fuel: fuelSelect.value,
            transmission: document.getElementById("transmission").value,
            body: document.getElementById("body").value,
            drive: document.getElementById("drive").value,
            color: document.getElementById("color").value.trim(),
            doors: doors === "" ? null : Number(doors),
            power: power || null,
            guarantee: guarantee ? guarantee.value : "Hayır",
            summary: document.getElementById("summary").value.trim()
        };
    }

    function fillForm(ad) {
        document.getElementById("Marka").value = ad.marka || "";
        document.getElementById("series").value = ad.series || "";
        document.getElementById("model").value = ad.model || "";
        document.getElementById("price").value = ad.price ?? "";
        document.getElementById("year").value = ad.year ?? "";
        document.getElementById("Kilometre").value = ad.kilometre ?? "";
        fuelSelect.value = ad.fuel || "";
        document.getElementById("transmission").value = ad.transmission || "";
        motorInput.value = ad.power || "";
        document.getElementById("body").value = ad.body || "";
        document.getElementById("drive").value = ad.drive || "";
        document.getElementById("color").value = ad.color || "";
        document.getElementById("doors").value = ad.doors ?? "";
        document.getElementById("summary").value = ad.summary || "";
        const guarantee = ad.guarantee === "Evet" ? "Evet" : "Hayır";
        const guaranteeInput = form.querySelector(`input[name="guarantee"][value="${guarantee}"]`);
        if (guaranteeInput) {
            guaranteeInput.checked = true;
        }
        applyFuelState();
    }

    async function loadAd() {
        if (!editId) {
            return;
        }
        formTitle.textContent = "İlanı Düzenle";
        submitButton.textContent = "İlanı Güncelle";
        if (!requireSupabase()) {
            return;
        }
        const { data, error } = await db
            .from("ilanlar")
            .select("*")
            .eq("id", editId)
            .maybeSingle();
        if (error || !data) {
            alert(error ? "İlan yüklenemedi: " + error.message : "İlan bulunamadı.");
            return;
        }
        fillForm(data);
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const marka = document.getElementById("Marka").value.trim();
        const year = Number(document.getElementById("year").value);
        const kilometre = Number(document.getElementById("Kilometre").value);

        if (!marka) {
            alert("Marka alanı boş bırakılamaz!");
            return;
        }
        if (year < 2010 || year > 2026) {
            alert("Yıl 2010 ile 2026 arasında olmalıdır!");
            return;
        }
        if (kilometre < 0) {
            alert("Kilometre 0'dan küçük olamaz!");
            return;
        }
        if (!requireSupabase()) {
            return;
        }

        const payload = readAd();
        const query = editId
            ? db.from("ilanlar").update(payload).eq("id", editId)
            : db.from("ilanlar").insert(payload);
        const { error } = await query;

        if (error) {
            alert("Kayıt başarısız: " + error.message);
            return;
        }

        alert(editId ? "İlan güncellendi." : "İlanınız başarıyla kaydedildi!");
        window.location.href = "ads.html";
    });

    imagesInput.addEventListener("change", function (event) {
        const files = event.target.files;
        const maxSize = 2 * 1024 * 1024;
        for (const file of files) {
            if (file.size > maxSize) {
                alert(`${file.name} dosyası çok büyük! Maksimum 2MB.`);
                event.target.value = "";
                break;
            }
        }
    });

    fuelSelect.addEventListener("change", applyFuelState);
    loadAd();
}

function initAds() {
    const adsList = document.getElementById("adsList");
    const emptyMessage = document.getElementById("emptyMessage");
    const emptyDefault = emptyMessage.innerHTML;

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;");
    }

    function formatNumber(value) {
        const number = Number(value);
        return Number.isFinite(number) ? number.toLocaleString("tr-TR") : "";
    }

    async function renderAds() {
        adsList.innerHTML = "";
        emptyMessage.innerHTML = emptyDefault;

        if (!requireSupabase()) {
            emptyMessage.style.display = "block";
            emptyMessage.querySelector("p").textContent = SUPABASE_SETUP_MESSAGE;
            return;
        }

        const { data, error } = await db
            .from("ilanlar")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            emptyMessage.style.display = "block";
            emptyMessage.querySelector("p").textContent = "İlanlar yüklenemedi: " + error.message;
            return;
        }

        const ads = data || [];
        if (ads.length === 0) {
            emptyMessage.style.display = "block";
            return;
        }

        emptyMessage.style.display = "none";

        ads.forEach((ad) => {
            const card = document.createElement("article");
            card.className = "ad-card";
            card.innerHTML = `
                <h3 style="margin: 0 0 12px 0;">${escapeHtml(ad.marka)} ${escapeHtml(ad.series)}</h3>
                <p style="margin: 0 0 12px 0; color: #475569;">${escapeHtml(ad.model)}</p>
                <div class="ad-meta">
                    <span>${escapeHtml(ad.year)} • ${formatNumber(ad.kilometre)} km</span>
                    <strong style="color: #2563eb; font-size: 1.1rem;">${formatNumber(ad.price)} TL</strong>
                </div>
                <p style="margin: 12px 0; color: #475569;">${escapeHtml(ad.summary)}</p>
                <div style="display: flex; gap: 10px; margin-top: 12px;">
                    <button type="button" class="button-secondary" data-action="edit" data-id="${escapeHtml(ad.id)}">Düzenle</button>
                    <button type="button" class="button-secondary" data-action="delete" data-id="${escapeHtml(ad.id)}" style="background: #fee2e2; color: #991b1b;">Sil</button>
                </div>
            `;
            adsList.appendChild(card);
        });
    }

    async function deleteAd(id) {
        if (!confirm("Bu ilanı silmek istediğinize emin misiniz?")) {
            return;
        }
        if (!requireSupabase()) {
            return;
        }
        const { error } = await db.from("ilanlar").delete().eq("id", id);
        if (error) {
            alert("Silinemedi: " + error.message);
            return;
        }
        renderAds();
    }

    adsList.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");
        if (!button) {
            return;
        }
        if (button.dataset.action === "edit") {
            window.location.href = "form.html?id=" + encodeURIComponent(button.dataset.id);
            return;
        }
        if (button.dataset.action === "delete") {
            deleteAd(button.dataset.id);
        }
    });

    renderAds();
}

if (document.getElementById("carsList")) {
    initHome();
}
if (document.getElementById("detail")) {
    initDetail();
}
if (document.getElementById("carForm")) {
    initForm();
}
if (document.getElementById("adsList")) {
    initAds();
}
