document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("carForm");
    const imagesInput = document.getElementById("images");
    const fuelSelect = document.getElementById("fuel");
    const motorInput = document.getElementById("motorgücü");

    if (form) {
        form.addEventListener("submit", function (event) {
            const marka = document.getElementById("Marka").value.trim();
            const year = Number(document.getElementById("year").value);
            const kilometre = Number(document.getElementById("Kilometre").value);

            if (!marka) {
                alert("Marka alanı boş bırakılamaz!");
                event.preventDefault();
                return;
            }
            if (year < 2010 || year > 2026) {
                alert("Yıl 2010 ile 2026 arasında olmalıdır!");
                event.preventDefault();
                return;
            }
            if (kilometre < 0) {
                alert("Kilometre 0'dan küçük olamaz!");
                event.preventDefault();
                return;
            }
        });
    }

    if (imagesInput) {
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
    }

    if (fuelSelect && motorInput) {
        fuelSelect.addEventListener("change", function (event) {
            if (event.target.value === "Elektrik") {
                motorInput.value = "Elektrik motor";
                motorInput.disabled = true;
            } else {
                motorInput.disabled = false;
                if (motorInput.value === "Elektrik motor") {
                    motorInput.value = "";
                }
            }
        });
    }
});
