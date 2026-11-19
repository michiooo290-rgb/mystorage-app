/**
 * worker.js — Cloudflare Worker untuk MyStorage (R2)
 *
 * Binding / variabel yang dibutuhkan (Settings > Bindings & Variables):
 *   BUCKET            : R2 bucket binding (sesuaikan nama dengan punyamu)
 *   SUPABASE_URL      : https://xxxx.supabase.co
 *   SUPABASE_ANON_KEY : anon key (publik, boleh sebagai variable biasa)
 *   ALLOWED_ORIGINS   : https://michio-vault.vercel.app,https://mystorage-app.vercel.app
 *
 * Aturan: identitas = hasil verifikasi token ke Supabase. Header dari klien tidak dipercaya.
 * Semua key file berbentuk  <userId>/<timestamp>-<namafile>
 */

const MAX_SIZE = 100 * 1024 * 1024; // 100 MB

const json = (obj, status, headers) =>
  new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...headers } });

async function getUser(request, env) {
  const auth = request.headers.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) return null;
  const res = await fetch(env.SUPABASE_URL + '/auth/v1/user', {
    headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: auth },
  });
  if (!res.ok) return null;
  const user = await res.json();
  return user && user.id ? user : null;
}

// Izin baca untuk file milik orang lain (fitur Dibagikan).
// Isi sesuai tabel berbagi di Supabase milikmu; sementara selalu menolak.
async function canReadShared(key, user, env) {
  return false;
}

function safeName(name) {
  return name.replace(/[\\/:*?"<>|\x00-\x1f]/g, '_').replace(/\.\.+/g, '.').slice(0, 150) || 'file';
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowed = (env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
    const cors = {
      'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : 'null',
      'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type,X-File-Name',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    };

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (origin && !allowed.includes(origin)) return json({ error: 'Origin tidak diizinkan' }, 403, cors);

    const user = await getUser(request, env);
    if (!user) return json({ error: 'Belum login atau token tidak valid' }, 401, cors);

    const url = new URL(request.url);

    // UPLOAD
    if (request.method === 'PUT' && url.pathname === '/upload') {
      const size = Number(request.headers.get('Content-Length') || 0);
      if (size > MAX_SIZE) return json({ error: 'File terlalu besar (maks 100 MB)' }, 413, cors);
      let name = 'file';
      try { name = decodeURIComponent(request.headers.get('X-File-Name') || 'file'); } catch (e) {}
      const key = user.id + '/' + Date.now() + '-' + safeName(name);
      await env.BUCKET.put(key, request.body, {
        httpMetadata: { contentType: request.headers.get('Content-Type') || 'application/octet-stream' },
      });
      return json({ success: true, key, url: url.origin + '/file/' + encodeURIComponent(key) }, 200, cors);
    }

    // DOWNLOAD / DELETE
    if (url.pathname.startsWith('/file/') && (request.method === 'GET' || request.method === 'DELETE')) {
      let key;
      try { key = decodeURIComponent(url.pathname.slice('/file/'.length)); }
      catch (e) { return json({ error: 'Key tidak valid' }, 400, cors); }
      if (!key || key.includes('..')) return json({ error: 'Key tidak valid' }, 400, cors);

      const isOwner = key.startsWith(user.id + '/');

      if (request.method === 'DELETE') {
        if (!isOwner) return json({ error: 'Bukan pemilik file' }, 403, cors);
        await env.BUCKET.delete(key);
        return json({ success: true }, 200, cors);
      }

      if (!isOwner && !(await canReadShared(key, user, env))) {
        return json({ error: 'Tidak punya akses' }, 403, cors);
      }
      const obj = await env.BUCKET.get(key);
      if (!obj) return json({ error: 'File tidak ditemukan' }, 404, cors);
      const headers = new Headers(cors);
      headers.set('Content-Type', (obj.httpMetadata && obj.httpMetadata.contentType) || 'application/octet-stream');
      headers.set('Cache-Control', 'private, no-store');
      return new Response(obj.body, { headers });
    }

    return json({ error: 'Not found' }, 404, cors);
  },
};