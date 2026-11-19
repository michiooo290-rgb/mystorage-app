/**
 * r2-config.js — Konfigurasi Cloudflare R2 untuk MyStorage
 * Versi aman: semua request ke Worker membawa token login Supabase.
 * Identitas pengguna ditentukan Worker dari token, bukan dari header yang dikirim klien.
 * Tambahkan script ini di Storage-dashboard.html SEBELUM script.js
 */

window.R2_WORKER_URL = 'https://mystorage-worker.michiooo290.workers.dev';
window.R2_ENABLED = true; // set false untuk fallback ke Supabase

// Cari client Supabase yang sudah dibuat di supabase-config.js
function r2GetSupabase() {
  if (window.supabaseClient && window.supabaseClient.auth) return window.supabaseClient;
  if (typeof supabase !== 'undefined' && supabase && supabase.auth) return supabase;
  if (window.supabase && window.supabase.auth) return window.supabase;
  return null;
}

// Header Authorization dari sesi login saat ini
async function r2AuthHeaders(extra) {
  const sb = r2GetSupabase();
  if (!sb) throw new Error('Client Supabase tidak ditemukan. Pastikan supabase-config.js dimuat lebih dulu.');
  const { data } = await sb.auth.getSession();
  const session = data && data.session;
  if (!session) throw new Error('Sesi login habis. Silakan login lagi.');
  return Object.assign({}, extra, { Authorization: 'Bearer ' + session.access_token });
}

function r2Ready() {
  if (!window.R2_ENABLED || !window.R2_WORKER_URL || window.R2_WORKER_URL === 'GANTI_DENGAN_URL_WORKER_KAMU') {
    throw new Error('R2 belum dikonfigurasi. Isi R2_WORKER_URL di r2-config.js');
  }
}

/**
 * Upload file ke R2 via Worker.
 * Parameter userId dipertahankan agar kode lama tetap jalan, tetapi diabaikan:
 * Worker memakai id dari token.
 * @returns {Promise<{key: string, url: string}>}
 */
window.uploadToR2 = async function (file, userId, fileName) {
  r2Ready();
  const response = await fetch(window.R2_WORKER_URL + '/upload', {
    method: 'PUT',
    headers: await r2AuthHeaders({
      'Content-Type': file.type || 'application/octet-stream',
      'X-File-Name': encodeURIComponent(fileName),
    }),
    body: file,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload gagal' }));
    throw new Error(err.error || 'Upload ke R2 gagal');
  }
  return await response.json(); // { success, key, url }
};

/** Download file dari R2 via Worker (hasilnya Blob; <img src> langsung tidak bisa, pakai URL.createObjectURL) */
window.downloadFromR2 = async function (r2Key) {
  r2Ready();
  const response = await fetch(window.R2_WORKER_URL + '/file/' + encodeURIComponent(r2Key), {
    headers: await r2AuthHeaders(),
  });
  if (response.status === 401 || response.status === 403) throw new Error('Tidak punya akses ke file ini');
  if (!response.ok) throw new Error('File tidak ditemukan di R2');
  return await response.blob();
};

/** Hapus file dari R2 via Worker */
window.deleteFromR2 = async function (r2Key) {
  r2Ready();
  const response = await fetch(window.R2_WORKER_URL + '/file/' + encodeURIComponent(r2Key), {
    method: 'DELETE',
    headers: await r2AuthHeaders(),
  });
  if (response.status === 401 || response.status === 403) throw new Error('Tidak punya akses untuk menghapus file ini');
  if (!response.ok) throw new Error('Gagal hapus file dari R2');
};