/* MyStorage viewer page logic
   Versi hybrid PDF:
   - PDF dicoba tampil pakai viewer bawaan browser lewat iframe
   - Kalau gagal/lambat, fallback Download tetap muncul
   - Share link public tetap dipertahankan
   - Cocok dengan CSP ketat tanpa inline script
*/

(function () {
  const sb = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  let signedUrl = null;

  const params = new URLSearchParams(window.location.search);
  const fileId = params.get('id');
  const storagePath = params.get('path');
  const fileName = params.get('name');
  const fileType = params.get('type');
  const fileSize = params.get('size');

  const FILE_ICONS = {
    pdf: {
      icon: 'ti-file-type-pdf',
      color: '#c0392b',
      bg: 'rgba(192,57,43,0.08)'
    },
    doc: {
      icon: 'ti-file-text',
      color: '#1d4ed8',
      bg: 'rgba(29,78,216,0.08)'
    },
    foto: {
      icon: 'ti-photo',
      color: '#2d6a4f',
      bg: 'rgba(45,106,79,0.08)'
    },
    video: {
      icon: 'ti-video',
      color: '#c8602a',
      bg: 'rgba(200,96,42,0.08)'
    },
    spreadsheet: {
      icon: 'ti-table',
      color: '#0369a1',
      bg: 'rgba(3,105,161,0.08)'
    },
    audio: {
      icon: 'ti-music',
      color: '#7e22ce',
      bg: 'rgba(126,34,206,0.08)'
    }
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
    t._timer = setTimeout(function () {
      t.classList.remove('show');
    }, 3000);
  }

  function showError(msg, detail) {
    const loading = document.getElementById('loadingState');
    const wrap = document.getElementById('viewerWrap');

    if (loading) loading.remove();
    if (!wrap) return;

    wrap.innerHTML = `
      <div class="error-state">
        <i class="ti ti-file-alert"></i>
        <h3>${escapeHtml(msg)}</h3>
        <p>${escapeHtml(detail)}</p>
        <a href="../Storage-dashboard.html" class="btn-action" style="margin-top:8px">
          <i class="ti ti-arrow-left"></i> Kembali ke Dashboard
        </a>
      </div>
    `;
  }

  function generateShareToken() {
    try {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);

      return Array.from(bytes)
        .map(function (b) {
          return b.toString(16).padStart(2, '0');
        })
        .join('');
    } catch (e) {
      return String(Date.now()) + '_' + Math.random().toString(36).slice(2);
    }
  }

  function buildPublicShareUrl(token) {
    return (
      window.location.origin +
      '/pages/share.html?token=' +
      encodeURIComponent(token)
    );
  }

  function showPdfFallback(name) {
    const frame = document.getElementById('pdfFrame');
    const fallback = document.getElementById('pdfFallback');

    if (frame) frame.style.display = 'none';
    if (fallback) fallback.style.display = 'flex';
  }

  function renderPdfViewer(url, name) {
    const wrap = document.getElementById('viewerWrap');
    if (!wrap) return;

    wrap.innerHTML = `
      <iframe
        id="pdfFrame"
        class="pdf-viewer"
        src="${escapeHtml(url)}"
        title="${escapeHtml(name)}">
      </iframe>

      <div id="pdfFallback" class="generic-viewer" style="display:none">
        <div class="generic-icon-box" style="background:rgba(192,57,43,0.08)">
          <i class="ti ti-file-type-pdf" style="color:#c0392b"></i>
        </div>

        <span class="ext-badge">PDF</span>

        <h3>${escapeHtml(name)}</h3>

        <p>
          Preview PDF gagal dimuat di browser, tetapi file masih bisa didownload.
        </p>

        <div class="btn-group">
          <button class="btn-action primary" data-action="download-file">
            <i class="ti ti-download"></i> Download File
          </button>

          <button class="btn-action" data-action="open-pdf-new-tab">
            <i class="ti ti-external-link"></i> Buka di Tab Baru
          </button>
        </div>
      </div>
    `;

    const frame = document.getElementById('pdfFrame');
    let loaded = false;

    if (frame) {
      frame.addEventListener('load', function () {
        loaded = true;
      });

      frame.addEventListener('error', function () {
        showPdfFallback(name);
      });
    }

    setTimeout(function () {
      if (!loaded) {
        showPdfFallback(name);
      }
    }, 6000);
  }

  function renderViewer(url, type, name) {
    const wrap = document.getElementById('viewerWrap');
    if (!wrap) return;

    const ext = String(name || '').split('.').pop().toLowerCase();

    if (type === 'pdf' || ext === 'pdf') {
      renderPdfViewer(url, name);
      return;
    }

    if (type === 'foto' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) {
      wrap.innerHTML = `
        <div class="img-viewer-wrap">
          <img
            id="viewerImage"
            src="${escapeHtml(url)}"
            alt="${escapeHtml(name)}"
            style="opacity:0;transition:opacity 0.4s ease"
          />
        </div>
      `;

      const img = document.getElementById('viewerImage');
      if (img) {
        img.addEventListener('load', function () {
          this.style.opacity = '1';
        });
      }

      return;
    }

    if (type === 'video' || ['mp4', 'webm', 'ogg', 'mov'].includes(ext)) {
      wrap.innerHTML = `
        <div class="video-viewer-wrap">
          <video controls autoplay>
            <source src="${escapeHtml(url)}">
            Browser Anda tidak mendukung pemutaran video.
          </video>
        </div>
      `;

      return;
    }

    if (type === 'audio' || ['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(ext)) {
      wrap.innerHTML = `
        <div class="audio-viewer-wrap">
          <div class="audio-icon-big">
            <i class="ti ti-music"></i>
          </div>

          <div class="audio-name">${escapeHtml(name)}</div>

          <audio controls autoplay>
            <source src="${escapeHtml(url)}">
            Browser Anda tidak mendukung pemutaran audio.
          </audio>
        </div>
      `;

      return;
    }

    const iconInfo = FILE_ICONS[type] || FILE_ICONS.doc;
    const isOffice = OFFICE_EXTS.includes(ext);
    const extLabel = ext ? ext.toUpperCase() : String(type || 'FILE').toUpperCase();

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
      </div>
    `;
  }

  async function downloadFile() {
    if (!storagePath) return;

    showToast('Menyiapkan download...');

    const { data, error } = await sb.storage
      .from('user-files')
      .download(storagePath);

    if (error) {
      showToast('Gagal download: ' + error.message, true);
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement('a');

    a.href = url;
    a.download = fileName || 'file';
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);

    showToast('Download dimulai!');
  }

  async function shareFile() {
    if (!storagePath) return;

    showToast('Membuat public share link...');

    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData && sessionData.session ? sessionData.session.user : null;

    if (!user) {
      showToast('Sesi login habis. Login ulang dulu.', true);
      return;
    }

    if (!fileId) {
      showToast('File ID tidak tersedia. Buka file dari dashboard terbaru lalu coba lagi.', true);
      return;
    }

    const token = generateShareToken();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    try {
      await sb
        .from('shared_links')
        .update({ revoked_at: new Date().toISOString() })
        .eq('file_id', fileId)
        .eq('user_id', user.id)
        .is('revoked_at', null);

      const { data: row, error } = await sb
        .from('shared_links')
        .insert({
          token: token,
          file_id: fileId,
          user_id: user.id,
          expires_at: expiresAt,
          file_name: fileName || 'File',
          file_type: fileType || 'doc',
          storage_path_snapshot: storagePath
        })
        .select('id, token, created_at, expires_at')
        .single();

      if (error) throw error;

      await sb.from('activity_logs').insert({
        user_id: user.id,
        action: 'share_file',
        file_id: fileId,
        file_name: fileName || 'File',
        details: {
          shared_id: row && row.id,
          token: token,
          source: 'viewer'
        }
      });

      const publicUrl = buildPublicShareUrl(token);

      try {
        let saved = JSON.parse(localStorage.getItem('myStorageShared') || '[]');

        saved = saved.filter(function (s) {
          return s.fileId !== String(fileId);
        });

        saved.unshift({
          fileId: String(fileId),
          sharedId: row && row.id,
          token: token,
          name: fileName || 'File',
          url: publicUrl,
          type: fileType || 'doc',
          folder: storagePath.split('/')[1] || 'root',
          createdAt: Date.now(),
          expiresAt: new Date(expiresAt).getTime()
        });

        if (saved.length > 50) saved = saved.slice(0, 50);

        localStorage.setItem('myStorageShared', JSON.stringify(saved));
      } catch (cacheErr) {
        console.warn('Gagal simpan cache shared link:', cacheErr);
      }

      try {
        await navigator.clipboard.writeText(publicUrl);
        showToast('Link publik berhasil disalin!');
      } catch (clipErr) {
        window.prompt('Salin link publik berikut:', publicUrl);
      }
    } catch (e) {
      showToast('Gagal membuat public share link: ' + (e.message || e), true);
    }
  }

  function bindEvents() {
    const btnShare = document.getElementById('btnShare');
    const btnDownload = document.getElementById('btnDownload');

    if (btnShare) {
      btnShare.addEventListener('click', shareFile);
    }

    if (btnDownload) {
      btnDownload.addEventListener('click', downloadFile);
    }

    document.addEventListener('click', function (e) {
      const actionEl = e.target.closest('[data-action]');
      if (!actionEl) return;

      const action = actionEl.getAttribute('data-action');

      if (action === 'download-file') {
        downloadFile();
      }

      if (action === 'open-pdf-new-tab' && signedUrl) {
        window.open(signedUrl, '_blank', 'noopener,noreferrer');
      }
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
      showError(
        'File tidak ditemukan',
        'Parameter file tidak valid. Silakan kembali ke dashboard dan pilih file lagi.'
      );
      return;
    }

    document.title = 'MyStorage — ' + fileName;

    const fileTitle = document.getElementById('fileTitle');
    const fileMeta = document.getElementById('fileMeta');

    if (fileTitle) fileTitle.textContent = fileName;

    if (fileMeta) {
      fileMeta.textContent = fileSize
        ? fileSize + ' · ' + String(fileType || '').toUpperCase()
        : String(fileType || '').toUpperCase();
    }

    const { data, error } = await sb.storage
      .from('user-files')
      .createSignedUrl(storagePath, 3600);

    if (error) {
      showError(
        'Gagal membuka file',
        'Tidak dapat membuat link akses: ' + error.message
      );
      return;
    }

    signedUrl = data.signedUrl;

    renderViewer(signedUrl, fileType, fileName);
  });
})();