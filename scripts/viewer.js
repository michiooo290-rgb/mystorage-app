/* MyStorage viewer page logic
   Dipindahkan dari inline <script> agar cocok dengan CSP ketat tanpa 'unsafe-inline'. */
(function () {
  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

  let signedUrl = null;

  const params = new URLSearchParams(window.location.search);
  const storagePath = params.get('path');
  const fileName = params.get('name');
  const fileType = params.get('type');
  const fileSize = params.get('size');

  const FILE_ICONS = {
    pdf: { icon: 'ti-file-type-pdf', color: '#c0392b', bg: 'rgba(192,57,43,0.08)' },
    doc: { icon: 'ti-file-text', color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
    foto: { icon: 'ti-photo', color: '#2d6a4f', bg: 'rgba(45,106,79,0.08)' },
    video: { icon: 'ti-video', color: '#c8602a', bg: 'rgba(200,96,42,0.08)' },
    spreadsheet: { icon: 'ti-table', color: '#0369a1', bg: 'rgba(3,105,161,0.08)' },
    audio: { icon: 'ti-music', color: '#7e22ce', bg: 'rgba(126,34,206,0.08)' },
  };

  const OFFICE_EXTS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  function showToast(msg, isError) {
    const t = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const msgEl = document.getElementById('toastMsg');
    if (!t || !icon || !msgEl) return;
    msgEl.textContent = msg;
    icon.className = isError ? 'ti ti-alert-circle' : 'ti ti-check';
    icon.style.color = isError ? '#f87171' : '#4ade80';
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove('show'), 3000);
  }

  function showError(msg, detail) {
    const ls = document.getElementById('loadingState');
    if (ls) ls.remove();
    document.getElementById('viewerWrap').innerHTML = `
      <div class="error-state">
        <i class="ti ti-file-alert"></i>
        <h3>${escapeHtml(msg)}</h3>
        <p>${escapeHtml(detail)}</p>
        <a href="../Storage-dashboard.html" class="btn-action" style="margin-top:8px">
          <i class="ti ti-arrow-left"></i> Kembali ke Dashboard
        </a>
      </div>`;
  }

  function renderViewer(url, type, name) {
    const wrap = document.getElementById('viewerWrap');
    const ext = (name || '').split('.').pop().toLowerCase();

    if (type === 'pdf' || ext === 'pdf') {
      wrap.innerHTML = `<iframe class="pdf-viewer" src="${escapeHtml(url)}" title="${escapeHtml(name)}"></iframe>`;
      return;
    }

    if (type === 'foto' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      wrap.innerHTML = `
        <div class="img-viewer-wrap">
          <img id="viewerImage" src="${escapeHtml(url)}" alt="${escapeHtml(name)}" style="opacity:0;transition:opacity 0.4s ease"/>
        </div>`;
      const img = document.getElementById('viewerImage');
      if (img) img.addEventListener('load', function () { this.style.opacity = '1'; });
      return;
    }

    if (type === 'video' || ['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      wrap.innerHTML = `
        <div class="video-viewer-wrap">
          <video controls autoplay>
            <source src="${escapeHtml(url)}">
            Browser Anda tidak mendukung pemutaran video.
          </video>
        </div>`;
      return;
    }

    if (type === 'audio' || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) {
      wrap.innerHTML = `
        <div class="audio-viewer-wrap">
          <div class="audio-icon-big"><i class="ti ti-music"></i></div>
          <div class="audio-name">${escapeHtml(name)}</div>
          <audio controls autoplay>
            <source src="${escapeHtml(url)}">
            Browser Anda tidak mendukung pemutaran audio.
          </audio>
        </div>`;
      return;
    }

    const iconInfo = FILE_ICONS[type] || FILE_ICONS.doc;
    const isOffice = OFFICE_EXTS.includes(ext);
    const extLabel = ext ? ext.toUpperCase() : (type || 'FILE').toUpperCase();

    const officeNote = isOffice
      ? `File <strong>${escapeHtml(extLabel)}</strong> tidak bisa ditampilkan langsung di browser karena keterbatasan keamanan browser.<br>Silakan download untuk membuka dengan aplikasi yang sesuai.`
      : `Tipe file ini tidak bisa ditampilkan langsung di browser.<br>Gunakan tombol <strong>Download</strong> untuk membuka file ini.`;

    wrap.innerHTML = `
      <div class="generic-viewer">
        <div class="generic-icon-box" style="background:${iconInfo.bg}">
          <i class="ti ${iconInfo.icon}" style="color:${iconInfo.color}"></i>
        </div>
        <span class="ext-badge">${escapeHtml(extLabel)}</span>
        <h3>${escapeHtml(name)}</h3>
        <p>${officeNote}</p>
        <div class="btn-group">
          <button class="btn-action primary" data-action="download-file">
            <i class="ti ti-download"></i> Download File
          </button>
        </div>
      </div>`;
  }

  async function downloadFile() {
    if (!storagePath) return;
    showToast('Menyiapkan download...');
    const { data, error } = await sb.storage.from('user-files').download(storagePath);
    if (error) {
      showToast('Gagal download: ' + error.message, true);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'file';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download dimulai!');
  }

  async function shareFile() {
    if (!storagePath) return;
    showToast('Membuat link...');
    const { data, error } = await sb.storage.from('user-files').createSignedUrl(storagePath, 604800);
    if (error) {
      showToast('Gagal membuat link: ' + error.message, true);
      return;
    }

    try {
      let saved = JSON.parse(localStorage.getItem('myStorageShared') || '[]');
      saved = saved.filter(s => s.fileId !== storagePath);
      saved.unshift({
        fileId: storagePath,
        name: fileName || 'File',
        url: data.signedUrl,
        type: fileType || 'doc',
        folder: storagePath.split('/')[1] || 'root',
        createdAt: Date.now(),
      });
      if (saved.length > 50) saved = saved.slice(0, 50);
      localStorage.setItem('myStorageShared', JSON.stringify(saved));
    } catch (e) {
      console.warn('Gagal simpan shared link:', e);
    }

    try {
      await navigator.clipboard.writeText(data.signedUrl);
      showToast('Link berhasil disalin ke clipboard!');
    } catch (e) {
      window.prompt('Salin link berikut:', data.signedUrl);
    }
  }

  function bindEvents() {
    const btnShare = document.getElementById('btnShare');
    const btnDownload = document.getElementById('btnDownload');
    if (btnShare) btnShare.addEventListener('click', shareFile);
    if (btnDownload) btnDownload.addEventListener('click', downloadFile);

    document.addEventListener('click', function (e) {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;
      const action = actionEl.getAttribute('data-action');
      if (action === 'download-file') downloadFile();
    });
  }

  document.addEventListener('DOMContentLoaded', async function () {
    bindEvents();

    const { data: sessionData } = await sb.auth.getSession();
    if (!sessionData || !sessionData.session) {
      window.location.href = '../pages/login.html';
      return;
    }

    if (!storagePath || !fileName) {
      showError('File tidak ditemukan', 'Parameter file tidak valid. Silakan kembali ke dashboard dan pilih file lagi.');
      return;
    }

    document.title = 'MyStorage — ' + fileName;
    document.getElementById('fileTitle').textContent = fileName;
    document.getElementById('fileMeta').textContent = fileSize
      ? fileSize + ' · ' + (fileType || '').toUpperCase()
      : (fileType || '').toUpperCase();

    const { data, error } = await sb.storage.from('user-files').createSignedUrl(storagePath, 3600);
    if (error) {
      showError('Gagal membuka file', 'Tidak dapat membuat link akses: ' + error.message);
      return;
    }

    signedUrl = data.signedUrl;
    renderViewer(signedUrl, fileType, fileName);
  });
})();
