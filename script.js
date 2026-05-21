const SUPABASE_URL = 'https://cgmoxqvdihiewdgxqxlh.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbW94cXZkaWhpZXdkZ3hxeGxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNjYzMjYsImV4cCI6MjA5NDg0MjMyNn0.VpifdxYoJFb-6HA6fNmK2g0rBJGZTNfklwTafCOci6U';
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
let currentFolderFilter = null;
let currentSort = 'newest';
let ctxTarget = null;
let allFolders = [];
let allFiles = [];
let droppedFiles = null;
let showOnlyFavorites = false;
// BUG FIX #1: userInitials disimpan global agar bisa dipakai di render folder
let userInitials = 'US';

/* ── UTILITY ── */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getFavs() {
  return JSON.parse(localStorage.getItem('myStorageFavs') || '[]');
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
  // BUG FIX #2: tambah order('created_at', { ascending: false }) agar file terbaru tampil dulu
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) { showToast('Gagal load file: ' + error.message); return; }
  allFiles = data || [];
  renderFiles();
}

/* ── STATS ── */
function renderStats() {
  const totalFiles = allFiles.length;
  const totalFolders = allFolders.length;
  const favCount = allFiles.filter(f => getFavs().includes(String(f.id))).length;

  document.getElementById('statFiles').textContent = totalFiles;
  document.getElementById('statFolders').textContent = totalFolders;
  // BUG FIX #3: statShared tidak pernah diupdate — set ke 0 secara eksplisit
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = 0;
  if (document.getElementById('statFavorit')) document.getElementById('statFavorit').textContent = favCount;

  if (document.getElementById('badgeDashboard')) document.getElementById('badgeDashboard').textContent = totalFiles;
  if (document.getElementById('badgeDocs')) document.getElementById('badgeDocs').textContent = allFiles.filter(f => f.type === 'doc' || f.type === 'pdf').length;
  if (document.getElementById('badgePhotos')) document.getElementById('badgePhotos').textContent = allFiles.filter(f => f.type === 'foto').length;
  if (document.getElementById('badgeVideos')) document.getElementById('badgeVideos').textContent = allFiles.filter(f => f.type === 'video').length;
  if (document.getElementById('badgeAudio')) document.getElementById('badgeAudio').textContent = allFiles.filter(f => f.type === 'audio').length;
  // BUG FIX #4: badgeShared tidak pernah diset
  if (document.getElementById('badgeShared')) document.getElementById('badgeShared').textContent = 0;

  let usedBytes = 0;
  allFiles.forEach(f => {
    if (f.size) {
      const num = parseFloat(f.size);
      if (f.size.includes('MB')) usedBytes += num * 1024 * 1024;
      else if (f.size.includes('KB')) usedBytes += num * 1024;
      else if (f.size.includes('GB')) usedBytes += num * 1024 * 1024 * 1024;
    }
  });
  // BUG FIX #5: kalkulasi storage menggunakan usedBytes yang konsisten
  const usedMB = usedBytes / (1024 * 1024);
  const totalMB = 1024;
  const pct = Math.min(Math.round((usedMB / totalMB) * 100), 100);
  const usedStr = usedBytes < 1024 ? usedBytes.toFixed(0) + ' B' :
                  usedBytes < 1024*1024 ? (usedBytes/1024).toFixed(0) + ' KB' :
                  usedBytes < 1024*1024*1024 ? (usedBytes/(1024*1024)).toFixed(1) + ' MB' :
                  (usedBytes/(1024*1024*1024)).toFixed(2) + ' GB';

  document.getElementById('storagePct').textContent = pct + '%';
  document.getElementById('storageUsed').textContent = usedStr + ' terpakai';

  setTimeout(() => {
    const fill = document.querySelector('.storage-fill');
    if (fill) fill.style.width = pct + '%';
  }, 300);
}

/* ── RENDER FOLDERS ── */
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
    // BUG FIX #6: inisial user dinamis (bukan hardcode 'RZ')
    const initials = userInitials;
    return `
      <div class="folder-wrap" style="animation-delay:${i * 0.06}s; position:relative;" data-folder="${safeName}" onclick="openFolder(this.dataset.folder)">
        <button class="folder-delete-btn" title="Hapus folder" onclick="event.stopPropagation(); deleteFolder('${safeName.replace(/'/g, \"\\'\")}')">
          <i class="ti ti-trash"></i>
        </button>
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
          <text x="10" y="73" font-size="5.5" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="600">${escapeHtml(initials)}</text>
          <circle cx="128" cy="14" r="8" fill="${c.color1}"/>
          <text x="128" y="18" font-size="10" fill="${c.text}" text-anchor="middle" font-family="sans-serif" font-weight="600">›</text>
        </svg>
      </div>`;
  }).join('');
  document.getElementById('folderCount').textContent = allFolders.length;

  const sel = document.getElementById('folderSelect');
  sel.innerHTML = '<option value="">Pilih folder...</option>' +
    allFolders.map(f => `<option value="${escapeHtml(f.name)}">${escapeHtml(f.name)}</option>`).join('');
}

function openFolder(name) {
  currentFolderFilter = name;
  showOnlyFavorites = false;
  document.getElementById('fileGrid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Folder ' + name + ' dibuka');
  renderFiles();
}

/* ── FITUR SORTING FILE ── */
function toggleSort() {
  const modes = ['newest', 'oldest', 'az', 'za'];
  const labels = ['Terbaru', 'Terlama', 'A-Z', 'Z-A'];

  let idx = modes.indexOf(currentSort);
  let nextIdx = (idx + 1) % modes.length;

  currentSort = modes[nextIdx];
  document.getElementById('sortLabel').textContent = labels[nextIdx];
  showToast('Diurutkan berdasarkan: ' + labels[nextIdx]);
  renderFiles();
}

/* ── RENDER FILES ── */
function renderFiles() {
  const grid = document.getElementById('fileGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const favs = getFavs();

  let filtered = allFiles.filter(f => {
    const matchType   = currentFilter === 'semua' || f.type === currentFilter;
    const matchSearch = f.name.toLowerCase().includes(search) || (f.folder_name || '').toLowerCase().includes(search);
    const matchFolder = !currentFolderFilter || f.folder_name === currentFolderFilter;
    const matchFav    = showOnlyFavorites ? favs.includes(String(f.id)) : true;

    return matchType && matchSearch && matchFolder && matchFav;
  });

  filtered.sort((a, b) => {
    if (currentSort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (currentSort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (currentSort === 'az') return a.name.localeCompare(b.name);
    if (currentSort === 'za') return b.name.localeCompare(a.name);
    return 0;
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
    const isFav = favs.includes(String(f.id));

    return `
      <div class="file-card" style="animation-delay:${i * 0.04}s" data-file-id="${safeId}" oncontextmenu="showCtx(event, '${safeId}')">
        <div class="file-top">
          <div class="file-icon-box" style="background:${iconBg}">
            <i class="ti ${icon}" style="color:${iconColor}"></i>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
             ${isFav ? `<i class="ti ti-star" style="color:#fbbf24; font-size:16px;"></i>` : ''}
             <div class="file-menu" onclick="event.stopPropagation(); showCtx(event, '${safeId}')">
               <i class="ti ti-dots-vertical"></i>
             </div>
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
  // BUG FIX #7: setFilter dari sidebar ("doc","foto","video","audio") tidak mereset currentFolderFilter
  currentFolderFilter = null;
  showOnlyFavorites = false;
  renderFiles();
}

function filterFiles() { renderFiles(); }

function filterFavorites() {
  currentFolderFilter = null;
  currentFilter = 'semua';
  showOnlyFavorites = true;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  document.querySelector('.filter-chip').classList.add('active');
  showToast('Menampilkan file favorit');
  renderFiles();
}

/* ── NAV ── */
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  if (el.textContent.includes("Dashboard")) {
    currentFolderFilter = null;
    showOnlyFavorites = false;
    renderFiles();
  }
}

/* ── MODAL ── */
function openModal() { document.getElementById('modal').classList.add('show'); }

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
  if (allFolders.some(f => f.name.toLowerCase() === name.trim().toLowerCase())) {
    showToast('Folder "' + name.trim() + '" sudah ada!');
    return;
  }
  // BUG FIX #17: sertakan user_id agar RLS mengenali kepemilikan folder
  const { data: { session: folderSession } } = await sb.auth.getSession();
  const { error } = await sb.from('folders').insert({
    name: name.trim(),
    user_id: folderSession?.user?.id
  });
  if (error) { showToast('Gagal buat folder: ' + error.message); return; }

  await loadFolders();
  showToast('Folder "' + name.trim() + '" berhasil dibuat!');
}

/* ── DELETE FOLDER ── */
async function deleteFolder(folderName) {
  const filesInFolder = allFiles.filter(f => f.folder_name === folderName);
  if (filesInFolder.length > 0) {
    if (!confirm(`Folder "${folderName}" masih berisi ${filesInFolder.length} file.\nHapus semua file dan folder ini?`)) return;
    showToast('Menghapus isi folder...');
    for (const file of filesInFolder) {
      const path = file.storage_path || `${file.folder_name}/${file.name}`;
      await sb.storage.from('user-files').remove([path]);
      await sb.from('files').delete().eq('id', file.id);
    }
  } else {
    if (!confirm(`Yakin ingin menghapus folder "${folderName}"?`)) return;
  }
  const { error } = await sb.from('folders').delete().eq('name', folderName);
  if (error) { showToast('Gagal hapus folder: ' + error.message); return; }
  if (currentFolderFilter === folderName) currentFolderFilter = null;
  showToast('Folder "' + folderName + '" berhasil dihapus!');
  await loadAll();
}

/* ── CONTEXT MENU ACTION ── */
function showCtx(e, id) {
  e.preventDefault();
  e.stopPropagation();
  ctxTarget = String(id);
  const menu = document.getElementById('ctxMenu');
  // BUG FIX #9: posisi ctx menu bisa terpotong di tepi layar, perhitungkan tinggi menu
  const menuH = 200;
  const menuW = 190;
  const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
  const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
  menu.style.top  = y + 'px';
  menu.style.left = x + 'px';
  menu.classList.add('show');
}

document.addEventListener('click', () => {
  document.getElementById('ctxMenu').classList.remove('show');
});

/* ── FITUR DOWNLOAD ── */
async function downloadFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(f => String(f.id) === ctxTarget);
  if (!file) return;

  document.getElementById('ctxMenu').classList.remove('show');
  showToast('Menyiapkan file download...');

  const path = file.storage_path || `${file.folder_name}/${file.name}`;
  const { data, error } = await sb.storage.from('user-files').download(path);

  if (error) { showToast('Gagal mengunduh: ' + error.message); return; }

  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Download dimulai!');
}

/* ── FITUR SHARE (COPY LINK) ── */
async function shareFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(f => String(f.id) === ctxTarget);
  if (!file) return;

  document.getElementById('ctxMenu').classList.remove('show');
  const path = file.storage_path || `${file.folder_name}/${file.name}`;

  const { data, error } = await sb.storage.from('user-files').createSignedUrl(path, 604800);

  if (error) { showToast('Gagal membuat link: ' + error.message); return; }

  // BUG FIX #10: navigator.clipboard bisa gagal jika tidak di HTTPS / tidak ada permission
  try {
    await navigator.clipboard.writeText(data.signedUrl);
    showToast('Link berhasil disalin ke clipboard!');
  } catch (clipErr) {
    // fallback: tampilkan URL di prompt agar bisa disalin manual
    prompt('Salin link berikut (Ctrl+C):', data.signedUrl);
    showToast('Salin link dari dialog ya!');
  }
}

/* ── FITUR RENAME ── */
async function renameFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(f => String(f.id) === ctxTarget);
  if (!file) return;

  document.getElementById('ctxMenu').classList.remove('show');

  const newName = prompt('Masukkan nama file baru:', file.name);
  if (!newName || newName.trim() === '' || newName.trim() === file.name) return;

  showToast('Mengubah nama file...');

  const oldPath = file.storage_path || `${file.folder_name}/${file.name}`;
  const newPath = `${file.folder_name}/${Date.now()}_${newName.trim()}`;

  const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
  if (moveErr) { showToast('Gagal mengubah di Storage: ' + moveErr.message); return; }

  const { error: dbErr } = await sb.from('files').update({ name: newName.trim(), storage_path: newPath }).eq('id', file.id);
  if (dbErr) { showToast('Gagal mengubah di Database: ' + dbErr.message); return; }

  showToast('Nama file berhasil diubah!');
  await loadFiles();
  // BUG FIX #11: renderStats tidak dipanggil setelah rename, padahal nama file berubah
  renderStats();
}

/* ── FITUR FAVORIT ── */
function toggleFavorite() {
  if (!ctxTarget) return;
  let favs = getFavs();

  if (favs.includes(ctxTarget)) {
    favs = favs.filter(id => id !== ctxTarget);
    showToast('Dihapus dari favorit');
  } else {
    favs.push(ctxTarget);
    showToast('Ditambahkan ke favorit!');
  }

  localStorage.setItem('myStorageFavs', JSON.stringify(favs));
  document.getElementById('ctxMenu').classList.remove('show');

  renderFiles();
  renderStats();
}

/* ── DELETE FILE ── */
async function deleteFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(f => String(f.id) === ctxTarget);
  if (!file) return;

  if (!confirm(`Yakin ingin menghapus file "${file.name}"? File yang dihapus tidak bisa dikembalikan.`)) {
    ctxTarget = null;
    return;
  }

  document.getElementById('ctxMenu').classList.remove('show');
  showToast('Menghapus file...');

  const pathToDelete = file.storage_path || `${file.folder_name}/${file.name}`;
  const { error: storageError } = await sb.storage.from('user-files').remove([pathToDelete]);

  if (storageError) {
    console.error('Gagal menghapus file dari Storage:', storageError.message);
  }

  const { error } = await sb.from('files').delete().eq('id', ctxTarget);
  if (error) { showToast('Gagal hapus data database: ' + error.message); return; }

  let favs = getFavs();
  if (favs.includes(ctxTarget)) {
    favs = favs.filter(id => id !== ctxTarget);
    localStorage.setItem('myStorageFavs', JSON.stringify(favs));
  }

  showToast('File "' + file.name + '" berhasil dihapus.');
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
async function uploadFile() {
  const folder = document.getElementById('folderSelect').value;
  if (!folder) { showToast('Pilih folder tujuan dulu!'); return; }

  const fileInput = document.getElementById('fileInput');
  const files = (droppedFiles && droppedFiles.length > 0) ? droppedFiles : fileInput.files;
  if (!files || files.length === 0) { showToast('Pilih file dulu!'); return; }

  // BUG FIX #12: disable tombol upload saat proses berjalan agar tidak double-submit
  const btnConfirm = document.querySelector('.btn-confirm');
  btnConfirm.disabled = true;
  btnConfirm.textContent = 'Mengupload...';

  showToast('Mengupload ' + files.length + ' file...');
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

    const filePath = `${folder}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await sb.storage.from('user-files').upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      failCount++;
      continue;
    }

    // BUG FIX #16: user_id wajib diisi agar RLS bisa mengenali kepemilikan file
    const { data: { session: uploadSession } } = await sb.auth.getSession();
    const { error: insertError } = await sb.from('files').insert({
      name: file.name,
      folder_name: folder,
      type,
      size: sizeStr,
      icon: iconInfo.icon,
      icon_color: iconInfo.iconColor,
      icon_bg: iconInfo.iconBg,
      storage_path: filePath,
      user_id: uploadSession?.user?.id
    });

    if (insertError) {
      console.error('Insert error:', insertError.message);
      failCount++;
    } else {
      successCount++;
    }
  }

  // BUG FIX #13: reset tombol setelah upload selesai
  btnConfirm.disabled = false;
  btnConfirm.textContent = 'Upload';

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
  droppedFiles = null;
  const names = Array.from(input.files).map(f => f.name).join(', ');
  document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { window.location.href = 'login.html'; return; }

  const user = session.user;
  const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
  // BUG FIX #1 (lanjutan): simpan inisial ke variabel global
  userInitials = fullName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const email = user.email;

  document.querySelectorAll('.user-name').forEach(el => el.textContent = fullName);
  document.querySelectorAll('.user-av, .topbar-av').forEach(el => el.textContent = userInitials);
  const roleEl = document.querySelector('.user-role');
  if (roleEl) roleEl.textContent = email;

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

  // BUG FIX #14: klik overlay modal tidak menutup modal (event listener sudah ada, ini pastikan tidak duplikat)
  const modalOverlay = document.getElementById('modal');
  modalOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

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
    droppedFiles = Array.from(e.dataTransfer.files);
    const names = droppedFiles.map(f => f.name).join(', ');
    document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
  });

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

  // BUG FIX #15: auth state change listener — redirect ke login jika session habis/logout dari tab lain
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.href = 'login.html';
    }
  });

  loadAll();
});