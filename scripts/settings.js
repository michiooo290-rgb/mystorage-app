/* Settings page logic moved out of inline script for CSP. */
/* ────────────────────────
   INIT SUPABASE
──────────────────────── */
const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

/* ────────────────────────
   STATE
──────────────────────── */
let currentUser = null;
let allFiles = [];
let allFolders = [];
let userInitials = '??';
let avatarColor = '#c8602a';

const AVATAR_COLORS = [
  '#c8602a','#1d4ed8','#2d6a4f','#7e22ce','#0369a1',
  '#be123c','#92400e','#0f766e','#4338ca','#15803d'
];

const DONUT_COLORS = {
  pdf:         '#c0392b',
  doc:         '#1d4ed8',
  foto:        '#2d6a4f',
  video:       '#c8602a',
  spreadsheet: '#0369a1',
  audio:       '#7e22ce',
};
const DONUT_LABELS = {
  pdf:'PDF', doc:'Dokumen', foto:'Foto', video:'Video', spreadsheet:'Spreadsheet', audio:'Audio'
};

/* ────────────────────────
   AVATAR STORAGE PER USER
   Jangan pakai key global seperti myStorageAvatarPhoto / myStorageAvatarColor,
   karena localStorage berlaku untuk 1 browser/domain, bukan per akun.
──────────────────────── */
function getCurrentUserId() {
  return currentUser && currentUser.id ? currentUser.id : 'guest';
}

function getAvatarKey(type) {
  return 'myStorageAvatar_' + getCurrentUserId() + '_' + type;
}

function getAvatarPhoto() {
  if (!currentUser) return null;
  return localStorage.getItem(getAvatarKey('photo'));
}

function setAvatarPhoto(dataUrl) {
  if (!currentUser) return;
  localStorage.setItem(getAvatarKey('photo'), dataUrl);
}

function removeAvatarPhoto() {
  if (!currentUser) return;
  localStorage.removeItem(getAvatarKey('photo'));
}

function getAvatarColor() {
  if (!currentUser) return '#c8602a';
  return localStorage.getItem(getAvatarKey('color')) || '#c8602a';
}

function setAvatarColor(color) {
  if (!currentUser) return;
  localStorage.setItem(getAvatarKey('color'), color);
}


function cleanupLegacyAvatarKeys() {
  localStorage.removeItem('myStorageAvatarPhoto');
  localStorage.removeItem('myStorageAvatarColor');
}

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

function showSettingsLoading(message) {
  let box = document.getElementById('settingsLoadingState');
  if (!box) {
    box = document.createElement('div');
    box.id = 'settingsLoadingState';
    box.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:99999;display:none;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;background:var(--ink,#0f0e0d);color:#fff;box-shadow:0 12px 32px rgba(0,0,0,.22);font-size:13px;font-family:Inter,system-ui,sans-serif;';
    box.innerHTML = '<i class="ti ti-loader-2" style="font-size:17px;animation:spin .8s linear infinite"></i><span id="settingsLoadingMsg">Memuat...</span>';
    document.body.appendChild(box);
  }
  document.getElementById('settingsLoadingMsg').textContent = message || 'Memuat...';
  box.style.display = 'flex';
}

function hideSettingsLoading() {
  const box = document.getElementById('settingsLoadingState');
  if (box) box.style.display = 'none';
}

function showSettingsError(title, message) {
  let box = document.getElementById('settingsErrorState');
  if (!box) {
    box = document.createElement('div');
    box.id = 'settingsErrorState';
    box.style.cssText = 'position:fixed;left:50%;top:74px;transform:translateX(-50%);z-index:99999;display:none;max-width:min(560px,calc(100vw - 28px));padding:12px 14px;border-radius:14px;background:#fff7f7;color:#7f1d1d;border:1px solid rgba(192,57,43,.22);box-shadow:0 10px 30px rgba(127,29,29,.12);font-size:13px;font-family:Inter,system-ui,sans-serif;';
    box.innerHTML = '<div style="display:flex;align-items:flex-start;gap:10px"><i class="ti ti-alert-circle" style="font-size:18px;flex-shrink:0;margin-top:1px"></i><div style="flex:1;min-width:0"><strong id="settingsErrorTitle" style="display:block;margin-bottom:2px">Terjadi error</strong><span id="settingsErrorMsg"></span></div><button id="settingsErrorClose" type="button" style="border:0;background:transparent;color:#7f1d1d;cursor:pointer;font-size:18px;line-height:1">&times;</button></div>';
    document.body.appendChild(box);
    box.querySelector('#settingsErrorClose').addEventListener('click', function() { box.style.display = 'none'; });
  }
  document.getElementById('settingsErrorTitle').textContent = title || 'Terjadi error';
  document.getElementById('settingsErrorMsg').textContent = message || 'Coba ulangi beberapa saat lagi.';
  box.style.display = 'block';
}


/* ────────────────────────
   TOAST
──────────────────────── */
function showSettingsToast(msg, isError) {
  const t = document.getElementById('settingsToast');
  const icon = t.querySelector('i');
  document.getElementById('settingsToastMsg').textContent = msg;
  icon.style.color = isError ? '#f87171' : '#4ade80';
  icon.className = isError ? 'ti ti-alert-circle' : 'ti ti-check';
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ────────────────────────
   NAVIGATION
──────────────────────── */
function scrollToSection(id, el) {
  document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ────────────────────────
   LOAD DATA
──────────────────────── */
async function loadAll() {
  showSettingsLoading('Memuat analitik storage...');
  try {
    const [filesRes, foldersRes] = await Promise.all([
      sb.from('files').select('*').order('created_at', { ascending: false }),
      sb.from('folders').select('*').order('created_at')
    ]);
    if (filesRes.error) throw filesRes.error;
    if (foldersRes.error) throw foldersRes.error;
    allFiles = filesRes.data || [];
    allFolders = foldersRes.data || [];

    updateSidebarStorage();
    renderAnalitik();
    checkStorageWarning();
  } catch (err) {
    console.error('Settings load error:', err);
    showSettingsError('Gagal memuat data', err.message || 'Cek koneksi atau policy Supabase.');
    showSettingsToast('Gagal memuat data storage', true);
  } finally {
    hideSettingsLoading();
  }
}

/* ────────────────────────
   SIDEBAR STORAGE
──────────────────────── */
function updateSidebarStorage() {
  let usedBytes = calcUsedBytes();
  const totalMB = 1024;
  const usedMB = usedBytes / (1024 * 1024);
  const pct = Math.min(Math.round((usedMB / totalMB) * 100), 100);
  const usedStr = formatBytes(usedBytes);

  document.getElementById('storagePct').textContent = pct + '%';
  document.getElementById('storageUsed').textContent = usedStr + ' terpakai';
  setTimeout(() => {
    const fill = document.getElementById('storageFill');
    if (fill) fill.style.width = pct + '%';
  }, 300);
}

function calcUsedBytes() {
  return allFiles.reduce(function(total, file) {
    return total + getFileSizeBytes(file);
  }, 0);
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes.toFixed(0) + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
}

/* ────────────────────────
   EDIT PROFIL
──────────────────────── */
function initProfile(user) {
  const meta = user.user_metadata || {};
  const fullName = meta.full_name || user.email.split('@')[0];
  const parts = fullName.trim().split(' ');
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';

  document.getElementById('inputFirstName').value = firstName;
  document.getElementById('inputLastName').value = lastName;
  document.getElementById('inputEmail').value = user.email;
  document.getElementById('inputDisplayName').value = fullName;

  updateAvatarPreview(fullName, user.email);

  // Live preview saat mengetik
  ['inputFirstName', 'inputLastName', 'inputDisplayName'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      const fn = document.getElementById('inputFirstName').value.trim();
      const ln = document.getElementById('inputLastName').value.trim();
      const dn = document.getElementById('inputDisplayName').value.trim();
      const name = dn || (fn + (ln ? ' ' + ln : ''));
      updateAvatarPreview(name, user.email);
    });
  });
}

function updateAvatarPreview(name, email) {
  const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
  userInitials = initials;

  const savedPhoto = getAvatarPhoto();
  const avatarEl = document.getElementById('avatarPreview');

  if (savedPhoto) {
    // Show photo
    avatarEl.innerHTML = '';
    avatarEl.style.background = `url(${savedPhoto}) center/cover no-repeat`;
    document.getElementById('btnRemovePhoto').style.display = 'inline-flex';
    document.getElementById('btnColorAvatar').style.display = 'none';

    // Sidebar & topbar as image
    const setAv = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = '';
      el.style.background = `url(${savedPhoto}) center/cover no-repeat`;
    };
    setAv('sidebarAv');
    setAv('topbarAv');
  } else {
    // Show initials
    avatarEl.textContent = initials;
    avatarEl.style.background = avatarColor;
    document.getElementById('btnRemovePhoto').style.display = 'none';
    document.getElementById('btnColorAvatar').style.display = 'inline-flex';

    const setAvText = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.textContent = initials;
      el.style.background = avatarColor;
    };
    setAvText('sidebarAv');
    setAvText('topbarAv');
  }

  document.getElementById('avatarNamePreview').textContent = name || 'Nama Kamu';
  document.getElementById('avatarEmailPreview').textContent = email || '—';
  document.getElementById('sidebarName').textContent = name || '—';
  document.getElementById('sidebarEmail').textContent = email || '—';
}

/* ── Photo Upload & Crop ── */
let cropImg = null;
let cropOffsetX = 0, cropOffsetY = 0;
let cropDragStartX = 0, cropDragStartY = 0;
let cropIsDragging = false;

function triggerPhotoUpload() {
  document.getElementById('photoInput').click();
}

function handlePhotoSelect(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  if (!file.type.startsWith('image/')) {
    showSettingsToast('File harus berupa gambar!', true); return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showSettingsToast('Ukuran foto maksimal 5 MB!', true); return;
  }
  const reader = new FileReader();
  reader.onload = (e) => openCropDialog(e.target.result);
  reader.readAsDataURL(file);
  input.value = '';
}

function openCropDialog(src) {
  cropOffsetX = 0; cropOffsetY = 0;
  document.getElementById('cropZoom').value = 1;

  const img = document.getElementById('cropImage');
  img.src = src;
  img.onload = () => {
    cropImg = img;
    updateCrop();
    setupCropDrag();
  };
  document.getElementById('photoCropDialog').classList.add('show');
}

function updateCrop() {
  const img = document.getElementById('cropImage');
  const zoom = parseFloat(document.getElementById('cropZoom').value);
  const vw = 220, vh = 220;
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const scale = Math.max(vw / nw, vh / nh) * zoom;
  const dispW = nw * scale, dispH = nh * scale;

  // Clamp offset so image always covers the circle
  const maxX = (dispW - vw) / 2;
  const maxY = (dispH - vh) / 2;
  cropOffsetX = Math.max(-maxX, Math.min(maxX, cropOffsetX));
  cropOffsetY = Math.max(-maxY, Math.min(maxY, cropOffsetY));

  img.style.width = dispW + 'px';
  img.style.height = dispH + 'px';
  img.style.transform = `translate(calc(-50% + ${cropOffsetX}px), calc(-50% + ${cropOffsetY}px)) `;
}

function setupCropDrag() {
  const vp = document.querySelector('.crop-viewport');
  vp.onmousedown = (e) => {
    cropIsDragging = true;
    cropDragStartX = e.clientX - cropOffsetX;
    cropDragStartY = e.clientY - cropOffsetY;
    e.preventDefault();
  };
  window.addEventListener('mousemove', (e) => {
    if (!cropIsDragging) return;
    cropOffsetX = e.clientX - cropDragStartX;
    cropOffsetY = e.clientY - cropDragStartY;
    updateCrop();
  });
  window.addEventListener('mouseup', () => { cropIsDragging = false; });

  // Touch support
  vp.ontouchstart = (e) => {
    cropIsDragging = true;
    cropDragStartX = e.touches[0].clientX - cropOffsetX;
    cropDragStartY = e.touches[0].clientY - cropOffsetY;
  };
  vp.ontouchmove = (e) => {
    if (!cropIsDragging) return;
    cropOffsetX = e.touches[0].clientX - cropDragStartX;
    cropOffsetY = e.touches[0].clientY - cropDragStartY;
    updateCrop();
    e.preventDefault();
  };
  vp.ontouchend = () => { cropIsDragging = false; };
}

function applyCrop() {
  const img = document.getElementById('cropImage');
  const zoom = parseFloat(document.getElementById('cropZoom').value);
  const size = 120; // cukup untuk avatar, hemat localStorage
  const nw = img.naturalWidth, nh = img.naturalHeight;
  const scale = Math.max(size / nw, size / nh) * zoom;

  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Draw circle clip
  ctx.beginPath();
  ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
  ctx.clip();

  const dispW = nw * scale, dispH = nh * scale;
  const dx = (size - dispW) / 2 + cropOffsetX;
  const dy = (size - dispH) / 2 + cropOffsetY;
  ctx.drawImage(img, dx, dy, dispW, dispH);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.72);

  try {
    setAvatarPhoto(dataUrl);
  } catch (e) {
    showSettingsToast('Foto terlalu besar, coba foto yang lebih kecil.', true);
    closeCropDialog();
    return;
  }

  closeCropDialog();
  const name = document.getElementById('inputDisplayName').value.trim() ||
    (document.getElementById('inputFirstName').value.trim() + ' ' + document.getElementById('inputLastName').value.trim()).trim() || 'User';
  updateAvatarPreview(name, currentUser ? currentUser.email : '');
  showSettingsToast('Foto profil berhasil diperbarui!');
}

function closeCropDialog() {
  document.getElementById('photoCropDialog').classList.remove('show');
  cropIsDragging = false;
}

function removePhoto() {
  removeAvatarPhoto();
  const name = document.getElementById('inputDisplayName').value.trim() || 'User';
  updateAvatarPreview(name, currentUser ? currentUser.email : '');
  showSettingsToast('Foto profil dihapus');
}

async function saveProfile() {
  const firstName = document.getElementById('inputFirstName').value.trim();
  const lastName  = document.getElementById('inputLastName').value.trim();
  const displayName = document.getElementById('inputDisplayName').value.trim();

  const fullName = displayName || (firstName + (lastName ? ' ' + lastName : ''));
  if (!fullName) { showSettingsToast('Nama tidak boleh kosong!', true); return; }

  const btn = document.getElementById('btnSaveProfile');
  btn.disabled = true;
  btn.innerHTML = '<i class="ti ti-loader" style="font-size:14px;animation:spin 0.7s linear infinite"></i>Menyimpan...';

  const { error } = await sb.auth.updateUser({
    data: { full_name: fullName }
  });

  btn.disabled = false;
  btn.innerHTML = '<i class="ti ti-check" style="font-size:14px"></i>Simpan Perubahan';

  if (error) {
    showSettingsToast('Gagal menyimpan: ' + error.message, true);
    return;
  }

  // Simpan warna avatar ke localStorage
  setAvatarColor(avatarColor);

  updateAvatarPreview(fullName, currentUser.email);
  showSettingsToast('Profil berhasil diperbarui!');
}

function resetProfileForm() {
  if (!currentUser) return;
  initProfile(currentUser);
  showSettingsToast('Form direset ke data awal');
}

/* ── Avatar Color Picker ── */
function triggerAvatarColor() {
  const container = document.getElementById('avatarColorOptions');
  container.innerHTML = AVATAR_COLORS.map(c =>
    `<div data-action="pick-avatar-color" data-color="${c}" style="
      width:36px;height:36px;border-radius:10px;background:${c};cursor:pointer;
      border:3px solid ${c === avatarColor ? '#0f0e0d' : 'transparent'};
      transition:transform 0.15s,border-color 0.15s;display:flex;align-items:center;justify-content:center;
      font-size:10px;font-weight:700;color:#fff;font-family:'JetBrains Mono',monospace;
    ">
      ${c === avatarColor ? '<i class="ti ti-check" style="font-size:14px"></i>' : ''}
    </div>`
  ).join('');
  document.getElementById('colorPickerDialog').classList.add('show');
}

function pickAvatarColor(color) {
  avatarColor = color;
  setAvatarColor(color);
  closeColorPicker();
  const fullName = document.getElementById('inputDisplayName').value.trim() ||
    (document.getElementById('inputFirstName').value.trim() + ' ' + document.getElementById('inputLastName').value.trim()).trim();
  updateAvatarPreview(fullName, currentUser ? currentUser.email : '');
  showSettingsToast('Warna avatar diperbarui!');
}

function closeColorPicker() {
  document.getElementById('colorPickerDialog').classList.remove('show');
}

/* ────────────────────────
   ANALITIK STORAGE
──────────────────────── */
function renderAnalitik() {
  const usedBytes = calcUsedBytes();
  const totalBytes = 1024 * 1024 * 1024;
  const freeBytes = Math.max(0, totalBytes - usedBytes);
  const pct = Math.min((usedBytes / totalBytes) * 100, 100);

  // Mini stats
  document.getElementById('aStatFiles').textContent = allFiles.length;
  document.getElementById('aStatUsed').textContent = formatBytes(usedBytes);
  document.getElementById('aStatFree').textContent = formatBytes(freeBytes);
  document.getElementById('aStatFolders').textContent = allFolders.length;

  // Main progress bar
  document.getElementById('aProgUsed').textContent = formatBytes(usedBytes);
  const fill = document.getElementById('aProgFill');
  setTimeout(() => {
    fill.style.width = pct.toFixed(1) + '%';
    fill.className = 'storage-progress-fill' + (pct >= 90 ? ' danger' : pct >= 70 ? ' warn' : '');
  }, 200);

  // Donut per tipe
  renderDonut();

  // Bar per folder
  renderFolderBars();

  // Timeline
  renderTimeline();
}

function renderDonut() {
  // Hitung per tipe
  const typeCounts = {};
  allFiles.forEach(f => {
    const t = f.type || 'doc';
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });

  const total = allFiles.length;
  document.getElementById('donutCenterVal').textContent = total;

  const types = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  if (total === 0) {
    document.getElementById('donutSvg').innerHTML =
      '<circle cx="50" cy="50" r="38" fill="none" stroke="var(--paper-3)" stroke-width="14"/>';
    document.getElementById('donutLegend').innerHTML =
      '<div style="font-size:12px;color:var(--ink-5);text-align:center">Belum ada file</div>';
    return;
  }

  // Build SVG arcs
  const r = 38;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  let svgInner = '';

  types.forEach(([type, count]) => {
    const pct = count / total;
    const dash = pct * circ;
    const gap  = circ - dash;
    const color = DONUT_COLORS[type] || '#888';
    svgInner += `<circle cx="50" cy="50" r="${r}" fill="none"
      stroke="${color}" stroke-width="14"
      stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
      stroke-dashoffset="${(-offset).toFixed(2)}"
      style="transition:stroke-dasharray 0.8s cubic-bezier(0.19,1,0.22,1)"
    />`;
    offset += dash;
  });

  document.getElementById('donutSvg').innerHTML = svgInner;

  // Legend
  document.getElementById('donutLegend').innerHTML = types.map(([type, count]) => {
    const pct = ((count / total) * 100).toFixed(0);
    return `<div class="donut-legend-item">
      <div class="donut-dot" style="background:${DONUT_COLORS[type] || '#888'}"></div>
      <span class="donut-legend-name">${DONUT_LABELS[type] || type}</span>
      <span class="donut-legend-val">${count}</span>
      <span class="donut-legend-pct">${pct}%</span>
    </div>`;
  }).join('');
}

function renderFolderBars(showAll) {
  const list = document.getElementById('folderBarList');
  const LIMIT = 5;

  if (allFolders.length === 0) {
    list.innerHTML = '<div style="font-size:12px;color:var(--ink-5);text-align:center;padding:20px 0">Belum ada folder</div>';
    return;
  }

  // Hitung file + bytes per folder
  const folderData = allFolders.map(folder => {
    const files = allFiles.filter(f => f.folder_name === folder.name);
    let bytes = 0;
    files.forEach(f => {
      bytes += getFileSizeBytes(f);
    });
    return { name: folder.name, files: files.length, bytes };
  }).sort((a, b) => b.files - a.files);

  const maxFiles = Math.max(...folderData.map(f => f.files), 1);
  const visible = showAll ? folderData : folderData.slice(0, LIMIT);
  const hasMore = folderData.length > LIMIT;

  list.innerHTML = visible.map(fd => {
    const pct = ((fd.files / maxFiles) * 100).toFixed(0);
    return `<div class="folder-bar-item">
      <div class="folder-bar-head">
        <span class="folder-bar-name">${escHtml(fd.name)}</span>
        <span class="folder-bar-meta">${fd.files} file · ${formatBytes(fd.bytes)}</span>
      </div>
      <div class="folder-bar-track">
        <div class="folder-bar-fill" style="width:0%" data-pct="${pct}"></div>
      </div>
    </div>`;
  }).join('') + (hasMore ? `
    <button data-action="toggle-folder-bars" data-show-all="${!showAll}" class="btn-folder-toggle">
      <i class="ti ${showAll ? 'ti-chevron-up' : 'ti-chevron-down'}" style="font-size:13px"></i>
      ${showAll ? 'Tampilkan lebih sedikit' : 'Lihat semua ' + folderData.length + ' folder'}
    </button>` : '');

  // Animate bars after render
  setTimeout(() => {
    document.querySelectorAll('.folder-bar-fill').forEach(el => {
      el.style.width = el.dataset.pct + '%';
    });
  }, 150);
}

function renderTimeline() {
  const barsEl   = document.getElementById('timelineBars');
  const labelsEl = document.getElementById('timelineLabels');

  // Buat data 7 hari terakhir
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    days.push({ key, label, count: 0 });
  }

  // Hitung upload per hari
  allFiles.forEach(f => {
    const day = f.created_at ? f.created_at.split('T')[0] : null;
    const found = days.find(d => d.key === day);
    if (found) found.count++;
  });

  const maxCount = Math.max(...days.map(d => d.count), 1);

  barsEl.innerHTML = days.map(d => {
    const heightPct = ((d.count / maxCount) * 100).toFixed(0);
    return `<div class="timeline-bar-col">
      <div class="timeline-bar" style="height:0%" data-h="${heightPct}%" data-tooltip="${d.count} file"></div>
    </div>`;
  }).join('');

  labelsEl.innerHTML = days.map(d =>
    `<span class="timeline-label">${d.label}</span>`
  ).join('');

  // Animate
  setTimeout(() => {
    document.querySelectorAll('.timeline-bar').forEach(el => {
      el.style.height = el.dataset.h;
    });
  }, 200);
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

/* ────────────────────────
   NOTIFIKASI SETTINGS
──────────────────────── */
function loadNotifSettings() {
  const s = JSON.parse(localStorage.getItem('myStorageNotifSettings') || '{}');
  document.getElementById('toggleInApp').checked   = s.inApp   !== false;
  document.getElementById('toggleCritical').checked = s.critical !== false;
  document.getElementById('toggleUploadWarn').checked = s.uploadWarn !== false;
  const threshold = s.threshold || 80;
  document.getElementById('thresholdSlider').value = threshold;
  document.getElementById('thresholdDisplay').textContent = threshold + '%';
}

function saveNotifSettings() {
  const s = {
    inApp:       document.getElementById('toggleInApp').checked,
    critical:    document.getElementById('toggleCritical').checked,
    uploadWarn:  document.getElementById('toggleUploadWarn').checked,
    threshold:   parseInt(document.getElementById('thresholdSlider').value),
  };
  localStorage.setItem('myStorageNotifSettings', JSON.stringify(s));
  checkStorageWarning();
}

function resetNotifSettings() {
  localStorage.removeItem('myStorageNotifSettings');
  loadNotifSettings();
  checkStorageWarning();
  showSettingsToast('Pengaturan notifikasi direset ke default');
}

function updateThreshold(val) {
  document.getElementById('thresholdDisplay').textContent = val + '%';
}

function checkStorageWarning() {
  const usedBytes = calcUsedBytes();
  const totalBytes = 1024 * 1024 * 1024;
  const pct = (usedBytes / totalBytes) * 100;

  const s = JSON.parse(localStorage.getItem('myStorageNotifSettings') || '{}');
  const threshold = s.threshold || 80;
  const showInApp = s.inApp !== false;
  const showCritical = s.critical !== false;

  const banner = document.getElementById('storageWarnBanner');
  const title  = document.getElementById('warnBannerTitle');
  const desc   = document.getElementById('warnBannerDesc');

  if (pct >= 90 && showCritical) {
    banner.className = 'storage-warning-banner show danger';
    title.textContent = 'Storage Hampir Penuh!';
    desc.textContent  = `Storage kamu telah mencapai ${pct.toFixed(0)}% — segera hapus file yang tidak diperlukan.`;
  } else if (pct >= threshold && showInApp) {
    banner.className = 'storage-warning-banner show warn';
    title.textContent = `Storage Mencapai ${pct.toFixed(0)}%`;
    desc.textContent  = `Kamu telah menggunakan ${pct.toFixed(0)}% dari kapasitas (batas notifikasi: ${threshold}%).`;
  } else {
    banner.className = 'storage-warning-banner';
  }
}

/* ────────────────────────
   INIT
──────────────────────── */

function initSettingsActionBindings() {
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;

    if (action === 'go-dashboard') { window.location.href = '../Storage-dashboard.html'; return; }
    if (action === 'logout') { doLogout(); return; }
    if (action === 'close-sidebar') { closeSidebar(); return; }
    if (action === 'toggle-sidebar') { toggleSidebar(); return; }
    if (action === 'scroll-section') { scrollToSection(el.dataset.section, el); return; }
    if (action === 'trigger-photo') { triggerPhotoUpload(); return; }
    if (action === 'trigger-color') { triggerAvatarColor(); return; }
    if (action === 'remove-photo') { removePhoto(); return; }
    if (action === 'close-crop') { closeCropDialog(); return; }
    if (action === 'apply-crop') { applyCrop(); return; }
    if (action === 'reset-profile') { resetProfileForm(); return; }
    if (action === 'save-profile') { saveProfile(); return; }
    if (action === 'reset-notif') { resetNotifSettings(); return; }
    if (action === 'save-notif') { saveNotifSettings(); showSettingsToast('Pengaturan notifikasi disimpan!'); return; }
    if (action === 'toggle-night-mode') { NightMode.toggle(); syncNightModeToggle(); return; }
    if (action === 'set-light-mode') { if (NightMode.isDark()) { NightMode.toggle(); syncNightModeToggle(); } return; }
    if (action === 'set-dark-mode') { if (!NightMode.isDark()) { NightMode.toggle(); syncNightModeToggle(); } return; }
    if (action === 'close-color-picker') { closeColorPicker(); return; }
    if (action === 'pick-avatar-color') { pickAvatarColor(el.dataset.color); return; }
    if (action === 'toggle-folder-bars') { renderFolderBars(el.dataset.showAll === 'true'); return; }
  });

  document.addEventListener('change', function(e) {
    var el = e.target;
    if (!el || !el.dataset) return;
    if (el.dataset.action === 'photo-select') handlePhotoSelect(el);
    if (el.dataset.action === 'save-notif') saveNotifSettings();
  });

  document.addEventListener('input', function(e) {
    var el = e.target;
    if (!el || !el.dataset) return;
    if (el.dataset.action === 'update-crop') updateCrop();
    if (el.dataset.action === 'update-threshold') updateThreshold(el.value);
  });
}

document.addEventListener('DOMContentLoaded', async function() {
  initSettingsActionBindings();
  const { data: sessionData } = await sb.auth.getSession();
  if (!sessionData || !sessionData.session) {
    window.location.href = '../pages/login.html';
    return;
  }

  currentUser = sessionData.session.user;
  cleanupLegacyAvatarKeys();

  // Terapkan avatar color milik user yang sedang login
  avatarColor = getAvatarColor();

  initProfile(currentUser);
  loadNotifSettings();
  await loadAll();

  // Sidebar user chip → logout
  document.getElementById('userChip').onclick = doLogout;

  // Close color picker on overlay click
  document.getElementById('colorPickerDialog').addEventListener('click', function(e) {
    if (e.target === this) closeColorPicker();
  });

  sb.auth.onAuthStateChange(function(event, session) {
    if (event === 'SIGNED_OUT' || !session) window.location.href = '../pages/login.html';
  });

  // Sync night mode toggle checkbox
  syncNightModeToggle();
});

function syncNightModeToggle() {
  const cb = document.getElementById('nightModeCheck');
  if (cb) cb.checked = NightMode.isDark();
}

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
    iconEl.className = 'custom-dialog-icon' + (iconClass ? ' ' + iconClass : '');
    iconEl.innerHTML = '<i class="ti ' + (icon || 'ti-alert-triangle') + '"></i>';
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

/* ── Hamburger / Sidebar Toggle ── */
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ── Logout (dipanggil dari sidebar nav) ── */
async function doLogout() {
  const ok = await customConfirm({
    title: 'Logout',
    message: 'Yakin ingin keluar dari akun Anda?',
    icon: 'ti-logout',
    iconClass: 'logout',
    confirmText: 'Ya, Logout',
    confirmBtnClass: 'logout-confirm'
  });
  if (ok) {
    await sb.auth.signOut();
    window.location.replace('../pages/login.html');
  }
}
