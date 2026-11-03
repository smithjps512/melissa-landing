// Shared behavior for the /districts and /book pages.
(function () {
  // Header background once the page scrolls.
  var header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Vercel Web Analytics custom events, matching index.html.
  function track(name, data) {
    if (typeof window.va === 'function') {
      window.va('event', Object.assign({ name: name }, data || {}));
    }
  }
  var page = location.pathname.replace(/^\//, '') || 'home';
  document.querySelectorAll('a[href*="/signup"], a[href^="mailto:"], a[href*="amazon.com"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var section = link.closest('section');
      track('cta_click', {
        page: page,
        label: (link.textContent || '').trim().slice(0, 40),
        location: section ? (section.id || section.className.split(' ')[0]) : 'nav'
      });
    });
  });
})();
