// SECURITY: Credentials dimuat dari supabase-config.js (jangan hardcode di sini)
// Pastikan supabase-config.js dimuat sebelum script.js di Storage-dasboard.html
const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

const FOLDER_COLORS = [
  { color1: '#c7d2fe', color2: '#eef2ff', text: '#3730a3', sub: '#6366f1', av: '#6366f1' },
  { color1: '#bae6fd', color2: '#e0f2fe', text: '#0c4a6e', sub: '#0369a1', av: '#0ea5e9' },
  { color1: '#bbf7d0', color2: '#dcfce7', text: '#14532d', sub: '#15803d', av: '#22c55e' },
  { color1: '#fed7aa', color2: '#ffedd5', text: '#7c2d12', sub: '#c2410c', av: '#f97316' },
  { color1: '#fecdd3', color2: '#ffe4e6', text: '#881337', sub: '#be123c', av: '#f43f5e' },
  { color1: '#d8b4fe', color2: '#f3e8ff', text: '#4a044e', sub: '#7e22ce', av: '#a855f7' },
];

const FILE_ICONS = {
  pdf:         { icon: 'ti-file-type-pdf',  iconColor: '#c0392b', iconBg: 'rgba(192,57,43,0.18)' },
  doc:         { icon: 'ti-file-type-docx', iconColor: '#1d4ed8', iconBg: 'rgba(29,78,216,0.15)' },
  foto:        { icon: 'ti-photo',          iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.08)' },
  video:       { icon: 'ti-video',          iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.08)' },
  spreadsheet: { icon: 'ti-file-type-xls',  iconColor: '#0369a1', iconBg: 'rgba(3,105,161,0.15)' },
  audio:       { icon: 'ti-music',          iconColor: '#7e22ce', iconBg: 'rgba(126,34,206,0.08)' },
};

/* ── FILE TYPE LABEL ── */
function getFileTypeLabel(fileName, fileType) {
  if (!fileName) return fileType ? fileType.toUpperCase() : 'FILE';
  const ext = fileName.split('.').pop().toLowerCase();
  const extMap = {
    // Documents
    pdf: { label: 'PDF', color: '#c0392b', bg: 'rgba(192,57,43,0.13)' },
    doc: { label: 'DOC', color: '#1d4ed8', bg: 'rgba(29,78,216,0.13)' },
    docx: { label: 'DOCX', color: '#1d4ed8', bg: 'rgba(29,78,216,0.13)' },
    // Presentations
    ppt: { label: 'PPT', color: '#c2410c', bg: 'rgba(194,65,12,0.13)' },
    pptx: { label: 'PPTX', color: '#c2410c', bg: 'rgba(194,65,12,0.13)' },
    // Spreadsheets
    xls: { label: 'XLS', color: '#0369a1', bg: 'rgba(3,105,161,0.13)' },
    xlsx: { label: 'XLSX', color: '#0369a1', bg: 'rgba(3,105,161,0.13)' },
    csv: { label: 'CSV', color: '#0369a1', bg: 'rgba(3,105,161,0.13)' },
    // Images
    jpg: { label: 'JPG', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    jpeg: { label: 'JPEG', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    png: { label: 'PNG', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    gif: { label: 'GIF', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    webp: { label: 'WEBP', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    svg: { label: 'SVG', color: '#2d6a4f', bg: 'rgba(45,106,79,0.13)' },
    // Videos
    mp4: { label: 'MP4', color: '#c8602a', bg: 'rgba(200,96,42,0.13)' },
    mov: { label: 'MOV', color: '#c8602a', bg: 'rgba(200,96,42,0.13)' },
    avi: { label: 'AVI', color: '#c8602a', bg: 'rgba(200,96,42,0.13)' },
    mkv: { label: 'MKV', color: '#c8602a', bg: 'rgba(200,96,42,0.13)' },
    webm: { label: 'WEBM', color: '#c8602a', bg: 'rgba(200,96,42,0.13)' },
    // Audio
    mp3: { label: 'MP3', color: '#7e22ce', bg: 'rgba(126,34,206,0.13)' },
    wav: { label: 'WAV', color: '#7e22ce', bg: 'rgba(126,34,206,0.13)' },
    ogg: { label: 'OGG', color: '#7e22ce', bg: 'rgba(126,34,206,0.13)' },
    flac: { label: 'FLAC', color: '#7e22ce', bg: 'rgba(126,34,206,0.13)' },
    // Archives
    zip: { label: 'ZIP', color: '#5a5754', bg: 'rgba(90,87,84,0.13)' },
    rar: { label: 'RAR', color: '#5a5754', bg: 'rgba(90,87,84,0.13)' },
    '7z': { label: '7Z', color: '#5a5754', bg: 'rgba(90,87,84,0.13)' },
    // Text/Code
    txt: { label: 'TXT', color: '#5a5754', bg: 'rgba(90,87,84,0.13)' },
    js: { label: 'JS', color: '#92400e', bg: 'rgba(146,64,14,0.13)' },
    html: { label: 'HTML', color: '#c2410c', bg: 'rgba(194,65,12,0.13)' },
    css: { label: 'CSS', color: '#1d4ed8', bg: 'rgba(29,78,216,0.13)' },
    py: { label: 'PY', color: '#0369a1', bg: 'rgba(3,105,161,0.13)' },
  };
  return extMap[ext] || { label: ext ? ext.toUpperCase() : (fileType ? fileType.toUpperCase() : 'FILE'), color: '#5a5754', bg: 'rgba(90,87,84,0.13)' };
}

/* ── FILE ICON INFO BY EXTENSION ── */
function getFileIconInfo(fileName, fileType) {
  if (!fileName) return FILE_ICONS[fileType] || FILE_ICONS['doc'];
  const ext = fileName.split('.').pop().toLowerCase();
  const iconMap = {
    // PDF
    pdf:  { icon: 'ti-file-type-pdf',  iconColor: '#c0392b', iconBg: 'rgba(192,57,43,0.18)' },
    // Word
    doc:  { icon: 'ti-file-type-doc',  iconColor: '#1d4ed8', iconBg: 'rgba(29,78,216,0.15)' },
    docx: { icon: 'ti-file-type-docx', iconColor: '#1d4ed8', iconBg: 'rgba(29,78,216,0.15)' },
    // PowerPoint
    ppt:  { icon: 'ti-file-type-ppt',  iconColor: '#c2410c', iconBg: 'rgba(194,65,12,0.18)' },
    pptx: { icon: 'ti-file-type-ppt',  iconColor: '#c2410c', iconBg: 'rgba(194,65,12,0.18)' },
    // Excel / Spreadsheet
    xls:  { icon: 'ti-file-type-xls',  iconColor: '#0369a1', iconBg: 'rgba(3,105,161,0.15)' },
    xlsx: { icon: 'ti-file-type-xls',  iconColor: '#0369a1', iconBg: 'rgba(3,105,161,0.15)' },
    csv:  { icon: 'ti-file-type-csv',  iconColor: '#0369a1', iconBg: 'rgba(3,105,161,0.15)' },
    // Images
    jpg:  { icon: 'ti-file-type-jpg',  iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    jpeg: { icon: 'ti-file-type-jpg',  iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    png:  { icon: 'ti-file-type-png',  iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    gif:  { icon: 'ti-file-type-bmp',  iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    webp: { icon: 'ti-photo',          iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    svg:  { icon: 'ti-file-type-svg',  iconColor: '#2d6a4f', iconBg: 'rgba(45,106,79,0.13)' },
    // Videos
    mp4:  { icon: 'ti-file-type-mp4',  iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.15)' },
    mov:  { icon: 'ti-video',          iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.13)' },
    avi:  { icon: 'ti-video',          iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.13)' },
    mkv:  { icon: 'ti-video',          iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.13)' },
    webm: { icon: 'ti-video',          iconColor: '#c8602a', iconBg: 'rgba(200,96,42,0.13)' },
    // Audio
    mp3:  { icon: 'ti-file-type-mp3',  iconColor: '#7e22ce', iconBg: 'rgba(126,34,206,0.15)' },
    wav:  { icon: 'ti-music',          iconColor: '#7e22ce', iconBg: 'rgba(126,34,206,0.13)' },
    ogg:  { icon: 'ti-music',          iconColor: '#7e22ce', iconBg: 'rgba(126,34,206,0.13)' },
    flac: { icon: 'ti-music',          iconColor: '#7e22ce', iconBg: 'rgba(126,34,206,0.13)' },
    // Archives / ZIP
    zip:  { icon: 'ti-file-type-zip',  iconColor: '#b45309', iconBg: 'rgba(180,83,9,0.15)' },
    rar:  { icon: 'ti-file-zip',       iconColor: '#b45309', iconBg: 'rgba(180,83,9,0.15)' },
    '7z': { icon: 'ti-file-zip',       iconColor: '#b45309', iconBg: 'rgba(180,83,9,0.15)' },
    // Text / Code
    txt:  { icon: 'ti-file-type-txt',  iconColor: '#5a5754', iconBg: 'rgba(90,87,84,0.13)' },
    js:   { icon: 'ti-file-type-js',   iconColor: '#92400e', iconBg: 'rgba(146,64,14,0.15)' },
    ts:   { icon: 'ti-file-type-ts',   iconColor: '#1d4ed8', iconBg: 'rgba(29,78,216,0.13)' },
    html: { icon: 'ti-file-type-html', iconColor: '#c2410c', iconBg: 'rgba(194,65,12,0.13)' },
    css:  { icon: 'ti-file-type-css',  iconColor: '#1d4ed8', iconBg: 'rgba(29,78,216,0.13)' },
    py:   { icon: 'ti-file-type-py',   iconColor: '#0369a1', iconBg: 'rgba(3,105,161,0.13)' },
  };
  return iconMap[ext] || FILE_ICONS[fileType] || FILE_ICONS['doc'];
}

let currentFilter = 'semua';
let currentFolderFilter = null;   // nama folder (untuk kompatibilitas file filter)
let currentFolderId = null;       // UUID folder yang sedang dibuka (null = root)
let folderPath = [];              // breadcrumb: [{id, name}]
let currentSort = 'newest';
let currentViewMode = localStorage.getItem('myStorageViewMode') || 'grid';
const MAX_FOLDERS_SHOWN = 4;      // Jumlah folder yang ditampilkan sebelum "Lihat Semua"
let isFolderExpanded = false;

/* ── VIEW MODE (grid / list) ── */
function setViewMode(mode) {
  currentViewMode = mode;
  localStorage.setItem('myStorageViewMode', mode);

  const grid = document.getElementById('fileGrid');
  const header = document.getElementById('fileListHeader');
  const btnGrid = document.getElementById('btnGridView');
  const btnList = document.getElementById('btnListView');

  if (mode === 'list') {
    if (grid) grid.classList.add('list-view');
    if (header) header.classList.add('visible');
    if (btnGrid) btnGrid.classList.remove('active');
    if (btnList) btnList.classList.add('active');
  } else {
    if (grid) grid.classList.remove('list-view');
    if (header) header.classList.remove('visible');
    if (btnGrid) btnGrid.classList.add('active');
    if (btnList) btnList.classList.remove('active');
  }
  renderFiles();
}
let ctxTarget = null;
let allFolders = [];
let allFiles = [];
let droppedFiles = null;
let droppedFolderFiles = null;
let selectedFileIds = new Set();
let isSelectMode = false;
let showOnlyFavorites = false;
let userInitials = 'US';
let sharedLinks = JSON.parse(localStorage.getItem('myStorageShared') || '[]'); // [{id, name, url, createdAt, folder}]

/* ── CUSTOM DIALOG UTILITIES ── */
function customConfirm({ title, message, confirmText, cancelText, icon, iconClass, confirmBtnClass } = {}) {
  return new Promise(function(resolve) {
    var overlay = document.getElementById('customConfirm');
    var titleEl = document.getElementById('confirmTitle');
    var msgEl = document.getElementById('confirmMsg');
    var okBtn = document.getElementById('confirmOk');
    var cancelBtn = document.getElementById('confirmCancel');
    var iconEl = document.getElementById('confirmIcon');

    titleEl.textContent = title || 'Konfirmasi';
    msgEl.textContent = message || 'Apakah Anda yakin?';
    okBtn.textContent = confirmText || 'Ya, Lanjutkan';
    cancelBtn.textContent = cancelText || 'Batal';

    // Set icon
    iconEl.className = 'custom-dialog-icon' + (iconClass ? ' ' + iconClass : '');
    iconEl.innerHTML = '<i class="ti ' + (icon || 'ti-alert-triangle') + '"></i>';

    // Set confirm button style
    okBtn.className = 'custom-dialog-btn ' + (confirmBtnClass || 'confirm');

    overlay.classList.add('show');

    function cleanup() {
      overlay.classList.remove('show');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
    }
    function onOk() { cleanup(); resolve(true); }
    function onCancel() { cleanup(); resolve(false); }
    function onOverlay(e) { if (e.target === overlay) { cleanup(); resolve(false); } }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
  });
}

function customPrompt({ title, message, placeholder, defaultValue, confirmText, cancelText, icon, iconClass } = {}) {
  return new Promise(function(resolve) {
    var overlay = document.getElementById('customPrompt');
    var titleEl = document.getElementById('promptTitle');
    var msgEl = document.getElementById('promptMsg');
    var input = document.getElementById('promptInput');
    var okBtn = document.getElementById('promptOk');
    var cancelBtn = document.getElementById('promptCancel');
    var iconEl = document.getElementById('promptIcon');

    titleEl.textContent = title || 'Input';
    msgEl.textContent = message || 'Masukkan data:';
    input.placeholder = placeholder || 'Ketik di sini...';
    input.value = defaultValue || '';
    okBtn.textContent = confirmText || 'Simpan';
    cancelBtn.textContent = cancelText || 'Batal';

    // Set icon
    iconEl.className = 'custom-dialog-icon' + (iconClass ? ' ' + iconClass : ' prompt');
    iconEl.innerHTML = '<i class="ti ' + (icon || 'ti-edit') + '"></i>';

    overlay.classList.add('show');
    setTimeout(function() { input.focus(); input.select(); }, 100);

    function cleanup() {
      overlay.classList.remove('show');
      okBtn.removeEventListener('click', onOk);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      input.removeEventListener('keydown', onKey);
    }
    function onOk() { var val = input.value; cleanup(); resolve(val); }
    function onCancel() { cleanup(); resolve(null); }
    function onOverlay(e) { if (e.target === overlay) { cleanup(); resolve(null); } }
    function onKey(e) { if (e.key === 'Enter') onOk(); if (e.key === 'Escape') onCancel(); }

    okBtn.addEventListener('click', onOk);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    input.addEventListener('keydown', onKey);
  });
}

/* ── UTILITY ── */
function resetFolderUI() {
  document.querySelectorAll('.folder-wrap').forEach(function(w) { w.classList.remove('active'); });
  var titleEl = document.getElementById('fileSectionTitle');
  if (titleEl) titleEl.textContent = 'File Terbaru';
  var btnBack = document.getElementById('btnBackFolder');
  if (btnBack) btnBack.style.display = 'none';
  currentFolderId = null;
  folderPath = [];
  var bcEl = document.getElementById('folderBreadcrumb');
  if (bcEl) bcEl.style.display = 'none';
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return String(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

function getFavs() {
  return JSON.parse(localStorage.getItem('myStorageFavs') || '[]');
}

/* ── LOAD DATA ── */
async function loadAll() {
  await loadFolders();  // harus duluan agar folder tersedia saat migrasi file
  await loadFiles();
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

  // Auto-migrasi file lama: jika punya folder_name tapi belum folder_id, link ke folder yang sesuai
  const toMigrate = allFiles.filter(function(f) { return f.folder_name && !f.folder_id; });
  if (toMigrate.length > 0 && allFolders.length > 0) {
    for (const f of toMigrate) {
      const matchFolder = allFolders.find(function(folder) {
        return folder.name === f.folder_name && !folder.parent_id;
      });
      if (matchFolder) {
        await sb.from('files').update({ folder_id: matchFolder.id }).eq('id', f.id);
        f.folder_id = matchFolder.id; // update local state juga
      }
    }
  }

  renderFiles();
}

/* ── STATS ── */
function renderStats() {
  const totalFiles = allFiles.length;
  const totalFolders = allFolders.filter(function(f) { return !f.parent_id; }).length; // hanya root folder
  const favCount = allFiles.filter(f => getFavs().includes(String(f.id))).length;

  const sharedCount = JSON.parse(localStorage.getItem('myStorageShared') || '[]').filter(function(s) {
    return Date.now() - s.createdAt < 7 * 24 * 60 * 60 * 1000;
  }).length;

  document.getElementById('statFiles').textContent = totalFiles;
  document.getElementById('statFolders').textContent = totalFolders;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = sharedCount;
  if (document.getElementById('statFavorit')) document.getElementById('statFavorit').textContent = favCount;

  if (document.getElementById('badgeDashboard')) document.getElementById('badgeDashboard').textContent = totalFiles;
  if (document.getElementById('badgeDocs')) document.getElementById('badgeDocs').textContent = allFiles.filter(f => f.type === 'doc' || f.type === 'pdf').length;
  if (document.getElementById('badgePhotos')) document.getElementById('badgePhotos').textContent = allFiles.filter(f => f.type === 'foto').length;
  if (document.getElementById('badgeVideos')) document.getElementById('badgeVideos').textContent = allFiles.filter(f => f.type === 'video').length;
  if (document.getElementById('badgeAudio')) document.getElementById('badgeAudio').textContent = allFiles.filter(f => f.type === 'audio').length;
  if (document.getElementById('badgeShared')) document.getElementById('badgeShared').textContent = sharedCount;

  let usedBytes = 0;
  allFiles.forEach(f => {
    if (f.size) {
      const num = parseFloat(f.size);
      if (f.size.includes('MB')) usedBytes += num * 1024 * 1024;
      else if (f.size.includes('KB')) usedBytes += num * 1024;
      else if (f.size.includes('GB')) usedBytes += num * 1024 * 1024 * 1024;
    }
  });
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

  checkStorageNotif(usedBytes);
}

/* ── PIN FOLDER ── */
function getPinnedFolders() {
  return JSON.parse(localStorage.getItem('myStoragePinnedFolders') || '[]');
}
function togglePinFolder(folderId, e) {
  if (e) e.stopPropagation();
  var pins = getPinnedFolders();
  var idx = pins.indexOf(folderId);
  if (idx === -1) {
    pins.push(folderId);
    showToast('\uD83D\uDCCC Folder dipin ke atas!');
  } else {
    pins.splice(idx, 1);
    showToast('Pin folder dilepas.');
  }
  localStorage.setItem('myStoragePinnedFolders', JSON.stringify(pins));
  renderFolders();
}

/* ── RENDER FOLDERS ── */
function renderFolders() {
  const grid = document.getElementById('folderGrid');
  const pins = getPinnedFolders();

  // Tampilkan hanya folder yang parent_id-nya sama dengan currentFolderId
  let visible = allFolders.filter(function(f) {
    const pid = f.parent_id || null;
    return pid === currentFolderId;
  });

  // Sort: pinned duluan, lalu urutan asli
  visible = visible.slice().sort(function(a, b) {
    var ap = pins.includes(a.id) ? 0 : 1;
    var bp = pins.includes(b.id) ? 0 : 1;
    return ap - bp;
  });

  // Render breadcrumb
  renderFolderBreadcrumb();

  // Tambah tombol "Folder baru" label update
  const addBtn = document.querySelector('.btn-new');
  if (addBtn) {
    addBtn.onclick = function() { addFolder(); };
  }

  if (visible.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="ti ti-folder-off"></i><p>' +
      (currentFolderId ? 'Belum ada subfolder di sini.' : 'Belum ada folder. Buat folder baru!') +
      '</p></div>';
    document.getElementById('folderCount').textContent = '0';
    populateFolderSelect();
    var seeAllBtn = document.getElementById('btnLihatSemua');
    if (seeAllBtn) seeAllBtn.style.display = 'none';
    return;
  }

  // Tentukan folder yang ditampilkan berdasarkan status expand
  const toShow = isFolderExpanded ? visible : visible.slice(0, MAX_FOLDERS_SHOWN);

  grid.innerHTML = toShow.map(function(f, i) {
    const c = FOLDER_COLORS[i % FOLDER_COLORS.length];
    const fileCount = allFiles.filter(function(x) {
      return x.folder_id === f.id || (!x.folder_id && x.folder_name === f.name);
    }).length;
    const subCount = allFolders.filter(function(x) { return x.parent_id === f.id; }).length;
    const safeName = escapeHtml(f.name);
    const safeId = escapeAttr(f.id);
    const subLabel = subCount > 0 ? subCount + ' folder · ' + fileCount + ' file' : fileCount + ' file';
    const isPinned = pins.includes(f.id);
    return (
      '<div class="folder-wrap' + (isPinned ? ' folder-pinned' : '') + '" style="animation-delay:' + (i * 0.06) + 's; position:relative;" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '" onclick="openFolderById(\'' + safeId + '\', \'' + escapeAttr(f.name) + '\')" ondblclick="event.stopPropagation(); startFolderRename(\'' + safeId + '\', \'' + escapeAttr(f.name) + '\', this)" ondragover="folderCardDragOver(event,this)" ondragleave="folderCardDragLeave(event,this)" ondrop="folderCardDrop(event,this)">' +
      '<button class="folder-pin-btn' + (isPinned ? ' pinned' : '') + '" title="' + (isPinned ? 'Lepas pin' : 'Pin ke atas') + '" onclick="togglePinFolder(\'' + safeId + '\', event)">' +
      '<i class="ti ' + (isPinned ? 'ti-pin-filled' : 'ti-pin') + '"></i></button>' +
      '<button class="folder-delete-btn" title="Hapus folder" onclick="event.stopPropagation(); deleteFolderById(\'' + safeId + '\', \'' + escapeAttr(f.name) + '\')">' +
      '<i class="ti ti-trash"></i></button>' +
      '<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><filter id="fs' + i + '" x="-5%" y="-5%" width="110%" height="110%">' +
      '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="' + c.color1 + '" flood-opacity="0.4"/>' +
      '</filter></defs>' +
      '<path d="M6,20 Q6,14 12,14 L54,14 Q59,14 62,19 L67,26 L132,26 Q137,26 137,31 L137,82 Q137,88 131,88 L9,88 Q3,88 3,82 L3,27 Q3,20 9,20 Z" fill="' + c.color1 + '" filter="url(#fs' + i + ')"/>' +
      '<path d="M3,28 L3,82 Q3,88 9,88 L131,88 Q137,88 137,82 L137,31 Q137,26 132,26 L6,26 Q3,26 3,28 Z" fill="' + c.color2 + '"/>' +
      (isPinned ? '<text x="128" y="24" font-size="9" fill="' + c.sub + '" font-family="sans-serif" text-anchor="end">\uD83D\uDCCC</text>' : '') +
      (subCount > 0
        ? '<rect x="18" y="36" width="16" height="11" rx="2" fill="' + c.color1 + '"/>' +
          '<rect x="37" y="36" width="16" height="11" rx="2" fill="' + c.color1 + '"/>' +
          '<rect x="56" y="36" width="16" height="11" rx="2" fill="' + c.color1 + '"/>'
        : '') +
      '<text x="11" y="' + (subCount > 0 ? '60' : '48') + '" font-size="10.5" font-weight="700" fill="' + c.text + '" font-family="sans-serif">' + safeName + '</text>' +
      '<text x="11" y="' + (subCount > 0 ? '70' : '61') + '" font-size="7.5" fill="' + c.sub + '" font-family="sans-serif">' + escapeHtml(subLabel) + '</text>' +
      '</svg></div>'
    );
  }).join('');

  document.getElementById('folderCount').textContent = visible.length;
  populateFolderSelect();

  // ── Tombol "Lihat Semua / Sembunyikan" ──
  var seeAllBtn = document.getElementById('btnLihatSemua');
  if (visible.length > MAX_FOLDERS_SHOWN) {
    if (!seeAllBtn) {
      seeAllBtn = document.createElement('button');
      seeAllBtn.id = 'btnLihatSemua';
      seeAllBtn.style.cssText = [
        'display:flex', 'align-items:center', 'gap:5px',
        'background:transparent', 'border:1.5px solid var(--border)',
        'color:var(--text-muted)', 'border-radius:8px',
        'padding:6px 14px', 'font-size:12.5px', 'cursor:pointer',
        'margin-top:10px', 'transition:all .18s ease',
        'font-family:inherit'
      ].join(';');
      seeAllBtn.onmouseenter = function() {
        this.style.borderColor = 'var(--accent)';
        this.style.color = 'var(--accent)';
      };
      seeAllBtn.onmouseleave = function() {
        this.style.borderColor = 'var(--border)';
        this.style.color = 'var(--text-muted)';
      };
      grid.parentNode.insertBefore(seeAllBtn, grid.nextSibling);
    }
    var remaining = visible.length - MAX_FOLDERS_SHOWN;
    seeAllBtn.innerHTML = isFolderExpanded
      ? '<i class="ti ti-chevron-up" style="font-size:13px"></i> Sembunyikan'
      : '<i class="ti ti-chevron-down" style="font-size:13px"></i> Lihat Semua (' + remaining + ' lainnya)';
    seeAllBtn.style.display = 'flex';
    seeAllBtn.onclick = function() {
      isFolderExpanded = !isFolderExpanded;
      renderFolders();
    };
  } else {
    if (seeAllBtn) seeAllBtn.style.display = 'none';
  }
}

function renderFolderBreadcrumb() {
  let bcEl = document.getElementById('folderBreadcrumb');
  if (!bcEl) {
    bcEl = document.createElement('div');
    bcEl.id = 'folderBreadcrumb';
    bcEl.style.cssText = 'display:flex;align-items:center;gap:6px;font-size:12.5px;color:var(--ink-4);margin-bottom:10px;flex-wrap:wrap';
    const grid = document.getElementById('folderGrid');
    grid.parentNode.insertBefore(bcEl, grid);
  }

  if (folderPath.length === 0) {
    bcEl.style.display = 'none';
    updateTopbarBreadcrumb();
    return;
  }

  bcEl.style.display = 'flex';
  let html = '<span style="cursor:pointer;color:var(--accent);font-weight:500" onclick="goToRoot()"><i class="ti ti-home" style="font-size:13px;vertical-align:middle;margin-right:2px"></i>Root</span>';
  folderPath.forEach(function(crumb, idx) {
    html += '<i class="ti ti-chevron-right" style="font-size:11px;color:var(--ink-5)"></i>';
    if (idx < folderPath.length - 1) {
      html += '<span style="cursor:pointer;color:var(--accent);font-weight:500" onclick="navigateBreadcrumb(' + idx + ')">' + escapeHtml(crumb.name) + '</span>';
    } else {
      html += '<span style="color:var(--ink-2);font-weight:600">' + escapeHtml(crumb.name) + '</span>';
    }
  });
  bcEl.innerHTML = html;
  updateTopbarBreadcrumb();
}

function navigateBreadcrumb(idx) {
  if (idx === -1) {
    // Kembali ke root
    currentFolderId = null;
    currentFolderFilter = null;
    folderPath = [];
  } else {
    // Kembali ke level idx
    const crumb = folderPath[idx];
    currentFolderId = crumb.id;
    currentFolderFilter = crumb.name;
    folderPath = folderPath.slice(0, idx + 1);
  }
  renderFolders();
  renderFiles();
  updateFileSectionTitle();
  updateTopbarBreadcrumb();
}

/* ── goToRoot: dipanggil dari breadcrumb topbar ── */
function goToRoot() {
  currentFolderId = null;
  currentFolderFilter = null;
  folderPath = [];
  renderFolders();
  renderFiles();
  updateFileSectionTitle();
  updateTopbarBreadcrumb();
  // Reset active folder highlight
  document.querySelectorAll('.folder-wrap').forEach(function(w) { w.classList.remove('active'); });
  const bcEl = document.getElementById('folderBreadcrumb');
  if (bcEl) bcEl.style.display = 'none';
}

/* ── Update breadcrumb di topbar ── */
function updateTopbarBreadcrumb() {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;

  if (folderPath.length === 0) {
    // Di root: tampilkan ikon home + "Dashboard" (tidak clickable, sudah di sini)
    bc.innerHTML = `
      <i class="ti ti-home" style="font-size:15px;color:var(--ink-5)"></i>
      <i class="ti ti-chevron-right" style="font-size:12px;color:var(--ink-5)"></i>
      <span style="color:var(--ink-2);font-weight:500;font-size:12.5px">Dashboard</span>`;
    return;
  }

  // Ada path: home (clickable) > folder1 > folder2 (aktif)
  let html = `<i class="ti ti-home" style="font-size:15px;color:var(--accent);cursor:pointer" onclick="goToRoot()" title="Kembali ke root"></i>`;

  folderPath.forEach(function(crumb, idx) {
    html += `<i class="ti ti-chevron-right" style="font-size:12px;color:var(--ink-5)"></i>`;
    const isLast = idx === folderPath.length - 1;
    if (isLast) {
      // Folder aktif — tidak clickable
      html += `<span style="color:var(--ink-2);font-weight:600;font-size:12.5px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle">${escapeHtml(crumb.name)}</span>`;
    } else {
      // Folder parent — clickable untuk naik level
      html += `<span style="color:var(--accent);font-weight:500;font-size:12.5px;cursor:pointer;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle" onclick="navigateBreadcrumb(${idx})" title="${escapeHtml(crumb.name)}">${escapeHtml(crumb.name)}</span>`;
    }
  });

  bc.innerHTML = html;
}

function updateFileSectionTitle() {
  const titleEl = document.getElementById('fileSectionTitle');
  const btnBack = document.getElementById('btnBackFolder');
  if (currentFolderId) {
    const cur = folderPath[folderPath.length - 1];
    if (titleEl) titleEl.innerHTML = '<i class="ti ti-folder-open" style="font-size:15px;color:var(--accent);margin-right:5px;vertical-align:middle"></i>' + escapeHtml(cur ? cur.name : '');
    if (btnBack) btnBack.style.display = 'flex';
  } else {
    if (titleEl) titleEl.textContent = 'File Terbaru';
    if (btnBack) btnBack.style.display = 'none';
  }
}

function populateFolderSelect() {
  // Isi dropdown folder di modal upload — semua folder yang ada
  const sel = document.getElementById('folderSelect');
  if (!sel) return;
  // Bangun tree untuk display hirarkis
  function buildOptions(parentId, indent) {
    return allFolders
      .filter(function(f) { return (f.parent_id || null) === parentId; })
      .map(function(f) {
        const prefix = indent.repeat(0) + (indent ? '└ ' : '');
        const option = '<option value="' + escapeAttr(f.id) + '">' + indent + escapeHtml(f.name) + '</option>';
        return option + buildOptions(f.id, indent + '　');
      }).join('');
  }
  sel.innerHTML = '<option value="">Pilih folder...</option>' + buildOptions(null, '');
  // Auto-select folder aktif
  if (currentFolderId) sel.value = currentFolderId;
}

function populateFolderDestSelect() {
  var sel = document.getElementById('folderDestSelect');
  if (!sel) return;
  function buildOptions(parentId, indent) {
    return allFolders
      .filter(function(f) { return (f.parent_id || null) === parentId; })
      .map(function(f) {
        var option = '<option value="' + escapeAttr(f.id) + '">' + indent + escapeHtml(f.name) + '</option>';
        return option + buildOptions(f.id, indent + '　');
      }).join('');
  }
  sel.innerHTML = '<option value="">📂 Simpan di root (Dashboard)</option>' + buildOptions(null, '');
  if (currentFolderId) sel.value = currentFolderId;
}

function openFolderById(folderId, folderName) {
  currentFolderId = folderId;
  currentFolderFilter = folderName; // untuk filter file
  showOnlyFavorites = false;

  // Tambah ke breadcrumb path
  folderPath.push({ id: folderId, name: folderName });

  renderFolders();
  renderFiles();
  updateFileSectionTitle();
  updateTopbarBreadcrumb();

  setTimeout(function() {
    const fileSection = document.getElementById('fileGrid');
    if (fileSection) fileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

// Kembali satu level ke atas
function closeFolder() {
  if (folderPath.length <= 1) {
    // Kembali ke root
    currentFolderId = null;
    currentFolderFilter = null;
    folderPath = [];
  } else {
    folderPath.pop();
    const parent = folderPath[folderPath.length - 1];
    currentFolderId = parent.id;
    currentFolderFilter = parent.name;
  }
  showOnlyFavorites = false;
  renderFolders();
  renderFiles();
  updateFileSectionTitle();
  updateTopbarBreadcrumb();
}

// Legacy openFolder (masih dipakai dari sidebar nav chips)
function openFolder(name) {
  const f = allFolders.find(function(x) { return x.name === name; });
  if (f) {
    folderPath = [];
    openFolderById(f.id, f.name);
  }
}

/* ── SORTING ── */
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

  let filtered = allFiles.filter(function(f) {
    const matchType   = currentFilter === 'semua' || f.type === currentFilter;
    const matchSearch = f.name.toLowerCase().includes(search) || (f.folder_name || '').toLowerCase().includes(search);
    // Filter folder: prioritas folder_id, fallback ke folder_name (kompatibilitas file lama)
    let matchFolder = true;
    if (currentFolderId) {
      // File baru punya folder_id, file lama hanya punya folder_name
      matchFolder = f.folder_id === currentFolderId ||
                    (!f.folder_id && f.folder_name === currentFolderFilter);
    } else if (!currentFolderId && currentFolderFilter === null && !showOnlyFavorites) {
      // Root view: tampilkan SEMUA file (tidak filter)
      matchFolder = true;
    }
    const matchFav    = showOnlyFavorites ? favs.includes(String(f.id)) : true;
    return matchType && matchSearch && matchFolder && matchFav;
  });

  filtered.sort(function(a, b) {
    if (currentSort === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (currentSort === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (currentSort === 'az') return a.name.localeCompare(b.name);
    if (currentSort === 'za') return b.name.localeCompare(a.name);
    return 0;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="ti ti-mood-empty"></i><p>Tidak ada file yang ditemukan.</p></div>';
    document.getElementById('fileCount').textContent = '0';
    return;
  }

  const FOLDER_BADGE = {};
  const badgeColors = [
    { bg: 'rgba(15,14,13,0.06)',   color: '#5a5754' },
    { bg: 'rgba(200,96,42,0.08)',  color: '#92400e' },
    { bg: 'rgba(29,78,216,0.07)',  color: '#1e40af' },
    { bg: 'rgba(45,106,79,0.07)',  color: '#166534' },
    { bg: 'rgba(126,34,206,0.07)', color: '#6b21a8' },
    { bg: 'rgba(3,105,161,0.07)',  color: '#075985' },
  ];
  allFolders.forEach(function(f, i) {
    FOLDER_BADGE[f.name] = badgeColors[i % badgeColors.length];
  });

  grid.innerHTML = filtered.map(function(f, i) {
    const badge = FOLDER_BADGE[f.folder_name] || { bg: '#f3f4f6', color: '#6b7280' };
    const iconInfo = getFileIconInfo(f.name, f.type);
    const icon = iconInfo.icon;
    const iconColor = iconInfo.iconColor;
    const iconBg = iconInfo.iconBg;
    const date = new Date(f.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const safeId = escapeAttr(String(f.id));
    const safeName = escapeHtml(f.name);
    const safeFolder = escapeHtml(f.folder_name || '-');
    const isFav = favs.includes(String(f.id));

    var isSelected = selectedFileIds.has(String(f.id));
    var selectedStyle = isSelected ? 'outline:2.5px solid #c8602a;outline-offset:2px;background:rgba(200,96,42,0.05);' : '';

    if (currentViewMode === 'list') {
      // ── LIST VIEW CARD ──
      return (
        '<div class="file-card" style="' + selectedStyle + '" data-file-id="' + safeId + '" onclick="fileCardClick(event, \'' + safeId + '\')" oncontextmenu="showCtx(event, \'' + safeId + '\')">' +
        // Checkbox
        '<div class="file-select-cb" style="display:' + (isSelectMode ? 'flex' : 'none') + ';flex-shrink:0;align-items:center;justify-content:center;">' +
        '<input type="checkbox" ' + (isSelected ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#c8602a;" onclick="event.stopPropagation();toggleFileSelect(\'' + safeId + '\', this.checked)"></div>' +
        // Icon + type label
        '<div class="file-top" style="margin-bottom:0;flex-shrink:0;position:relative">' +
        '<div class="file-icon-box" style="background:' + iconBg + ';width:32px;height:32px;font-size:15px;">' +
        '<i class="ti ' + icon + '" style="color:' + iconColor + '"></i></div>' +
        '</div>' +
        // Name (flex-1)
        '<div class="file-name" style="flex:1;margin-bottom:0;font-size:13px;" title="' + escapeAttr(f.name) + '">' + safeName + '</div>' +
        // Folder col
        '<div class="list-folder-col">' + safeFolder + '</div>' +
        // Size + date
        '<div class="file-info" style="margin-top:0;flex-direction:column;align-items:flex-end;gap:0;">' +
        '<span>' + escapeHtml(f.size || '-') + '</span>' +
        '<span style="margin-top:1px">' + date + '</span></div>' +
        // Fav + menu
        (isFav ? '<i class="ti ti-star fav-star" style="position:static;font-size:13px;flex-shrink:0;color:#fbbf24;"></i>' : '') +
        (isSelectMode ? '' : '<div class="file-menu" onclick="event.stopPropagation(); showCtx(event, \'' + safeId + '\')">' +
        '<i class="ti ti-dots-vertical"></i></div>') +
        '</div>'
      );
    }

    // ── GRID VIEW CARD (default) ──
    return (
      '<div class="file-card" draggable="true" style="animation-delay:' + (i * 0.04) + 's; cursor:pointer; position:relative;' + selectedStyle + '" data-file-id="' + safeId + '" onclick="fileCardClick(event, \'' + safeId + '\')" oncontextmenu="showCtx(event, \'' + safeId + '\')" ondragstart="fileCardDragStart(event, \'' + safeId + '\')" ondragend="fileCardDragEnd(event, this)">' +
      '<div class="file-select-cb" style="display:' + (isSelectMode ? 'flex' : 'none') + ';position:absolute;top:8px;left:8px;z-index:2;align-items:center;justify-content:center;">' +
      '<input type="checkbox" ' + (isSelected ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#c8602a;" onclick="event.stopPropagation();toggleFileSelect(\'' + safeId + '\', this.checked)"></div>' +
      '<div class="file-top">' +
      '<div style="position:relative;display:inline-block">' +
      '<div class="file-icon-box" style="background:' + iconBg + '">' +
      '<i class="ti ' + icon + '" style="color:' + iconColor + '"></i></div>' +
      '</div>' +
      '<div style="display:flex; gap:6px; align-items:center;">' +
      (isFav ? '<i class="ti ti-star" style="color:#fbbf24; font-size:16px;"></i>' : '') +
      (isSelectMode ? '' : '<div class="file-menu" onclick="event.stopPropagation(); showCtx(event, \'' + safeId + '\')">' +
      '<i class="ti ti-dots-vertical"></i></div>') + '</div></div>' +
      '<span class="fcat-badge" style="background:' + badge.bg + ';color:' + badge.color + ';margin-top:8px">' + safeFolder + '</span>' +
      '<div class="file-name" title="' + escapeAttr(f.name) + '">' + safeName + '</div>' +
      '<div class="file-info"><span>' + escapeHtml(f.size || '-') + '</span><span>' + date + '</span></div>' +
      '</div>'
    );
  }).join('');

  document.getElementById('fileCount').textContent = filtered.length;
}

/* ── OPEN FILE (viewer) ── */
function openFile(id) {
  const file = allFiles.find(function(f) { return String(f.id) === String(id); });
  if (!file) return;
  const path = file.storage_path || (file.folder_name + '/' + file.name);
  const params = new URLSearchParams({
    path: path,
    name: file.name,
    type: file.type || 'doc',
    size: file.size || ''
  });
  window.open('viewer.html?' + params.toString(), '_blank');
}

/* ── SHARED PANEL ── */
function showSharedPanel() {
  document.getElementById('sharedPanel').style.display = '';
  document.getElementById('mainPanel').style.display = 'none';
  renderShared();
}

function hideSharedPanel() {
  document.getElementById('sharedPanel').style.display = 'none';
  document.getElementById('mainPanel').style.display = '';
}

function renderShared() {
  const list = document.getElementById('sharedList');
  sharedLinks = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
  // Hapus yang sudah expired (lebih dari 7 hari)
  const now = Date.now();
  sharedLinks = sharedLinks.filter(function(s) { return now - s.createdAt < 7 * 24 * 60 * 60 * 1000; });
  localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));

  if (document.getElementById('sharedCount')) document.getElementById('sharedCount').textContent = sharedLinks.length;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = sharedLinks.length;
  if (document.getElementById('badgeShared')) document.getElementById('badgeShared').textContent = sharedLinks.length;

  if (sharedLinks.length === 0) {
    list.innerHTML = '<div class="empty-state"><i class="ti ti-share-off"></i><p>Belum ada file yang dibagikan. Klik kanan file lalu pilih "Bagikan Link".</p></div>';
    return;
  }

  const FILE_ICONS_LOCAL = {
    pdf:         { icon: 'ti-file-type-pdf', color: '#c0392b', bg: 'rgba(192,57,43,0.08)' },
    doc:         { icon: 'ti-file-text',     color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
    foto:        { icon: 'ti-photo',         color: '#2d6a4f', bg: 'rgba(45,106,79,0.08)' },
    video:       { icon: 'ti-video',         color: '#c8602a', bg: 'rgba(200,96,42,0.08)' },
    spreadsheet: { icon: 'ti-table',         color: '#0369a1', bg: 'rgba(3,105,161,0.08)' },
    audio:       { icon: 'ti-music',         color: '#7e22ce', bg: 'rgba(126,34,206,0.08)' },
  };

  list.innerHTML = sharedLinks.map(function(s, i) {
    const iconInfo = FILE_ICONS_LOCAL[s.type] || FILE_ICONS_LOCAL['doc'];
    const created = new Date(s.createdAt);
    const expiry  = new Date(s.createdAt + 7 * 24 * 60 * 60 * 1000);
    const daysLeft = Math.max(0, Math.ceil((expiry - now) / (24 * 60 * 60 * 1000)));
    const dateStr = created.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
      '<div style="background:#fff;border:1px solid rgba(15,14,13,0.08);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(15,14,13,0.06)" class="shared-item">' +
      '<div style="width:40px;height:40px;border-radius:10px;background:' + iconInfo.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
      '<i class="ti ' + iconInfo.icon + '" style="color:' + iconInfo.color + ';font-size:18px"></i></div>' +
      '<div style="flex:1;min-width:0">' +
      '<div style="font-size:13px;font-weight:500;color:#0f0e0d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(s.name) + '</div>' +
      '<div style="font-size:10.5px;color:#9a9693;margin-top:3px;font-family:\'JetBrains Mono\',monospace">Dibagikan ' + dateStr + ' · <span style="color:' + (daysLeft <= 1 ? '#c0392b' : '#92400e') + '">' + daysLeft + ' hari tersisa</span></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-shrink:0">' +
      '<button onclick="copySharedLink(\'' + i + '\')" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:#f7f5f2;border:1px solid rgba(15,14,13,0.14);border-radius:8px;color:#5a5754;font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.15s" onmouseenter="this.style.background=\'#0f0e0d\';this.style.color=\'#fff\';this.style.borderColor=\'transparent\'" onmouseleave="this.style.background=\'#f7f5f2\';this.style.color=\'#5a5754\';this.style.borderColor=\'rgba(15,14,13,0.14)\'">' +
      '<i class="ti ti-copy" style="font-size:13px"></i>Salin</button>' +
      '<button onclick="removeSharedLink(\'' + i + '\')" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:rgba(192,57,43,0.06);border:1px solid rgba(192,57,43,0.15);border-radius:8px;color:#c0392b;font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.15s" onmouseenter="this.style.background=\'rgba(192,57,43,0.12)\'" onmouseleave="this.style.background=\'rgba(192,57,43,0.06)\'">' +
      '<i class="ti ti-trash" style="font-size:13px"></i>Hapus</button>' +
      '</div></div>'
    );
  }).join('');
}

function copySharedLink(idx) {
  sharedLinks = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
  const s = sharedLinks[parseInt(idx)];
  if (!s) return;
  try {
    navigator.clipboard.writeText(s.url);
    showToast('Link berhasil disalin!');
  } catch {
    customPrompt({
      title: 'Salin Link',
      message: 'Salin link berikut secara manual:',
      defaultValue: s.url,
      icon: 'ti-link',
      iconClass: 'prompt',
      confirmText: 'Tutup'
    });
  }
}

function removeSharedLink(idx) {
  sharedLinks = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
  sharedLinks.splice(parseInt(idx), 1);
  localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));
  showToast('Link dihapus dari daftar.');
  renderShared();
}

/* ── FILTER & SEARCH ── */
function setFilter(el, type) {
  document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
  if (el) el.classList.add('active');
  currentFilter = type;
  currentFolderFilter = null;
  currentFolderId = null;
  folderPath = [];
  showOnlyFavorites = false;
  resetFolderUI();
  hideSharedPanel();
  renderFiles();
  renderFolders();
  setTimeout(function() {
    var fileSection = document.getElementById('fileGrid');
    if (fileSection) {
      fileSection.closest('div') && fileSection.closest('div').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 80);
}

function toggleClearBtn() {
  const val = document.getElementById('searchInput').value;
  const btn = document.getElementById('searchClear');
  if (btn) btn.style.display = val.length > 0 ? 'flex' : 'none';
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  const btn = document.getElementById('searchClear');
  if (btn) btn.style.display = 'none';
  resetFolderUI();
  renderFolders();
  renderFiles();
}

function filterFiles() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  if (search.length > 0) {
    currentFolderFilter = null;
    currentFilter = 'semua';
    document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
    var firstChip = document.querySelector('.filter-chip');
    if (firstChip) firstChip.classList.add('active');
    showOnlyFavorites = false;
    renderFoldersFiltered(search);
  } else {
    renderFolders();
  }
  renderFiles();
}

function renderFoldersFiltered(search) {
  const grid = document.getElementById('folderGrid');
  const filtered = allFolders.filter(function(f) {
    return f.name.toLowerCase().includes(search);
  });
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state"><i class="ti ti-folder-off"></i><p>Folder tidak ditemukan.</p></div>';
    document.getElementById('folderCount').textContent = '0';
    return;
  }
  grid.innerHTML = filtered.map(function(f, i) {
    const origIdx = allFolders.indexOf(f);
    const c = FOLDER_COLORS[origIdx % FOLDER_COLORS.length];
    const fileCount = allFiles.filter(function(x) { return x.folder_id === f.id || (!x.folder_id && x.folder_name === f.name); }).length;
    const subCount = allFolders.filter(function(x) { return x.parent_id === f.id; }).length;
    const safeName = escapeHtml(f.name);
    const safeId = escapeAttr(f.id);    const subLabel = subCount > 0 ? subCount + ' folder · ' + fileCount + ' file' : fileCount + ' file';
    return (
      '<div class="folder-wrap" style="animation-delay:' + (i * 0.06) + 's; position:relative;" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '" onclick="openFolderById(\'' + safeId + '\', \'' + escapeAttr(f.name) + '\')" ondragover="folderCardDragOver(event,this)" ondragleave="folderCardDragLeave(event,this)" ondrop="folderCardDrop(event,this)">' +
      '<button class="folder-delete-btn" title="Hapus folder" onclick="event.stopPropagation(); deleteFolderById(\'' + safeId + '\', \'' + escapeAttr(f.name) + '\')">' +
      '<i class="ti ti-trash"></i></button>' +
      '<svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><filter id="fsf' + i + '" x="-5%" y="-5%" width="110%" height="110%">' +
      '<feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="' + c.color1 + '" flood-opacity="0.4"/>' +
      '</filter></defs>' +
      '<path d="M6,20 Q6,14 12,14 L54,14 Q59,14 62,19 L67,26 L132,26 Q137,26 137,31 L137,82 Q137,88 131,88 L9,88 Q3,88 3,82 L3,27 Q3,20 9,20 Z" fill="' + c.color1 + '" filter="url(#fsf' + i + ')"/>' +
      '<path d="M3,28 L3,82 Q3,88 9,88 L131,88 Q137,88 137,82 L137,31 Q137,26 132,26 L6,26 Q3,26 3,28 Z" fill="' + c.color2 + '"/>' +
      '<text x="11" y="48" font-size="10.5" font-weight="700" fill="' + c.text + '" font-family="sans-serif">' + safeName + '</text>' +
      '<text x="11" y="61" font-size="7.5" fill="' + c.sub + '" font-family="sans-serif">' + escapeHtml(subLabel) + '</text>' +
      
      '</svg></div>'
    );
  }).join('');
  document.getElementById('folderCount').textContent = filtered.length;
}

function filterFavorites() {
  currentFolderFilter = null;
  currentFilter = 'semua';
  showOnlyFavorites = true;
  document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
  var firstChip = document.querySelector('.filter-chip');
  if (firstChip) firstChip.classList.add('active');
  resetFolderUI();
  hideSharedPanel();
  showToast('Menampilkan file favorit');
  renderFiles();
  setTimeout(function() {
    var fileGrid = document.getElementById('fileGrid');
    if (fileGrid) fileGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

/* ── NAV ── */
function setNav(el) {
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  el.classList.add('active');
  var label = el.textContent.trim();
  if (label.includes('Dashboard')) {
    currentFolderFilter = null;
    showOnlyFavorites = false;
    currentFilter = 'semua';
    document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
    var firstChip = document.querySelector('.filter-chip');
    if (firstChip) firstChip.classList.add('active');
    resetFolderUI();
    hideSharedPanel();
    renderFiles();
  }
  // Scroll ke file section untuk nav tipe file
  if (label.includes('Dokumen') || label.includes('Foto') || label.includes('Video') || label.includes('Audio')) {
    setTimeout(function() {
      var fileGrid = document.getElementById('fileGrid');
      if (fileGrid) fileGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
}

/* ── MODAL ── */
function openModal() {
  document.getElementById('modal').classList.add('show');
  switchUploadTab('files'); // selalu mulai di tab File
  populateFolderSelect();
  populateFolderDestSelect();
  if (currentFolderId) {
    const sel = document.getElementById('folderSelect');
    if (sel) sel.value = currentFolderId;
    const sel2 = document.getElementById('folderDestSelect');
    if (sel2) sel2.value = currentFolderId;
  }
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  var sf = document.getElementById('selectedFiles');
  if (sf) sf.textContent = '';
  var sfolder = document.getElementById('selectedFolder');
  if (sfolder) sfolder.textContent = '';
  var fs = document.getElementById('folderSelect');
  if (fs) fs.value = '';
  var fds = document.getElementById('folderDestSelect');
  if (fds) fds.value = '';
  var fi = document.getElementById('fileInput');
  if (fi) fi.value = '';
  var foi = document.getElementById('folderInput');
  if (foi) foi.value = '';
  droppedFiles = null;
  droppedFolderFiles = null;
  var dz = document.getElementById('dropZoneFolder');
  if (dz) dz.classList.remove('drag-over');
  var pb = document.getElementById('uploadProgressBox');
  if (pb) pb.remove();
}

function switchUploadTab(tab) {
  var tabFilesContent = document.getElementById('tabFilesContent');
  var tabFolderContent = document.getElementById('tabFolderContent');
  var tabFilesBtn = document.getElementById('tabFiles');
  var tabFolderBtn = document.getElementById('tabFolder');
  var modalTitle = document.getElementById('modalTitle');
  var modalSub = document.getElementById('modalSub');

  if (tab === 'files') {
    tabFilesContent.style.display = '';
    tabFolderContent.style.display = 'none';
    tabFilesBtn.style.background = '#fff';
    tabFilesBtn.style.fontWeight = '600';
    tabFilesBtn.style.color = '#0f0e0d';
    tabFilesBtn.style.boxShadow = '0 1px 4px rgba(15,14,13,0.08)';
    tabFolderBtn.style.background = 'transparent';
    tabFolderBtn.style.fontWeight = '500';
    tabFolderBtn.style.color = '#9a9693';
    tabFolderBtn.style.boxShadow = 'none';
    if (modalTitle) modalTitle.textContent = 'Upload File';
    if (modalSub) modalSub.textContent = 'Pilih file dan tentukan kategori folder tujuan.';
  } else {
    tabFilesContent.style.display = 'none';
    tabFolderContent.style.display = '';
    tabFolderBtn.style.background = '#fff';
    tabFolderBtn.style.fontWeight = '600';
    tabFolderBtn.style.color = '#0f0e0d';
    tabFolderBtn.style.boxShadow = '0 1px 4px rgba(15,14,13,0.08)';
    tabFilesBtn.style.background = 'transparent';
    tabFilesBtn.style.fontWeight = '500';
    tabFilesBtn.style.color = '#9a9693';
    tabFilesBtn.style.boxShadow = 'none';
    if (modalTitle) modalTitle.textContent = 'Upload Folder';
    if (modalSub) modalSub.textContent = 'Pilih folder dari komputer untuk diupload.';
  }
}

function doUpload() {
  var tabFolderContent = document.getElementById('tabFolderContent');
  if (tabFolderContent && tabFolderContent.style.display !== 'none') {
    uploadFolderFiles();
  } else {
    uploadFile();
  }
}

/* ── ADD FOLDER ── */
async function addFolder() {
  const parentLabel = currentFolderId
    ? 'di dalam "' + (folderPath[folderPath.length - 1] ? folderPath[folderPath.length - 1].name : '') + '"'
    : 'di root';
  const name = await customPrompt({
    title: 'Buat Folder Baru',
    message: 'Masukkan nama folder baru ' + parentLabel + ':',
    placeholder: 'Contoh: Matematika',
    icon: 'ti-folder-plus',
    iconClass: 'prompt',
    confirmText: 'Buat Folder'
  });
  if (!name || !name.trim()) return;

  // Cek duplikat hanya dalam parent yang sama
  const siblings = allFolders.filter(function(f) { return (f.parent_id || null) === currentFolderId; });
  if (siblings.some(function(f) { return f.name.toLowerCase() === name.trim().toLowerCase(); })) {
    showToast('Folder "' + name.trim() + '" sudah ada di sini!');
    return;
  }

  const { data: authData } = await sb.auth.getSession();
  const uid = authData && authData.session ? authData.session.user.id : null;
  const insertObj = { name: name.trim(), user_id: uid };
  if (currentFolderId) insertObj.parent_id = currentFolderId;

  const { error } = await sb.from('folders').insert(insertObj);
  if (error) { showToast('Gagal buat folder: ' + error.message); return; }
  await loadFolders();
  showToast('📁 Folder "' + name.trim() + '" berhasil dibuat!');
}

/* ── DELETE FOLDER (by ID) ── */
function deleteFolderByName(btn) {
  // Legacy - tidak dipakai lagi, fallback
  const folderWrap = btn.closest('.folder-wrap');
  if (!folderWrap) return;
  const fid = folderWrap.dataset.folderId;
  const fname = folderWrap.dataset.folderName;
  if (fid) deleteFolderById(fid, fname);
}

/* ── RENAME FOLDER (double click) ── */
function startFolderRename(folderId, folderName, el) {
  // Cari elemen SVG text nama folder
  const svg = el.querySelector('svg');
  if (!svg) return;

  // Buat input overlay di atas folder card
  const rect = el.getBoundingClientRect();
  const input = document.createElement('input');
  input.type = 'text';
  input.value = folderName;
  input.style.cssText = `
    position: fixed;
    left: ${rect.left + 10}px;
    top: ${rect.top + rect.height * 0.45}px;
    width: ${Math.min(rect.width - 20, 160)}px;
    padding: 4px 8px;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    border: 2px solid var(--accent, #c8602a);
    border-radius: 6px;
    background: #fff;
    color: #0f0e0d;
    z-index: 9999;
    outline: none;
    box-shadow: 0 4px 16px rgba(200,96,42,0.25);
  `;

  document.body.appendChild(input);
  input.focus();
  input.select();

  async function doRename() {
    const newName = input.value.trim();
    input.remove();

    if (!newName || newName === folderName) return;

    // Cek duplikat dalam parent yang sama
    const folder = allFolders.find(function(f) { return f.id === folderId; });
    const parentId = folder ? (folder.parent_id || null) : null;
    const siblings = allFolders.filter(function(f) { return (f.parent_id || null) === parentId && f.id !== folderId; });
    if (siblings.some(function(f) { return f.name.toLowerCase() === newName.toLowerCase(); })) {
      showToast('Nama folder "' + newName + '" sudah ada!');
      return;
    }

    showToast('Mengubah nama folder...');
    const { error } = await sb.from('folders').update({ name: newName }).eq('id', folderId);
    if (error) { showToast('Gagal rename: ' + error.message); return; }

    // Update nama di allFolders lokal
    const idx = allFolders.findIndex(function(f) { return f.id === folderId; });
    if (idx !== -1) allFolders[idx].name = newName;

    // Update breadcrumb jika folder ini sedang dibuka
    const bcIdx = folderPath.findIndex(function(c) { return c.id === folderId; });
    if (bcIdx !== -1) folderPath[bcIdx].name = newName;

    showToast('📁 Folder berhasil diubah ke "' + newName + '"!');
    await loadFolders();
  }

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') doRename();
    if (e.key === 'Escape') input.remove();
  });

  input.addEventListener('blur', function() {
    // Delay agar enter bisa diproses dulu
    setTimeout(function() {
      if (document.body.contains(input)) doRename();
    }, 150);
  });
}
async function deleteFolderById(folderId, folderName) {
  // Kumpulkan semua subfolder secara rekursif
  function collectSubIds(pid) {
    const children = allFolders.filter(function(f) { return f.parent_id === pid; });
    let ids = children.map(function(f) { return f.id; });
    children.forEach(function(f) { ids = ids.concat(collectSubIds(f.id)); });
    return ids;
  }
  const allSubIds = [folderId].concat(collectSubIds(folderId));

  // Hitung total file di semua subfolder
  const filesInside = allFiles.filter(function(f) {
    return allSubIds.includes(f.folder_id) || allSubIds.some(function(id) {
      const folder = allFolders.find(function(x) { return x.id === id; });
      return folder && f.folder_name === folder.name;
    });
  });

  const msg = filesInside.length > 0
    ? 'Folder "' + folderName + '" berisi ' + filesInside.length + ' file' + (allSubIds.length > 1 ? ' dan ' + (allSubIds.length - 1) + ' subfolder' : '') + '. Semua akan dihapus permanen.'
    : 'Yakin ingin menghapus folder "' + folderName + '"' + (allSubIds.length > 1 ? ' beserta ' + (allSubIds.length - 1) + ' subfoldernya' : '') + '?';

  const confirmed = await customConfirm({
    title: 'Hapus Folder',
    message: msg,
    icon: 'ti-trash',
    confirmText: 'Ya, Hapus Semua',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) return;

  showToast('Menghapus folder...');
  // Hapus semua file di dalamnya
  for (const file of filesInside) {
    const path = file.storage_path || (file.folder_name + '/' + file.name);
    await sb.storage.from('user-files').remove([path]);
    await sb.from('files').delete().eq('id', file.id);
  }
  // Hapus folder (cascade akan hapus subfolder jika ada foreign key, atau manual)
  await sb.from('folders').delete().in('id', allSubIds);

  if (currentFolderId && allSubIds.includes(currentFolderId)) {
    currentFolderId = null;
    currentFolderFilter = null;
    folderPath = [];
    updateFileSectionTitle();
  }
  showToast('Folder "' + folderName + '" berhasil dihapus!');
  await loadAll();
}

/* ── CONTEXT MENU ── */
function showCtx(e, id) {
  e.preventDefault();
  e.stopPropagation();
  ctxTarget = String(id);
  const menu = document.getElementById('ctxMenu');
  const menuH = 200;
  const menuW = 190;
  const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
  const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
  menu.style.top  = y + 'px';
  menu.style.left = x + 'px';
  menu.classList.add('show');
}

document.addEventListener('click', function() {
  document.getElementById('ctxMenu').classList.remove('show');
});

/* ── DOWNLOAD ── */
async function downloadFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  document.getElementById('ctxMenu').classList.remove('show');
  showToast('Menyiapkan file download...');
  const path = file.storage_path || (file.folder_name + '/' + file.name);
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

/* ── SHARE ── */
async function shareFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  document.getElementById('ctxMenu').classList.remove('show');
  const path = file.storage_path || (file.folder_name + '/' + file.name);
  const { data, error } = await sb.storage.from('user-files').createSignedUrl(path, 604800);
  if (error) { showToast('Gagal membuat link: ' + error.message); return; }

  // Simpan ke localStorage untuk panel Dibagikan
  let saved = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
  // Hindari duplikat berdasarkan file id
  saved = saved.filter(function(s) { return s.fileId !== String(file.id); });
  saved.unshift({ fileId: String(file.id), name: file.name, url: data.signedUrl, type: file.type || 'doc', folder: file.folder_name || '', createdAt: Date.now() });
  if (saved.length > 50) saved = saved.slice(0, 50);
  localStorage.setItem('myStorageShared', JSON.stringify(saved));

  // Update badge
  if (document.getElementById('badgeShared')) document.getElementById('badgeShared').textContent = saved.length;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = saved.length;

  try {
    await navigator.clipboard.writeText(data.signedUrl);
    showToast('Link berhasil disalin ke clipboard!');
  } catch (clipErr) {
    customPrompt({
      title: 'Salin Link Berbagi',
      message: 'Salin link berikut secara manual (Ctrl+C):',
      defaultValue: data.signedUrl,
      icon: 'ti-link',
      iconClass: 'prompt',
      confirmText: 'Tutup'
    });
    showToast('Salin link dari dialog ya!');
  }
}

/* ── RENAME ── */
async function renameFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  document.getElementById('ctxMenu').classList.remove('show');
  const newName = await customPrompt({
    title: 'Rename File',
    message: 'Masukkan nama baru untuk file ini:',
    defaultValue: file.name,
    placeholder: 'Nama file baru...',
    icon: 'ti-edit',
    iconClass: 'prompt',
    confirmText: 'Ubah Nama'
  });
  if (!newName || newName.trim() === '' || newName.trim() === file.name) return;
  showToast('Mengubah nama file...');
  const oldPath = file.storage_path || (file.folder_name + '/' + file.name);
  const newPath = file.folder_name + '/' + Date.now() + '_' + newName.trim();
  const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
  if (moveErr) { showToast('Gagal mengubah di Storage: ' + moveErr.message); return; }
  const { error: dbErr } = await sb.from('files').update({ name: newName.trim(), storage_path: newPath }).eq('id', file.id);
  if (dbErr) { showToast('Gagal mengubah di Database: ' + dbErr.message); return; }
  showToast('Nama file berhasil diubah!');
  await loadFiles();
  renderStats();
}

/* ── MOVE FILE ── */
function moveFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  document.getElementById('ctxMenu').classList.remove('show');

  const sel = document.getElementById('moveFolderSelect');
  function buildMoveOptions(parentId, indent) {
    return allFolders
      .filter(function(f) { return (f.parent_id || null) === parentId && f.id !== (file.folder_id || null) && f.name !== file.folder_name; })
      .map(function(f) {
        return '<option value="' + escapeAttr(f.id) + '">' + indent + escapeHtml(f.name) + '</option>' +
          buildMoveOptions(f.id, indent + '　');
      }).join('');
  }
  sel.innerHTML = '<option value="">Pilih folder tujuan...</option>' + buildMoveOptions(null, '');

  const sub = document.getElementById('moveModalSub');
  if (sub) sub.textContent = 'Pindahkan "' + file.name + '" ke:';

  document.getElementById('moveModal').classList.add('show');
}

function closeMoveModal() {
  document.getElementById('moveModal').classList.remove('show');
  document.getElementById('moveFolderSelect').value = '';
}

async function confirmMoveFile() {
  const targetFolderId = document.getElementById('moveFolderSelect').value;
  if (!targetFolderId) { showToast('Pilih folder tujuan dulu!'); return; }
  const targetFolderObj = allFolders.find(function(f) { return f.id === targetFolderId; });
  const targetFolder = targetFolderObj ? targetFolderObj.name : targetFolderId;

  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;

  const btn = document.querySelector('#moveModal .btn-confirm');
  if (btn) { btn.disabled = true; btn.textContent = 'Memindahkan...'; }

  const oldPath = file.storage_path || (file.folder_name + '/' + file.name);
  const { data: sd2 } = await sb.auth.getSession();
  const uid2 = sd2 && sd2.session ? sd2.session.user.id : 'unknown';
  const newPath = uid2 + '/' + targetFolderId + '/' + Date.now() + '_' + file.name;

  const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
  if (moveErr) {
    showToast('Gagal memindahkan file: ' + moveErr.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Pindahkan'; }
    return;
  }

  const { error: dbErr } = await sb.from('files').update({
    folder_name: targetFolder,
    folder_id: targetFolderId,
    storage_path: newPath
  }).eq('id', file.id);

  if (dbErr) {
    showToast('Gagal update database: ' + dbErr.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Pindahkan'; }
    return;
  }

  closeMoveModal();
  showToast('File berhasil dipindahkan ke "' + targetFolder + '"!');
  ctxTarget = null;
  if (btn) { btn.disabled = false; btn.textContent = 'Pindahkan'; }
  await loadAll();
}

/* ── FAVORIT ── */
function toggleFavorite() {
  if (!ctxTarget) return;
  let favs = getFavs();
  if (favs.includes(ctxTarget)) {
    favs = favs.filter(function(id) { return id !== ctxTarget; });
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

/* ── DELETE FILE (with Undo) ── */
async function deleteFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  const confirmed = await customConfirm({
    title: 'Hapus File',
    message: 'Hapus "' + file.name + '"? Anda punya 5 detik untuk membatalkan.',
    icon: 'ti-trash',
    confirmText: 'Ya, Hapus',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) { ctxTarget = null; return; }
  document.getElementById('ctxMenu').classList.remove('show');

  const fileId = ctxTarget;
  const pathToDelete = file.storage_path || (file.folder_name + '/' + file.name);

  // Hapus dari DB segera (bisa di-restore dengan re-insert, tapi lebih mudah: hapus storage tertunda)
  const { error } = await sb.from('files').delete().eq('id', fileId);
  if (error) { showToast('Gagal hapus: ' + error.message); ctxTarget = null; return; }

  // Hapus dari favs lokal
  let favs = getFavs();
  if (favs.includes(fileId)) {
    favs = favs.filter(function(id) { return id !== fileId; });
    localStorage.setItem('myStorageFavs', JSON.stringify(favs));
  }

  ctxTarget = null;
  await loadFiles();
  renderStats();

  // Hapus storage setelah 5 detik, kecuali di-undo
  let undone = false;
  let deletionTimer = setTimeout(async function() {
    if (!undone) {
      await sb.storage.from('user-files').remove([pathToDelete]);
    }
  }, 5000);

  showToast('\uD83D\uDDD1\uFE0F "' + file.name + '" dihapus.', {
    icon: 'ti-trash',
    duration: 5000,
    undoLabel: 'Undo',
    onUndo: async function() {
      undone = true;
      clearTimeout(deletionTimer);
      // Re-insert file ke DB
      const { error: reErr } = await sb.from('files').insert({
        id: file.id,
        name: file.name,
        folder_name: file.folder_name,
        folder_id: file.folder_id,
        type: file.type,
        size: file.size,
        icon: file.icon,
        icon_color: file.icon_color,
        icon_bg: file.icon_bg,
        storage_path: file.storage_path,
        user_id: file.user_id,
        created_at: file.created_at
      });
      if (reErr) {
        showToast('Gagal undo: ' + reErr.message);
        return;
      }
      // Restore favs jika perlu
      if (favs.indexOf(fileId) === -1 && JSON.parse(localStorage.getItem('myStorageFavs') || '[]').indexOf(fileId) !== -1) {
        // sudah dihapus dari favs, jangan restore otomatis
      }
      showToast('\u2705 File "' + file.name + '" berhasil dikembalikan!');
      await loadFiles();
      renderStats();
    }
  });
}

/* ── STORAGE NOTIFICATION CHECK ── */
function checkStorageNotif(usedBytes) {
  const s = JSON.parse(localStorage.getItem('myStorageNotifSettings') || '{}');
  if (s.inApp === false) return;

  const threshold = s.threshold || 80;
  const totalBytes = 1024 * 1024 * 1024;
  const pct = (usedBytes / totalBytes) * 100;

  const lastShown = parseInt(localStorage.getItem('myStorageNotifLastShown') || '0');
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  // Jangan spam — tampilkan maks sekali per jam
  if (now - lastShown < ONE_HOUR) return;

  if (pct >= 90 && s.critical !== false) {
    showToast('🔴 Storage hampir penuh! ' + pct.toFixed(0) + '% terpakai. Segera hapus file.');
    localStorage.setItem('myStorageNotifLastShown', now.toString());
  } else if (pct >= threshold) {
    showToast('⚠️ Storage mencapai ' + pct.toFixed(0) + '% (batas: ' + threshold + '%)');
    localStorage.setItem('myStorageNotifLastShown', now.toString());
  }
}

/* ── TOAST ── */
function showToast(msg, opts) {
  // opts: { undoLabel, onUndo, duration, icon }
  const t = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const undoEl = document.getElementById('toastUndo');
  const iconEl = document.getElementById('toastIcon');

  msgEl.textContent = msg;

  // Icon
  if (iconEl) {
    iconEl.className = 'ti ' + ((opts && opts.icon) ? opts.icon : 'ti-check');
    iconEl.style.color = (opts && opts.icon === 'ti-trash') ? '#f87171' : '#4ade80';
  }

  // Undo button
  if (undoEl) {
    if (opts && opts.onUndo) {
      undoEl.style.display = 'flex';
      undoEl.textContent = opts.undoLabel || 'Undo';
      undoEl.onclick = function() {
        clearTimeout(t._timer);
        clearInterval(t._countdown);
        t.classList.remove('show');
        opts.onUndo();
      };
    } else {
      undoEl.style.display = 'none';
      undoEl.onclick = null;
    }
  }

  t.classList.add('show');
  clearTimeout(t._timer);
  clearInterval(t._countdown);

  const duration = (opts && opts.duration) || 2800;
  t._timer = setTimeout(function() { t.classList.remove('show'); }, duration);
}

/* ── UPLOAD FILE ── */
async function uploadFile() {
  const folderId = document.getElementById('folderSelect').value;
  if (!folderId) { showToast('Pilih folder tujuan dulu!'); return; }
  // Cari nama folder berdasarkan ID
  const folderObj = allFolders.find(function(f) { return f.id === folderId; });
  const folder = folderObj ? folderObj.name : folderId; // fallback ke value lama jika nama

  const fileInput = document.getElementById('fileInput');
  const files = (droppedFiles && droppedFiles.length > 0) ? droppedFiles : fileInput.files;
  if (!files || files.length === 0) { showToast('Pilih file dulu!'); return; }

  // ── Validasi ukuran file ──
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB per file
  const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1 GB total storage

  // Hitung sisa storage yang tersedia
  let usedBytes = 0;
  allFiles.forEach(function(f) {
    if (f.size) {
      const num = parseFloat(f.size);
      if (f.size.includes('MB')) usedBytes += num * 1024 * 1024;
      else if (f.size.includes('KB')) usedBytes += num * 1024;
      else if (f.size.includes('GB')) usedBytes += num * 1024 * 1024 * 1024;
    }
  });
  const remainingBytes = MAX_TOTAL_SIZE - usedBytes;

  // Cek setiap file
  let tooBigFiles = [];
  let totalNewBytes = 0;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    totalNewBytes += f.size;
    if (f.size > MAX_FILE_SIZE) {
      tooBigFiles.push(f.name + ' (' + (f.size / (1024*1024)).toFixed(1) + ' MB)');
    }
  }
  if (tooBigFiles.length > 0) {
    showToast('File terlalu besar (maks 100 MB): ' + tooBigFiles[0]);
    return;
  }
  if (totalNewBytes > remainingBytes) {
    const remMB = (remainingBytes / (1024*1024)).toFixed(0);
    const newMB = (totalNewBytes / (1024*1024)).toFixed(1);
    showToast('Storage tidak cukup! Perlu ' + newMB + ' MB, sisa ' + remMB + ' MB.');
    return;
  }

  const btnConfirm = document.querySelector('.btn-confirm');
  const btnCancel  = document.querySelector('.btn-cancel');
  btnConfirm.disabled = true;
  btnCancel.disabled  = true;

  // Buat progress UI di dalam modal
  let progressBox = document.getElementById('uploadProgressBox');
  if (!progressBox) {
    progressBox = document.createElement('div');
    progressBox.id = 'uploadProgressBox';
    progressBox.style.cssText = 'margin-bottom:14px';
    document.getElementById('selectedFiles').after(progressBox);
  }

  let successCount = 0;
  let failCount = 0;
  const total = files.length;

  const { data: authData } = await sb.auth.getSession();
  const uid = authData && authData.session ? authData.session.user.id : null;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const pct = Math.round((i / total) * 100);

    progressBox.innerHTML =
      '<div style="font-size:12px;color:#9a9693;margin-bottom:6px">Mengupload ' + (i + 1) + ' dari ' + total + ': <span style="color:#0f0e0d">' + file.name + '</span></div>' +
      '<div style="background:rgba(15,14,13,0.06);border-radius:99px;height:5px;overflow:hidden">' +
        '<div style="height:100%;width:' + pct + '%;background:#c8602a;border-radius:99px;transition:width 0.3s ease"></div>' +
      '</div>' +
      '<div style="font-size:11px;color:#9a9693;margin-top:5px;text-align:right">' + pct + '%</div>';

    btnConfirm.textContent = 'Mengupload ' + (i+1) + '/' + total;

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

    const filePath = (uid || 'unknown') + '/' + folderId + '/' + Date.now() + '_' + file.name;
    const { error: uploadError } = await sb.storage.from('user-files').upload(filePath, file);
    if (uploadError) { console.error('Upload error:', uploadError.message); failCount++; continue; }

    const { error: insertError } = await sb.from('files').insert({
      name: file.name,
      folder_name: folder,
      folder_id: folderId,
      type: type,
      size: sizeStr,
      icon: iconInfo.icon,
      icon_color: iconInfo.iconColor,
      icon_bg: iconInfo.iconBg,
      storage_path: filePath,
      user_id: uid
    });
    if (insertError) {
      console.error('Insert error:', insertError.message);
      await sb.storage.from('user-files').remove([filePath]);
      failCount++;
    }
    else successCount++;
  }

  // Progress 100%
  progressBox.innerHTML =
    '<div style="font-size:12px;color:#9a9693;margin-bottom:6px">Selesai!</div>' +
    '<div style="background:rgba(15,14,13,0.06);border-radius:99px;height:5px;overflow:hidden">' +
      '<div style="height:100%;width:100%;background:#2d6a4f;border-radius:99px"></div>' +
    '</div>' +
    '<div style="font-size:11px;color:#2d6a4f;margin-top:5px;text-align:right">100%</div>';

  btnConfirm.disabled = false;
  btnCancel.disabled  = false;
  btnConfirm.textContent = 'Upload';

  setTimeout(() => { closeModal(); }, 600);

  if (failCount > 0 && successCount > 0) showToast(successCount + ' file berhasil, ' + failCount + ' gagal diupload.');
  else if (failCount > 0 && successCount === 0) showToast('Gagal mengupload ' + failCount + ' file. Cek koneksi atau storage.');
  else showToast('File berhasil diupload ke ' + folder + '!');

  await loadFiles();
  renderStats();
}

function handleFileSelect(input) {
  droppedFiles = null;
  const filesArr = Array.from(input.files);
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  const el = document.getElementById('selectedFiles');

  const warnings = filesArr.filter(function(f) { return f.size > MAX_FILE_SIZE; });
  const totalSize = filesArr.reduce(function(sum, f) { return sum + f.size; }, 0);
  const totalStr = totalSize > 1024*1024
    ? (totalSize/(1024*1024)).toFixed(1) + ' MB'
    : (totalSize/1024).toFixed(0) + ' KB';

  if (warnings.length > 0) {
    el.innerHTML = '<span style="color:#f87171">⚠️ ' + warnings[0].name + ' melebihi batas 100 MB!</span>';
  } else if (filesArr.length > 0) {
    const names = filesArr.map(function(f) { return f.name; }).join(', ');
    el.innerHTML = '📎 ' + escapeHtml(names) + ' <span style="color:#9a9693">(' + totalStr + ')</span>';
  } else {
    el.textContent = '';
  }
}

function handleFolderSelect(input) {
  droppedFiles = null;
  droppedFolderFiles = null;
  const filesArr = Array.from(input.files);
  showFolderInfo(filesArr);
}

function showFolderInfo(filesArr) {
  const el = document.getElementById('selectedFolder');
  if (filesArr.length > 0) {
    const totalSize = filesArr.reduce(function(sum, f) { return sum + f.size; }, 0);
    const totalStr = totalSize > 1024*1024
      ? (totalSize/(1024*1024)).toFixed(1) + ' MB'
      : (totalSize/1024).toFixed(0) + ' KB';
    const folderName = filesArr[0].webkitRelativePath
      ? filesArr[0].webkitRelativePath.split('/')[0]
      : 'Folder';
    const subFolders = new Set(filesArr.map(function(f) {
      const parts = f.webkitRelativePath ? f.webkitRelativePath.split('/') : [];
      return parts.length > 2 ? parts[1] : null;
    }).filter(Boolean)).size;
    el.innerHTML = '📁 <strong>' + escapeHtml(folderName) + '</strong> — ' + filesArr.length + ' file'
      + (subFolders > 0 ? ', ' + subFolders + ' sub-folder' : '')
      + ' <span style="color:#9a9693">(' + totalStr + ')</span>';
  } else {
    el.textContent = '';
  }
}

function handleFolderDragOver(e) {
  e.preventDefault();
  e.stopPropagation();
  var dz = document.getElementById('dropZoneFolder');
  if (dz) dz.classList.add('drag-over');
}

function handleFolderDragLeave(e) {
  e.preventDefault();
  e.stopPropagation();
  var dz = document.getElementById('dropZoneFolder');
  if (dz) dz.classList.remove('drag-over');
}

async function handleFolderDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  var dz = document.getElementById('dropZoneFolder');
  if (dz) dz.classList.remove('drag-over');

  var items = e.dataTransfer.items;
  if (!items || items.length === 0) return;

  var droppedEntryFiles = [];
  var promises = [];

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.kind === 'file') {
      var entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
      if (entry && entry.isDirectory) {
        promises.push(readDirectoryEntries(entry, entry.name, allFiles));
      } else if (entry && entry.isFile) {
        promises.push(new Promise(function(resolve) {
          entry.file(function(file) {
            // Simulasikan webkitRelativePath
            Object.defineProperty(file, 'webkitRelativePath', { value: entry.name + '/' + file.name, writable: false });
            allFiles.push(file);
            resolve();
          });
        }));
      }
    }
  }

  await Promise.all(promises);

    if (droppedEntryFiles.length === 0) {
    showToast('Drop folder, bukan file biasa!');
    return;
  }

    droppedFolderFiles = droppedEntryFiles;
  showFolderInfo(droppedEntryFiles);
  }

  function readDirectoryEntries(dirEntry, path, fileList) {
  return new Promise(function(resolve) {
    var reader = dirEntry.createReader();
    var allEntries = [];
    function readBatch() {
      reader.readEntries(function(entries) {
        if (entries.length === 0) {
          var promises = allEntries.map(function(entry) {
            if (entry.isFile) {
              return new Promise(function(res) {
                entry.file(function(file) {
                  try {
                    Object.defineProperty(file, 'webkitRelativePath', {
                      value: path + '/' + entry.name,
                      writable: false
                    });
                  } catch(e) {}
                  fileList.push(file);
                  res();
                });
              });
            } else if (entry.isDirectory) {
              return readDirectoryEntries(entry, path + '/' + entry.name, fileList);
            }
            return Promise.resolve();
          });
          Promise.all(promises).then(resolve);
        } else {
          allEntries = allEntries.concat(Array.from(entries));
          readBatch();
        }
      });
    }
    readBatch();
  });
}

/**
 * Resolve (atau buat jika belum ada) rantai folder berdasarkan array nama.
 * parentId = null berarti root.
 * Mengembalikan id folder terakhir, atau null jika gagal.
 * Cache disimpan di folderIdCache agar tidak query berulang untuk path yang sama.
 */
var folderIdCache = {};
async function resolveOrCreateFolderChain(parts, rootParentId, userId) {
  var parentId = rootParentId || null;
  for (var p = 0; p < parts.length; p++) {
    var name = parts[p];
    var cacheKey = (parentId || 'root') + '::' + name;
    if (folderIdCache[cacheKey]) {
      parentId = folderIdCache[cacheKey];
      continue;
    }

    // Cari di DB
    var q = sb.from('folders').select('id').eq('name', name);
    if (parentId) q = q.eq('parent_id', parentId);
    else          q = q.is('parent_id', null);
    var { data: existing } = await q.maybeSingle();

    if (existing) {
      folderIdCache[cacheKey] = existing.id;
      // Tambah ke allFolders lokal jika belum ada
      if (!allFolders.find(function(f) { return f.id === existing.id; })) {
        allFolders.push({ id: existing.id, name: name, parent_id: parentId, user_id: userId });
      }
      parentId = existing.id;
    } else {
      // Buat folder baru
      var obj = { name: name, user_id: userId };
      if (parentId) obj.parent_id = parentId;
      var { data: nf, error: ce } = await sb.from('folders').insert(obj).select('id').single();
      if (ce || !nf) { console.error('Gagal buat folder:', name, ce && ce.message); return null; }
      folderIdCache[cacheKey] = nf.id;
      allFolders.push({ id: nf.id, name: name, parent_id: parentId, user_id: userId });
      parentId = nf.id;
    }
  }
  return parentId;
}

async function uploadFolderFiles() {
  var filesArr = droppedFolderFiles;
  if (!filesArr || filesArr.length === 0) {
    var folderInput = document.getElementById('folderInput');
    if (folderInput && folderInput.files.length > 0) {
      filesArr = Array.from(folderInput.files);
    }
  }
  if (!filesArr || filesArr.length === 0) {
    showToast('Pilih folder dulu!');
    return;
  }

  var destId = document.getElementById('folderDestSelect').value || null;
  var destObj = allFolders.find(function(f) { return f.id === destId; });
  var destName = destObj ? destObj.name : null;

  var btnConfirm = document.getElementById('uploadBtn');
  var btnCancel  = document.querySelector('#modal .btn-cancel');
  if (btnConfirm) { btnConfirm.disabled = true; btnConfirm.textContent = 'Mengupload...'; }
  if (btnCancel)    btnCancel.disabled = true;

  // Reset folder cache tiap upload baru
  folderIdCache = {};

  // Auth session (ambil sekali di luar loop)
  var { data: sd } = await sb.auth.getSession();
  var userId = sd && sd.session ? sd.session.user.id : 'unknown';

  var successCount = 0;
  var failCount = 0;
  var total = filesArr.length;

  for (var i = 0; i < filesArr.length; i++) {
    var file = filesArr[i];
    var relPath = file.webkitRelativePath || file.name;

    // relPath contoh: "NamaFolder/SubFolder/file.pdf"
    // Pisahkan menjadi bagian folder dan nama file
    var pathParts = relPath.replace(/\\/g, '/').split('/');
    var fileName  = pathParts[pathParts.length - 1];
    var folderParts = pathParts.slice(0, pathParts.length - 1);

    // Skip folder sistem & file tersembunyi
    const SKIP_FOLDERS = [
      'build','node_modules','.git','.gradle','intermediates',
      'out','debug','release','tmp','.idea','.dart_tool',
      'generated','obj','bin','.vs','__pycache__','.cache'
    ];
    const hasSkipFolder = folderParts.some(function(p) {
      return SKIP_FOLDERS.includes(p.toLowerCase()) || p.startsWith('.');
    });
    if (hasSkipFolder || fileName.startsWith('.')) { failCount++; continue; }

    if (btnConfirm) btnConfirm.textContent = 'Upload ' + (i+1) + '/' + total;

    try {
      // Resolve chain folder: destId (root tujuan) → folderParts[0] → folderParts[1] → dst
      var targetFolderId = destId;
      var targetFolderName = destName;

      if (folderParts.length > 0) {
        targetFolderId = await resolveOrCreateFolderChain(folderParts, destId, userId);
        if (!targetFolderId) { failCount++; continue; }
        targetFolderName = folderParts[folderParts.length - 1];
      }

      // Storage path unik
      var storagePath = userId + '/' + (targetFolderId || 'root') + '/' + Date.now() + '_' + fileName;

      var { error: upErr } = await sb.storage.from('user-files').upload(storagePath, file, { upsert: true });
      if (upErr) { console.error('Storage upload error:', upErr.message); failCount++; continue; }

      // Determine file type
      var ext = fileName.split('.').pop().toLowerCase();
      var type = 'doc';
      if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) type = 'foto';
      else if (['mp4','mov','avi','mkv','webm'].includes(ext)) type = 'video';
      else if (ext === 'pdf') type = 'pdf';
      else if (['xlsx','csv','xls'].includes(ext)) type = 'spreadsheet';
      else if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) type = 'audio';

      var iconInfo = FILE_ICONS[type] || FILE_ICONS['doc'];
      var sizeStr = file.size > 1024*1024
        ? (file.size/(1024*1024)).toFixed(1)+' MB'
        : (file.size/1024).toFixed(0)+' KB';

      var { error: insertErr } = await sb.from('files').insert({
        name: fileName,
        folder_name: targetFolderName,
        folder_id: targetFolderId || null,
        type: type,
        size: sizeStr,
        icon: iconInfo.icon,
        icon_color: iconInfo.iconColor,
        icon_bg: iconInfo.iconBg,
        storage_path: storagePath,
        user_id: userId
      });
      if (insertErr) { console.error('DB insert error:', insertErr.message); failCount++; }
      else successCount++;
    } catch(e) { console.error('Upload error:', e); failCount++; }
  }

  if (btnConfirm) { btnConfirm.disabled = false; btnConfirm.textContent = 'Upload'; }
  if (btnCancel)    btnCancel.disabled = false;
  droppedFolderFiles = null;

  setTimeout(function() { closeModal(); }, 400);
  await loadFolders(); // reload folder dulu agar subfolder baru tampil
  await loadFiles();
  renderStats();

  if (failCount > 0 && successCount > 0) showToast(successCount + ' file berhasil, ' + failCount + ' gagal.');
  else if (failCount > 0) showToast('Gagal upload ' + failCount + ' file. Cek konsol untuk detail.');
  else showToast('Folder berhasil diupload ke ' + (destName || 'Dashboard') + '!');
}

/* ── FILE CARD DRAG (seret file ke folder) ── */
let draggingFileId = null;

function fileCardDragStart(e, fileId) {
  draggingFileId = fileId;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/mystorage-fileid', fileId);
  // Ghost styling
  setTimeout(function() {
    var el = document.querySelector('[data-file-id="' + fileId + '"]');
    if (el) el.classList.add('file-card-dragging');
  }, 0);
}

function fileCardDragEnd(e, el) {
  draggingFileId = null;
  if (el) el.classList.remove('file-card-dragging');
  // Clear all folder highlights
  document.querySelectorAll('.folder-drop-target').forEach(function(f) {
    f.classList.remove('folder-drop-target');
  });
}

/* ── FOLDER CARD DRAG & DROP ── */
function folderCardDragOver(e, el) {
  e.preventDefault();
  e.stopPropagation();
  e.dataTransfer.dropEffect = draggingFileId ? 'move' : 'copy';
  el.classList.add('folder-drop-target');
}

function folderCardDragLeave(e, el) {
  if (!el.contains(e.relatedTarget)) {
    el.classList.remove('folder-drop-target');
  }
}

async function folderCardDrop(e, el) {
  e.preventDefault();
  e.stopPropagation();
  el.classList.remove('folder-drop-target');

  var targetFolderId = el.getAttribute('data-folder-id');
  var targetFolderName = el.getAttribute('data-folder-name');
  if (!targetFolderId) return;

  // ── CASE 1: Drop file card dari dalam app ──
  var internalFileId = e.dataTransfer.getData('text/mystorage-fileid') || draggingFileId;
  if (internalFileId) {
    draggingFileId = null;
    document.querySelectorAll('.file-card-dragging').forEach(function(c) { c.classList.remove('file-card-dragging'); });

    var file = allFiles.find(function(f) { return String(f.id) === String(internalFileId); });
    if (!file) { showToast('File tidak ditemukan.'); return; }
    if (file.folder_id === targetFolderId) { showToast('File sudah ada di folder ini.'); return; }

    showToast('Memindahkan ke ' + targetFolderName + '...');
    const oldPath = file.storage_path || (file.folder_name + '/' + file.name);
    const newPath = targetFolderName + '/' + Date.now() + '_' + file.name;

    const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
    if (moveErr) { showToast('Gagal pindah storage: ' + moveErr.message); return; }

    const { error: dbErr } = await sb.from('files').update({
      folder_name: targetFolderName,
      folder_id: targetFolderId,
      storage_path: newPath
    }).eq('id', file.id);

    if (dbErr) { showToast('Gagal update DB: ' + dbErr.message); return; }
    showToast('\uD83D\uDCC1 "' + file.name + '" dipindahkan ke ' + targetFolderName + '!');
    await loadAll();
    return;
  }

  // ── CASE 2: Drop file dari OS (upload langsung) ──
  var files = e.dataTransfer.files;
  if (!files || files.length === 0) return;

  var { data: sd } = await sb.auth.getSession();
  var userId = sd && sd.session ? sd.session.user.id : 'unknown';
  var successCount = 0;
  var failCount = 0;

  showToast('Mengupload ' + files.length + ' file ke ' + targetFolderName + '...');

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var storagePath = userId + '/' + targetFolderId + '/' + Date.now() + '_' + file.name;

    try {
      var { error: upErr } = await sb.storage.from('user-files').upload(storagePath, file, { upsert: true });
      if (upErr) { failCount++; continue; }

      var ext = file.name.split('.').pop().toLowerCase();
      var type = 'doc';
      if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) type = 'foto';
      else if (['mp4','mov','avi','mkv','webm'].includes(ext)) type = 'video';
      else if (ext === 'pdf') type = 'pdf';
      else if (['xlsx','csv','xls'].includes(ext)) type = 'spreadsheet';
      else if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) type = 'audio';

      var iconInfo = FILE_ICONS[type] || FILE_ICONS['doc'];
      var sizeStr = file.size > 1024*1024 ? (file.size/(1024*1024)).toFixed(1)+' MB' : (file.size/1024).toFixed(0)+' KB';

      var { error: insertErr } = await sb.from('files').insert({
        name: file.name, folder_name: targetFolderName, folder_id: targetFolderId,
        type: type, size: sizeStr, icon: iconInfo.icon, icon_color: iconInfo.iconColor,
        icon_bg: iconInfo.iconBg, storage_path: storagePath, user_id: userId
      });
      if (insertErr) failCount++; else successCount++;
    } catch(e2) { failCount++; }
  }

  await loadFiles();
  renderStats();

  if (failCount > 0 && successCount > 0) showToast(successCount + ' file masuk ke ' + targetFolderName + ', ' + failCount + ' gagal.');
  else if (failCount > 0) showToast('Gagal upload ke ' + targetFolderName + '.');
  else showToast(successCount + ' file berhasil masuk ke ' + targetFolderName + '! \uD83D\uDCC1');
}


/* ── SELECT MODE & BULK DELETE ── */
function enterSelectMode() {
  isSelectMode = true;
  selectedFileIds.clear();
  var bulkBar = document.getElementById('bulkBar');
  var btnSelect = document.getElementById('btnSelectMode');
  if (bulkBar) bulkBar.style.display = 'flex';
  if (btnSelect) btnSelect.style.display = 'none';
  updateBulkBar();
  renderFiles();
}

function exitSelectMode() {
  isSelectMode = false;
  selectedFileIds.clear();
  var bulkBar = document.getElementById('bulkBar');
  var btnSelect = document.getElementById('btnSelectMode');
  if (bulkBar) bulkBar.style.display = 'none';
  if (btnSelect) btnSelect.style.display = '';
  var cb = document.getElementById('checkSelectAll');
  if (cb) cb.checked = false;
  renderFiles();
}

function fileCardClick(event, id) {
  if (isSelectMode) {
    // In select mode, clicking card toggles selection
    var newState = !selectedFileIds.has(String(id));
    toggleFileSelect(String(id), newState);
    // Sync checkbox inside card
    var card = document.querySelector('[data-file-id="' + id + '"]');
    if (card) {
      var cb = card.querySelector('input[type=checkbox]');
      if (cb) cb.checked = newState;
    }
  } else {
    openFile(id);
  }
}

function toggleFileSelect(id, checked) {
  if (checked) {
    selectedFileIds.add(String(id));
  } else {
    selectedFileIds.delete(String(id));
  }
  // Update card visual
  var card = document.querySelector('[data-file-id="' + id + '"]');
  if (card) {
    if (checked) {
      card.style.outline = '2.5px solid #c8602a';
      card.style.outlineOffset = '2px';
      card.style.background = 'rgba(200,96,42,0.05)';
    } else {
      card.style.outline = '';
      card.style.outlineOffset = '';
      card.style.background = '';
    }
  }
  updateBulkBar();
}

function toggleSelectAll(checked) {
  // Get all currently visible file IDs from cards
  var cards = document.querySelectorAll('#fileGrid [data-file-id]');
  cards.forEach(function(card) {
    var id = card.getAttribute('data-file-id');
    var cb = card.querySelector('input[type=checkbox]');
    if (checked) {
      selectedFileIds.add(String(id));
      card.style.outline = '2.5px solid #c8602a';
      card.style.outlineOffset = '2px';
      card.style.background = 'rgba(200,96,42,0.05)';
    } else {
      selectedFileIds.delete(String(id));
      card.style.outline = '';
      card.style.outlineOffset = '';
      card.style.background = '';
    }
    if (cb) cb.checked = checked;
  });
  updateBulkBar();
}

function updateBulkBar() {
  var count = selectedFileIds.size;
  var countEl = document.getElementById('bulkCount');
  if (countEl) countEl.textContent = count + ' file dipilih';
  // Sync select-all checkbox state
  var cards = document.querySelectorAll('#fileGrid [data-file-id]');
  var cb = document.getElementById('checkSelectAll');
  if (cb && cards.length > 0) {
    cb.checked = count > 0 && count >= cards.length;
    cb.indeterminate = count > 0 && count < cards.length;
  }
}

async function bulkDelete() {
  if (selectedFileIds.size === 0) { showToast('Pilih file dulu!'); return; }
  var count = selectedFileIds.size;
  var confirmed = await customConfirm({
    title: 'Hapus ' + count + ' File',
    message: 'Yakin ingin menghapus ' + count + ' file sekaligus? Anda punya 5 detik untuk membatalkan.',
    icon: 'ti-trash',
    confirmText: 'Ya, Hapus Semua',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) return;

  var ids = Array.from(selectedFileIds);
  var filesToDelete = ids.map(function(id) {
    return allFiles.find(function(f) { return String(f.id) === id; });
  }).filter(Boolean);

  var successCount = 0;
  var failCount = 0;
  var deletedFromDB = [];

  for (var i = 0; i < filesToDelete.length; i++) {
    var file = filesToDelete[i];
    var { error } = await sb.from('files').delete().eq('id', file.id);
    if (error) { failCount++; }
    else {
      deletedFromDB.push(file);
      successCount++;
      // Hapus dari favs
      var favs = getFavs();
      if (favs.includes(String(file.id))) {
        localStorage.setItem('myStorageFavs', JSON.stringify(favs.filter(function(fid) { return fid !== String(file.id); })));
      }
    }
  }

  exitSelectMode();
  await loadFiles();
  renderStats();

  if (successCount === 0) { showToast('Gagal menghapus ' + failCount + ' file.'); return; }

  let undone = false;
  let deletionTimer = setTimeout(async function() {
    if (!undone) {
      for (var j = 0; j < deletedFromDB.length; j++) {
        var f = deletedFromDB[j];
        var pathToDelete = f.storage_path || (f.folder_name + '/' + f.name);
        await sb.storage.from('user-files').remove([pathToDelete]);
      }
    }
  }, 5000);

  var label = successCount + ' file dihapus' + (failCount > 0 ? ' (' + failCount + ' gagal)' : '') + '.';
  showToast('\uD83D\uDDD1\uFE0F ' + label, {
    icon: 'ti-trash',
    duration: 5000,
    undoLabel: 'Undo',
    onUndo: async function() {
      undone = true;
      clearTimeout(deletionTimer);
      var reErr = false;
      for (var j = 0; j < deletedFromDB.length; j++) {
        var f = deletedFromDB[j];
        var { error: rErr } = await sb.from('files').insert({
          id: f.id, name: f.name, folder_name: f.folder_name, folder_id: f.folder_id,
          type: f.type, size: f.size, icon: f.icon, icon_color: f.icon_color,
          icon_bg: f.icon_bg, storage_path: f.storage_path, user_id: f.user_id, created_at: f.created_at
        });
        if (rErr) reErr = true;
      }
      if (reErr) showToast('Sebagian file gagal dikembalikan.');
      else showToast('\u2705 ' + deletedFromDB.length + ' file berhasil dikembalikan!');
      await loadFiles();
      renderStats();
    }
  });
}


/* ── INIT ── */
document.addEventListener('DOMContentLoaded', async function() {
  // Sembunyikan konten sampai session terverifikasi — cegah flash konten
  document.body.style.visibility = 'hidden';

  const { data: sessionData } = await sb.auth.getSession();
  if (!sessionData || !sessionData.session) {
    window.location.replace('login.html'); // replace: hapus dari history, tombol Back tidak bisa balik
    return;
  }

  // Session valid — tampilkan konten
  document.body.style.visibility = 'visible';

  const user = sessionData.session.user;
  const fullName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : user.email.split('@')[0];
  userInitials = fullName.split(' ').map(function(w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  const email = user.email;

  document.querySelectorAll('.user-name').forEach(function(el) { el.textContent = fullName; });

  // Apply avatar photo or initials
  const savedPhoto = localStorage.getItem('myStorageAvatarPhoto');
  const savedColor = localStorage.getItem('myStorageAvatarColor') || '#c8602a';
  document.querySelectorAll('.user-av, .topbar-av').forEach(function(el) {
    if (savedPhoto) {
      el.textContent = '';
      el.style.background = 'url(' + savedPhoto + ') center/cover';
      el.style.backgroundSize = 'cover';
    } else {
      el.textContent = userInitials;
      el.style.background = savedColor;
    }
  });
  const roleEl = document.querySelector('.user-role');
  if (roleEl) roleEl.textContent = email;

  const userChip = document.querySelector('.user-chip');
  if (userChip) {
    userChip.title = 'Klik untuk logout';
    userChip.onclick = async function() {
      const confirmed = await customConfirm({
        title: 'Logout',
        message: 'Yakin ingin keluar dari akun Anda?',
        icon: 'ti-logout',
        iconClass: 'logout',
        confirmText: 'Ya, Logout',
        confirmBtnClass: 'logout-confirm'
      });
      if (confirmed) {
        await sb.auth.signOut();
        window.location.replace('login.html');
      }
    };
  }

  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.getElementById('moveModal').addEventListener('click', function(e) {
    if (e.target === this) closeMoveModal();
  });

  const dz = document.getElementById('dropZone');
  dz.addEventListener('dragover', function(e) {
    e.preventDefault();
    dz.style.borderColor = 'var(--accent)';
    dz.style.background = 'rgba(124,58,237,0.15)';
  });
  dz.addEventListener('dragleave', function() {
    dz.style.borderColor = '';
    dz.style.background = '';
  });
  dz.addEventListener('drop', function(e) {
    e.preventDefault();
    dz.style.borderColor = '';
    dz.style.background = '';
    droppedFiles = Array.from(e.dataTransfer.files);
    const names = droppedFiles.map(function(f) { return f.name; }).join(', ');
    document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.getElementById('ctxMenu').classList.remove('show');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const inp = document.getElementById('searchInput');
      inp.focus();
      inp.select();
    }
  });

  sb.auth.onAuthStateChange(function(event, session) {
    if (event === 'SIGNED_OUT' || !session) {
      window.location.replace('login.html');
    }
  });

  // Restore saved view mode (grid/list)
  setViewMode(currentViewMode);

  loadAll();
});