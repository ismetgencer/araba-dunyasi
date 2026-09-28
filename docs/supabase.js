// Supabase → Project Settings → API
// Project URL ve anon public anahtarını buraya yapıştır.
// service_role anahtarını kullanma.
const SUPABASE_URL = "https://sywyhfdnbfxqzphyxxzq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_agO0j8vBDK41GFymUcW0QA_uADXcqMf";

const SUPABASE_SETUP_MESSAGE =
    "Supabase ayarı eksik. docs/supabase.js içine Project URL ve anon public anahtarını yaz. Tablo için docs/supabase.sql dosyasını SQL Editor'da bir kez çalıştır.";

function supabaseConfigured() {
    return (
        SUPABASE_URL.startsWith("https://") &&
        !SUPABASE_URL.includes("YOUR_PROJECT") &&
        SUPABASE_ANON_KEY !== "YOUR_ANON_KEY"
    );
}

let db = null;

if (supabaseConfigured() && window.supabase) {
    db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

function requireSupabase() {
    if (db) {
        return true;
    }
    alert(SUPABASE_SETUP_MESSAGE);
    return false;
}
