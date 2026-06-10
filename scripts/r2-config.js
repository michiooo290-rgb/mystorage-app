/**
 * r2-config.js — Konfigurasi Cloudflare R2 untuk MyStorage
 * ─────────────────────────────────────────────────────────
 * CARA PENGGUNAAN:
 * 1. Ganti R2_WORKER_URL dengan URL Cloudflare Worker kamu
 *    (didapat setelah deploy worker.js ke Cloudflare Workers)
 * 2. Tambahkan script ini di Storage-dashboard.html SEBELUM script.js
 *    <script src="scripts/r2-config.js"></script>
 *
 * JANGAN commit file ini jika berisi data sensitif.
 * Worker URL aman untuk di-expose ke frontend.
 * ─────────────────────────────────────────────────────────
 */

// Ganti dengan URL Worker kamu setelah deploy
// Contoh: https://mystorage-worker.namakamu.workers.dev
window.R2_WORKER_URL = 'https://mystorage-worker.michiooo290.workers.dev';

window.R2_ENABLED = true; // set false untuk fallback ke Supabase

/**
 * Upload file ke Cloudflare R2 via Worker
 * @param {File} file - File object dari input
 * @param {string} userId - ID user dari Supabase Auth
 * @param {string} fileName - Nama file yang sudah disanitize
 * @returns {Promise<{key: string, url: string}>}
 */
window.uploadToR2 = async function(file, userId, fileName) {
  if (!window.R2_ENABLED || !window.R2_WORKER_URL || window.R2_WORKER_URL === 'GANTI_DENGAN_URL_WORKER_KAMU') {
    throw new Error('R2 belum dikonfigurasi. Isi R2_WORKER_URL di r2-config.js');
  }

  const response = await fetch(window.R2_WORKER_URL + '/upload', {
    method: 'PUT',
    headers: {
      'Content-Type': file.type || 'application/octet-stream',
      'X-User-Id': userId,
      'X-File-Name': encodeURIComponent(fileName),
    },
    body: file
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Upload gagal' }));
    throw new Error(err.error || 'Upload ke R2 gagal');
  }

  return await response.json(); // { success, key, url }
};

/**
 * Download file dari Cloudflare R2 via Worker
 * @param {string} r2Key - Key/path file di R2
 * @returns {Promise<Blob>}
 */
window.downloadFromR2 = async function(r2Key) {
  const response = await fetch(window.R2_WORKER_URL + '/file/' + encodeURIComponent(r2Key));
  if (!response.ok) throw new Error('File tidak ditemukan di R2');
  return await response.blob();
};

/**
 * Hapus file dari Cloudflare R2 via Worker
 * @param {string} r2Key - Key/path file di R2
 */
window.deleteFromR2 = async function(r2Key) {
  const response = await fetch(window.R2_WORKER_URL + '/file/' + encodeURIComponent(r2Key), {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Gagal hapus file dari R2');
};