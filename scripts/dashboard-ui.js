/* Dashboard UI helpers moved out of inline script for CSP. */
  function updateNmBtn() {
    var dark = NightMode.isDark();
    var icon = document.getElementById('nmTopbarIcon');
    var btn  = document.getElementById('nmTopbarBtn');
    if (!icon || !btn) return;
    icon.className = dark ? 'ti ti-sun' : 'ti ti-moon';
    btn.title      = dark ? 'Mode Terang' : 'Mode Malam';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }
  document.addEventListener('DOMContentLoaded', updateNmBtn);

  function toggleNavGroup(headerEl) {
    headerEl.classList.toggle('collapsed');
    const bodyId = headerEl.id + 'Body';
    const body = document.getElementById(bodyId);
    if (body) body.classList.toggle('collapsed');
    const key = 'navGroup_' + headerEl.id;
    localStorage.setItem(key, headerEl.classList.contains('collapsed') ? '1' : '0');
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-group-header').forEach(function(header) {
      const key = 'navGroup_' + header.id;
      if (localStorage.getItem(key) === '1') {
        header.classList.add('collapsed');
        const body = document.getElementById(header.id + 'Body');
        if (body) body.classList.add('collapsed');
      }
    });
  });

  function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('open');
    document.getElementById('sidebarOverlay').classList.toggle('open');
  }
  function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  }

  async function doLogout() {
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
      window.location.replace('pages/login.html');
    }
  }
