(() => {
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...document.querySelectorAll('.site-nav a')];
  const toTop = document.querySelector('.back-to-top');
  const topLinks = [...document.querySelectorAll('a[href="#top"]')];

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });

  navLinks.forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  topLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      closeMenu();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });

  const updateScrollUI = () => {
    const scrolled = window.scrollY > 12;
    header?.classList.toggle('is-scrolled', scrolled);
    toTop?.classList.toggle('is-visible', window.scrollY > 620);
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const filterButtons = [...document.querySelectorAll('.filter-button')];
  const publications = [...document.querySelectorAll('.publication-item')];
  const publicationCount = document.getElementById('publication-count');

  const applyPublicationFilter = (filter) => {
    let visible = 0;
    publications.forEach((publication) => {
      const categories = (publication.dataset.category || '').split(/\s+/).filter(Boolean);
      const show = filter === 'selected'
        ? publication.dataset.selected === 'true'
        : categories.includes(filter);
      publication.hidden = !show;
      if (show) visible += 1;
    });
    if (publicationCount) publicationCount.textContent = String(visible);
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyPublicationFilter(button.dataset.filter));
  });
  applyPublicationFilter('selected');

  const newsToggle = document.getElementById('news-toggle');
  const extraNews = [...document.querySelectorAll('.news-extra')];
  newsToggle?.addEventListener('click', () => {
    const expanded = newsToggle.getAttribute('aria-expanded') === 'true';
    extraNews.forEach((item) => { item.hidden = expanded; });
    newsToggle.setAttribute('aria-expanded', String(!expanded));
    newsToggle.innerHTML = expanded
      ? 'More <span aria-hidden="true">↓</span>'
      : 'Show Less <span aria-hidden="true">↑</span>';
  });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
