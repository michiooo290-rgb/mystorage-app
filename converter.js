/* ═══════════════════════════════════════════════════
   MyStorage — Converter Page Script
   ═══════════════════════════════════════════════════ */

'use strict';

// ── Init ────────────────────────────────────────────
// nightmode.js manages the .nm-toggle button automatically.
// The button in HTML has class="btn-icon nm-toggle" so nightmode.js
// wires it up and keeps icon/state in sync on every page.
document.addEventListener('DOMContentLoaded', () => {
  loadMammoth();
});

// ── State ───────────────────────────────────────────
let currentMode = 'pdf-to-word'; // 'pdf-to-word' | 'word-to-pdf'
let fileQueue   = [];
let toastTimer  = null;

// ── Mode Switching ──────────────────────────────────
function setMode(mode) {
  currentMode = mode;

  const tabPdf       = document.getElementById('tabPdfToWord');
  const tabWord      = document.getElementById('tabWordToPdf');
  const flowFrom     = document.getElementById('flowFrom');
  const flowTo       = document.getElementById('flowTo');
  const dropIcon     = document.getElementById('dropIcon');
  const dropIconI    = document.getElementById('dropIconI');
  const dropTitle    = document.querySelector('.drop-title');
  const dropSubtitle = document.getElementById('dropSubtitle');
  const fileInput    = document.getElementById('fileInput');
  const btnLabel     = document.getElementById('btnConvertLabel');

  if (mode === 'pdf-to-word') {
    tabPdf.classList.add('active');
    tabWord.classList.remove('active');
    flowFrom.textContent = 'PDF';
    flowFrom.className   = 'flow-from pdf-badge';
    flowTo.textContent   = 'WORD';
    flowTo.className     = 'flow-to word-badge';
    dropIcon.className   = 'drop-icon pdf-mode';
    dropIconI.className  = 'ti ti-file-type-pdf';
    dropTitle.textContent    = 'Drag & drop file PDF di sini';
    dropSubtitle.textContent = 'atau klik untuk pilih dari komputer kamu. Mendukung banyak file sekaligus.';
    fileInput.accept   = '.pdf';
    btnLabel.textContent = 'Konversi Semua ke Word';
  } else {
    tabWord.classList.add('active');
    tabPdf.classList.remove('active');
    flowFrom.textContent = 'WORD';
    flowFrom.className   = 'flow-from word-badge';
    flowTo.textContent   = 'PDF';
    flowTo.className     = 'flow-to pdf-badge';
    dropIcon.className   = 'drop-icon word-mode';
    dropIconI.className  = 'ti ti-file-type-doc';
    dropTitle.textContent    = 'Drag & drop file Word di sini';
    dropSubtitle.textContent = 'atau klik untuk pilih dari komputer kamu. Mendukung .docx';
    fileInput.accept   = '.docx,.doc';
    btnLabel.textContent = 'Konversi Semua ke PDF';
  }

  clearAll();
}

// ── Drag & Drop Handlers ────────────────────────────
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.add('drag-over');
}

function handleDragLeave() {
  document.getElementById('dropZone').classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropZone').classList.remove('drag-over');
  addFiles(Array.from(e.dataTransfer.files));
}

function handleFileSelect(input) {
  addFiles(Array.from(input.files));
  input.value = '';
}

// ── Add Files to Queue ──────────────────────────────
function addFiles(files) {
  const validExt = currentMode === 'pdf-to-word'
    ? ['.pdf']
    : ['.docx', '.doc'];

  const validFiles = files.filter(f => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    return validExt.includes(ext);
  });

  if (validFiles.length === 0) {
    showToast('Format file tidak didukung untuk mode ini', 'error');
    return;
  }

  if (files.length !== validFiles.length) {
    showToast(`${files.length - validFiles.length} file dilewati (format tidak cocok)`, 'warning');
  }

  validFiles.forEach(f => {
    // Avoid duplicates
    if (fileQueue.find(q => q.name === f.name && q.size === f.size)) return;
    fileQueue.push({
      file:   f,
      name:   f.name,
      size:   f.size,
      status: 'waiting',
      result: null,
      id:     Date.now() + Math.random()
    });
  });

  renderQueue();
}

// ── Render File Queue ───────────────────────────────
function renderQueue() {
  const container  = document.getElementById('fileQueue');
  const actionsRow = document.getElementById('actionsRow');

  if (fileQueue.length === 0) {
    container.innerHTML    = '';
    actionsRow.style.display = 'none';
    return;
  }

  actionsRow.style.display = 'flex';

  const isInputPdf = currentMode === 'pdf-to-word';
  const iconClass  = isInputPdf ? 'pdf-icon'        : 'word-icon';
  const iconName   = isInputPdf ? 'ti-file-type-pdf' : 'ti-file-type-doc';

  container.innerHTML = fileQueue.map((item, idx) => {
    let statusHtml = '';
    let rightHtml  = '';

    switch (item.status) {
      case 'waiting':
        statusHtml = `<span class="status-waiting"><i class="ti ti-clock"></i> Menunggu</span>`;
        rightHtml  = `<button class="file-remove-btn" onclick="removeFile(${idx})" title="Hapus"><i class="ti ti-x"></i></button>`;
        break;
      case 'processing':
        statusHtml = `<span class="status-processing"><div class="progress-ring"></div> Memproses...</span>`;
        break;
      case 'done':
        statusHtml = `<span class="status-done"><i class="ti ti-check"></i> Selesai</span>`;
        rightHtml  = `<button class="file-download-btn" onclick="downloadResult(${idx})"><i class="ti ti-download"></i> Download</button>`;
        break;
      case 'error':
        statusHtml = `<span class="status-error"><i class="ti ti-x"></i> Gagal</span>`;
        rightHtml  = `<button class="file-remove-btn" onclick="removeFile(${idx})" title="Hapus"><i class="ti ti-x"></i></button>`;
        break;
    }

    return `
      <div class="file-item" id="fileItem_${idx}">
        <div class="file-item-icon ${iconClass}"><i class="ti ${iconName}"></i></div>
        <div class="file-item-info">
          <div class="file-item-name">${escapeHtml(item.name)}</div>
          <div class="file-item-meta">${formatSize(item.size)}</div>
        </div>
        <div class="file-item-status">${statusHtml}</div>
        ${rightHtml}
      </div>`;
  }).join('');

  // Disable convert button if nothing is waiting
  const anyWaiting = fileQueue.some(f => f.status === 'waiting');
  document.getElementById('btnConvert').disabled = !anyWaiting;
}

function removeFile(idx) {
  fileQueue.splice(idx, 1);
  renderQueue();
}

function clearAll() {
  fileQueue = [];
  renderQueue();
}

// ── Convert All Files ───────────────────────────────
async function convertAll() {
  if (!fileQueue.some(f => f.status === 'waiting')) return;

  document.getElementById('btnConvert').disabled = true;

  for (let i = 0; i < fileQueue.length; i++) {
    if (fileQueue[i].status !== 'waiting') continue;

    fileQueue[i].status = 'processing';
    renderQueue();

    try {
      if (currentMode === 'pdf-to-word') {
        await convertPdfToWord(i);
      } else {
        await convertWordToPdf(i);
      }
      fileQueue[i].status = 'done';
    } catch (err) {
      console.error('Conversion error:', err);
      fileQueue[i].status = 'error';
    }

    renderQueue();
  }

  const doneCount = fileQueue.filter(f => f.status === 'done').length;
  showToast(`${doneCount} file berhasil dikonversi!`);
}

// ── PDF → Word (via Claude AI API) ─────────────────
async function convertPdfToWord(idx) {
  const item   = fileQueue[idx];
  const base64 = await fileToBase64(item.file);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: [
          {
            type:   'document',
            source: { type: 'base64', media_type: 'application/pdf', data: base64 }
          },
          {
            type: 'text',
            text: `Ekstrak semua teks dari PDF ini dan format ulang sebagai dokumen Word yang rapi.

Kembalikan HANYA konten dalam format ini (mulai langsung dengan ===START=== tanpa teks lain sebelumnya):
===START===
[Judul dokumen jika ada]

[Isi dokumen dengan paragraf jelas, heading terstruktur, dan whitespace yang baik. Pertahankan struktur asli sebisa mungkin.]
===END===`
          }
        ]
      }]
    })
  });

  if (!response.ok) throw new Error('API error: ' + response.status);

  const data    = await response.json();
  const rawText = data.content.map(c => c.text || '').join('');

  // Extract between markers
  const s0 = rawText.indexOf('===START===');
  const e0 = rawText.indexOf('===END===');
  const content = (s0 !== -1 && e0 !== -1)
    ? rawText.slice(s0 + 11, e0).trim()
    : rawText.trim();

  const docHtml = buildWordHtml(content, item.name);
  const blob    = new Blob([docHtml], { type: 'application/msword' });

  fileQueue[idx].result = {
    blob,
    filename: item.name.replace(/\.pdf$/i, '') + '_converted.doc'
  };
}

// ── Word → PDF (via Claude AI API) ─────────────────
async function convertWordToPdf(idx) {
  const item        = fileQueue[idx];
  const arrayBuffer = await fileToArrayBuffer(item.file);

  let extractedText = '';
  try {
    if (window.mammoth) {
      const result  = await window.mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else {
      // Fallback: decode as UTF-8 and strip non-printable chars
      const decoder = new TextDecoder('utf-8', { fatal: false });
      extractedText = decoder.decode(arrayBuffer)
        .replace(/[^\x20-\x7E\n\r\t\u00C0-\u024F\u0400-\u04FF]/g, ' ')
        .replace(/\s{3,}/g, '\n\n')
        .trim();
    }
  } catch {
    extractedText = '(Tidak dapat membaca isi file Word)';
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `Ini adalah teks yang diekstrak dari file Word. Format ulang menjadi HTML yang siap dijadikan PDF dengan layout rapi, profesional, dan bisa dicetak.

Teks dokumen:
"""
${extractedText.slice(0, 6000)}
"""

Kembalikan HANYA kode HTML lengkap (mulai dari <!DOCTYPE html>) tanpa penjelasan apapun. Gunakan styling inline yang bagus untuk PDF printing.`
      }]
    })
  });

  if (!response.ok) throw new Error('API error: ' + response.status);

  const data      = await response.json();
  const rawHtml   = data.content.map(c => c.text || '').join('').trim();
  const cleanHtml = rawHtml.replace(/^```html\n?/i, '').replace(/```$/, '').trim();
  const blob      = new Blob([cleanHtml], { type: 'text/html' });

  fileQueue[idx].result = {
    blob,
    filename:  item.name.replace(/\.(docx|doc)$/i, '') + '_converted.html',
    openAsPdf: true
  };
}

// ── Download Result ─────────────────────────────────
function downloadResult(idx) {
  const item = fileQueue[idx];
  if (!item.result) return;

  if (item.result.openAsPdf) {
    // Open in new tab → user prints to PDF with Ctrl+P
    const url = URL.createObjectURL(item.result.blob);
    const win = window.open(url, '_blank');
    if (win) {
      win.addEventListener('load', () => {
        setTimeout(() => win.print(), 500);
      });
    }
    showToast('Gunakan Ctrl+P / Cmd+P → "Save as PDF" di tab baru');
    return;
  }

  const url = URL.createObjectURL(item.result.blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = item.result.filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast('File berhasil didownload!');
}

// ── Build Word-Compatible HTML ──────────────────────
function buildWordHtml(content, filename) {
  const paragraphs  = content.split('\n').filter(l => l.trim());
  const bodyContent = paragraphs.map(p => {
    if (p.startsWith('# '))   return `<h1>${escapeHtml(p.slice(2))}</h1>`;
    if (p.startsWith('## '))  return `<h2>${escapeHtml(p.slice(3))}</h2>`;
    if (p.startsWith('### ')) return `<h3>${escapeHtml(p.slice(4))}</h3>`;
    return `<p>${escapeHtml(p)}</p>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="UTF-8">
<title>${escapeHtml(filename)}</title>
<style>
  body { font-family: 'Calibri', 'Times New Roman', serif; font-size: 12pt; line-height: 1.6; margin: 2.5cm; color: #1a1a1a; }
  h1   { font-size: 20pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt;  color: #0f0e0d; }
  h2   { font-size: 16pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt;  color: #2a2825; }
  h3   { font-size: 13pt; font-weight: bold; margin-top: 10pt; margin-bottom: 4pt;  color: #5a5754; }
  p    { margin-top: 0;   margin-bottom: 8pt; text-align: justify; }
</style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

// ── Utility Helpers ─────────────────────────────────
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function fileToArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function formatSize(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;');
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const icon  = document.getElementById('toastIcon');
  const msgEl = document.getElementById('toastMsg');

  const colors = { success: '#4ade80', warning: '#fbbf24', error: '#f87171' };
  const icons  = { success: 'ti ti-check', warning: 'ti ti-alert-triangle', error: 'ti ti-x' };

  icon.className    = icons[type]  || icons.success;
  icon.style.color  = colors[type] || colors.success;
  msgEl.textContent = msg;

  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Load mammoth.js dynamically ─────────────────────
function loadMammoth() {
  const s = document.createElement('script');
  s.src   = 'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js';
  document.head.appendChild(s);
}