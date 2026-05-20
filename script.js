const FOLDERS = [
  { name: 'Kampus',  count: 10, size: '3.2 GB', color1: '#c7d2fe', color2: '#eef2ff', text: '#3730a3', sub: '#6366f1', av: '#6366f1', members: ['RZ'] },
  { name: 'Kerja',   count: 8,  size: '2.8 GB', color1: '#bae6fd', color2: '#e0f2fe', text: '#0c4a6e', sub: '#0369a1', av: '#0ea5e9', members: ['RZ', 'AB'] },
  { name: 'Foto',    count: 4,  size: '800 MB', color1: '#bbf7d0', color2: '#dcfce7', text: '#14532d', sub: '#15803d', av: '#22c55e', members: ['RZ'] },
  { name: 'Pribadi', count: 2,  size: '600 MB', color1: '#fed7aa', color2: '#ffedd5', text: '#7c2d12', sub: '#c2410c', av: '#f97316', members: ['RZ'] },
];

const FILES = [
  { name: 'Skripsi_final.pdf',  folder: 'Kampus',  type: 'pdf',         icon: 'ti-file-type-pdf', iconColor: '#ef4444', iconBg: '#fff0f0', size: '2.1 GB', date: '10 Okt' },
  { name: 'Sidang_ppt.pptx',    folder: 'Kampus',  type: 'doc',         icon: 'ti-presentation',  iconColor: '#6366f1', iconBg: '#eef2ff', size: '450 MB', date: '9 Okt'  },
  { name: 'Laporan_Q3.docx',    folder: 'Kerja',   type: 'doc',         icon: 'ti-file-text',     iconColor: '#0ea5e9', iconBg: '#f0f9ff', size: '25 MB',  date: '8 Okt'  },
  { name: 'Foto_wisuda.jpg',    folder: 'Foto',    type: 'foto',        icon: 'ti-photo',          iconColor: '#22c55e', iconBg: '#dcfce7', size: '12 MB',  date: '7 Okt'  },
  { name: 'Data_sales.xlsx',    folder: 'Kerja',   type: 'spreadsheet', icon: 'ti-table',          iconColor: '#0ea5e9', iconBg: '#f0f9ff', size: '80 MB',  date: '6 Okt'  },
  { name: 'Vlog_liburan.mp4',   folder: 'Pribadi', type: 'video',       icon: 'ti-video',          iconColor: '#f97316', iconBg: '#fff7ed', size: '600 MB', date: '5 Okt'  },
  { name: 'Proposal_PKM.docx',  folder: 'Kampus',  type: 'doc',         icon: 'ti-file-text',      iconColor: '#6366f1', iconBg: '#eef2ff', size: '15 MB',  date: '4 Okt'  },
  { name: 'CV_terbaru.pdf',     folder: 'Kerja',   type: 'pdf',         icon: 'ti-file-type-pdf',  iconColor: '#ef4444', iconBg: '#fff0f0', size: '2 MB',   date: '3 Okt'  },
];

const FOLDER_BADGE = {
  'Kampus':  { bg: '#e0e7ff', color: '#4338ca' },
  'Kerja':   { bg: '#e0f2fe', color: '#0369a1' },
  'Foto':    { bg: '#dcfce7', color: '#15803d' },
  'Pribadi': { bg: '#ffedd5', color: '#c2410c' },
};

let currentFilter = 'semua';
let ctxTarget = null;

/* ── STATS ── */
function renderStats() {
  const totalFiles = FILES.length;
  const totalFolders = FOLDERS.length;
  const usedGB = 7.4;
  const totalGB = 12;

  document.getElementById('statFiles').textContent = totalFiles;
  document.getElementById('statFolders').textContent = totalFolders;

  const pct = Math.round((usedGB / totalGB) * 100);
  document.getElementById('storagePct').textContent = pct + '%';
  document.getElementById('storageUsed').textContent = usedGB + ' GB terpakai';

  setTimeout(() => {
    const fill = document.querySelector('.storage-fill');
    if (fill) fill.style.width = pct + '%';
  }, 300);
}

/* ── RENDER FOLDERS ── */
function renderFolders() {
  const grid = document.getElementById('folderGrid');
  grid.innerHTML = FOLDERS.map((f, i) => {
    const avatars = f.members.map((m, j) => `
      <circle cx="${10 + j * 12}" cy="69" r="6.5" fill="${f.av}" opacity="${1 - j * 0.15}"/>
      <text x="${10 + j * 12}" y="73" font-size="5.5" fill="#fff" text-anchor="middle" font-family="sans-serif" font-weight="600">${m}</text>
    `).join('');
    return `
      <div class="folder-wrap" style="animation-delay:${i * 0.06}s" onclick="showToast('Membuka folder ${f.name}...')">
        <svg viewBox="0 0 140 90" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="fs${i}" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${f.color1}" flood-opacity="0.4"/>
            </filter>
          </defs>
          <path d="M6,20 Q6,14 12,14 L54,14 Q59,14 62,19 L67,26 L132,26 Q137,26 137,31 L137,82 Q137,88 131,88 L9,88 Q3,88 3,82 L3,27 Q3,20 9,20 Z" fill="${f.color1}" filter="url(#fs${i})"/>
          <path d="M3,28 L3,82 Q3,88 9,88 L131,88 Q137,88 137,82 L137,31 Q137,26 132,26 L6,26 Q3,26 3,28 Z" fill="${f.color2}"/>
          <text x="11" y="48" font-size="10.5" font-weight="700" fill="${f.text}" font-family="sans-serif">${f.name}</text>
          <text x="11" y="61" font-size="7.5" fill="${f.sub}" font-family="sans-serif">${f.count} file · ${f.size}</text>
          ${avatars}
          <circle cx="${128}" cy="${14}" r="8" fill="${f.color1}"/>
          <text x="128" y="18" font-size="10" fill="${f.text}" text-anchor="middle" font-family="sans-serif" font-weight="600">›</text>
        </svg>
      </div>`;
  }).join('');
  document.getElementById('folderCount').textContent = FOLDERS.length;
}

/* ── RENDER FILES ── */
function renderFiles() {
  const grid = document.getElementById('fileGrid');
  const search = document.getElementById('searchInput').value.toLowerCase();
  const filtered = FILES.filter(f => {
    const matchType   = currentFilter === 'semua' || f.type === currentFilter;
    const matchSearch = f.name.toLowerCase().includes(search) || f.folder.toLowerCase().includes(search);
    return matchType && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="ti ti-mood-empty"></i>
        <p>Tidak ada file yang ditemukan.</p>
      </div>`;
    document.getElementById('fileCount').textContent = '0';
    return;
  }

  grid.innerHTML = filtered.map((f, i) => {
    const badge = FOLDER_BADGE[f.folder] || { bg: '#f3f4f6', color: '#6b7280' };
    return `
      <div class="file-card" style="animation-delay:${i * 0.04}s" oncontextmenu="showCtx(event,${FILES.indexOf(f)})">
        <div class="file-top">
          <div class="file-icon-box" style="background:${f.iconBg}">
            <i class="ti ${f.icon}" style="color:${f.iconColor}"></i>
          </div>
          <div class="file-menu" onclick="showCtx(event,${FILES.indexOf(f)})">
            <i class="ti ti-dots-vertical"></i>
          </div>
        </div>
        <span class="fcat-badge" style="background:${badge.bg};color:${badge.color}">${f.folder}</span>
        <div class="file-name" title="${f.name}">${f.name}</div>
        <div class="file-info"><span>${f.size}</span><span>${f.date}</span></div>
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

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  document.getElementById('selectedFiles').textContent = '';
  document.getElementById('folderSelect').value = '';
}

/* ── ADD FOLDER ── */
function addFolder() {
  const name = prompt('Nama folder baru:');
  if (!name || !name.trim()) return;
  const colors = [
    { c1: '#fecdd3', c2: '#ffe4e6', text: '#881337', sub: '#be123c', av: '#f43f5e' },
    { c1: '#d8b4fe', c2: '#f3e8ff', text: '#4a044e', sub: '#7e22ce', av: '#a855f7' },
    { c1: '#fde68a', c2: '#fef9c3', text: '#78350f', sub: '#b45309', av: '#f59e0b' },
  ];
  const c = colors[FOLDERS.length % colors.length];
  FOLDERS.push({ name: name.trim(), count: 0, size: '0 MB', color1: c.c1, color2: c.c2, text: c.text, sub: c.sub, av: c.av, members: ['RZ'] });
  FOLDER_BADGE[name.trim()] = { bg: c.c2, color: c.text };
  const sel = document.getElementById('folderSelect');
  const opt = document.createElement('option');
  opt.value = name.trim();
  opt.textContent = name.trim();
  sel.appendChild(opt);
  renderFolders();
  showToast('Folder "' + name.trim() + '" berhasil dibuat!');
}

/* ── CONTEXT MENU ── */
function showCtx(e, idx) {
  e.preventDefault();
  ctxTarget = idx;
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

function deleteFile() {
  if (ctxTarget === null) return;
  const name = FILES[ctxTarget].name;
  FILES.splice(ctxTarget, 1);
  renderFiles();
  showToast('File "' + name + '" dihapus.');
  ctxTarget = null;
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
document.addEventListener('DOMContentLoaded', () => {
  /* modal backdrop click */
  document.getElementById('modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });

  /* drag & drop */
  const dz = document.getElementById('dropZone');
  dz.addEventListener('dragover', e => {
    e.preventDefault();
    dz.style.borderColor = 'var(--accent)';
    dz.style.background = '#e8e5fc';
  });
  dz.addEventListener('dragleave', () => {
    dz.style.borderColor = '';
    dz.style.background = '';
  });
  dz.addEventListener('drop', e => {
    e.preventDefault();
    dz.style.borderColor = '';
    dz.style.background = '';
    const names = Array.from(e.dataTransfer.files).map(f => f.name).join(', ');
    document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
  });

  /* search keyboard shortcut */
  document.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      document.getElementById('searchInput').focus();
    }
  });

  renderStats();
  renderFolders();
  renderFiles();
});

function handleFileSelect(input) {
  const names = Array.from(input.files).map(f => f.name).join(', ');
  document.getElementById('selectedFiles').textContent = names ? '📎 ' + names : '';
}

function uploadFile() {
  const folder = document.getElementById('folderSelect').value;
  if (!folder) { showToast('Pilih folder tujuan dulu!'); return; }
  closeModal();
  showToast('File berhasil diupload ke ' + folder + '!');
}