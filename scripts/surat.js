/* MyStorage — Surat TU. Dimuat dari pages/surat.html setelah supabase-config.js. */
const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
const $ = id => document.getElementById(id);
const BUCKET = 'tu-surat', PAGE = 50, MAX = 10 * 1024 * 1024;
const TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const STATUS = { baru: 'Baru', diproses: 'Diproses', selesai: 'Selesai' };
let user = null, jenis = 'semua', rows = [], total = 0, editing = null, timer = null;

const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
const safeName = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9 ._()\-]/g, '_').slice(-100);

function toast(msg, bad) {
  const t = $('toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.className = ''; }, 3500);
}

async function init() {
  const { data } = await sb.auth.getSession();
  if (!data.session) { location.replace('login.html'); return; }
  user = data.session.user;
  $('who').textContent = user.email;
  sb.auth.onAuthStateChange(ev => { if (ev === 'SIGNED_OUT') location.replace('login.html'); });
  load(true);
}

async function load(reset) {
  if (reset) rows = [];
  let q = sb.from('surat').select('*', { count: 'exact' })
    .order('tanggal_surat', { ascending: false }).order('created_at', { ascending: false })
    .range(rows.length, rows.length + PAGE - 1);
  q = $('trash').checked ? q.not('deleted_at', 'is', null) : q.is('deleted_at', null);
  if (jenis !== 'semua') q = q.eq('jenis', jenis);
  if ($('status').value) q = q.eq('status', $('status').value);
  const term = $('q').value.trim().replace(/[%,()*]/g, ' ');
  if (term) q = q.or('nomor_surat.ilike.%' + term + '%,pihak.ilike.%' + term + '%,perihal.ilike.%' + term + '%');
  const { data, error, count } = await q;
  if (error) { toast('Gagal memuat: ' + error.message, true); return; }
  rows = rows.concat(data || []); total = count || 0;
  render();
}

function render() {
  $('count').textContent = total + ' surat';
  $('list').innerHTML = rows.length ? rows.map(rowHtml).join('') : '<p class="empty">Belum ada surat yang cocok.</p>';
  $('more').hidden = rows.length >= total;
}

function rowHtml(r) {
  const masuk = r.jenis === 'masuk';
  return '<article class="row" data-id="' + esc(r.id) + '">' +
    '<div>' + fmt(r.tanggal_surat) + '<br><span class="badge ' + r.jenis + '">' + (masuk ? 'Masuk' : 'Keluar') + '</span></div>' +
    '<div><strong>' + esc(r.perihal) + '</strong><span class="sub"><span class="mono">' + esc(r.nomor_surat) + '</span> · ' + (masuk ? 'Dari ' : 'Kepada ') + esc(r.pihak) + '</span></div>' +
    '<div><span class="st ' + esc(r.status) + '">' + esc(STATUS[r.status] || r.status) + '</span></div>' +
    '<div class="act">' + (r.file_path ? '<button type="button" class="btn btn-sm" data-act="open"><i class="ti ti-paperclip"></i> Scan</button>' : '') +
    (r.deleted_at ? '<button type="button" class="btn btn-sm" data-act="restore"><i class="ti ti-arrow-back-up"></i> Pulihkan</button>'
      : '<button type="button" class="btn btn-sm" data-act="edit"><i class="ti ti-pencil"></i> Ubah</button><button type="button" class="btn btn-sm" data-act="del"><i class="ti ti-trash"></i> Hapus</button>') + '</div></article>';
}

function syncForm() {
  const masuk = $('fJenis').value === 'masuk';
  $('lblPihak').textContent = masuk ? 'Pengirim' : 'Tujuan';
  $('lblTerima').hidden = !masuk;
}

function openForm(r) {
  editing = r || null;
  const f = $('form'); f.reset();
  $('dlgTitle').textContent = r ? 'Ubah surat' : 'Catat surat';
  if (r) {
    f.jenis.value = r.jenis; f.status.value = r.status; f.nomor.value = r.nomor_surat;
    f.tgl.value = r.tanggal_surat; f.diterima.value = r.tanggal_diterima || '';
    f.pihak.value = r.pihak; f.perihal.value = r.perihal; f.ket.value = r.keterangan || '';
  } else {
    f.tgl.value = new Date().toISOString().slice(0, 10);
    if (jenis !== 'semua') f.jenis.value = jenis;
  }
  $('curFile').textContent = r && r.file_name ? 'Scan saat ini: ' + r.file_name + ' (pilih file baru untuk menggantinya)' : '';
  syncForm(); $('dlg').showModal();
}

async function save(e) {
  e.preventDefault();
  const f = $('form'), btn = $('save'), file = f.berkas.files[0];
  if (file && (file.size > MAX || !TYPES.includes(file.type))) { toast('File harus PDF, JPG, PNG, atau DOCX dan maks 10 MB.', true); return; }
  const masuk = f.jenis.value === 'masuk';
  const p = {
    jenis: f.jenis.value, status: f.status.value, nomor_surat: f.nomor.value.trim(),
    tanggal_surat: f.tgl.value, tanggal_diterima: masuk ? (f.diterima.value || null) : null,
    pihak: f.pihak.value.trim(), perihal: f.perihal.value.trim(), keterangan: f.ket.value.trim() || null
  };
  btn.disabled = true; btn.textContent = 'Menyimpan…';
  let newPath = null;
  try {
    if (file) {
      newPath = user.id + '/' + crypto.randomUUID() + '-' + safeName(file.name);
      const up = await sb.storage.from(BUCKET).upload(newPath, file, { contentType: file.type });
      if (up.error) throw up.error;
      p.file_path = newPath; p.file_name = file.name;
    }
    const res = editing ? await sb.from('surat').update(p).eq('id', editing.id) : await sb.from('surat').insert(p);
    if (res.error) { if (newPath) await sb.storage.from(BUCKET).remove([newPath]); throw res.error; }
    if (file && editing && editing.file_path) await sb.storage.from(BUCKET).remove([editing.file_path]);
    $('dlg').close(); toast('Surat tersimpan.'); load(true);
  } catch (err) {
    toast(err.code === '23505' ? 'Nomor surat keluar itu sudah dipakai.' : 'Gagal menyimpan: ' + err.message, true);
  } finally { btn.disabled = false; btn.textContent = 'Simpan'; }
}

async function openScan(r) {
  const w = window.open('about:blank', '_blank');
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(r.file_path, 120);
  if (error) { if (w) w.close(); toast('Gagal membuka scan: ' + error.message, true); return; }
  if (w) { w.opener = null; w.location.href = data.signedUrl; } else location.href = data.signedUrl;
}

async function setDeleted(r, del) {
  if (del && !confirm('Pindahkan surat ini ke daftar terhapus?')) return;
  const { error } = await sb.from('surat').update({ deleted_at: del ? new Date().toISOString() : null }).eq('id', r.id);
  if (error) toast('Gagal: ' + error.message, true); else { toast(del ? 'Surat dihapus.' : 'Surat dipulihkan.'); load(true); }
}

$('list').addEventListener('click', e => {
  const b = e.target.closest('button[data-act]'); if (!b) return;
  const r = rows.find(x => x.id === b.closest('.row').dataset.id); if (!r) return;
  ({ open: () => openScan(r), edit: () => openForm(r), del: () => setDeleted(r, true), restore: () => setDeleted(r, false) })[b.dataset.act]();
});
$('tabs').addEventListener('click', e => {
  const b = e.target.closest('button[data-j]'); if (!b) return;
  jenis = b.dataset.j;
  document.querySelectorAll('#tabs button').forEach(x => x.setAttribute('aria-pressed', x === b));
  load(true);
});
$('q').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => load(true), 300); });
$('status').addEventListener('change', () => load(true));
$('trash').addEventListener('change', () => load(true));
$('more').addEventListener('click', () => load(false));
$('add').addEventListener('click', () => openForm(null));
$('cancel').addEventListener('click', () => $('dlg').close());
$('fJenis').addEventListener('change', syncForm);
$('form').addEventListener('submit', save);
$('out').addEventListener('click', async () => { await sb.auth.signOut(); location.replace('login.html'); });

/* ── Impor banyak: data surat dibaca dari nama file ── */
/* PARSER-START */
const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, mei: 5, may: 5, jun: 6, jul: 7, agu: 8, agt: 8, aug: 8, sep: 9, okt: 10, oct: 10, nov: 11, des: 12, dec: 12 };
const pad2 = n => String(n).padStart(2, '0');
const clean = s => s.replace(/_+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s.,:;()\-–—]+|[\s.,:;()\-–—]+$/g, '');

function validDate(y, m, d) {
  y = +y; m = +m; d = +d;
  if (!(y >= 2000 && y <= 2100 && m >= 1 && m <= 12 && d >= 1 && d <= 31)) return '';
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCMonth() === m - 1 ? y + '-' + pad2(m) + '-' + pad2(d) : '';
}

function takeDate(s) {
  const mon = 'januari|februari|maret|april|mei|juni|juli|agustus|september|sept|oktober|november|desember|jan|feb|mar|apr|jun|jul|agu|agt|sep|okt|nov|des|may|aug|oct|dec';
  const pats = [
    [/(?<!\d)(\d{4})[-_.](\d{1,2})[-_.](\d{1,2})(?!\d)/, a => validDate(a[1], a[2], a[3])],
    [/(?<!\d)(\d{1,2})[-_.](\d{1,2})[-_.](\d{4})(?!\d)/, a => validDate(a[3], a[2], a[1])],
    [new RegExp('(?<!\\d)(\\d{1,2})[\\s._-]*(' + mon + ')(?![a-z])[\\s._,-]*(\\d{4})(?!\\d)', 'i'), a => validDate(a[3], MONTHS[a[2].slice(0, 3).toLowerCase()], a[1])],
    [/(?<!\d)(20\d{2})(\d{2})(\d{2})(?!\d)/, a => validDate(a[1], a[2], a[3])]
  ];
  for (const [re, f] of pats) {
    const m = s.match(re), tgl = m && f(m);
    if (tgl) return { tgl, rest: s.replace(m[0], ' ') };
  }
  return { tgl: '', rest: s };
}

function takeJenis(s) {
  const masuk = /(^|[^a-z])(surat[\s_-]*)?masuk(?![a-z])/i, keluar = /(^|[^a-z])(surat[\s_-]*)?keluar(?![a-z])/i;
  const m = masuk.test(s), k = keluar.test(s);
  if (m === k) return { jenis: '', rest: s };
  return { jenis: m ? 'masuk' : 'keluar', rest: s.replace(m ? masuk : keluar, ' ') };
}

function takeNomor(s) {
  const pats = [
    /(?:^|[^a-z])(?:no|nomor)\.?[\s:_-]*([0-9][A-Za-z0-9._-]*)/i,
    /^\s*([0-9]{1,5}(?:[._-][A-Za-z0-9.]+)*)/,
    /(?<![A-Za-z0-9])([0-9]{2,5}(?:[._-][A-Za-z0-9.]+)*)(?![A-Za-z0-9])/
  ];
  for (const re of pats) {
    const m = s.match(re);
    if (!m) continue;
    const nomor = trimNomor(m[1]);
    return { nomor, rest: s.replace(m[0].replace(m[1], nomor), ' ') };
  }
  return { nomor: '', rest: s };
}

/* Nomor hanya terdiri dari bagian berbentuk kode (ada angka atau huruf besar semua);
   kata biasa seperti "Peminjaman" atau "Aula" yang terhubung garis bawah dibuang dari nomor. */
function trimNomor(raw) {
  const parts = raw.split(/([._-])/);
  let out = parts[0];
  for (let i = 1; i < parts.length; i += 2) {
    const seg = parts[i + 1] || '';
    if (!seg || !(/\d/.test(seg) || /^[A-Z]+$/.test(seg))) break;
    out += parts[i] + seg;
  }
  return out;
}

function parseName(name) {
  let s = name.replace(/\.[A-Za-z0-9]{2,5}$/, '');
  const base = s;
  const d = takeDate(s); s = d.rest;
  const j = takeJenis(s); s = j.rest;
  const n = takeNomor(s); s = n.rest;
  let pihak = '';
  const pm = s.match(/(?:^|[\s_-])(?:dari|kepada)[\s_]+(.+)$/i);
  if (pm && s.slice(0, pm.index).replace(/[\s_.,:;()-]+/g, '').length >= 3) {
    pihak = clean(pm[1]).slice(0, 200);
    s = s.slice(0, pm.index);
  }
  return { jenis: j.jenis, nomor: n.nomor.slice(0, 120), tgl: d.tgl, pihak, perihal: (clean(s) || clean(base)).slice(0, 300) };
}
/* PARSER-END */

const EXT = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' };
const typeOf = f => TYPES.includes(f.type) ? f.type : (EXT[(f.name.split('.').pop() || '').toLowerCase()] || '');
const fileDate = f => { const d = new Date(f.lastModified || Date.now()); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); };
const MAXBULK = 200;
let bulk = [], skipped = [], saving = false, bulkOk = 0;

function bulkItem(f) {
  const p = parseName(f.name);
  return { file: f, include: true, jenis: p.jenis, nomor: p.nomor, tgl: p.tgl || fileDate(f), tglGuess: !p.tgl, pihak: p.pihak, perihal: p.perihal, done: false, msg: '' };
}

const issues = it => [!it.jenis && 'jenis', !it.nomor.trim() && 'nomor', !it.tgl && 'tgl'].filter(Boolean);
const bulkRow = i => $('bgrid').querySelector('.brow[data-i="' + i + '"]');

function openBulk(files) {
  skipped = []; bulk = []; bulkOk = 0;
  if (files.length > MAXBULK) { toast('Maksimal ' + MAXBULK + ' file sekali impor. Sisanya diabaikan.', true); files = files.slice(0, MAXBULK); }
  files.forEach(f => {
    if (!typeOf(f)) skipped.push(f.name + ' (tipe tidak didukung)');
    else if (f.size > MAX) skipped.push(f.name + ' (lebih dari 10 MB)');
    else bulk.push(bulkItem(f));
  });
  if (!bulk.length) { toast('Tidak ada file yang bisa diimpor (PDF, JPG, PNG, DOCX, maks 10 MB).', true); return; }
  bulk.sort((a, b) => a.file.name.localeCompare(b.file.name, 'id', { numeric: true }));
  $('bJenisAll').value = ''; $('bSlash').checked = false; $('bStatus').value = 'selesai';
  renderBulk(); $('bdlg').showModal();
}

function renderBulk() {
  const opt = (v, t, cur) => '<option value="' + v + '"' + (cur === v ? ' selected' : '') + '>' + t + '</option>';
  $('bgrid').innerHTML = '<div class="bcol"><span></span><span>File</span><span>Jenis</span><span>Nomor surat</span><span>Tanggal</span><span>Pengirim / tujuan</span><span>Perihal</span><span></span></div>' +
    bulk.map((it, i) => {
      const d = it.done ? ' disabled' : '';
      return '<div class="brow' + (it.done ? ' done' : '') + '" data-i="' + i + '">' +
        '<input type="checkbox" data-f="include" aria-label="Sertakan"' + (it.include ? ' checked' : '') + d + '>' +
        '<div class="bname" title="' + esc(it.file.name) + '">' + esc(it.file.name) + '</div>' +
        '<select class="field" data-f="jenis" aria-label="Jenis"' + d + '>' + opt('', 'Pilih…', it.jenis) + opt('masuk', 'Masuk', it.jenis) + opt('keluar', 'Keluar', it.jenis) + '</select>' +
        '<input class="field" data-f="nomor" maxlength="120" placeholder="Nomor surat" value="' + esc(it.nomor) + '"' + d + '>' +
        '<input class="field" type="date" data-f="tgl" value="' + esc(it.tgl) + '"' + d + '>' +
        '<input class="field" data-f="pihak" maxlength="200" placeholder="Pengirim / tujuan (kosong = -)" value="' + esc(it.pihak) + '"' + d + '>' +
        '<input class="field" data-f="perihal" maxlength="300" placeholder="Perihal" value="' + esc(it.perihal) + '"' + d + '>' +
        '<div class="bstate"></div></div>';
    }).join('');
  bulk.forEach((it, i) => markRow(bulkRow(i), it));
  updateBulkSum();
}

function markRow(row, it) {
  const bad = it.include && !it.done ? issues(it) : [];
  row.querySelectorAll('[data-f]').forEach(el => el.classList.toggle('bad', bad.includes(el.dataset.f)));
  row.classList.toggle('off', !it.include);
}

function updateBulkSum() {
  const live = bulk.filter(it => it.include && !it.done), seen = {};
  live.forEach(it => { if (it.jenis === 'keluar' && it.nomor.trim()) { const k = it.nomor.trim().toLowerCase(); seen[k] = (seen[k] || 0) + 1; } });
  let bad = 0;
  bulk.forEach((it, i) => {
    const st = bulkRow(i).querySelector('.bstate');
    if (it.include && !it.done && issues(it).length) bad++;
    let txt = it.msg, cls = it.done ? 'ok' : (it.msg ? 'bad' : '');
    if (!txt && it.include && !it.done) {
      if (it.jenis === 'keluar' && seen[it.nomor.trim().toLowerCase()] > 1) { txt = 'Nomor ganda di daftar ini'; cls = 'bad'; }
      else if (it.tglGuess) txt = 'Tanggal diambil dari tanggal file';
    }
    st.textContent = txt; st.className = 'bstate ' + cls;
  });
  $('bsum').textContent = live.length + ' surat akan diimpor' + (bad ? ' · ' + bad + ' baris perlu dilengkapi (kolom merah)' : '');
  $('bskip').textContent = skipped.length ? 'Dilewati: ' + skipped.slice(0, 5).join('; ') + (skipped.length > 5 ? ' dan ' + (skipped.length - 5) + ' lainnya' : '') : '';
  $('bsave').disabled = saving || !live.length || bad > 0;
}

function onBulkEdit(e) {
  const el = e.target, f = el.dataset.f, row = el.closest('.brow');
  if (!f || !row) return;
  const it = bulk[+row.dataset.i];
  it[f] = el.type === 'checkbox' ? el.checked : el.value;
  if (f === 'tgl') it.tglGuess = false;
  if (!it.done) it.msg = '';
  markRow(row, it); updateBulkSum();
}

async function saveBulk() {
  const todo = bulk.filter(it => it.include && !it.done), status = $('bStatus').value;
  if (!todo.length || saving) return;
  saving = true; $('bgrid').inert = true; updateBulkSum();
  let ok = 0, fail = 0, idx = 0, fin = 0;
  const label = () => { $('bsave').textContent = 'Menyimpan ' + fin + '/' + todo.length + '…'; };
  const setState = (it, txt, cls) => { const st = bulkRow(bulk.indexOf(it)).querySelector('.bstate'); st.textContent = txt; st.className = 'bstate ' + (cls || ''); };
  label();
  const run = async () => {
    while (idx < todo.length) {
      const it = todo[idx++]; let path = null;
      setState(it, 'Mengunggah…');
      try {
        path = user.id + '/' + crypto.randomUUID() + '-' + safeName(it.file.name);
        const up = await sb.storage.from(BUCKET).upload(path, it.file, { contentType: typeOf(it.file) });
        if (up.error) { path = null; throw up.error; }
        const res = await sb.from('surat').insert({
          jenis: it.jenis, status, nomor_surat: it.nomor.trim(), tanggal_surat: it.tgl, tanggal_diterima: null,
          pihak: it.pihak.trim() || '-', perihal: it.perihal.trim() || it.nomor.trim(), keterangan: null,
          file_path: path, file_name: it.file.name
        });
        if (res.error) throw res.error;
        it.done = true; it.msg = '✓ Tersimpan'; ok++; bulkOk++;
        const row = bulkRow(bulk.indexOf(it)); row.classList.add('done');
        row.querySelectorAll('input,select').forEach(x => { x.disabled = true; });
      } catch (err) {
        if (path) await sb.storage.from(BUCKET).remove([path]);
        it.msg = err.code === '23505' ? 'Nomor surat keluar sudah dipakai' : 'Gagal: ' + (err.message || 'error');
        fail++;
      }
      fin++; label(); setState(it, it.msg, it.done ? 'ok' : 'bad');
    }
  };
  await Promise.all([run(), run(), run()]);
  saving = false; $('bgrid').inert = false; $('bsave').textContent = 'Simpan semua'; updateBulkSum();
  if (fail) toast(ok + ' tersimpan, ' + fail + ' gagal. Periksa baris bertanda merah.', true);
  else { toast(ok + ' surat diimpor.'); $('bdlg').close(); }
}

$('bulk').addEventListener('click', () => $('bulkFile').click());
$('bulkFile').addEventListener('change', e => { const fl = Array.from(e.target.files); e.target.value = ''; if (fl.length) openBulk(fl); });
$('bgrid').addEventListener('input', onBulkEdit);
$('bgrid').addEventListener('change', onBulkEdit);
$('bJenisAll').addEventListener('change', e => { if (!e.target.value) return; bulk.forEach(it => { if (!it.jenis && !it.done) it.jenis = e.target.value; }); renderBulk(); });
$('bSlash').addEventListener('change', e => { bulk.forEach(it => { if (!it.done) it.nomor = e.target.checked ? it.nomor.replace(/_/g, '/') : it.nomor.replace(/\//g, '_'); }); renderBulk(); });
$('bsave').addEventListener('click', saveBulk);
$('bclose').addEventListener('click', () => { if (!saving) $('bdlg').close(); });
$('bdlg').addEventListener('cancel', e => { if (saving) e.preventDefault(); });
$('bdlg').addEventListener('close', () => { if (bulkOk) { bulkOk = 0; load(true); } });

init();