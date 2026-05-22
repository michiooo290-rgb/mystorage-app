/* ═══════════════════════════════════════════
   MyStorage — Night Mode Manager
   Manages dark/light theme across all pages.
   Preference saved to localStorage.
   ═══════════════════════════════════════════ */

(function () {
  const KEY = 'myStorage_nightMode';

  /* ── Apply theme immediately (before paint) ── */
  function applyTheme(dark) {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  /* ── Read saved preference ── */
  function isDark() {
    return localStorage.getItem(KEY) === 'true';
  }

  /* ── Save & toggle ── */
  function toggleNightMode() {
    const dark = !isDark();
    localStorage.setItem(KEY, dark);
    applyTheme(dark);
    updateAllToggles(dark);
    return dark;
  }

  /* ── Update all toggle buttons on the page ── */
  function updateAllToggles(dark) {
    document.querySelectorAll('.nm-toggle').forEach(function (btn) {
      const icon = btn.querySelector('.nm-icon');
      const label = btn.querySelector('.nm-label');
      if (icon) icon.className = dark ? 'ti ti-sun nm-icon' : 'ti ti-moon nm-icon';
      if (label) label.textContent = dark ? 'Mode Terang' : 'Mode Malam';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.title = dark ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Malam';
    });
  }

  /* ── Create a floating toggle button ── */
  function createFloatingToggle() {
    if (document.getElementById('nmFloatBtn')) return;
    const btn = document.createElement('button');
    btn.id = 'nmFloatBtn';
    btn.className = 'nm-toggle nm-float';
    btn.setAttribute('aria-label', 'Toggle night mode');
    btn.innerHTML = '<i class="ti ti-moon nm-icon"></i>';
    btn.addEventListener('click', toggleNightMode);
    document.body.appendChild(btn);
  }

  /* ── Inject floating toggle CSS ── */
  function injectFloatCSS() {
    if (document.getElementById('nm-float-style')) return;
    const style = document.createElement('style');
    style.id = 'nm-float-style';
    style.textContent = `
      .nm-float {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 1.5px solid var(--border-2, rgba(15,14,13,0.14));
        background: var(--white, #fdfcfb);
        color: var(--ink-3, #5a5754);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 16px rgba(15,14,13,0.12);
        transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
        outline: none;
      }
      .nm-float:hover {
        transform: scale(1.12) rotate(-12deg);
        border-color: var(--accent, #c8602a);
        color: var(--accent, #c8602a);
        box-shadow: 0 6px 20px rgba(200,96,42,0.2);
      }
      .nm-float:active { transform: scale(0.96); }

      [data-theme="dark"] .nm-float {
        background: #1e1c1a;
        border-color: rgba(255,255,255,0.12);
        color: rgba(255,255,255,0.7);
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      }
      [data-theme="dark"] .nm-float:hover {
        border-color: #c8602a;
        color: #e08050;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Init ── */
  function init() {
    // Apply saved theme immediately
    applyTheme(isDark());

    // After DOM ready, create floating toggle + update state
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', onReady);
    } else {
      onReady();
    }
  }

  function onReady() {
    injectFloatCSS();
    createFloatingToggle();
    updateAllToggles(isDark());

    // Wire up any static .nm-toggle buttons already in the DOM
    document.querySelectorAll('.nm-toggle').forEach(function (btn) {
      if (!btn._nmBound) {
        btn.addEventListener('click', toggleNightMode);
        btn._nmBound = true;
      }
    });
  }

  /* ── Expose globally ── */
  window.NightMode = {
    toggle: toggleNightMode,
    isDark: isDark,
    apply: applyTheme,
    updateToggles: updateAllToggles
  };

  init();
})();