const SUPABASE_URL = 'https://cgmoxqvdihiewdgxqxlh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbW94cXZkaWhpZXdkZ3hxeGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjYzMjYsImV4cCI6MjA5NDg0MjMyNn0.VpifdxYoJFb-6HA6fNmK2g0rBJGZTNfklwTafCOci6U'; // ⚠️ Supabase: Project Settings > API > anon public key
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const FOLDER_COLORS = [
  { color1: '#c7d2fe', color2: '#eef2ff', text: '#3730a3', sub: '#6366f1', av: '#6366f1' },
  { color1: '#bae6fd', color2: '#e0f2fe', text: '#0c4a6e', sub: '#0369a1', av: '#0ea5e9' },
  { color1: '#bbf7d0', color2: '#dcfce7', text: '#14532d', sub: '#15803d', av: '#22c55e' },
  { color1: '#fed7aa', color2: '#ffedd5', text: '#7c2d12', sub: '#c2410c', av: '#f97316' },
  { color1: '#fecdd3', color2: '#ffe4e6', text: '#881337', sub: '#be123c', av: '#f43f5e' },
  { color1: '#d8b4fe', color2: '#f3e8ff', text: '#4a044e', sub: '#7e22ce', av: '#a855f7' },
];

const FILE_ICONS = {
  pdf:         { icon: 'ti-file-type-pdf', iconColor: '#ef4444', iconBg: '#fff0f0' },
  doc:         { icon: 'ti-file-text',     iconColor: '#6366f1', iconBg: '#eef2ff' },
  foto:        { icon: 'ti-photo',         iconColor: '#22c55e', iconBg: '#dcfce7' },
  video:       { icon: 'ti-video',         iconColor: '#f97316', iconBg: '#fff7ed' },
  spreadsheet: { icon: 'ti-table',         iconColor: '#0ea5e9', iconBg: '#f0f9ff' },
  audio:       { icon: 'ti-music',         iconColor: '#a855f7', iconBg: '#f3e8ff' },
};

let currentFilter = 'semua';
let ctxTarget = null;
let allFolders = [];
let allFiles = [];
let droppedFiles = null; // [BUG FIX #2] Menyimpan file dari drag & drop

/* ── UTILITY: Escape HTML untuk mencegah XSS ── */
/* [BUG FIX #1] Semua input user di-escape sebelum masuk innerHTML */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ── LOAD DATA ── */
async function loadAll() {
  await Promise.all([loadFolders(), loadFiles()]);
  renderStats();
}

async function loadFolders() {
  const { data, error } = await sb.from('folders').select('*').order('created_at');
  if (error) { showToast('Gagal load folder: ' + error.message); return; }
  allFolders = data || [];
  renderFolders();
}

async function loadFiles() {
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Gagal load file: ' + error.message); return; }
  allFiles = data || [];
  renderFiles();
}

/* ── STATS ── */
function renderStats() {
  const totalFiles = allFiles.length;
  const totalFolders = allFolders.length;

  // Stat cards
  document.getElementById('statFiles').textContent = totalFiles;
  document.getElementById('statFolders').textContent = totalFolders;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = 0;
  if (document.getElementById('statFavorit')) document.getElementById('statFavorit').textContent = 0;

  // Sidebar badges
  if (document.getElementById('badgeDashboard')) document.getElementById('badgeDashboard').textContent = totalFiles;
  if (document.getElementById('badgeShared')) document.getElementById('badgeShared').textContent = 0;
  if (document.getElementById('badgeDocs')) document.getElementById('badgeDocs').textContent = allFiles.filter(f => f.type === 'doc' || f.type === 'pdf').length;
  if (document.getElementById('badgePhotos')) document.getElementById('badgePhotos').textContent = allFiles.filter(f => f.type === 'foto').length;
  if (document.getElementById('badgeVideos')) document.getElementById('badgeVideos').textContent = allFiles.filter(f => f.type === 'video').length;
  if (document.getElementById('badgeAudio')) document.getElementById('badgeAudio').textContent = allFiles.filter(f => f.type === 'audio').length;

  // Storage: hitung dari ukuran file yang ada
  let usedMB = 0;
  allFiles.forEach(f => {
    if (f.size) {
      const num = parseFloat(f.size);
      if (f.size.includes('MB')) usedMB += num;
      else if (f.size.includes('KB')) usedMB += num / 1024;
      else if (f.size.includes('GB')) usedMB += num * 1024;
    }
  });
  const totalMB = 1024; // 1 GB free tier Supabase Storage
  const pct = Math.min(Math.round((usedMB / totalMB) * 100), 100);
  const usedStr = usedMB < 1 ? (usedMB * 1024).toFixed(0) + ' KB' :
                  usedMB < 1024 ? usedMB.toFixed(1) + ' MB' :
                  (usedMB / 1024).toFixed(2) + ' GB';

  document.getElementById('storagePct').textContent = pct + '%';
  document.getElementById('storageUsed').textContent = usedStr + ' terpakai';

  setTimeout(() => {
    const fill = document.querySelector('.storage-fill');
    if (fill) fill.style.width = pct + '%';
  }, 300);
}

/* ── RENDER FOLDERS ── */
/* [BUG FIX #1] Semua f.name di-escape dengan escapeHtml() */
function renderFolders() {
  const grid = document.getElementById('folderGrid');
  if (allFolders.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="ti ti-folder-off"></i><p>Belum ada folder. Buat folder baru!</p></div>`;
    document.getElementById('folderCount').textContent = '0';
    return;
  }

  grid.innerHTML = allFolders.map((f, i) => {
    const c = FOLDER_COLORS[i % FOLDER_COLORS.length];
    const fileCount = allFiles.filter(x => x.folder_name === f.name).length;
    const safeName = escapeHtml(f.name);
    return `
      <div class="folder-wrap" style="animation-delay:${i * 0.06}s" data-folder="${safeName}" onclick="openFolder(this.dataset.folder)">
        <svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="fs${i}" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${c.color1}" flood-opacity="0.4"/>
            </filter>
          </defs>
          <path d="M6,20 Q6,14 12,14 L54,14 Q59,14 62,19 L67,26 L132,26 Q137,26 137,31 L137,82 Q137,88 131,88 L9,88 Q3,88 3,82 L3,27 Q3,20 9,20 Z" fill="${c.color1}" filter="url(#fs${i})"/>
          <path d="M3,28 L3,82 Q3,88 9,88 L131,88 Q137,88 137,82 L137,31 Q137,26 132,26 L6,26 Q3,26 3,28 Z" fill="${c.color2}"/>
          <text x="11" y="48" font-size="10.5" font-weight="700" fill="${c.text}" font-family="sans-serif">${safeName}</text>
          <text x="11" y="61" font-size="7.5" fill="${c.sub}" font-family="sans-serif">${fileCount} file</text>
          <circle cx="10" cy="69" r="6.5" fill="${c.av}"/>
          <text x="10" y="73" font-size="5.5" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="600">RZ</text>
          <circle cx="128" cy="14" r="8" fill="${c.color1}"/>
          <text x="128" y="18" font-size="10" fill="${c.text}" text-anchor="middle" font-family="sans-serif" font-weight="600">›</text>
        </svg>
      </div>`;
  }).join('');
  document.getElementById('folderCount').textContent = allFolders.length;

  /* update folder select di modal */
  const sel = document.getElementById('folderSelect');
  sel.innerHTML = '<option value="">Pilih folder...</option>' +
    allFolders.map(f => `<option value="${escapeHtml(f.name)}">${escapeHtml(f.name)}</option>`).join('');
}

/* Klik folder — filter file berdasarkan folder */
let currentFolderFilter = null;

function openFolder(name) {
  currentFolderFilter = name;
  // Scroll ke section file
  document.getElementById('fileGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Folder ' + name + ' dibuka');
  renderFiles();
}

function clearFolderFilter() {
  currentFolderFilter = null;
  renderFiles();
}

/* ── RENDER FILES ── */
/* [BUG FIX #1] Semua data user di-escape & gunakan data-attribute */
function renderFiles() {
  const grid = document.getElementById('fileGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();

  const filtered = allFiles.filter(f => {
    const matchType   = currentFilter === 'semua' || f.type === currentFilter;
    const matchSearch = f.name.toLowerCase().includes(search) || (f.folder_name || '').toLowerCase().includes(search);
    const matchFolder = !currentFolderFilter || f.folder_name === currentFolderFilter;
    return matchType && matchSearch && matchFolder;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div class="empty-state"><i class="ti ti-mood-empty"></i><p>Tidak ada file yang ditemukan.</p></div>`;
    document.getElementById('fileCount').textContent = '0';
    return;
  }

  const FOLDER_BADGE = {};
  const badgeColors = [
    { bg: '#e0e7ff', color: '#4338ca' }, { bg: '#e0f2fe', color: '#0369a1' },
    { bg: '#dcfce7', color: '#15803d' }, { bg: '#ffedd5', color: '#c2410c' },
    { bg: '#fce7f3', color: '#9d174d' }, { bg: '#ede9fe', color: '#6d28d9' },
  ];
  allFolders.forEach((f, i) => {
    FOLDER_BADGE[f.name] = badgeColors[i % badgeColors.length];
  });

  grid.innerHTML = filtered.map((f, i) => {
    const badge = FOLDER_BADGE[f.folder_name] || { bg: '#f3f4f6', color: '#6b7280' };
    const iconInfo = FILE_ICONS[f.type] || FILE_ICONS['doc'];
    const icon = f.icon || iconInfo.icon;
    const iconColor = f.icon_color || iconInfo.iconColor;
    const iconBg = f.icon_bg || iconInfo.iconBg;
    const date = new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const safeId = escapeHtml(String(f.id));
    const safeName = escapeHtml(f.name);
    const safeFolder = escapeHtml(f.folder_name || '-');
    return `
      <div class="file-card" style="animation-delay:${i * 0.04}s" data-file-id="${safeId}" oncontextmenu="showCtx(event, this.dataset.fileId)">
        <div class="file-top">
          <div class="file-icon-box" style="background:${iconBg}">
            <i class="ti ${icon}" style="color:${iconColor}"></i>
          </div>
          <div class="file-menu" onclick="event.stopPropagation(); showCtx(event, this.parentElement.parentElement.dataset.fileId)">
            <i class="ti ti-dots-vertical"></i>
          </div>
        </div>
        <span class="fcat-badge" style="background:${badge.bg};color:${badge.color}">${safeFolder}</span>
        <div class="file-name" title="${safeName}">${safeName}</div>
        <div class="file-info"><span>${escapeHtml(f.size || '-')}</span><span>${date}</span></div>
      </div>`;
  }).join('');
  document.getElementById('fileCount').textContent = filtered.length;
}

/* ── FILTER & SEARCH ── */
function setFilter(el, type) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  currentFilter = type;
  renderFiles();
}

function filterFiles() { renderFiles(); }

/* ── NAV ── */
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
}

/* ── MODAL ── */
function openModal() { document.getElementById('modal').classList.add('show'); }

/* [BUG FIX #6] Reset fileInput & droppedFiles saat modal ditutup */
function closeModal() {
  document.getElementById('modal').classList.remove('show');
  document.getElementById('selectedFiles').textContent = '';
  document.getElementById('folderSelect').value = '';
  document.getElementById('fileInput').value = '';
  droppedFiles = null;
}

/* ── ADD FOLDER ── */
async function addFolder() {
  const name = prompt('Nama folder baru:');
  if (!name || !name.trim()) return;

  const { error } = await sb.from('folders').insert({ name: name.trim() });
  if (error) { showToast('Gagal buat folder: ' + error.message); return; }

  await loadFolders();
  showToast('Folder "' + name.trim() + '" berhasil dibuat!');
}

/* ── CONTEXT MENU ── */
function showCtx(e, id) {
  e.preventDefault();
  e.stopPropagation();
  ctxTarget = String(id); // [BUG FIX #5] Pastikan selalu string
  const menu = document.getElementById('ctxMenu');
  const x = Math.min(e.clientX, window.innerWidth - 190);
  const y = Math.min(e.clientY, window.innerHeight - 180);
  menu.style.top  = y + 'px';
  menu.style.left = x + 'px';
  menu.classList.add('show');
}

document.addEventListener('click', () => {
  document.getElementById('ctxMenu').classList.remove('show');
});

/* [BUG FIX #3] Tambahkan konfirmasi sebelum hapus file */
/* [BUG FIX #5] Gunakan String() pada perbandingan ID */
async function deleteFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(f => String(f.id) === ctxTarget);
  if (!file) return;

  // Konfirmasi sebelum hapus
  if (!confirm(`Yakin ingin menghapus file "${file.name}"? File yang dihapus tidak bisa dikembalikan.`)) {
    ctxTarget = null;
    return;
  }

  const { error } = await sb.from('files').delete().eq('id', ctxTarget);
  if (error) { showToast('Gagal hapus: ' + error.message); return; }

  showToast('File "' + file.name + '" dihapus.');
  ctxTarget = null;
  await loadFiles();
  renderStats();
}

/* ── TOAST ── */
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ── UPLOAD FILE ── */
/* [BUG FIX #4] Cek error dari Supabase Storage upload */
async function uploadFile() {
  const folder = document.getElementById('folderSelect').value;
  if (!folder) { showToast('Pilih folder tujuan dulu!'); return; }

  const fileInput = document.getElementById('fileInput');
  // [BUG FIX #2] Gunakan droppedFiles jika ada, fallback ke fileInput
  const files = (droppedFiles && droppedFiles.length > 0) ? droppedFiles : fileInput.files;
  if (!files || files.length === 0) { showToast('Pilih file dulu!'); return; }

  showToast('Mengupload...');
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const ext = file.name.split('.').pop().toLowerCase();
    let type = 'doc';
    if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) type = 'foto';
    else if (['mp4','mov','avi','mkv','webm'].includes(ext)) type = 'video';
    else if (ext === 'pdf') type = 'pdf';
    else if (['xlsx','csv','xls'].includes(ext)) type = 'spreadsheet';
    else if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) type = 'audio';
    else if (['doc','docx','txt','odt','rtf','pptx','ppt'].includes(ext)) type = 'doc';

    const iconInfo = FILE_ICONS[type] || FILE_ICONS['doc'];
    const sizeStr = file.size > 1024*1024
      ? (file.size / (1024*1024)).toFixed(1) + ' MB'
      : (file.size / 1024).toFixed(0) + ' KB';

    /* upload file ke Supabase Storage */
    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await sb.storage.from('user-files').upload(filePath, file);

    /* [BUG FIX #4] Cek error upload sebelum simpan metadata */
    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      failCount++;
      continue; // Skip metadata insert jika upload gagal
    }

    /* simpan metadata ke tabel files */
    const { error: insertError } = await sb.from('files').insert({
      name: file.name,
      folder_name: folder,
      type,
      size: sizeStr,
      icon: iconInfo.icon,
      icon_color: iconInfo.iconColor,
      icon_bg: iconInfo.iconBg,
    });

    if (insertError) {
      console.error('Insert error:', insertError.message);
      failCount++;
    } else {
      successCount++;
    }
  }

  closeModal();

  if (failCount > 0 && successCount > 0) {
    showToast(`${successCount} file berhasil, ${failCount} gagal diupload.`);
  } else if (failCount > 0 && successCount === 0) {
    showToast(`Gagal mengupload ${failCount} file. Cek koneksi atau storage.`);
  } else {
    showToast('File berhasil diupload ke ' + folder + '!');
  }

  await loadFiles();
  renderStats();
}

function handleFileSelect(input) {
  droppedFiles = null; // Reset dropped files saat user pilih via input
  const names = Array.from(input.files).map(f => f.name).join(', ');
  document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  // Auth guard: redirect ke login jika belum login
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  // Tampilkan info user
  const user = session.user;
  const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
  const initials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const email = user.email;

  document.querySelectorAll('.user-name').forEach(el => el.textContent = fullName);
  document.querySelectorAll('.user-av, .topbar-av').forEach(el => el.textContent = initials);
  const roleEl = document.querySelector('.user-role');
  if (roleEl) roleEl.textContent = email;

  // Tombol logout
  const userChip = document.querySelector('.user-chip');
  if (userChip) {
    userChip.title = 'Klik untuk logout';
    userChip.onclick = async () => {
      if (confirm('Yakin ingin logout?')) {
        await sb.auth.signOut();
        window.location.href = 'login.html';
      }
    };
  }

  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  /* [BUG FIX #2] Drag & drop sekarang menyimpan file ke droppedFiles */
  const dz = document.getElementById('dropZone');
  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.style.borderColor = 'var(--accent)';
    dz.style.background = 'rgba(124,58,237,0.15)';
  });
  dz.addEventListener('dragleave', () => {
    dz.style.borderColor = '';
    dz.style.background = '';
  });
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.style.borderColor = '';
    dz.style.background = '';
    droppedFiles = Array.from(e.dataTransfer.files); // Simpan file yang di-drop
    const names = droppedFiles.map(f => f.name).join(', ');
    document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
  });

  /* Escape untuk tutup modal */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('ctxMenu').classList.remove('show');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  loadAll();
});