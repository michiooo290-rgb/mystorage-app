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
init();