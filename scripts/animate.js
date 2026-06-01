/**
 * animate.js — MyStorage Scroll Fade-In
 * Tambahkan class .fade-in ke elemen yang ingin dianimasikan.
 * Gunakan data-delay="1" s/d "6" untuk stagger effect.
 */

(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animasi sekali saja
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -24px 0px',
    }
  );

  function initObserver() {
    document.querySelectorAll('.fade-in:not(.no-scroll)').forEach((el) => {
      observer.observe(el);
    });
  }

  // Jalankan saat DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initObserver);
  } else {
    initObserver();
  }

  // Re-observe elemen baru yang muncul dinamis (file cards, folders, dll)
  const mutationObserver = new MutationObserver(() => {
    document.querySelectorAll('.fade-in:not(.visible):not(.no-scroll)').forEach((el) => {
      observer.observe(el);
    });
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    mutationObserver.observe(document.body, { childList: true, subtree: true });
  }
})();