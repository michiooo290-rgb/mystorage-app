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
const MAX_UPLOAD_FILE_BYTES = 100 * 1024 * 1024;      // 100 MB per file
const MAX_STORAGE_BYTES = 1024 * 1024 * 1024;         // 1 GB per akun
let isFolderExpanded = false;
let folderSearchQuery = '';

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
let showTrashMode = false;
let userInitials = 'US';
let sharedLinks = []; // Diisi dari Supabase shared_links, fallback dari localStorage lama jika tabel belum ada
let activityLogs = [];
let hasLoadedInitialData = false;
let isInitialDataLoading = true;


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


/* ── SECURITY HELPERS ──
   Semua path di Supabase Storage dibuat konsisten:
   user_id/folder_id/nama_file
   Ini cocok dengan RLS Storage: folder pertama harus auth.uid().
*/
function sanitizeStorageFileName(fileName) {
  var base = String(fileName || 'file').trim();
  // Jangan biarkan slash/backslash atau karakter path berbahaya masuk ke object name.
  base = base.replace(/[\\/\x00-\x1F\x7F?%*:|"<>]/g, '_');
  // Rapikan spasi berlebihan agar path lebih stabil.
  base = base.replace(/\s+/g, ' ');
  return base || 'file';
}

function buildStoragePathForUser(userId, folderId, fileName) {
  if (!userId || userId === 'unknown') {
    throw new Error('User belum login. Silakan login ulang.');
  }
  var folderPart = folderId || 'root';
  return userId + '/' + folderPart + '/' + Date.now() + '_' + sanitizeStorageFileName(fileName);
}

async function getCurrentUserId() {
  const { data } = await sb.auth.getSession();
  const userId = data && data.session && data.session.user ? data.session.user.id : null;
  if (!userId) throw new Error('User belum login. Silakan login ulang.');
  return userId;
}

async function buildStoragePath(folderId, fileName) {
  return buildStoragePathForUser(await getCurrentUserId(), folderId, fileName);
}

function getFileStoragePath(file) {
  return file.storage_path || (file.folder_name ? (file.folder_name + '/' + file.name) : file.name);
}


/* ── SIZE & UI STATE HELPERS ── */
function parseSizeString(size) {
  if (!size) return 0;
  var text = String(size).trim();
  var num = parseFloat(text.replace(',', '.'));
  if (!isFinite(num)) return 0;
  var upper = text.toUpperCase();
  if (upper.includes('GB')) return Math.round(num * 1024 * 1024 * 1024);
  if (upper.includes('MB')) return Math.round(num * 1024 * 1024);
  if (upper.includes('KB')) return Math.round(num * 1024);
  return Math.round(num);
}

function getFileSizeBytes(file) {
  if (!file) return 0;
  if (typeof file.size_bytes === 'number' && isFinite(file.size_bytes)) return file.size_bytes;
  if (typeof file.size_bytes === 'string' && file.size_bytes.trim() !== '') {
    var parsed = parseInt(file.size_bytes, 10);
    if (isFinite(parsed)) return parsed;
  }
  return parseSizeString(file.size);
}

function isFileTrashed(file) {
  return !!(file && file.deleted_at);
}

function getActiveFiles() {
  return allFiles.filter(function(file) { return !isFileTrashed(file); });
}

function getTrashFiles() {
  return allFiles.filter(function(file) { return isFileTrashed(file); });
}

function getCurrentFileCollection() {
  return showTrashMode ? getTrashFiles() : getActiveFiles();
}

function calcTotalUsedBytes() {
  // File di Sampah tetap dihitung ke quota sampai dihapus permanen.
  return allFiles.reduce(function(total, file) {
    return total + getFileSizeBytes(file);
  }, 0);
}

async function fetchFreshUsedBytes() {
  // Ambil ulang usage dari Supabase sebelum upload supaya validasi quota tidak bergantung
  // pada state lama di browser. RLS memastikan query ini hanya membaca file user sendiri.
  const { data, error } = await sb.from('files').select('size_bytes,size');
  if (error) throw error;
  return (data || []).reduce(function(total, file) {
    return total + getFileSizeBytes(file);
  }, 0);
}

async function validateUploadQuota(files) {
  const fileList = Array.from(files || []);
  if (fileList.length === 0) return { ok: false, message: 'Pilih file dulu!' };

  const tooBig = fileList.find(function(file) { return file.size > MAX_UPLOAD_FILE_BYTES; });
  if (tooBig) {
    return {
      ok: false,
      message: 'File terlalu besar (maks 100 MB): ' + tooBig.name +
        ' (' + formatFileSizeFromBytes(tooBig.size) + ')'
    };
  }

  const totalNewBytes = fileList.reduce(function(sum, file) { return sum + file.size; }, 0);
  let freshUsedBytes;
  try {
    freshUsedBytes = await fetchFreshUsedBytes();
  } catch (err) {
    // Kalau query fresh gagal, pakai state lokal sebagai fallback, tapi tetap beri error visual.
    console.warn('Gagal mengambil quota terbaru, pakai cache lokal:', err);
    freshUsedBytes = calcTotalUsedBytes();
  }

  const remainingBytes = MAX_STORAGE_BYTES - freshUsedBytes;
  if (totalNewBytes > remainingBytes) {
    return {
      ok: false,
      usedBytes: freshUsedBytes,
      remainingBytes: remainingBytes,
      message: 'Storage tidak cukup! Perlu ' + formatFileSizeFromBytes(totalNewBytes) +
        ', sisa ' + formatFileSizeFromBytes(Math.max(remainingBytes, 0)) + '.'
    };
  }

  return { ok: true, usedBytes: freshUsedBytes, remainingBytes: remainingBytes, totalNewBytes: totalNewBytes };
}

function formatFileSizeFromBytes(bytes) {
  bytes = Number(bytes) || 0;
  if (bytes < 1024) return bytes.toFixed(0) + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}


/* ── FOLDER SAFETY HELPERS ── */
function normalizeFolderName(name) {
  return String(name || '').trim().replace(/\s+/g, ' ');
}

function isValidFolderName(name) {
  var clean = normalizeFolderName(name);
  if (!clean) return { ok: false, message: 'Nama folder tidak boleh kosong.' };
  if (clean.length > 80) return { ok: false, message: 'Nama folder maksimal 80 karakter.' };
  if (/[\\/\x00-\x1F\x7F?%*:|"<>]/.test(clean)) {
    return { ok: false, message: 'Nama folder tidak boleh memakai karakter: / \\ ? % * : | " < >' };
  }
  if (clean === '.' || clean === '..') return { ok: false, message: 'Nama folder tidak valid.' };
  return { ok: true, name: clean };
}

function folderNameExistsInParent(name, parentId, excludeFolderId) {
  var clean = normalizeFolderName(name).toLowerCase();
  return allFolders.some(function(folder) {
    return String(folder.id) !== String(excludeFolderId || '') &&
      (folder.parent_id || null) === (parentId || null) &&
      normalizeFolderName(folder.name).toLowerCase() === clean;
  });
}

function getDescendantFolderIds(folderId) {
  var ids = [];
  function walk(parentId) {
    allFolders
      .filter(function(folder) { return String(folder.parent_id || '') === String(parentId || ''); })
      .forEach(function(child) {
        ids.push(child.id);
        walk(child.id);
      });
  }
  walk(folderId);
  return ids;
}

function getFolderDisplayPath(folderId) {
  var path = buildFolderPathById(folderId);
  return path.length ? path.map(function(item) { return item.name; }).join(' / ') : 'Root';
}

function buildFolderDestinationOptions(excludeFolderId, selectedParentId) {
  var blocked = [String(excludeFolderId || '')].concat(getDescendantFolderIds(excludeFolderId).map(String));
  function build(parentId, indent) {
    return allFolders
      .filter(function(folder) { return (folder.parent_id || null) === (parentId || null); })
      .filter(function(folder) { return !blocked.includes(String(folder.id)); })
      .map(function(folder) {
        var selected = String(folder.id) === String(selectedParentId || '') ? ' selected' : '';
        return '<option value="' + escapeAttr(folder.id) + '"' + selected + '>' + indent + escapeHtml(folder.name) + '</option>' +
          build(folder.id, indent + '　');
      }).join('');
  }
  var rootSelected = !selectedParentId ? ' selected' : '';
  return '<option value=""' + rootSelected + '>📂 Root / Dashboard</option>' + build(null, '');
}

function updateFolderLocal(folderId, patch) {
  var idx = allFolders.findIndex(function(folder) { return String(folder.id) === String(folderId); });
  if (idx !== -1) allFolders[idx] = Object.assign({}, allFolders[idx], patch);
}

/* ── DETAILED UPLOAD PROGRESS HELPERS ── */
function ensureUploadProgressBox(targetId) {
  var progressBox = document.getElementById('uploadProgressBox');
  if (!progressBox) {
    progressBox = document.createElement('div');
    progressBox.id = 'uploadProgressBox';
    progressBox.style.cssText = 'margin:12px 0 14px';
    var target = document.getElementById(targetId || 'selectedFiles') || document.getElementById('selectedFiles') || document.getElementById('selectedFolder');
    if (target) target.after(progressBox);
  }
  return progressBox;
}

function renderDetailedUploadProgress(box, state) {
  if (!box) return;
  var total = Math.max(Number(state.total) || 0, 1);
  var done = Number(state.done) || 0;
  var failed = Number(state.failed) || 0;
  var currentIndex = Math.min(Number(state.currentIndex) || 0, total);
  var pct = Math.min(100, Math.round(((done + failed) / total) * 100));
  var rows = (state.items || []).slice(-6).map(function(item) {
    var color = item.status === 'success' ? 'var(--green)' : item.status === 'error' ? '#c0392b' : item.status === 'skip' ? '#92400e' : 'var(--accent)';
    var icon = item.status === 'success' ? 'ti-check' : item.status === 'error' ? 'ti-alert-circle' : item.status === 'skip' ? 'ti-circle-minus' : 'ti-loader-2';
    var spin = item.status === 'uploading' ? 'animation:spin .8s linear infinite' : '';
    return '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-top:1px solid rgba(15,14,13,0.06)">' +
      '<i class="ti ' + icon + '" style="font-size:14px;color:' + color + ';margin-top:1px;' + spin + '"></i>' +
      '<div style="min-width:0;flex:1"><div style="font-size:12px;color:var(--ink-2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(item.name || 'File') + '</div>' +
      (item.message ? '<div style="font-size:10.5px;color:var(--ink-4);margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(item.message) + '</div>' : '') + '</div></div>';
  }).join('');

  box.innerHTML =
    '<div style="border:1px solid var(--border);background:var(--white);border-radius:14px;padding:12px;box-shadow:var(--shadow-xs)">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px">' +
        '<div style="min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--ink)">' + escapeHtml(state.title || 'Upload file') + '</div>' +
        '<div style="font-size:11px;color:var(--ink-4);margin-top:1px">' + done + ' berhasil · ' + failed + ' gagal · ' + currentIndex + '/' + total + ' diproses</div></div>' +
        (state.finished ? '' : '<button type="button" data-action="cancel-upload" style="border:1px solid rgba(192,57,43,0.18);background:rgba(192,57,43,0.06);color:#c0392b;border-radius:9px;padding:5px 10px;font-size:11.5px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0">Batal</button>') +
      '</div>' +
      '<div style="background:rgba(15,14,13,0.06);border-radius:99px;height:7px;overflow:hidden;margin-bottom:7px">' +
        '<div style="height:100%;width:' + pct + '%;background:' + (failed > 0 ? '#c8602a' : 'var(--accent)') + ';border-radius:99px;transition:width .25s ease"></div>' +
      '</div>' +
      '<div style="display:flex;align-items:center;justify-content:space-between;font-size:10.5px;color:var(--ink-4);font-family:JetBrains Mono,monospace;margin-bottom:6px"><span>' + pct + '%</span><span>' + escapeHtml(state.currentName || '') + '</span></div>' +
      '<div style="max-height:178px;overflow:auto">' + rows + '</div>' +
    '</div>';
}

function pushUploadProgressItem(state, item) {
  state.items = state.items || [];
  state.items.push(item);
  state.currentName = item.name || '';
}

function cleanupLegacyAvatarKeys() {
  // Hapus cache avatar lama yang global supaya foto akun A tidak muncul di akun B.
  localStorage.removeItem('myStorageAvatarPhoto');
  localStorage.removeItem('myStorageAvatarColor');
}

function ensureAppStateUI() {
  if (!document.getElementById('appLoadingState')) {
    var loading = document.createElement('div');
    loading.id = 'appLoadingState';
    loading.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:99999;display:none;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:var(--ink,#0f0e0d);color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.22);font-size:13px;font-family:Inter,system-ui,sans-serif;';
    loading.innerHTML = '<i class="ti ti-loader-2" style="font-size:17px;animation:spin .8s linear infinite"></i><span id="appLoadingMsg">Memuat...</span>';
    document.body.appendChild(loading);
  }
  if (!document.getElementById('appErrorState')) {
    var error = document.createElement('div');
    error.id = 'appErrorState';
    error.style.cssText = 'position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:99999;display:none;max-width:min(560px,calc(100vw - 28px));padding:12px 14px;border-radius:14px;background:#fff7f7;color:#7f1d1d;border:1px solid rgba(192,57,43,.22);box-shadow:0 10px 30px rgba(127,29,29,.12);font-size:13px;font-family:Inter,system-ui,sans-serif;';
    error.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px"><i class="ti ti-alert-circle" style="font-size:18px;flex-shrink:0;margin-top:1px"></i><div style="flex:1;min-width:0"><strong id="appErrorTitle" style="display:block;margin-bottom:2px">Terjadi error</strong><span id="appErrorMsg"></span></div><button id="appErrorClose" type="button" style="border:0;background:transparent;color:#7f1d1d;cursor:pointer;font-size:18px;line-height:1">&times;</button></div>';
    document.body.appendChild(error);
    error.querySelector('#appErrorClose').addEventListener('click', function() { error.style.display = 'none'; });
  }
}

function showAppLoading(message) {
  ensureAppStateUI();
  var box = document.getElementById('appLoadingState');
  var msg = document.getElementById('appLoadingMsg');
  if (msg) msg.textContent = message || 'Memuat...';
  if (box) box.style.display = 'flex';
}

function hideAppLoading() {
  var box = document.getElementById('appLoadingState');
  if (box) box.style.display = 'none';
}

function showAppError(title, message) {
  ensureAppStateUI();
  var box = document.getElementById('appErrorState');
  var titleEl = document.getElementById('appErrorTitle');
  var msgEl = document.getElementById('appErrorMsg');
  if (titleEl) titleEl.textContent = title || 'Terjadi error';
  if (msgEl) msgEl.textContent = message || 'Coba ulangi beberapa saat lagi.';
  if (box) box.style.display = 'block';
}

function clearAppError() {
  var box = document.getElementById('appErrorState');
  if (box) box.style.display = 'none';
}


/* ── PUBLIC SHARE + ACTIVITY LOG HELPERS ── */
function generateShareToken() {
  try {
    var bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes).map(function(b) { return b.toString(16).padStart(2, '0'); }).join('');
  } catch (e) {
    return String(Date.now()) + '_' + Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
}

function buildPublicShareUrl(token) {
  return window.location.origin + '/pages/share.html?token=' + encodeURIComponent(token);
}

function normalizeSharedRow(row) {
  var file = row.files || row.file || {};
  var createdAt = row.created_at ? new Date(row.created_at).getTime() : Date.now();
  var expiresAt = row.expires_at ? new Date(row.expires_at).getTime() : createdAt + 7 * 24 * 60 * 60 * 1000;
  var token = row.token || '';
  return {
    fileId: String(row.file_id || (file && file.id) || ''),
    sharedId: row.id || null,
    token: token,
    name: file.name || row.file_name || 'File',
    url: token ? buildPublicShareUrl(token) : (row.public_url || row.signed_url || ''),
    type: file.type || row.file_type || 'doc',
    folder: file.folder_name || row.folder_name || '',
    createdAt: createdAt,
    expiresAt: expiresAt,
    revokedAt: row.revoked_at || null,
    accessCount: row.access_count || 0,
    lastAccessedAt: row.last_accessed_at || null
  };
}

async function loadSharedLinks() {
  var nowIso = new Date().toISOString();
  try {
    const { data, error } = await sb
      .from('shared_links')
      .select('id, token, file_id, expires_at, revoked_at, created_at, access_count, last_accessed_at, files(id,name,type,folder_name,size)')
      .is('revoked_at', null)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false });
    if (error) throw error;
    sharedLinks = (data || []).map(normalizeSharedRow);
    localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));
    return sharedLinks;
  } catch (err) {
    console.warn('Gagal load shared_links dari Supabase, pakai cache lokal:', err && err.message ? err.message : err);
    var cached = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
    var now = Date.now();
    sharedLinks = cached.filter(function(s) {
      var exp = s.expiresAt || (s.createdAt + 7 * 24 * 60 * 60 * 1000);
      return exp > now && !s.revokedAt;
    });
    return sharedLinks;
  }
}

function getActivityMeta(action) {
  var map = {
    upload_file:       { icon: 'ti-cloud-upload', color: '#2d6a4f', label: 'Upload file' },
    upload_folder:     { icon: 'ti-folder-up', color: '#2d6a4f', label: 'Upload folder' },
    rename_file:       { icon: 'ti-edit', color: '#1d4ed8', label: 'Rename file' },
    move_file:         { icon: 'ti-folder-symlink', color: '#0369a1', label: 'Pindah file' },
    trash_file:        { icon: 'ti-trash', color: '#c0392b', label: 'Pindah ke sampah' },
    restore_file:      { icon: 'ti-restore', color: '#2d6a4f', label: 'Pulihkan file' },
    delete_file:       { icon: 'ti-trash', color: '#c0392b', label: 'Hapus permanen' },
    share_file:        { icon: 'ti-share', color: '#c8602a', label: 'Bagikan file' },
    revoke_share:      { icon: 'ti-link-off', color: '#c0392b', label: 'Cabut link' },
    create_folder:     { icon: 'ti-folder-plus', color: '#2d6a4f', label: 'Buat folder' },
    delete_folder:     { icon: 'ti-folder-x', color: '#c0392b', label: 'Hapus folder' },
    rename_folder:     { icon: 'ti-folder-cog', color: '#1d4ed8', label: 'Rename folder' },
    move_folder:       { icon: 'ti-folder-symlink', color: '#0369a1', label: 'Pindah folder' },
    favorite_file:     { icon: 'ti-star', color: '#f59e0b', label: 'Favorit' },
    unfavorite_file:   { icon: 'ti-star-off', color: '#92400e', label: 'Hapus favorit' }
  };
  return map[action] || { icon: 'ti-activity', color: '#1d4ed8', label: action || 'Aktivitas' };
}

function formatActivityTime(iso) {
  if (!iso) return 'baru saja';
  var diff = Date.now() - new Date(iso).getTime();
  if (!isFinite(diff) || diff < 0) return 'baru saja';
  var min = Math.floor(diff / 60000);
  if (min < 1) return 'baru saja';
  if (min < 60) return min + ' menit lalu';
  var h = Math.floor(min / 60);
  if (h < 24) return h + ' jam lalu';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

async function loadActivityLogs() {
  try {
    const { data, error } = await sb
      .from('activity_logs')
      .select('id, action, file_id, file_name, details, created_at')
      .order('created_at', { ascending: false })
      .limit(12);
    if (error) throw error;
    activityLogs = data || [];
  } catch (err) {
    console.warn('Gagal load activity_logs:', err && err.message ? err.message : err);
    activityLogs = JSON.parse(localStorage.getItem('myStorageActivityCache') || '[]');
  }
  return activityLogs;
}

async function logActivity(action, file, details) {
  var item = {
    action: action,
    file_id: file && file.id ? file.id : null,
    file_name: file && file.name ? file.name : (details && details.file_name ? details.file_name : null),
    details: details || {}
  };
  try {
    const { error } = await sb.from('activity_logs').insert(item);
    if (error) throw error;
  } catch (err) {
    // Fallback lokal supaya UI tetap punya riwayat walaupun SQL belum dijalankan.
    var cache = JSON.parse(localStorage.getItem('myStorageActivityCache') || '[]');
    cache.unshift(Object.assign({ id: 'local_' + Date.now(), created_at: new Date().toISOString() }, item));
    cache = cache.slice(0, 20);
    localStorage.setItem('myStorageActivityCache', JSON.stringify(cache));
  }
  try { await loadActivityLogs(); updateNotificationBadge(); } catch(e) {}
}

/* ── LOAD DATA ── */
async function loadAll(options) {
  options = options || {};
  var showFloatingLoading = options.showFloating === true;

  // Saat refresh pertama, jangan tampilkan empty state dulu.
  // Tampilkan loading di area file sampai query Supabase selesai.
  isInitialDataLoading = !hasLoadedInitialData;
  clearAppError();
  if (isInitialDataLoading) renderFiles();
  if (showFloatingLoading) showAppLoading('Memuat data storage...');

  try {
    await loadFolders();  // harus duluan agar folder tersedia saat migrasi file
    await loadFiles();
    await loadSharedLinks();
    await loadActivityLogs();
    hasLoadedInitialData = true;
    isInitialDataLoading = false;
    renderStats();
    renderFiles();
    updateNotificationBadge();
  } catch (err) {
    console.error('Load data error:', err);
    hasLoadedInitialData = true;
    isInitialDataLoading = false;
    renderFiles();
    showAppError('Gagal memuat data', err.message || 'Cek koneksi internet atau policy Supabase.');
    showToast('Gagal memuat data storage.');
  } finally {
    if (showFloatingLoading) hideAppLoading();
  }
}

async function loadFolders() {
  const { data, error } = await sb.from('folders').select('*').order('created_at');
  if (error) {
    showAppError('Gagal load folder', error.message);
    showToast('Gagal load folder: ' + error.message);
    throw error;
  }
  allFolders = data || [];
  renderFolders();
}

async function loadFiles() {
  const { data, error } = await sb.from('files').select('*').order('created_at', { ascending: false });
  if (error) {
    isInitialDataLoading = false;
    showAppError('Gagal load file', error.message);
    showToast('Gagal load file: ' + error.message);
    throw error;
  }
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

  hasLoadedInitialData = true;
  isInitialDataLoading = false;
  renderFiles();
}

/* ── STATS ── */
function renderStats() {
  const activeFiles = getActiveFiles();
  const trashFiles = getTrashFiles();
  const totalFiles = activeFiles.length;
  const totalFolders = allFolders.filter(function(f) { return !f.parent_id; }).length; // hanya root folder
  const favCount = activeFiles.filter(f => getFavs().includes(String(f.id))).length;

  const sharedCount = (sharedLinks || []).filter(function(s) {
    return !s.revokedAt && (s.expiresAt || (s.createdAt + 7 * 24 * 60 * 60 * 1000)) > Date.now();
  }).length;

  document.getElementById('statFiles').textContent = totalFiles;
  document.getElementById('statFolders').textContent = totalFolders;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = sharedCount;
  if (document.getElementById('statFavorit')) document.getElementById('statFavorit').textContent = favCount;

  function setBadge(id, count) {
    var el = document.getElementById(id);
    if (!el) return;
    if (count > 0) {
      el.textContent = count;
      el.style.display = 'inline-block';
    } else {
      el.style.display = 'none';
    }
  }
  setBadge('badgeDashboard', totalFiles);
  setBadge('badgeDocs', activeFiles.filter(f => f.type === 'doc' || f.type === 'pdf').length);
  setBadge('badgePhotos', activeFiles.filter(f => f.type === 'foto').length);
  setBadge('badgeVideos', activeFiles.filter(f => f.type === 'video').length);
  setBadge('badgeAudio', activeFiles.filter(f => f.type === 'audio').length);
  setBadge('badgeShared', sharedCount);
  setBadge('badgeTrash', trashFiles.length);

  const usedBytes = calcTotalUsedBytes();
  const usedMB = usedBytes / (1024 * 1024);
  const totalMB = MAX_STORAGE_BYTES / (1024 * 1024);
  const pct = Math.min(Math.round((usedMB / totalMB) * 100), 100);
  const usedStr = formatFileSizeFromBytes(usedBytes);

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

/* ── FOLDER COLOR PALETTES (gradient pairs + text/pocket colors) ── */
const FOLDER_GRADIENTS = [
  { g1: '#818cf8', g2: '#6366f1', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(99,102,241,0.22)',  pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(99,102,241,0.50)' },
  { g1: '#38bdf8', g2: '#0ea5e9', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(14,165,233,0.22)',  pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(14,165,233,0.50)' },
  { g1: '#34d399', g2: '#10b981', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(16,185,129,0.22)',  pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(16,185,129,0.50)' },
  { g1: '#fb923c', g2: '#f97316', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(249,115,22,0.22)',  pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(249,115,22,0.50)' },
  { g1: '#fb7185', g2: '#f43f5e', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(244,63,94,0.22)',   pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(244,63,94,0.50)'  },
  { g1: '#c084fc', g2: '#a855f7', docBg: 'rgba(255,255,255,0.93)', docLine: 'rgba(168,85,247,0.22)', pocket: 'rgba(255,255,255,0.26)', shadow: 'rgba(168,85,247,0.50)' },
];

/* ── RENDER FOLDERS ── */
function renderFolders() {
  const grid = document.getElementById('folderGrid');
  const pins = getPinnedFolders();

  const folderSearchEl = document.getElementById('folderSearchInput');
  const activeFolderSearch = folderSearchEl ? folderSearchEl.value.trim().toLowerCase() : folderSearchQuery;
  folderSearchQuery = activeFolderSearch;

  // Tampilkan folder sesuai level saat ini. Jika search folder aktif, cari di semua folder.
  let visible = allFolders.filter(function(f) {
    const pid = f.parent_id || null;
    const matchLevel = activeFolderSearch ? true : pid === currentFolderId;
    const matchSearch = activeFolderSearch ? f.name.toLowerCase().includes(activeFolderSearch) : true;
    return matchLevel && matchSearch;
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
      (activeFolderSearch ? 'Folder tidak ditemukan.' : (currentFolderId ? 'Belum ada subfolder di sini.' : 'Belum ada folder. Buat folder baru!')) +
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
    const p = FOLDER_GRADIENTS[i % FOLDER_GRADIENTS.length];
    const fileCount = getActiveFiles().filter(function(x) {
      return x.folder_id === f.id || (!x.folder_id && x.folder_name === f.name);
    }).length;
    const subCount = allFolders.filter(function(x) { return x.parent_id === f.id; }).length;
    const safeName = escapeHtml(f.name);
    const safeId = escapeAttr(f.id);
    const subLabel = subCount > 0 ? subCount + ' subfolder · ' + fileCount + ' file' : fileCount + ' file';
    const isPinned = pins.includes(f.id);

    // Card utama — aspect ratio sedikit lebih tinggi agar dokumen & pocket proporsional
    const cardStyle = [
      'position:relative', 'width:100%', 'padding-bottom:80%',
      'border-radius:20px',
      'background:linear-gradient(155deg,' + p.g1 + ' 0%,' + p.g2 + ' 100%)',
      'box-shadow:0 20px 40px -12px ' + p.shadow + ',0 4px 12px -4px ' + p.shadow,
      'overflow:hidden', 'cursor:pointer'
    ].join(';');

    // Dokumen — semua berangkat dari left:50%, menyebar seperti referensi
    const docBase = [
      'position:absolute', 'width:42%', 'height:54%',
      'background:' + p.docBg,
      'border-radius:8px',
      'box-shadow:0 8px 20px -6px rgba(0,0,0,0.22)',
      'display:flex', 'flex-direction:column', 'gap:5px', 'padding:12% 11% 0'
    ].join(';');

    const lineStyle = 'display:block;height:3px;border-radius:3px;background:' + p.docLine + ';';
    const lines = '<span style="' + lineStyle + 'width:80%"></span>' +
                  '<span style="' + lineStyle + 'width:95%"></span>' +
                  '<span style="' + lineStyle + 'width:65%"></span>';

    // Kanan-belakang → tengah → kiri-depan, persis seperti referensi Scripts icon
    // class folder-doc-r/m/l dipakai CSS untuk animasi fan-out hover
    const doc3 = '<div class="folder-doc-r" style="' + docBase + ';top:12%;left:50%;transform:translateX(-10%) rotate(10deg);z-index:1;">' + lines + '</div>';
    const doc2 = '<div class="folder-doc-m" style="' + docBase + ';top:12%;left:50%;transform:translateX(-50%) rotate(2deg);z-index:2;">' + lines + '</div>';
    const doc1 = '<div class="folder-doc-l" style="' + docBase + ';top:12%;left:50%;transform:translateX(-90%) rotate(-7deg);z-index:3;">' + lines + '</div>';

    // Frosted pocket tinggi (60%) — blur kuat agar dokumen di belakang terlihat kabur
    const pocketStyle = [
      'position:absolute', 'left:0', 'right:0', 'bottom:0', 'height:60%', 'z-index:4',
      'background:' + p.pocket,
      'backdrop-filter:blur(16px)', '-webkit-backdrop-filter:blur(16px)',
      'border-top:1px solid rgba(255,255,255,0.38)',
      'border-top-right-radius:16px',
      'box-shadow:inset 0 1px 0 rgba(255,255,255,0.4)',
      'display:flex', 'align-items:flex-end',
      'padding:0 16px 14px'
    ].join(';');

    const nameStyle = [
      'font-family:Outfit,Inter,sans-serif',
      'font-size:15px', 'font-weight:700', 'color:#fff',
      'line-height:1.1', 'letter-spacing:-0.03em',
      'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis'
    ].join(';');

    const subStyle = [
      'font-size:10px', 'color:rgba(255,255,255,0.82)',
      'margin-top:4px', 'font-family:JetBrains Mono,monospace',
      'white-space:nowrap', 'overflow:hidden', 'text-overflow:ellipsis'
    ].join(';');

    const pinBadge = isPinned
      ? '<span style="font-size:10px;line-height:1;flex-shrink:0;margin-bottom:2px;margin-left:6px">📌</span>'
      : '';

    return (
      '<div class="folder-wrap' + (isPinned ? ' folder-pinned' : '') + '" ' +
      'style="animation-delay:' + (i * 0.06) + 's;position:relative;" ' +
      'data-folder-card="1" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +

      '<button class="folder-pin-btn' + (isPinned ? ' pinned' : '') + '" ' +
      'title="' + (isPinned ? 'Lepas pin' : 'Pin ke atas') + '" ' +
      'data-action="folder-pin" data-folder-id="' + safeId + '">' +
      '<i class="ti ' + (isPinned ? 'ti-pin-filled' : 'ti-pin') + '"></i></button>' +

      '<button class="folder-action-btn folder-rename-btn" title="Rename folder" ' +
      'style="position:absolute;right:70px;top:8px;z-index:6;width:26px;height:26px;border:0;border-radius:8px;background:rgba(255,255,255,0.82);color:#0f0e0d;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.12)" ' +
      'data-action="folder-rename" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +
      '<i class="ti ti-edit" style="font-size:14px"></i></button>' +

      '<button class="folder-action-btn folder-move-btn" title="Pindah folder" ' +
      'style="position:absolute;right:39px;top:8px;z-index:6;width:26px;height:26px;border:0;border-radius:8px;background:rgba(255,255,255,0.82);color:#0f0e0d;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.12)" ' +
      'data-action="folder-move" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +
      '<i class="ti ti-folder-symlink" style="font-size:14px"></i></button>' +

      '<button class="folder-delete-btn" title="Hapus folder" ' +
      'data-action="folder-delete" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +
      '<i class="ti ti-trash"></i></button>' +

      '<div style="' + cardStyle + '">' +
        '<div style="position:absolute;inset:0;">' +
          doc3 + doc2 + doc1 +
          '<div style="' + pocketStyle + '">' +
            '<div style="flex:1;min-width:0;">' +
              '<div style="' + nameStyle + '">' + safeName + '</div>' +
              '<div style="' + subStyle + '">' + escapeHtml(subLabel) + '</div>' +
            '</div>' +
            pinBadge +
          '</div>' +
        '</div>' +
      '</div>' +
      '</div>'
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
  let html = '<span style="cursor:pointer;color:var(--accent);font-weight:500" data-action="folder-breadcrumb-root"><i class="ti ti-home" style="font-size:13px;vertical-align:middle;margin-right:2px"></i>Root</span>';
  folderPath.forEach(function(crumb, idx) {
    html += '<i class="ti ti-chevron-right" style="font-size:11px;color:var(--ink-5)"></i>';
    if (idx < folderPath.length - 1) {
      html += '<span style="cursor:pointer;color:var(--accent);font-weight:500" data-action="folder-breadcrumb" data-index="' + idx + '">' + escapeHtml(crumb.name) + '</span>';
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
  let html = `<i class="ti ti-home" style="font-size:15px;color:var(--accent);cursor:pointer" data-action="folder-breadcrumb-root" title="Kembali ke root"></i>`;

  folderPath.forEach(function(crumb, idx) {
    html += `<i class="ti ti-chevron-right" style="font-size:12px;color:var(--ink-5)"></i>`;
    const isLast = idx === folderPath.length - 1;
    if (isLast) {
      // Folder aktif — tidak clickable
      html += `<span style="color:var(--ink-2);font-weight:600;font-size:12.5px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle">${escapeHtml(crumb.name)}</span>`;
    } else {
      // Folder parent — clickable untuk naik level
      html += `<span style="color:var(--accent);font-weight:500;font-size:12.5px;cursor:pointer;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:inline-block;vertical-align:middle" data-action="folder-breadcrumb" data-index="${idx}" title="${escapeHtml(crumb.name)}">${escapeHtml(crumb.name)}</span>`;
    }
  });

  bc.innerHTML = html;
}

function updateFileSectionTitle() {
  const titleEl = document.getElementById('fileSectionTitle');
  const btnBack = document.getElementById('btnBackFolder');
  if (showTrashMode) {
    if (titleEl) titleEl.innerHTML = '<i class="ti ti-trash" style="font-size:15px;color:var(--accent);margin-right:5px;vertical-align:middle"></i>Sampah';
    if (btnBack) btnBack.style.display = 'none';
  } else if (currentFolderId) {
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
  sel.innerHTML = '<option value="">Upload ke root (Dashboard)</option>' + buildOptions(null, '');
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

function buildFolderPathById(folderId) {
  var path = [];
  var safety = 0;
  var current = allFolders.find(function(f) { return f.id === folderId; });
  while (current && safety < 50) {
    path.unshift({ id: current.id, name: current.name });
    current = current.parent_id ? allFolders.find(function(f) { return f.id === current.parent_id; }) : null;
    safety++;
  }
  return path;
}

function openFolderById(folderId, folderName) {
  const folder = allFolders.find(function(f) { return f.id === folderId; });
  currentFolderId = folderId;
  currentFolderFilter = folder ? folder.name : folderName; // untuk filter file
  showOnlyFavorites = false;
  folderPath = buildFolderPathById(folderId);

  // Bersihkan search folder saat user masuk ke folder tertentu.
  folderSearchQuery = '';
  var folderSearchEl = document.getElementById('folderSearchInput');
  var folderClearBtn = document.getElementById('folderSearchClear');
  if (folderSearchEl) folderSearchEl.value = '';
  if (folderClearBtn) folderClearBtn.style.display = 'none';

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
  // Tampilkan dropdown sort
  var existing = document.getElementById('sortDropdown');
  if (existing) { existing.remove(); return; }

  var btn = document.querySelector('[data-action="toggle-sort"]');
  var rect = btn.getBoundingClientRect();

  var options = [
    { mode: 'newest',  label: 'Terbaru diunggah',  icon: 'ti-clock-down' },
    { mode: 'oldest',  label: 'Terlama diunggah',   icon: 'ti-clock-up' },
    { mode: 'az',      label: 'Nama A → Z',          icon: 'ti-sort-ascending-letters' },
    { mode: 'za',      label: 'Nama Z → A',          icon: 'ti-sort-descending-letters' },
    { mode: 'largest', label: 'Ukuran terbesar',     icon: 'ti-arrow-big-down' },
    { mode: 'smallest',label: 'Ukuran terkecil',     icon: 'ti-arrow-big-up' },
  ];

  var dd = document.createElement('div');
  dd.id = 'sortDropdown';
  dd.style.cssText = 'position:fixed;z-index:999;background:var(--white);border:1px solid var(--border-2);border-radius:var(--radius);box-shadow:var(--shadow-lg);padding:6px;min-width:210px;top:' + (rect.bottom + 6) + 'px;right:' + (window.innerWidth - rect.right) + 'px;';

  dd.innerHTML = '<div style="font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-5);padding:4px 10px 6px;font-family:\'JetBrains Mono\',monospace;">Urutkan berdasarkan</div>' +
    options.map(function(o) {
      var isActive = currentSort === o.mode;
      return '<div data-action="sort-mode" data-mode="' + o.mode + '" style="display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-sm);cursor:pointer;font-size:13px;color:' + (isActive ? 'var(--accent)' : 'var(--ink-2)') + ';background:' + (isActive ? 'rgba(200,96,42,0.07)' : 'transparent') + ';font-weight:' + (isActive ? '600' : '400') + ';transition:background 0.15s;">' +
        '<i class="ti ' + o.icon + '" style="font-size:15px;flex-shrink:0;opacity:0.7"></i>' + o.label +
        (isActive ? '<i class="ti ti-check" style="margin-left:auto;font-size:13px;color:var(--accent)"></i>' : '') +
      '</div>';
    }).join('');

  document.body.appendChild(dd);

  // Tutup jika klik di luar
  setTimeout(function() {
    document.addEventListener('click', function closeDd(e) {
      if (!dd.contains(e.target)) { dd.remove(); document.removeEventListener('click', closeDd); }
    });
  }, 10);
}

function setSortMode(mode) {
  var labels = { newest: 'Terbaru', oldest: 'Terlama', az: 'A-Z', za: 'Z-A', largest: 'Terbesar', smallest: 'Terkecil' };
  currentSort = mode;
  document.getElementById('sortLabel').textContent = labels[mode] || 'Urutkan';
  var dd = document.getElementById('sortDropdown');
  if (dd) dd.remove();
  showToast('Diurutkan: ' + labels[mode]);
  renderFiles();
}

/* ── RENDER FILES ── */
function renderFiles() {
  const grid = document.getElementById('fileGrid');
  if (!grid) return;

  if (isInitialDataLoading && !hasLoadedInitialData) {
    grid.innerHTML = `
      <div class="empty-state empty-state--first empty-state--loading">
        <div class="empty-state__icon-wrap">
          <i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i>
        </div>
        <p class="empty-state__title">Memuat file...</p>
        <p class="empty-state__desc">Sedang mengambil data dari storage kamu.</p>
      </div>`;
    const fileCountEl = document.getElementById('fileCount');
    if (fileCountEl) fileCountEl.textContent = '...';
    return;
  }

  const searchEl = document.getElementById('searchInput');
  const search = searchEl ? searchEl.value.toLowerCase() : '';
  const favs = getFavs();
  const baseFiles = getCurrentFileCollection();

  let filtered = baseFiles.filter(function(f) {
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
    if (currentSort === 'newest')   return new Date(b.created_at) - new Date(a.created_at);
    if (currentSort === 'oldest')   return new Date(a.created_at) - new Date(b.created_at);
    if (currentSort === 'az')       return a.name.localeCompare(b.name);
    if (currentSort === 'za')       return b.name.localeCompare(a.name);
    if (currentSort === 'largest')  return getFileSizeBytes(b) - getFileSizeBytes(a);
    if (currentSort === 'smallest') return getFileSizeBytes(a) - getFileSizeBytes(b);
    return 0;
  });

  if (filtered.length === 0) {
    const isReallyEmpty = baseFiles.length === 0 && !search && currentFilter === 'semua' && !currentFolderId && !showOnlyFavorites;
    if (isReallyEmpty) {
      if (showTrashMode) {
        grid.innerHTML = `
          <div class="empty-state empty-state--first">
            <div class="empty-state__icon-wrap">
              <i class="ti ti-trash-off"></i>
            </div>
            <p class="empty-state__title">Sampah kosong</p>
            <p class="empty-state__desc">File yang kamu hapus akan muncul di sini sebelum dihapus permanen.</p>
          </div>`;
      } else {
        grid.innerHTML = `
          <div class="empty-state empty-state--first">
            <div class="empty-state__icon-wrap">
              <i class="ti ti-cloud-upload"></i>
            </div>
            <p class="empty-state__title">Belum ada file</p>
            <p class="empty-state__desc">Upload file pertamamu atau buat folder untuk mulai mengorganisir file kamu.</p>
            <div class="empty-state__actions">
              <button class="empty-state__btn-primary" data-action="open-upload">
                <i class="ti ti-cloud-upload"></i> Upload File
              </button>
              <button class="empty-state__btn-secondary" data-action="new-folder">
                <i class="ti ti-folder-plus"></i> Buat Folder
              </button>
            </div>
          </div>`;
      }
    } else {
      const isSearch = !!search;
      const isFilter = currentFilter !== 'semua';
      const isFav    = showOnlyFavorites;
      let icon = 'ti-mood-empty';
      let msg  = 'Tidak ada file yang ditemukan.';
      if (isSearch)      { icon = 'ti-search-off'; msg = 'Tidak ada file yang cocok dengan pencarian "' + search + '".'; }
      else if (isFav)    { icon = 'ti-star-off';   msg = 'Belum ada file favorit. Klik kanan file lalu pilih "Tambah Favorit".'; }
      else if (isFilter) { icon = 'ti-filter-off'; msg = 'Tidak ada file dengan tipe ini di sini.'; }
      else if (showTrashMode) { icon = 'ti-trash-off'; msg = 'Tidak ada file di Sampah yang cocok.'; }
      else if (currentFolderId) { icon = 'ti-folder-open'; msg = 'Folder ini masih kosong.'; }
      grid.innerHTML = '<div class="empty-state"><i class="ti ' + icon + '"></i><p>' + msg + '</p></div>';
    }
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

  const IMG_EXTS = ['jpg','jpeg','png','gif','webp','svg'];

  grid.innerHTML = filtered.map(function(f, i) {
    const badge = FOLDER_BADGE[f.folder_name] || { bg: '#f3f4f6', color: '#6b7280' };
    const iconInfo = getFileIconInfo(f.name, f.type);
    const icon = iconInfo.icon;
    const iconColor = iconInfo.iconColor;
    const iconBg = iconInfo.iconBg;
    const dateSource = showTrashMode && f.deleted_at ? f.deleted_at : f.created_at;
    const date = new Date(dateSource).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    const safeId = escapeAttr(String(f.id));
    const safeName = escapeHtml(f.name);
    const safeFolder = escapeHtml(f.folder_name || '-');
    const isFav = favs.includes(String(f.id));
    const ext = (f.name || '').split('.').pop().toLowerCase();
    const isImage = f.type === 'foto' || IMG_EXTS.includes(ext);

    var isSelected = selectedFileIds.has(String(f.id));
    var selectedStyle = isSelected ? 'outline:2.5px solid #c8602a;outline-offset:2px;background:rgba(200,96,42,0.05);' : '';

    if (currentViewMode === 'list') {
      // ── LIST VIEW CARD ──
      return (
        '<div class="file-card" style="' + selectedStyle + '" data-file-card="1" data-file-id="' + safeId + '">' +
        // Checkbox
        '<div class="file-select-cb" style="display:' + (isSelectMode ? 'flex' : 'none') + ';flex-shrink:0;align-items:center;justify-content:center;">' +
        '<input type="checkbox" ' + (isSelected ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:var(--accent);" data-action="toggle-file-select" data-file-id="' + safeId + '"></div>' +
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
        (isSelectMode ? '' : '<div class="file-menu" data-file-menu="1" data-file-id="' + safeId + '">' +
        '<i class="ti ti-dots-vertical"></i></div>') +
        '</div>'
      );
    }

    // ── GRID VIEW CARD (default) ──
    var iconBox;
    if (isImage) {
      // Thumbnail — gambar di-load lazy via data attribute, diisi oleh loadThumbnails()
      iconBox =
        '<div class="file-icon-box file-thumb-box" style="background:var(--paper-2);overflow:hidden;position:relative;" data-thumb-id="' + safeId + '">' +
        '<i class="ti ti-photo" style="color:var(--ink-5);opacity:0.4;font-size:22px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)"></i>' +
        '<img class="file-thumb-img" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.3s ease;" alt="" />' +
        '</div>';
    } else {
      iconBox = '<div class="file-icon-box" style="background:' + iconBg + '">' +
        '<i class="ti ' + icon + '" style="color:' + iconColor + '"></i></div>';
    }

    return (
      '<div class="file-card" draggable="true" style="animation-delay:' + (i * 0.04) + 's; cursor:pointer; position:relative;' + selectedStyle + '" data-file-card="1" data-file-id="' + safeId + '">' +
      '<div class="file-select-cb" style="display:' + (isSelectMode ? 'flex' : 'none') + ';position:absolute;top:8px;left:8px;z-index:2;align-items:center;justify-content:center;">' +
      '<input type="checkbox" ' + (isSelected ? 'checked' : '') + ' style="width:16px;height:16px;cursor:pointer;accent-color:#c8602a;" data-action="toggle-file-select" data-file-id="' + safeId + '"></div>' +
      '<div class="file-top">' +
      '<div style="position:relative;display:inline-block">' +
      iconBox +
      '</div>' +
      '<div style="display:flex; gap:6px; align-items:center;">' +
      (isFav ? '<i class="ti ti-star" style="color:#fbbf24; font-size:16px;"></i>' : '') +
      (isSelectMode ? '' : '<div class="file-menu" data-file-menu="1" data-file-id="' + safeId + '">' +
      '<i class="ti ti-dots-vertical"></i></div>') + '</div></div>' +
      '<span class="fcat-badge" style="background:' + badge.bg + ';color:' + badge.color + ';margin-top:8px">' + safeFolder + '</span>' +
      '<div class="file-name" title="' + escapeAttr(f.name) + '">' + safeName + '</div>' +
      '<div class="file-info"><span>' + escapeHtml(f.size || '-') + '</span><span>' + date + '</span></div>' +
      '</div>'
    );
  }).join('');

  document.getElementById('fileCount').textContent = filtered.length;
  updateFileSectionTitle();

  // Load thumbnail untuk file gambar
  if (currentViewMode !== 'list') loadThumbnails(filtered);
}

/* ── THUMBNAIL LOADER ── */
async function loadThumbnails(files) {
  const IMG_EXTS = ['jpg','jpeg','png','gif','webp','svg'];
  const imageFiles = files.filter(function(f) {
    const ext = (f.name || '').split('.').pop().toLowerCase();
    return f.type === 'foto' || IMG_EXTS.includes(ext);
  });
  if (imageFiles.length === 0) return;

  // Proses max 6 thumbnail sekaligus
  var batch = 6;
  for (var i = 0; i < imageFiles.length; i += batch) {
    var chunk = imageFiles.slice(i, i + batch);
    await Promise.all(chunk.map(async function(f) {
      try {
        var box = document.querySelector('[data-thumb-id="' + escapeAttr(String(f.id)) + '"]');
        if (!box) return;
        var path = f.storage_path || (f.folder_name + '/' + f.name);
        var result = await sb.storage.from('user-files').createSignedUrl(path, 300);
        if (result.error || !result.data) return;
        var img = box.querySelector('.file-thumb-img');
        if (!img) return;
        img.onload = function() { this.style.opacity = '1'; };
        img.src = result.data.signedUrl;
      } catch(e) {}
    }));
  }
}

/* ── OPEN FILE (viewer) ── */
function openFile(id) {
  const file = allFiles.find(function(f) { return String(f.id) === String(id); });
  if (!file) return;
  if (isFileTrashed(file)) { showToast('File ini ada di Sampah. Pulihkan dulu untuk membukanya.'); return; }
  const path = getFileStoragePath(file);
  const params = new URLSearchParams({
    id: String(file.id),
    path: path,
    name: file.name,
    type: file.type || 'doc',
    size: file.size || ''
  });
  window.open('pages/viewer.html?' + params.toString(), '_blank');
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

async function renderShared() {
  const list = document.getElementById('sharedList');
  if (!list) return;

  list.innerHTML = '<div class="empty-state"><i class="ti ti-loader-2" style="animation:spin .8s linear infinite"></i><p>Memuat link dibagikan...</p></div>';
  await loadSharedLinks();
  const now = Date.now();
  sharedLinks = (sharedLinks || []).filter(function(s) {
    return !s.revokedAt && (s.expiresAt || (s.createdAt + 7 * 24 * 60 * 60 * 1000)) > now;
  });
  localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));

  if (document.getElementById('sharedCount')) document.getElementById('sharedCount').textContent = sharedLinks.length;
  if (document.getElementById('statShared')) document.getElementById('statShared').textContent = sharedLinks.length;
  var bShared = document.getElementById('badgeShared');
  if (bShared) { if (sharedLinks.length > 0) { bShared.textContent = sharedLinks.length; bShared.style.display = 'inline-block'; } else { bShared.style.display = 'none'; } }

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
    const created = new Date(s.createdAt || Date.now());
    const expiry  = new Date(s.expiresAt || (s.createdAt + 7 * 24 * 60 * 60 * 1000));
    const daysLeft = Math.max(0, Math.ceil((expiry - now) / (24 * 60 * 60 * 1000)));
    const dateStr = created.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const accessInfo = s.accessCount ? ' · ' + s.accessCount + 'x dibuka' : '';

    return (
      '<div style="background:#fff;border:1px solid rgba(15,14,13,0.08);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(15,14,13,0.06)" class="shared-item">' +
      '<div style="width:40px;height:40px;border-radius:10px;background:' + iconInfo.bg + ';display:flex;align-items:center;justify-content:center;flex-shrink:0">' +
      '<i class="ti ' + iconInfo.icon + '" style="color:' + iconInfo.color + ';font-size:18px"></i></div>' +
      '<div style="flex:1;min-width:0">' +
      '<div style="font-size:13px;font-weight:500;color:#0f0e0d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(s.name) + '</div>' +
      '<div style="font-size:10.5px;color:#9a9693;margin-top:3px;font-family:\'JetBrains Mono\',monospace">Dibagikan ' + dateStr + ' · <span style="color:' + (daysLeft <= 1 ? '#c0392b' : '#92400e') + '">' + daysLeft + ' hari tersisa</span>' + accessInfo + '</div>' +
      '<div style="font-size:11px;color:#9a9693;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(s.url || '') + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-shrink:0">' +
      '<button data-action="copy-shared" data-index="' + i + '" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:#f7f5f2;border:1px solid rgba(15,14,13,0.14);border-radius:8px;color:#5a5754;font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.15s">' +
      '<i class="ti ti-copy" style="font-size:13px"></i>Salin</button>' +
      '<a href="' + escapeAttr(s.url || '#') + '" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:#f7f5f2;border:1px solid rgba(15,14,13,0.14);border-radius:8px;color:#5a5754;font-size:12px;cursor:pointer;font-family:inherit;text-decoration:none">' +
      '<i class="ti ti-external-link" style="font-size:13px"></i>Buka</a>' +
      '<button data-action="remove-shared" data-index="' + i + '" style="display:flex;align-items:center;gap:5px;padding:6px 12px;background:rgba(192,57,43,0.06);border:1px solid rgba(192,57,43,0.15);border-radius:8px;color:#c0392b;font-size:12px;cursor:pointer;font-family:inherit;transition:all 0.15s">' +
      '<i class="ti ti-link-off" style="font-size:13px"></i>Cabut</button>' +
      '</div></div>'
    );
  }).join('');
}

function copySharedLink(idx) {
  const s = sharedLinks[parseInt(idx, 10)];
  if (!s) return;
  try {
    navigator.clipboard.writeText(s.url);
    showToast('Link publik berhasil disalin!');
  } catch {
    customPrompt({
      title: 'Salin Link Publik',
      message: 'Salin link berikut secara manual:',
      defaultValue: s.url,
      icon: 'ti-link',
      iconClass: 'prompt',
      confirmText: 'Tutup'
    });
  }
}

async function removeSharedLink(idx) {
  const removed = sharedLinks[parseInt(idx, 10)];
  if (!removed) return;
  const ok = await customConfirm({
    title: 'Cabut Link',
    message: 'Link publik untuk "' + removed.name + '" akan dinonaktifkan. Lanjutkan?',
    icon: 'ti-link-off',
    confirmText: 'Ya, Cabut',
    confirmBtnClass: 'danger'
  });
  if (!ok) return;

  if (removed.sharedId) {
    const { error } = await sb.from('shared_links').update({ revoked_at: new Date().toISOString() }).eq('id', removed.sharedId);
    if (error) { showToast('Gagal mencabut link: ' + error.message); return; }
  }

  sharedLinks = sharedLinks.filter(function(_, i) { return i !== parseInt(idx, 10); });
  localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));
  await logActivity('revoke_share', { id: removed.fileId, name: removed.name }, { shared_id: removed.sharedId, token: removed.token });
  showToast('Link publik berhasil dicabut.');
  await renderShared();
  renderStats();
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
  showTrashMode = false;
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

function filterFoldersOnly() {
  const input = document.getElementById('folderSearchInput');
  const btn = document.getElementById('folderSearchClear');
  folderSearchQuery = input ? input.value.trim().toLowerCase() : '';
  if (btn) btn.style.display = folderSearchQuery ? 'flex' : 'none';
  isFolderExpanded = true;
  renderFolders();
}

function clearFolderSearch() {
  folderSearchQuery = '';
  const input = document.getElementById('folderSearchInput');
  const btn = document.getElementById('folderSearchClear');
  if (input) input.value = '';
  if (btn) btn.style.display = 'none';
  isFolderExpanded = false;
  renderFolders();
}

function filterFiles() {
  const search = document.getElementById('searchInput').value.toLowerCase().trim();
  if (search.length > 0) {
    currentFolderFilter = null;
    currentFilter = 'semua';
    showTrashMode = false;
    document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
    var firstChip = document.querySelector('.filter-chip');
    if (firstChip) firstChip.classList.add('active');
    showOnlyFavorites = false;
    showTrashMode = false;
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
    const fileCount = getActiveFiles().filter(function(x) { return x.folder_id === f.id || (!x.folder_id && x.folder_name === f.name); }).length;
    const subCount = allFolders.filter(function(x) { return x.parent_id === f.id; }).length;
    const safeName = escapeHtml(f.name);
    const safeId = escapeAttr(f.id);    const subLabel = subCount > 0 ? subCount + ' folder · ' + fileCount + ' file' : fileCount + ' file';
    return (
      '<div class="folder-wrap" style="animation-delay:' + (i * 0.06) + 's; position:relative;" data-folder-card="1" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +
      '<button class="folder-action-btn folder-rename-btn" title="Rename folder" style="position:absolute;right:70px;top:8px;z-index:6;width:26px;height:26px;border:0;border-radius:8px;background:rgba(255,255,255,0.82);color:#0f0e0d;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.12)" data-action="folder-rename" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '"><i class="ti ti-edit" style="font-size:14px"></i></button>' +
      '<button class="folder-action-btn folder-move-btn" title="Pindah folder" style="position:absolute;right:39px;top:8px;z-index:6;width:26px;height:26px;border:0;border-radius:8px;background:rgba(255,255,255,0.82);color:#0f0e0d;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.12)" data-action="folder-move" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '"><i class="ti ti-folder-symlink" style="font-size:14px"></i></button>' +
      '<button class="folder-delete-btn" title="Hapus folder" data-action="folder-delete" data-folder-id="' + safeId + '" data-folder-name="' + escapeAttr(f.name) + '">' +
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
  showTrashMode = false;
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


function showTrashView() {
  showTrashMode = true;
  showOnlyFavorites = false;
  currentFilter = 'semua';
  currentFolderFilter = null;
  currentFolderId = null;
  folderPath = [];
  selectedFileIds.clear();
  hideSharedPanel();
  resetFolderUI();
  document.querySelectorAll('.filter-chip').forEach(function(c) { c.classList.remove('active'); });
  var firstChip = document.querySelector('.filter-chip[data-filter="semua"]') || document.querySelector('.filter-chip');
  if (firstChip) firstChip.classList.add('active');
  updateFileSectionTitle();
  renderFiles();
  showToast('Menampilkan file di Sampah');
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

  let uid;
  try {
    uid = await getCurrentUserId();
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    btnConfirm.disabled = false;
    btnCancel.disabled = false;
    btnConfirm.textContent = 'Upload';
    return;
  }
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

/* ── RENAME & MOVE FOLDER (safe) ── */
async function renameFolderById(folderId, folderName) {
  var folder = allFolders.find(function(f) { return String(f.id) === String(folderId); });
  if (!folder) { showToast('Folder tidak ditemukan.'); return; }

  var result = await customPrompt({
    title: 'Rename Folder',
    message: 'Masukkan nama baru untuk folder "' + folder.name + '":',
    defaultValue: folder.name,
    placeholder: 'Nama folder baru...',
    icon: 'ti-folder-cog',
    iconClass: 'prompt',
    confirmText: 'Ubah Nama'
  });
  if (result === null) return;

  var valid = isValidFolderName(result);
  if (!valid.ok) { showToast(valid.message); return; }
  var newName = valid.name;
  if (newName.toLowerCase() === normalizeFolderName(folder.name).toLowerCase()) return;

  var parentId = folder.parent_id || null;
  if (folderNameExistsInParent(newName, parentId, folderId)) {
    showToast('Nama folder "' + newName + '" sudah ada di lokasi ini.');
    return;
  }

  showToast('Mengubah nama folder...');
  const { error } = await sb.from('folders').update({ name: newName }).eq('id', folderId);
  if (error) { showToast('Gagal rename folder: ' + error.message); return; }

  // folder_name masih disimpan di rows file untuk label lama; sinkronkan file langsung di folder ini.
  await sb.from('files').update({ folder_name: newName }).eq('folder_id', folderId);
  try { await sb.from('shared_links').update({ folder_name: newName }).eq('folder_name', folder.name); } catch(e) {}

  updateFolderLocal(folderId, { name: newName });
  allFiles.forEach(function(file) { if (String(file.folder_id || '') === String(folderId)) file.folder_name = newName; });
  var bcIdx = folderPath.findIndex(function(c) { return String(c.id) === String(folderId); });
  if (bcIdx !== -1) folderPath[bcIdx].name = newName;

  await logActivity('rename_folder', { id: folderId, name: newName }, { old_name: folder.name, new_name: newName, folder_id: folderId });
  showToast('📁 Folder berhasil diubah menjadi "' + newName + '".');
  await loadFolders();
  renderFiles();
  renderStats();
}

function startFolderRename(folderId, folderName, el) {
  // Double click tetap didukung, tapi sekarang memakai prompt yang lebih aman.
  renameFolderById(folderId, folderName);
}

function ensureFolderMoveModal() {
  var existing = document.getElementById('folderMoveModal');
  if (existing) return existing;
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'folderMoveModal';
  overlay.innerHTML =
    '<div class="modal">' +
      '<div class="modal-title">Pindah Folder</div>' +
      '<div class="modal-sub" id="folderMoveModalSub">Pilih lokasi tujuan.</div>' +
      '<div class="modal-row"><select class="modal-select" id="folderMoveSelect"></select></div>' +
      '<div style="font-size:11.5px;color:var(--ink-4);line-height:1.45;margin-top:-4px;margin-bottom:10px">Folder tidak bisa dipindah ke dirinya sendiri atau ke subfoldernya sendiri. Nama folder juga tidak boleh duplikat di lokasi tujuan.</div>' +
      '<div class="modal-footer">' +
        '<button class="btn-cancel" type="button" data-action="close-folder-move-modal">Batal</button>' +
        '<button class="btn-confirm" type="button" data-action="confirm-move-folder">Pindahkan</button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === overlay) closeFolderMoveModal(); });
  return overlay;
}

let folderMoveTargetId = null;

function moveFolderById(folderId, folderName) {
  var folder = allFolders.find(function(f) { return String(f.id) === String(folderId); });
  if (!folder) { showToast('Folder tidak ditemukan.'); return; }
  folderMoveTargetId = folderId;
  var modal = ensureFolderMoveModal();
  var select = document.getElementById('folderMoveSelect');
  var sub = document.getElementById('folderMoveModalSub');
  if (sub) sub.textContent = 'Pindahkan "' + folder.name + '" dari ' + getFolderDisplayPath(folder.parent_id) + ' ke:';
  if (select) select.innerHTML = buildFolderDestinationOptions(folderId, folder.parent_id || null);
  modal.classList.add('show');
}

function closeFolderMoveModal() {
  var modal = document.getElementById('folderMoveModal');
  if (modal) modal.classList.remove('show');
  folderMoveTargetId = null;
}

async function confirmMoveFolder() {
  if (!folderMoveTargetId) return;
  var folder = allFolders.find(function(f) { return String(f.id) === String(folderMoveTargetId); });
  if (!folder) { closeFolderMoveModal(); showToast('Folder tidak ditemukan.'); return; }
  var select = document.getElementById('folderMoveSelect');
  var targetParentId = select && select.value ? select.value : null;
  var oldParentId = folder.parent_id || null;

  if ((targetParentId || null) === oldParentId) {
    showToast('Folder sudah berada di lokasi itu.');
    return;
  }
  if (targetParentId && String(targetParentId) === String(folder.id)) {
    showToast('Folder tidak bisa dipindah ke dirinya sendiri.');
    return;
  }
  var descendants = getDescendantFolderIds(folder.id).map(String);
  if (targetParentId && descendants.includes(String(targetParentId))) {
    showToast('Folder tidak bisa dipindah ke subfoldernya sendiri.');
    return;
  }
  if (folderNameExistsInParent(folder.name, targetParentId, folder.id)) {
    showToast('Di lokasi tujuan sudah ada folder bernama "' + folder.name + '".');
    return;
  }

  var btn = document.querySelector('#folderMoveModal .btn-confirm');
  if (btn) { btn.disabled = true; btn.textContent = 'Memindahkan...'; }

  const { error } = await sb.from('folders').update({ parent_id: targetParentId }).eq('id', folder.id);
  if (btn) { btn.disabled = false; btn.textContent = 'Pindahkan'; }
  if (error) { showToast('Gagal memindahkan folder: ' + error.message); return; }

  updateFolderLocal(folder.id, { parent_id: targetParentId });
  if (currentFolderId) folderPath = buildFolderPathById(currentFolderId);
  await logActivity('move_folder', { id: folder.id, name: folder.name }, { folder_id: folder.id, old_parent_id: oldParentId, new_parent_id: targetParentId });

  closeFolderMoveModal();
  showToast('📁 Folder berhasil dipindahkan ke ' + getFolderDisplayPath(targetParentId) + '.');
  await loadFolders();
  renderFiles();
  renderStats();
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
    ? 'Folder "' + folderName + '" berisi ' + filesInside.length + ' file' + (allSubIds.length > 1 ? ' dan ' + (allSubIds.length - 1) + ' subfolder' : '') + '. Semua file di dalamnya akan dipindahkan ke Sampah.'
    : 'Yakin ingin menghapus folder "' + folderName + '"' + (allSubIds.length > 1 ? ' beserta ' + (allSubIds.length - 1) + ' subfoldernya' : '') + '?';

  const confirmed = await customConfirm({
    title: 'Hapus Folder',
    message: msg,
    icon: 'ti-trash',
    confirmText: 'Pindahkan ke Sampah',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) return;

  showToast('Memindahkan isi folder ke Sampah...');
  var deletedAt = new Date().toISOString();
  var fileIdsInside = filesInside.map(function(file) { return file.id; });
  if (fileIdsInside.length > 0) {
    await sb.from('files').update({ deleted_at: deletedAt, folder_id: null, folder_name: null }).in('id', fileIdsInside);
    try { await sb.from('shared_links').update({ revoked_at: deletedAt }).in('file_id', fileIdsInside); } catch(e) {}
  }
  // Setelah isinya masuk Sampah, metadata folder boleh dihapus supaya daftar folder tetap rapi.
  await sb.from('folders').delete().in('id', allSubIds);

  if (currentFolderId && allSubIds.includes(currentFolderId)) {
    currentFolderId = null;
    currentFolderFilter = null;
    folderPath = [];
    updateFileSectionTitle();
  }
  await logActivity('delete_folder', { id: folderId, name: folderName }, { folder_id: folderId, moved_files_to_trash: filesInside.length, folder_ids: allSubIds });
  showToast('Folder "' + folderName + '" dihapus. ' + filesInside.length + ' file dipindahkan ke Sampah.');
  await loadAll();
}

/* ── CONTEXT MENU ── */
function closeCtxMenu() {
  var menu = document.getElementById('ctxMenu');
  if (!menu) return;
  menu.classList.remove('show', 'ctx-menu--mobile');
  document.body.classList.remove('ctx-open-mobile');
}

function setCtxItemVisibility(action, visible) {
  var item = document.querySelector('#ctxMenu [data-action="' + action + '"]');
  if (item) item.style.display = visible ? 'flex' : 'none';
}

function showCtx(e, id) {
  e.preventDefault();
  e.stopPropagation();
  ctxTarget = String(id);
  const menu = document.getElementById('ctxMenu');
  if (!menu) return;

  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  var trashed = isFileTrashed(file);
  var fnEl = document.getElementById('ctxFileName');
  if (fnEl && file) {
    var name = file.name || '—';
    fnEl.textContent = name.length > 28 ? name.substring(0, 26) + '…' : name;
  }

  setCtxItemVisibility('ctx-download', !trashed);
  setCtxItemVisibility('ctx-share', !trashed);
  setCtxItemVisibility('ctx-rename', !trashed);
  setCtxItemVisibility('ctx-move', !trashed);
  setCtxItemVisibility('ctx-favorite', !trashed);
  setCtxItemVisibility('ctx-delete', !trashed);
  setCtxItemVisibility('ctx-restore', trashed);
  setCtxItemVisibility('ctx-delete-permanent', trashed);

  menu.classList.remove('ctx-menu--mobile');
  document.body.classList.remove('ctx-open-mobile');

  if (window.matchMedia && window.matchMedia('(max-width: 768px)').matches) {
    menu.style.top = '';
    menu.style.left = '';
    menu.classList.add('show', 'ctx-menu--mobile');
    document.body.classList.add('ctx-open-mobile');
    return;
  }

  const menuH = trashed ? 160 : 260;
  const menuW = 210;
  const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
  const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
  menu.style.top  = y + 'px';
  menu.style.left = x + 'px';
  menu.classList.add('show');
}

document.addEventListener('click', function() {
  closeCtxMenu();
});

/* ── DOWNLOAD ── */
async function downloadFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  closeCtxMenu();
  showToast('Menyiapkan file download...');
  const path = getFileStoragePath(file);
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
  closeCtxMenu();

  const path = getFileStoragePath(file);
  const token = generateShareToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  let sharedRow = null;

  try {
    const userId = await getCurrentUserId();

    // Cabut link aktif lama untuk file yang sama agar satu file hanya punya satu link aktif terbaru.
    await sb
      .from('shared_links')
      .update({ revoked_at: new Date().toISOString() })
      .eq('file_id', file.id)
      .eq('user_id', userId)
      .is('revoked_at', null);

    const { data, error } = await sb
      .from('shared_links')
      .insert({
        token: token,
        file_id: file.id,
        user_id: userId,
        expires_at: expiresAt,
        file_name: file.name,
        file_type: file.type || 'doc',
        folder_name: file.folder_name || null,
        storage_path_snapshot: path
      })
      .select('id, token, file_id, expires_at, revoked_at, created_at, access_count, last_accessed_at, files(id,name,type,folder_name,size)')
      .single();

    if (error) throw error;
    sharedRow = data;
  } catch (e) {
    showToast('Gagal membuat public share link: ' + (e.message || e));
    return;
  }

  const item = normalizeSharedRow(sharedRow);
  sharedLinks = sharedLinks.filter(function(s) { return s.fileId !== String(file.id); });
  sharedLinks.unshift(item);
  localStorage.setItem('myStorageShared', JSON.stringify(sharedLinks));
  await logActivity('share_file', file, { shared_id: item.sharedId, token: item.token, expires_at: expiresAt });

  try {
    await navigator.clipboard.writeText(item.url);
    showToast('Link publik berhasil dibuat dan disalin!');
  } catch {
    customPrompt({
      title: 'Link Publik',
      message: 'Salin link berikut secara manual:',
      defaultValue: item.url,
      icon: 'ti-link',
      iconClass: 'prompt',
      confirmText: 'Tutup'
    });
    showToast('Link publik berhasil dibuat!');
  }

  renderStats();
  if (document.getElementById('sharedPanel') && document.getElementById('sharedPanel').style.display !== 'none') {
    await renderShared();
  }
}

/* ── RENAME ── */
async function renameFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  closeCtxMenu();
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
  const oldPath = getFileStoragePath(file);
  let newPath;
  try {
    newPath = await buildStoragePath(file.folder_id || null, newName.trim());
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    return;
  }
  const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
  if (moveErr) { showToast('Gagal mengubah di Storage: ' + moveErr.message); return; }
  const { error: dbErr } = await sb.from('files').update({ name: newName.trim(), storage_path: newPath }).eq('id', file.id);
  if (dbErr) { showToast('Gagal mengubah di Database: ' + dbErr.message); return; }
  showToast('Nama file berhasil diubah!');
  await logActivity('rename_file', { id: file.id, name: newName.trim() }, { old_name: file.name, new_name: newName.trim() });
  await loadFiles();
  renderStats();
}

/* ── MOVE FILE ── */
function moveFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  closeCtxMenu();

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

  const oldPath = getFileStoragePath(file);
  let newPath;
  try {
    newPath = await buildStoragePath(targetFolderId, file.name);
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    if (btn) { btn.disabled = false; btn.textContent = 'Pindahkan'; }
    return;
  }

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
  await logActivity('move_file', file, { folder_id: targetFolderId, folder_name: targetFolder });
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
  closeCtxMenu();
  renderFiles();
  renderStats();
}

/* ── DELETE FILE (with Undo) ── */
async function deleteFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  const confirmed = await customConfirm({
    title: 'Pindahkan ke Sampah',
    message: 'File "' + file.name + '" akan dipindahkan ke Sampah. Kamu masih bisa memulihkannya nanti.',
    icon: 'ti-trash',
    confirmText: 'Pindahkan',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) { ctxTarget = null; return; }
  closeCtxMenu();

  const fileId = ctxTarget;
  const deletedAt = new Date().toISOString();
  const { error } = await sb.from('files').update({ deleted_at: deletedAt }).eq('id', fileId);
  if (error) { showToast('Gagal memindahkan ke Sampah: ' + error.message); ctxTarget = null; return; }
  try { await sb.from('shared_links').update({ revoked_at: deletedAt }).eq('file_id', fileId); } catch(e) {}

  await logActivity('trash_file', file, { deleted_at: deletedAt, storage_path: getFileStoragePath(file) });

  var favs = getFavs();
  if (favs.includes(fileId)) {
    favs = favs.filter(function(id) { return id !== fileId; });
    localStorage.setItem('myStorageFavs', JSON.stringify(favs));
  }

  ctxTarget = null;
  await loadFiles();
  renderStats();
  showToast('🗑️ "' + file.name + '" dipindahkan ke Sampah.');
}

async function restoreFile() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  closeCtxMenu();
  const { error } = await sb.from('files').update({ deleted_at: null, deleted_by: null }).eq('id', file.id);
  if (error) { showToast('Gagal memulihkan file: ' + error.message); ctxTarget = null; return; }
  await logActivity('restore_file', file, { restored_at: new Date().toISOString() });
  ctxTarget = null;
  await loadFiles();
  renderStats();
  showToast('✅ File berhasil dipulihkan.');
}

async function deleteFilePermanently() {
  if (!ctxTarget) return;
  const file = allFiles.find(function(f) { return String(f.id) === ctxTarget; });
  if (!file) return;
  const ok = await customConfirm({
    title: 'Hapus Permanen',
    message: 'Hapus permanen "' + file.name + '"? File tidak bisa dipulihkan lagi.',
    icon: 'ti-trash',
    confirmText: 'Hapus Permanen',
    confirmBtnClass: 'danger'
  });
  if (!ok) { ctxTarget = null; return; }
  closeCtxMenu();
  const pathToDelete = getFileStoragePath(file);
  const { error: dbError } = await sb.from('files').delete().eq('id', file.id);
  if (dbError) { showToast('Gagal hapus permanen: ' + dbError.message); ctxTarget = null; return; }
  try { await sb.storage.from('user-files').remove([pathToDelete]); } catch(e) {}
  await logActivity('delete_file', file, { storage_path: pathToDelete, permanent: true });
  ctxTarget = null;
  await loadFiles();
  renderStats();
  showToast('🗑️ File dihapus permanen.');
}

/* ── STORAGE NOTIFICATION CHECK ── */
function checkStorageNotif(usedBytes) {
  const s = JSON.parse(localStorage.getItem('myStorageNotifSettings') || '{}');
  if (s.inApp === false) { updateNotificationBadge(); return; }

  const threshold = s.threshold || 80;
  const totalBytes = MAX_STORAGE_BYTES;
  const pct = (usedBytes / totalBytes) * 100;

  const lastShown = parseInt(localStorage.getItem('myStorageNotifLastShown') || '0');
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;

  updateNotificationBadge();

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

function buildNotificationItems() {
  const items = [];
  const settings = JSON.parse(localStorage.getItem('myStorageNotifSettings') || '{}');
  const threshold = settings.threshold || 80;
  const usedBytes = calcTotalUsedBytes();
  const pct = (usedBytes / MAX_STORAGE_BYTES) * 100;
  const remaining = Math.max(0, MAX_STORAGE_BYTES - usedBytes);

  if (pct >= 90 && settings.critical !== false) {
    items.push({
      type: 'danger',
      icon: 'ti-alert-triangle',
      title: 'Storage hampir penuh',
      desc: pct.toFixed(0) + '% terpakai. Sisa ' + formatFileSizeFromBytes(remaining) + '.',
      action: 'Hapus file yang tidak perlu atau pindahkan ke tempat lain.'
    });
  } else if (pct >= threshold && settings.inApp !== false) {
    items.push({
      type: 'warn',
      icon: 'ti-alert-circle',
      title: 'Storage melewati batas peringatan',
      desc: pct.toFixed(0) + '% terpakai dari 1 GB.',
      action: 'Batas peringatan kamu: ' + threshold + '%.'
    });
  }

  const todayKey = new Date().toISOString().split('T')[0];
  const uploadedToday = allFiles.filter(function(file) {
    return file.created_at && file.created_at.split('T')[0] === todayKey;
  }).length;
  if (uploadedToday > 0) {
    items.push({
      type: 'info',
      icon: 'ti-cloud-upload',
      title: uploadedToday + ' file diupload hari ini',
      desc: 'Aktivitas upload terbaru sudah masuk ke storage.',
      action: 'Total storage sekarang ' + formatFileSizeFromBytes(usedBytes) + '.'
    });
  }

  const now = Date.now();
  const expiringShared = (sharedLinks || []).filter(function(link) {
    const left = (link.expiresAt || (link.createdAt + 7 * 24 * 60 * 60 * 1000)) - now;
    return !link.revokedAt && left > 0 && left <= 24 * 60 * 60 * 1000;
  }).length;
  if (expiringShared > 0) {
    items.push({
      type: 'warn',
      icon: 'ti-link',
      title: expiringShared + ' link hampir expired',
      desc: 'Link share akan habis dalam 24 jam.',
      action: 'Buka menu Dibagikan untuk mengecek link.'
    });
  }

  if (hasLoadedInitialData && allFiles.length === 0) {
    items.push({
      type: 'info',
      icon: 'ti-cloud-upload',
      title: 'Belum ada file',
      desc: 'Upload file pertama untuk mulai memakai storage.',
      action: 'Klik tombol Upload di kanan atas.'
    });
  }

  return items;
}

function ensureNotificationPanel() {
  if (document.getElementById('notificationPanel')) return;
  const panel = document.createElement('div');
  panel.id = 'notificationPanel';
  panel.style.cssText = 'position:fixed;right:72px;top:62px;z-index:9999;width:min(420px,calc(100vw - 28px));max-height:calc(100vh - 84px);overflow:auto;background:var(--white);border:1px solid var(--border-2);border-radius:18px;box-shadow:var(--shadow-lg);padding:12px;display:none;color:var(--ink-2);';
  panel.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><strong style="font-family:Outfit,sans-serif;font-size:14px">Notifikasi & Aktivitas</strong><button type="button" data-action="close-notifications" style="border:0;background:transparent;color:var(--ink-4);cursor:pointer;font-size:18px;line-height:1">&times;</button></div><div id="notificationList"></div><div style="height:1px;background:var(--border);margin:10px 0"></div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px"><strong style="font-family:Outfit,sans-serif;font-size:13px">Aktivitas terbaru</strong><button type="button" data-action="refresh-activity" style="border:0;background:transparent;color:var(--accent);cursor:pointer;font-size:12px;font-weight:600">Refresh</button></div><div id="activityList"></div>';
  document.body.appendChild(panel);
}

function renderNotificationPanel() {
  ensureNotificationPanel();
  const list = document.getElementById('notificationList');
  const items = buildNotificationItems();
  if (!list) return;

  if (items.length === 0) {
    const usedBytes = calcTotalUsedBytes();
    list.innerHTML = '<div style="padding:18px 10px;text-align:center;color:var(--ink-4)"><i class="ti ti-bell-check" style="font-size:28px;color:var(--green);display:block;margin-bottom:8px"></i><div style="font-weight:600;color:var(--ink-2);margin-bottom:3px">Tidak ada peringatan</div><div style="font-size:12px;line-height:1.45">Storage aman. Terpakai ' + formatFileSizeFromBytes(usedBytes) + ' dari 1 GB.</div></div>';
    renderActivityList();
    return;
  }

  list.innerHTML = items.map(function(item) {
    const color = item.type === 'danger' ? '#c0392b' : item.type === 'warn' ? '#92400e' : '#1d4ed8';
    const bg = item.type === 'danger' ? 'rgba(192,57,43,0.08)' : item.type === 'warn' ? 'rgba(146,64,14,0.08)' : 'rgba(29,78,216,0.08)';
    return '<div style="display:flex;gap:10px;padding:10px;border-radius:14px;background:' + bg + ';margin-bottom:8px;border:1px solid rgba(15,14,13,0.06)">' +
      '<div style="width:32px;height:32px;border-radius:10px;background:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ti ' + item.icon + '" style="color:' + color + ';font-size:17px"></i></div>' +
      '<div style="min-width:0;flex:1"><div style="font-size:13px;font-weight:700;color:var(--ink);margin-bottom:2px">' + escapeHtml(item.title) + '</div>' +
      '<div style="font-size:12px;color:var(--ink-4);line-height:1.4">' + escapeHtml(item.desc) + '</div>' +
      '<div style="font-size:11px;color:' + color + ';margin-top:5px;font-weight:600">' + escapeHtml(item.action) + '</div></div></div>';
  }).join('');
  renderActivityList();
}


function renderActivityList() {
  const list = document.getElementById('activityList');
  if (!list) return;
  const logs = activityLogs || [];
  if (logs.length === 0) {
    list.innerHTML = '<div style="padding:14px 10px;text-align:center;color:var(--ink-4);font-size:12px"><i class="ti ti-activity" style="font-size:24px;display:block;margin-bottom:6px;color:var(--ink-5)"></i>Belum ada aktivitas.</div>';
    return;
  }
  list.innerHTML = logs.slice(0, 8).map(function(log) {
    var meta = getActivityMeta(log.action);
    var name = log.file_name || (log.details && log.details.folder_name) || 'Item';
    return '<div style="display:flex;gap:10px;align-items:flex-start;padding:9px 4px;border-bottom:1px solid var(--border)">' +
      '<div style="width:30px;height:30px;border-radius:10px;background:rgba(15,14,13,0.05);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ti ' + meta.icon + '" style="font-size:16px;color:' + meta.color + '"></i></div>' +
      '<div style="min-width:0;flex:1"><div style="font-size:12.5px;font-weight:700;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(meta.label) + '</div>' +
      '<div style="font-size:12px;color:var(--ink-4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escapeHtml(name) + '</div>' +
      '<div style="font-size:10.5px;color:var(--ink-5);margin-top:2px;font-family:\'JetBrains Mono\',monospace">' + escapeHtml(formatActivityTime(log.created_at)) + '</div></div></div>';
  }).join('');
}

function updateNotificationBadge() {
  const dot = document.querySelector('.notif-dot');
  const items = buildNotificationItems();
  if (dot) dot.style.display = items.length > 0 ? 'block' : 'none';
  const btn = document.querySelector('[data-action="show-empty-notif"]');
  if (btn) btn.title = items.length > 0 ? (items.length + ' notifikasi') : 'Tidak ada peringatan';
}

async function toggleNotifications() {
  await loadActivityLogs();
  renderNotificationPanel();
  const panel = document.getElementById('notificationPanel');
  if (!panel) return;
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function closeNotifications() {
  const panel = document.getElementById('notificationPanel');
  if (panel) panel.style.display = 'none';
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
  const folderId = document.getElementById('folderSelect').value || currentFolderId || null;
  const folderObj = folderId ? allFolders.find(function(f) { return f.id === folderId; }) : null;
  const folder = folderObj ? folderObj.name : null;

  const fileInput = document.getElementById('fileInput');
  const files = Array.from((droppedFiles && droppedFiles.length > 0) ? droppedFiles : fileInput.files || []);
  if (!files || files.length === 0) { showToast('Pilih file dulu!'); return; }

  const quota = await validateUploadQuota(files);
  if (!quota.ok) { showToast(quota.message); return; }

  const btnConfirm = document.querySelector('.btn-confirm');
  const btnCancel  = document.querySelector('.btn-cancel');
  if (btnConfirm) btnConfirm.disabled = true;
  if (btnCancel) btnCancel.disabled  = true;

  var progressBox = ensureUploadProgressBox('selectedFiles');
  activeUploadCancelled = false;
  var progressState = { title: 'Upload file ke ' + (folder || 'Dashboard'), total: files.length, done: 0, failed: 0, currentIndex: 0, items: [] };
  renderDetailedUploadProgress(progressBox, progressState);

  let successCount = 0;
  let failCount = 0;
  let cancelledCount = 0;
  let errorMessages = [];
  const total = files.length;

  let uid;
  try {
    uid = await getCurrentUserId();
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    if (btnConfirm) { btnConfirm.disabled = false; btnConfirm.textContent = 'Upload'; }
    if (btnCancel) btnCancel.disabled = false;
    return;
  }

  for (let i = 0; i < total; i++) {
    if (activeUploadCancelled) {
      cancelledCount = total - i;
      break;
    }

    const file = files[i];
    progressState.currentIndex = i + 1;
    pushUploadProgressItem(progressState, { name: file.name, status: 'uploading', message: formatFileSizeFromBytes(file.size) });
    renderDetailedUploadProgress(progressBox, progressState);
    if (btnConfirm) btnConfirm.textContent = 'Upload ' + (i + 1) + '/' + total;

    const ext = file.name.split('.').pop().toLowerCase();
    let type = 'doc';
    if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) type = 'foto';
    else if (['mp4','mov','avi','mkv','webm'].includes(ext)) type = 'video';
    else if (ext === 'pdf') type = 'pdf';
    else if (['xlsx','csv','xls'].includes(ext)) type = 'spreadsheet';
    else if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) type = 'audio';
    else if (['doc','docx','txt','odt','rtf','pptx','ppt'].includes(ext)) type = 'doc';

    const iconInfo = FILE_ICONS[type] || FILE_ICONS['doc'];
    const sizeStr = formatFileSizeFromBytes(file.size);
    const filePath = buildStoragePathForUser(uid, folderId, file.name);

    try {
      const { error: uploadError } = await sb.storage.from('user-files').upload(filePath, file);
      if (uploadError) throw new Error(uploadError.message);

      const { error: insertError } = await sb.from('files').insert({
        name: file.name,
        folder_name: folder,
        folder_id: folderId || null,
        type: type,
        size: sizeStr,
        size_bytes: file.size,
        icon: iconInfo.icon,
        icon_color: iconInfo.iconColor,
        icon_bg: iconInfo.iconBg,
        storage_path: filePath,
        user_id: uid
      });
      if (insertError) {
        await sb.storage.from('user-files').remove([filePath]);
        throw new Error(insertError.message);
      }

      successCount++;
      progressState.done = successCount;
      progressState.items[progressState.items.length - 1] = { name: file.name, status: 'success', message: 'Berhasil · ' + sizeStr };
      await logActivity('upload_file', { name: file.name }, { folder_id: folderId || null, folder_name: folder, size_bytes: file.size, storage_path: filePath });
    } catch (err) {
      console.error('Upload error:', err.message || err);
      failCount++;
      progressState.failed = failCount;
      var message = err.message || String(err);
      errorMessages.push(file.name + ': ' + message);
      progressState.items[progressState.items.length - 1] = { name: file.name, status: 'error', message: message };
    }
    renderDetailedUploadProgress(progressBox, progressState);
  }

  progressState.finished = true;
  if (cancelledCount > 0) {
    progressState.currentName = 'Upload dibatalkan';
    progressState.items.push({ name: cancelledCount + ' file belum diproses', status: 'skip', message: 'Dibatalkan oleh pengguna' });
  } else {
    progressState.currentName = 'Selesai';
  }
  renderDetailedUploadProgress(progressBox, progressState);

  if (btnConfirm) { btnConfirm.disabled = false; btnConfirm.textContent = 'Upload'; }
  if (btnCancel) btnCancel.disabled = false;
  activeUploadCancelled = false;

  if (failCount === 0 && cancelledCount === 0) setTimeout(function() { closeModal(); }, 900);

  if (cancelledCount > 0) showToast('Upload dibatalkan. ' + successCount + ' file berhasil, ' + cancelledCount + ' belum diproses.');
  else if (failCount > 0 && successCount > 0) showToast(successCount + ' file berhasil, ' + failCount + ' gagal diupload.');
  else if (failCount > 0 && successCount === 0) showToast('Gagal mengupload ' + failCount + ' file. Lihat detail di modal.');
  else showToast('File berhasil diupload ke ' + (folder || 'Dashboard') + '!');

  await loadFiles();
  renderStats();
}

function handleFileSelect(input) {
  droppedFiles = null;
  const filesArr = Array.from(input.files);
  const MAX_FILE_SIZE = MAX_UPLOAD_FILE_BYTES;
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
        promises.push(readDirectoryEntries(entry, entry.name, droppedEntryFiles));
      } else if (entry && entry.isFile) {
        promises.push(new Promise(function(resolve) {
          entry.file(function(file) {
            // Simulasikan webkitRelativePath
            Object.defineProperty(file, 'webkitRelativePath', { value: entry.name + '/' + file.name, writable: false });
            droppedEntryFiles.push(file);
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
    if (folderInput && folderInput.files.length > 0) filesArr = Array.from(folderInput.files);
  }
  filesArr = Array.from(filesArr || []);
  if (!filesArr || filesArr.length === 0) { showToast('Pilih folder dulu!'); return; }

  const quota = await validateUploadQuota(filesArr);
  if (!quota.ok) { showToast(quota.message); return; }

  var destId = document.getElementById('folderDestSelect').value || null;
  var destObj = allFolders.find(function(f) { return f.id === destId; });
  var destName = destObj ? destObj.name : null;

  var btnConfirm = document.getElementById('uploadBtn');
  var btnCancel  = document.querySelector('#modal .btn-cancel');
  if (btnConfirm) { btnConfirm.disabled = true; btnConfirm.textContent = 'Mengupload...'; }
  if (btnCancel) btnCancel.disabled = true;

  folderIdCache = {};
  activeUploadCancelled = false;

  var userId;
  try {
    userId = await getCurrentUserId();
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    if (btnConfirm) { btnConfirm.disabled = false; btnConfirm.textContent = 'Upload'; }
    if (btnCancel) btnCancel.disabled = false;
    return;
  }

  var progressBox = ensureUploadProgressBox('selectedFolder');
  var progressState = { title: 'Upload folder ke ' + (destName || 'Dashboard'), total: filesArr.length, done: 0, failed: 0, currentIndex: 0, items: [] };
  renderDetailedUploadProgress(progressBox, progressState);

  var successCount = 0;
  var failCount = 0;
  var skippedCount = 0;
  var cancelledCount = 0;
  var total = filesArr.length;

  for (var i = 0; i < filesArr.length; i++) {
    if (activeUploadCancelled) {
      cancelledCount = total - i;
      break;
    }

    var file = filesArr[i];
    var relPath = file.webkitRelativePath || file.name;
    var pathParts = relPath.replace(/\\/g, '/').split('/');
    var fileName  = pathParts[pathParts.length - 1];
    var folderParts = pathParts.slice(0, pathParts.length - 1);

    progressState.currentIndex = i + 1;
    pushUploadProgressItem(progressState, { name: relPath, status: 'uploading', message: formatFileSizeFromBytes(file.size) });
    if (btnConfirm) btnConfirm.textContent = 'Upload ' + (i + 1) + '/' + total;
    renderDetailedUploadProgress(progressBox, progressState);

    const SKIP_FOLDERS = ['build','node_modules','.git','.gradle','intermediates','out','debug','release','tmp','.idea','.dart_tool','generated','obj','bin','.vs','__pycache__','.cache'];
    const hasSkipFolder = folderParts.some(function(part) {
      return SKIP_FOLDERS.includes(part.toLowerCase()) || part.startsWith('.');
    });
    if (hasSkipFolder || fileName.startsWith('.')) {
      skippedCount++;
      progressState.failed = failCount;
      progressState.items[progressState.items.length - 1] = { name: relPath, status: 'skip', message: 'Dilewati karena folder/file sistem' };
      renderDetailedUploadProgress(progressBox, progressState);
      continue;
    }

    try {
      var targetFolderId = destId;
      var targetFolderName = destName;
      if (folderParts.length > 0) {
        targetFolderId = await resolveOrCreateFolderChain(folderParts, destId, userId);
        if (!targetFolderId) throw new Error('Gagal membuat folder tujuan');
        targetFolderName = folderParts[folderParts.length - 1];
      }

      var storagePath = buildStoragePathForUser(userId, targetFolderId || null, fileName);
      var { error: upErr } = await sb.storage.from('user-files').upload(storagePath, file, { upsert: true });
      if (upErr) throw new Error(upErr.message);

      var ext = fileName.split('.').pop().toLowerCase();
      var type = 'doc';
      if (['jpg','jpeg','png','gif','webp','svg','bmp'].includes(ext)) type = 'foto';
      else if (['mp4','mov','avi','mkv','webm'].includes(ext)) type = 'video';
      else if (ext === 'pdf') type = 'pdf';
      else if (['xlsx','csv','xls'].includes(ext)) type = 'spreadsheet';
      else if (['mp3','wav','ogg','flac','aac','m4a'].includes(ext)) type = 'audio';

      var iconInfo = FILE_ICONS[type] || FILE_ICONS['doc'];
      var sizeStr = formatFileSizeFromBytes(file.size);
      var { error: insertErr } = await sb.from('files').insert({
        name: fileName,
        folder_name: targetFolderName,
        folder_id: targetFolderId || null,
        type: type,
        size: sizeStr,
        size_bytes: file.size,
        icon: iconInfo.icon,
        icon_color: iconInfo.iconColor,
        icon_bg: iconInfo.iconBg,
        storage_path: storagePath,
        user_id: userId
      });
      if (insertErr) {
        await sb.storage.from('user-files').remove([storagePath]);
        throw new Error(insertErr.message);
      }

      successCount++;
      progressState.done = successCount;
      progressState.items[progressState.items.length - 1] = { name: relPath, status: 'success', message: 'Berhasil · ' + sizeStr };
      await logActivity('upload_folder', { name: fileName }, { folder_id: targetFolderId || null, folder_name: targetFolderName, size_bytes: file.size, storage_path: storagePath });
    } catch (err) {
      console.error('Upload folder error:', err.message || err);
      failCount++;
      progressState.failed = failCount;
      progressState.items[progressState.items.length - 1] = { name: relPath, status: 'error', message: err.message || String(err) };
    }
    renderDetailedUploadProgress(progressBox, progressState);
  }

  progressState.finished = true;
  progressState.failed = failCount;
  if (cancelledCount > 0) {
    progressState.currentName = 'Upload dibatalkan';
    progressState.items.push({ name: cancelledCount + ' file belum diproses', status: 'skip', message: 'Dibatalkan oleh pengguna' });
  } else {
    progressState.currentName = 'Selesai';
  }
  renderDetailedUploadProgress(progressBox, progressState);

  if (btnConfirm) { btnConfirm.disabled = false; btnConfirm.textContent = 'Upload'; }
  if (btnCancel) btnCancel.disabled = false;
  activeUploadCancelled = false;
  droppedFolderFiles = null;

  if (failCount === 0 && cancelledCount === 0) setTimeout(function() { closeModal(); }, 900);
  await loadFolders();
  await loadFiles();
  renderStats();

  if (cancelledCount > 0) showToast('Upload folder dibatalkan. ' + successCount + ' file berhasil, ' + cancelledCount + ' belum diproses.');
  else if (failCount > 0 && successCount > 0) showToast(successCount + ' file berhasil, ' + failCount + ' gagal' + (skippedCount ? ', ' + skippedCount + ' dilewati' : '') + '.');
  else if (failCount > 0) showToast('Gagal upload ' + failCount + ' file. Lihat detail di modal.');
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
    const oldPath = getFileStoragePath(file);
    let newPath;
    try {
      newPath = await buildStoragePath(targetFolderId, file.name);
    } catch (authErr) {
      showToast(authErr.message || 'User belum login.');
      return;
    }

    const { error: moveErr } = await sb.storage.from('user-files').move(oldPath, newPath);
    if (moveErr) { showToast('Gagal pindah storage: ' + moveErr.message); return; }

    const { error: dbErr } = await sb.from('files').update({
      folder_name: targetFolderName,
      folder_id: targetFolderId,
      storage_path: newPath
    }).eq('id', file.id);

    if (dbErr) { showToast('Gagal update DB: ' + dbErr.message); return; }
    showToast('\uD83D\uDCC1 "' + file.name + '" dipindahkan ke ' + targetFolderName + '!');
    await logActivity('move_file', file, { folder_id: targetFolderId, folder_name: targetFolderName, via_drag_drop: true });
    await loadAll();
    return;
  }

  // ── CASE 2: Drop file dari OS (upload langsung) ──
  var files = e.dataTransfer.files;
  if (!files || files.length === 0) return;

  const quota = await validateUploadQuota(files);
  if (!quota.ok) { showToast(quota.message); return; }

  var userId;
  try {
    userId = await getCurrentUserId();
  } catch (authErr) {
    showToast(authErr.message || 'User belum login.');
    return;
  }
  var successCount = 0;
  var failCount = 0;

  showToast('Mengupload ' + files.length + ' file ke ' + targetFolderName + '...');

  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var storagePath = buildStoragePathForUser(userId, targetFolderId, file.name);

    try {
      var { error: upErr } = await sb.storage.from('user-files').upload(storagePath, file, { upsert: true });
      if (upErr) { console.error('Drop upload error:', upErr.message); failCount++; continue; }

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
        type: type, size: sizeStr, size_bytes: file.size, icon: iconInfo.icon, icon_color: iconInfo.iconColor,
        icon_bg: iconInfo.iconBg, storage_path: storagePath, user_id: userId
      });
      if (insertErr) { console.error('Drop insert error:', insertErr.message); failCount++; } else {
        successCount++;
        await logActivity('upload_file', { name: file.name }, { folder_id: targetFolderId, folder_name: targetFolderName, size_bytes: file.size, storage_path: storagePath });
      }
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
    if (showTrashMode) {
      ctxTarget = String(id);
      showToast('File di Sampah. Klik titik tiga untuk pulihkan atau hapus permanen.');
      return;
    }
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
      card.style.outline = '2.5px solid var(--accent)';
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
      card.style.outline = '2.5px solid var(--accent)';
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
    title: showTrashMode ? 'Hapus Permanen ' + count + ' File' : 'Pindahkan ' + count + ' File ke Sampah',
    message: showTrashMode
      ? 'Yakin ingin menghapus permanen ' + count + ' file? File tidak bisa dipulihkan lagi.'
      : 'File terpilih akan dipindahkan ke Sampah dan masih bisa dipulihkan nanti.',
    icon: 'ti-trash',
    confirmText: showTrashMode ? 'Hapus Permanen' : 'Pindahkan ke Sampah',
    confirmBtnClass: 'danger'
  });
  if (!confirmed) return;

  var ids = Array.from(selectedFileIds);
  var filesToDelete = ids.map(function(id) {
    return allFiles.find(function(f) { return String(f.id) === id; });
  }).filter(Boolean);

  var successCount = 0;
  var failCount = 0;

  if (showTrashMode) {
    for (var i = 0; i < filesToDelete.length; i++) {
      var file = filesToDelete[i];
      var path = getFileStoragePath(file);
      var { error } = await sb.from('files').delete().eq('id', file.id);
      if (error) { failCount++; continue; }
      try { await sb.storage.from('user-files').remove([path]); } catch(e) {}
      await logActivity('delete_file', file, { storage_path: path, permanent: true, bulk: true });
      successCount++;
    }
  } else {
    var deletedAt = new Date().toISOString();
    for (var j = 0; j < filesToDelete.length; j++) {
      var f = filesToDelete[j];
      var result = await sb.from('files').update({ deleted_at: deletedAt }).eq('id', f.id);
      if (result.error) { failCount++; continue; }
      try { await sb.from('shared_links').update({ revoked_at: deletedAt }).eq('file_id', f.id); } catch(e) {}
      await logActivity('trash_file', f, { deleted_at: deletedAt, bulk: true });
      var favs = getFavs();
      if (favs.includes(String(f.id))) {
        localStorage.setItem('myStorageFavs', JSON.stringify(favs.filter(function(fid) { return fid !== String(f.id); })));
      }
      successCount++;
    }
  }

  exitSelectMode();
  await loadFiles();
  renderStats();
  if (successCount === 0) { showToast('Gagal memproses ' + failCount + ' file.'); return; }
  showToast((showTrashMode ? '🗑️ ' : '✅ ') + successCount + ' file ' + (showTrashMode ? 'dihapus permanen' : 'dipindahkan ke Sampah') + (failCount ? ' (' + failCount + ' gagal)' : '') + '.');
}

/* ── BULK DOWNLOAD ── */
async function bulkDownload() {
  if (selectedFileIds.size === 0) { showToast('Pilih file dulu!'); return; }

  var ids = Array.from(selectedFileIds);
  var filesToDownload = ids.map(function(id) {
    return allFiles.find(function(f) { return String(f.id) === id; });
  }).filter(Boolean);

  var total = filesToDownload.length;
  var success = 0;
  var fail = 0;

  showToast('⬇️ Memulai download ' + total + ' file...', { duration: 3000 });

  for (var i = 0; i < filesToDownload.length; i++) {
    var file = filesToDownload[i];
    var path = getFileStoragePath(file);

    showToast('⬇️ Mengunduh ' + (i + 1) + ' / ' + total + ': ' + file.name, { duration: 4000 });

    try {
      var result = await sb.storage.from('user-files').download(path);
      if (result.error) { fail++; continue; }

      var url = URL.createObjectURL(result.data);
      var a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success++;

      // Jeda kecil agar browser tidak blokir multiple download
      await new Promise(function(res) { setTimeout(res, 600); });
    } catch(e) {
      fail++;
    }
  }

  exitSelectMode();

  if (fail === 0) {
    showToast('✅ ' + success + ' file berhasil didownload!');
  } else {
    showToast('✅ ' + success + ' berhasil, ' + fail + ' gagal.');
  }
}


/* ── INIT ── */
/* ════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
════════════════════════════════════════ */
/* ════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
   Pakai window sebagai root (viewport)
════════════════════════════════════════ */
function initScrollReveal() {
  var els = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function(el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  els.forEach(function(el) { obs.observe(el); });
}

/* ════════════════════════════════════════
   SCROLL PROGRESS BAR
   Pakai window scroll
════════════════════════════════════════ */
function initScrollProgress() {
  var fill = document.getElementById('scrollProgressFill');
  if (!fill) return;
  window.addEventListener('scroll', function() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════
   SMOOTH PASS SCROLL — LERP Physics Engine
   Pakai window.scrollY — tidak perlu ubah CSS
════════════════════════════════════════ */
function setupSmoothScroll() {
  // Skip di mobile/touch — native scroll lebih baik
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  // Skip jika user prefer reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── LERP CONFIG ──
  var LERP_FACTOR    = 0.085; // Makin kecil = makin smooth (0.05–0.15)
  var WHEEL_MULT     = 1.0;
  var STOP_THRESHOLD = 0.05;  // px — batas berhenti animasi

  var targetY   = window.scrollY;
  var currentY  = window.scrollY;
  var rafId     = null;
  var animating = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getMaxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }

  function clamp(val) {
    return Math.max(0, Math.min(val, getMaxScroll()));
  }

  function animate() {
    var delta = targetY - currentY;
    if (Math.abs(delta) < STOP_THRESHOLD) {
      currentY = targetY;
      window.scrollTo(0, currentY);
      animating = false;
      rafId = null;
      return;
    }
    currentY = lerp(currentY, targetY, LERP_FACTOR);
    window.scrollTo(0, currentY);
    rafId = requestAnimationFrame(animate);
  }

  // ── Wheel handler pada document ──
  document.addEventListener('wheel', function(e) {
    // Jangan intercept scroll di dalam elemen yang punya overflow scroll sendiri
    // (misal: sidebar, modal, select dropdown)
    var el = e.target;
    while (el && el !== document.body) {
      var style = window.getComputedStyle(el);
      var overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
        return; // biarkan elemen itu scroll sendiri
      }
      el = el.parentElement;
    }

    e.preventDefault();

    var delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 32;   // Firefox line mode
    if (e.deltaMode === 2) delta *= 300;  // Page mode
    delta = Math.sign(delta) * Math.min(Math.abs(delta), 200) * WHEEL_MULT;

    if (!animating) { currentY = window.scrollY; animating = true; }
    targetY = clamp(targetY + delta);
    if (!rafId) rafId = requestAnimationFrame(animate);
  }, { passive: false });

  // ── Keyboard handler ──
  document.addEventListener('keydown', function(e) {
    var focused = document.activeElement;
    var isInput = focused && (
      focused.tagName === 'INPUT' ||
      focused.tagName === 'SELECT' ||
      focused.tagName === 'TEXTAREA'
    );
    if (isInput) return;

    var delta = 0;
    switch (e.key) {
      case 'ArrowDown': delta =  80; break;
      case 'ArrowUp':   delta = -80; break;
      case 'PageDown':  delta =  window.innerHeight * 0.85; break;
      case 'PageUp':    delta = -window.innerHeight * 0.85; break;
      case 'End':       delta =  getMaxScroll() - targetY; break;
      case 'Home':      delta = -targetY; break;
      default: return;
    }
    if (delta === 0) return;
    e.preventDefault();
    if (!animating) { currentY = window.scrollY; animating = true; }
    targetY = clamp(targetY + delta);
    if (!rafId) rafId = requestAnimationFrame(animate);
  });

  // ── Sync targetY kalau ada scroll eksternal (klik anchor, dll) ──
  window.addEventListener('scroll', function() {
    if (!animating) {
      targetY  = window.scrollY;
      currentY = window.scrollY;
    }
  }, { passive: true });

  // ── Topbar shadow saat scroll ──
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    topbar.style.transition = (topbar.style.transition || '') + ', box-shadow 0.28s ease';
    window.addEventListener('scroll', function() {
      topbar.style.boxShadow = window.scrollY > 10
        ? '0 4px 24px rgba(15,14,13,0.08)'
        : 'none';
    }, { passive: true });
  }
}


/* ── STATIC ACTION BINDINGS (mengurangi inline onclick di HTML utama) ── */
function initStaticActionBindings() {
  document.addEventListener('click', async function(e) {
    var el = e.target.closest('[data-action]');
    if (el) {
      var action = el.getAttribute('data-action');

      if (action === 'nav-dashboard') { setNav(el); setFilter(document.querySelector('.filter-chip[data-filter="semua"]'), 'semua'); return; }
    if (action === 'nav-shared') { setNav(el); showSharedPanel(); return; }
    if (action === 'nav-favorites') { setNav(el); filterFavorites(); return; }
    if (action === 'nav-trash') { setNav(el); showTrashView(); return; }
    if (action === 'nav-file-type') { setNav(el); setFilter(document.querySelector('.filter-chip[data-filter="' + el.dataset.filter + '"]'), el.dataset.filter); return; }
    if (action === 'toggle-nav-group') { toggleNavGroup(el); return; }
    if (action === 'go-settings') { window.location.href = 'pages/settings.html'; return; }
    if (action === 'logout') { await doLogout(); return; }
    if (action === 'close-sidebar') { closeSidebar(); return; }
    if (action === 'toggle-sidebar') { toggleSidebar(); return; }
    if (action === 'go-root') { goToRoot(); return; }
    if (action === 'clear-search') { clearSearch(); return; }
    if (action === 'clear-folder-search') { clearFolderSearch(); return; }
    if (action === 'close-notifications') { closeNotifications(); return; }
    if (action === 'refresh-activity') { await loadActivityLogs(); renderActivityList(); return; }
    if (action === 'toggle-night-mode') { NightMode.toggle(); updateNmBtn(); return; }
    if (action === 'show-empty-notif') { toggleNotifications(); return; }
    if (action === 'refresh-data') { await loadAll({ showFloating: true }); showToast('Data diperbarui'); return; }
    if (action === 'open-upload') { openModal(); return; }
    if (action === 'new-folder') { addFolder(); return; }
    if (action === 'cancel-upload') { activeUploadCancelled = true; showToast('Membatalkan upload setelah file aktif selesai...'); return; }
    if (action === 'bulk-download') { bulkDownload(); return; }
    if (action === 'bulk-delete') { bulkDelete(); return; }
    if (action === 'exit-select-mode') { exitSelectMode(); return; }
    if (action === 'close-folder') { closeFolder(); return; }
    if (action === 'enter-select-mode') { enterSelectMode(); return; }
    if (action === 'toggle-sort') { toggleSort(); return; }
    if (action === 'set-view-mode') { setViewMode(el.dataset.mode); return; }
    if (action === 'set-filter') { setFilter(el, el.dataset.filter); return; }
    if (action === 'switch-upload-tab') { switchUploadTab(el.dataset.tab); return; }
    if (action === 'pick-file') { document.getElementById('fileInput').click(); return; }
    if (action === 'pick-folder') { document.getElementById('folderInput').click(); return; }
    if (action === 'close-modal') { closeModal(); return; }
    if (action === 'do-upload') { doUpload(); return; }
    if (action === 'close-move-modal') { closeMoveModal(); return; }
    if (action === 'confirm-move-file') { confirmMoveFile(); return; }
    if (action === 'close-folder-move-modal') { closeFolderMoveModal(); return; }
    if (action === 'confirm-move-folder') { confirmMoveFolder(); return; }
      if (action === 'ctx-download') { downloadFile(); return; }
      if (action === 'ctx-share') { shareFile(); return; }
      if (action === 'ctx-rename') { renameFile(); return; }
      if (action === 'ctx-move') { moveFile(); return; }
      if (action === 'ctx-favorite') { toggleFavorite(); return; }
      if (action === 'ctx-delete') { deleteFile(); return; }
      if (action === 'ctx-restore') { restoreFile(); return; }
      if (action === 'ctx-delete-permanent') { deleteFilePermanently(); return; }
      if (action === 'toggle-file-select') { e.stopPropagation(); return; }
      if (action === 'file-select' || action === 'folder-select' || action === 'select-all') { return; }
      if (action === 'folder-pin') { togglePinFolder(el.dataset.folderId, e); return; }
      if (action === 'folder-rename') { e.stopPropagation(); renameFolderById(el.dataset.folderId, el.dataset.folderName); return; }
      if (action === 'folder-move') { e.stopPropagation(); moveFolderById(el.dataset.folderId, el.dataset.folderName); return; }
      if (action === 'folder-delete') { e.stopPropagation(); deleteFolderById(el.dataset.folderId, el.dataset.folderName); return; }
      if (action === 'sort-mode') { setSortMode(el.dataset.mode); return; }
      if (action === 'copy-shared') { copySharedLink(el.dataset.index); return; }
      if (action === 'remove-shared') { removeSharedLink(el.dataset.index); return; }
      if (action === 'folder-breadcrumb-root') { goToRoot(); return; }
      if (action === 'folder-breadcrumb') { navigateBreadcrumb(parseInt(el.dataset.index, 10)); return; }
      if (action === 'open-folder') { openFolderById(el.dataset.folderId, el.dataset.folderName); return; }
    }

    var menu = e.target.closest('[data-file-menu]');
    if (menu) {
      e.stopPropagation();
      showCtx(e, menu.dataset.fileId);
      return;
    }

    var card = e.target.closest('[data-file-card]');
    if (card) {
      fileCardClick(e, card.dataset.fileId);
      return;
    }

    var folderCard = e.target.closest('[data-folder-card]');
    if (folderCard) {
      openFolderById(folderCard.dataset.folderId, folderCard.dataset.folderName);
      return;
    }
  });

  document.addEventListener('input', function(e) {
    var el = e.target;
    if (el && el.dataset && el.dataset.action === 'search-files') { filterFiles(); toggleClearBtn(); }
    if (el && el.dataset && el.dataset.action === 'search-folders') { filterFoldersOnly(); }
  });

  document.addEventListener('change', function(e) {
    var el = e.target;
    if (!el || !el.dataset) return;
    if (el.dataset.action === 'select-all') toggleSelectAll(el.checked);
    if (el.dataset.action === 'file-select') handleFileSelect(el);
    if (el.dataset.action === 'folder-select') handleFolderSelect(el);
    if (el.dataset.action === 'toggle-file-select') toggleFileSelect(el.dataset.fileId, el.checked);
  });

  document.addEventListener('dblclick', function(e) {
    var folderCard = e.target.closest('[data-folder-card]');
    if (folderCard) {
      e.stopPropagation();
      startFolderRename(folderCard.dataset.folderId, folderCard.dataset.folderName, folderCard);
    }
  });

  document.addEventListener('contextmenu', function(e) {
    var card = e.target.closest('[data-file-card]');
    if (card) showCtx(e, card.dataset.fileId);
  });

  document.addEventListener('dragstart', function(e) {
    var card = e.target.closest('[data-file-card]');
    if (card) fileCardDragStart(e, card.dataset.fileId);
  });
  document.addEventListener('dragend', function(e) {
    var card = e.target.closest('[data-file-card]');
    if (card) fileCardDragEnd(e, card);
  });
  document.addEventListener('dragover', function(e) {
    var folderCard = e.target.closest('[data-folder-card]');
    if (folderCard) folderCardDragOver(e, folderCard);
  });
  document.addEventListener('dragleave', function(e) {
    var folderCard = e.target.closest('[data-folder-card]');
    if (folderCard) folderCardDragLeave(e, folderCard);
  });
  document.addEventListener('drop', function(e) {
    var folderCard = e.target.closest('[data-folder-card]');
    if (folderCard) folderCardDrop(e, folderCard);
  });

  var folderDrop = document.getElementById('dropZoneFolder');
  if (folderDrop && !folderDrop.dataset.dragBound) {
    folderDrop.dataset.dragBound = '1';
    folderDrop.addEventListener('dragover', handleFolderDragOver);
    folderDrop.addEventListener('dragleave', handleFolderDragLeave);
    folderDrop.addEventListener('drop', handleFolderDrop);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  // Sembunyikan konten sampai session terverifikasi — cegah flash konten
  initStaticActionBindings();
  document.body.style.visibility = 'hidden';

  const { data: sessionData } = await sb.auth.getSession();
  if (!sessionData || !sessionData.session) {
    window.location.replace('login.html'); // replace: hapus dari history, tombol Back tidak bisa balik
    return;
  }

  // Session valid — tampilkan konten
  cleanupLegacyAvatarKeys();
  document.body.style.visibility = 'visible';

  // ── ENTER CURTAIN: hanya aktif kalau datang dari login (bukan refresh) ──
  const enterCurtain = document.getElementById('enterCurtain');
  if (enterCurtain) {
    const fromLogin = sessionStorage.getItem('fromLogin');
    sessionStorage.removeItem('fromLogin'); // hapus tiket — sekali pakai
    if (fromLogin) {
      // Datang dari login: tampilkan lalu fade out
      enterCurtain.style.opacity = '1';
      enterCurtain.style.pointerEvents = 'all';
      setTimeout(function() {
        enterCurtain.style.opacity = '0';
        enterCurtain.style.pointerEvents = 'none';
        setTimeout(function() { enterCurtain.remove(); }, 650);
      }, 320);
    } else {
      // Refresh / akses langsung: langsung hapus tanpa animasi
      enterCurtain.remove();
    }
  }

  // ── STAGGER REVEAL: kartu-kartu muncul berurutan ──
  setTimeout(function() {
    const revealEls = document.querySelectorAll('.stat, .folder-wrap, .file-card, .section-header');
    revealEls.forEach(function(el, i) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      var delay = Math.min(i * 0.045, 0.55) + 's';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.19,1,0.22,1) ' + delay + ', transform 0.5s cubic-bezier(0.19,1,0.22,1) ' + delay;
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  }, 380);

  const user = sessionData.session.user;
  const fullName = (user.user_metadata && user.user_metadata.full_name) ? user.user_metadata.full_name : user.email.split('@')[0];
  userInitials = fullName.split(' ').map(function(w) { return w[0]; }).join('').toUpperCase().slice(0, 2);
  const email = user.email;

  document.querySelectorAll('.user-name').forEach(function(el) { el.textContent = fullName; });

  // Apply avatar photo or initials
  const savedPhoto = localStorage.getItem('myStorageAvatar_' + user.id + '_photo');
  const savedColor = localStorage.getItem('myStorageAvatar_' + user.id + '_color') || '#c8602a';
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
      closeCtxMenu();
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
      window.location.replace('pages/login.html');
    }
  });

  // Restore saved view mode (grid/list)
  setViewMode(currentViewMode);

  await loadAll();

  // ── Smooth scroll init ──
  initScrollReveal();
  initScrollProgress();
  setupSmoothScroll();
});