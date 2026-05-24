/**
 * supabase-config.example.js
 * ─────────────────────────────────────────────────────────────────
 * CARA PENGGUNAAN:
 *   1. Salin file ini menjadi "supabase-config.js"
 *   2. Isi SUPABASE_URL dan SUPABASE_ANON_KEY dengan nilai dari
 *      Supabase Dashboard → Project Settings → API
 *   3. JANGAN commit supabase-config.js ke Git/GitHub
 *      (tambahkan ke .gitignore)
 *
 * KEAMANAN PENTING:
 *   - File ini hanya boleh berisi anon key (bukan service_role key)
 *   - Pastikan Row Level Security (RLS) aktif di semua tabel Supabase
 *   - Jika key sudah terlanjur ter-expose, rotate segera di Supabase Dashboard
 * ─────────────────────────────────────────────────────────────────
 */

window.SUPABASE_URL  = 'https://cgmoxqvdihiewdgxqxlh.supabase.co';
window.SUPABASE_ANON_KEY = 'sb_publishable_XhKT_IJerdA8nC_OdKASjw_S--Caw3w';