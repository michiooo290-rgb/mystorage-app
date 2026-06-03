/* MyStorage theme boot
   Apply dark mode before page render without inline script, so CSP can remove script 'unsafe-inline'. */
(function () {
  try {
    if (localStorage.getItem('myStorage_nightMode') === 'true') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch (e) {
    // localStorage may be unavailable in strict/private contexts; ignore safely.
  }
})();
