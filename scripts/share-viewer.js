/* MyStorage public share viewer */
(function () {
  const sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  let fileInfo = null;
  let signedUrl = null;

  const FILE_ICONS = {
    pdf: { icon: 'ti-file-type-pdf', color: '#c0392b', bg: 'rgba(192,57,43,0.08)' },
    doc: { icon: 'ti-file-text', color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)' },
    foto: { icon: 'ti-photo', color: '#2d6a4f', bg: 'rgba(45,106,79,0.08)' },
    video: { icon: 'ti-video', color: '#c8602a', bg: 'rgba(200,96,42,0.08)' },
    spreadsheet: { icon: 'ti-table', color: '#0369a1', bg: 'rgba(3,105,161,0.08)' },
    audio: { icon: 'ti-music', color: '#7e22ce', bg: 'rgba(126,34,206,0.08)' },
  };
  const OFFICE_EXTS = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = String(str || '');
    return d.innerHTML;
  }

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

  function showError(title, desc) {
    document.getElementById('viewerWrap').innerHTML = `
      <div class="error-state">
        <i class="ti ti-link-off"></i>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(desc)}</p>
      </div>`;
    document.getElementById('fileTitle').textContent = title;
    document.getElementById('fileMeta').textContent = 'Link tidak tersedia';
  }

  function renderViewer(url, info) {
    const wrap = document.getElementById('viewerWrap');
    const name = info.name || 'File';
    const type = info.type || 'doc';
    const ext = (name || '').split('.').pop().toLowerCase();

    if (type === 'pdf' || ext === 'pdf') {
      wrap.innerHTML = `<iframe class="pdf-viewer" src="${escapeHtml(url)}" title="${escapeHtml(name)}"></iframe>`;
      return;
    }

    if (type === 'foto' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      wrap.innerHTML = `<div class="img-viewer-wrap"><img id="viewerImage" src="${escapeHtml(url)}" alt="${escapeHtml(name)}" style="opacity:0;transition:opacity .4s ease"/></div>`;
      const img = document.getElementById('viewerImage');
      if (img) img.addEventListener('load', function () { this.style.opacity = '1'; });
      return;
    }

    if (type === 'video' || ['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      wrap.innerHTML = `<div class="video-viewer-wrap"><video controls><source src="${escapeHtml(url)}">Browser Anda tidak mendukung video.</video></div>`;
      return;
    }

    if (type === 'audio' || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) {
      wrap.innerHTML = `<div class="audio-viewer-wrap"><div class="audio-icon-big"><i class="ti ti-music"></i></div><div class="audio-name">${escapeHtml(name)}</div><audio controls><source src="${escapeHtml(url)}">Browser Anda tidak mendukung audio.</audio></div>`;
      return;
    }

    const iconInfo = FILE_ICONS[type] || FILE_ICONS.doc;
    const extLabel = ext ? ext.toUpperCase() : (type || 'FILE').toUpperCase();
    const note = OFFICE_EXTS.includes(ext)
      ? `File <strong>${escapeHtml(extLabel)}</strong> tidak bisa ditampilkan langsung di browser. Silakan download untuk membukanya.`
      : `Tipe file ini tidak bisa ditampilkan langsung. Gunakan tombol Download.`;

    wrap.innerHTML = `<div class="generic-viewer"><div class="generic-icon-box" style="background:${iconInfo.bg}"><i class="ti ${iconInfo.icon}" style="color:${iconInfo.color}"></i></div><span class="ext-badge">${escapeHtml(extLabel)}</span><h3>${escapeHtml(name)}</h3><p>${note}</p><button class="btn primary" type="button" data-action="download-file"><i class="ti ti-download"></i>Download File</button></div>`;
  }

  async function downloadFile() {
    if (!fileInfo || !fileInfo.storage_path) return;
    showToast('Menyiapkan download...');
    const { data, error } = await sb.storage.from('user-files').download(fileInfo.storage_path);
    if (error) {
      showToast('Gagal download: ' + error.message, true);
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileInfo.name || 'file';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Download dimulai!');
  }

  async function init() {
    if (!token) {
      showError('Token tidak valid', 'Link publik ini tidak memiliki token.');
      return;
    }

    const { data, error } = await sb.rpc('get_shared_file_by_token', { p_token: token });
    if (error || !data || data.length === 0) {
      showError('Link tidak bisa dibuka', error ? error.message : 'Link sudah expired, dicabut, atau file tidak tersedia.');
      return;
    }

    fileInfo = Array.isArray(data) ? data[0] : data;
    document.title = 'MyStorage — ' + fileInfo.name;
    document.getElementById('fileTitle').textContent = fileInfo.name || 'Shared file';
    document.getElementById('fileMeta').textContent = (fileInfo.size || '') + (fileInfo.type ? ' · ' + String(fileInfo.type).toUpperCase() : '') + ' · Link publik';

    const { data: signed, error: signError } = await sb.storage.from('user-files').createSignedUrl(fileInfo.storage_path, 3600);
    if (signError || !signed) {
      showError('Gagal membuka file', signError ? signError.message : 'Tidak dapat membuat link akses.');
      return;
    }
    signedUrl = signed.signedUrl;
    renderViewer(signedUrl, fileInfo);
  }

  function bindEvents() {
    const btnDownload = document.getElementById('btnDownload');
    const btnCopy = document.getElementById('btnCopy');
    if (btnDownload) btnDownload.addEventListener('click', downloadFile);
    if (btnCopy) btnCopy.addEventListener('click', async function () {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link disalin!');
      } catch (e) {
        window.prompt('Salin link:', window.location.href);
      }
    });
    document.addEventListener('click', function (e) {
      const action = e.target.closest('[data-action]');
      if (action && action.getAttribute('data-action') === 'download-file') downloadFile();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindEvents();
    init();
  });
})();
