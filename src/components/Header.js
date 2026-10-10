// ===== Generic site header =====
import store from '../data/store.js';

export function renderHeader(overlay = false) {
  const config = store.getConfig();
  const navigation = overlay
    ? [
        { label: 'Início', section: 'hero' },
        { label: 'Serviços', section: 'services-section' },
        { label: 'Profissionais', section: 'barbers-section' },
        { label: 'Contato', section: 'footer' },
      ]
    : [
        { label: 'Início', route: '/' },
        { label: 'Serviços', route: '/servicos' },
        { label: 'Profissionais', route: '/profissionais' },
        { label: 'Contato', route: '/contato' },
      ];

  return `
    <header class="header ${overlay ? 'header-overlay' : ''}" id="header">
      <div class="container">
        <a href="${overlay ? '#hero' : '#/'}" class="header-logo" id="header-logo" ${overlay ? 'data-section="hero"' : ''}>
          <span>${config.shopName || 'Barbearia'}</span>
        </a>

        <nav class="nav-menu" id="nav-menu">
          ${navigation.map(item => `
            <a href="${overlay ? `#${item.section}` : `#${item.route}`}"
               class="nav-link"
               ${overlay ? `data-section="${item.section}"` : `data-route="${item.route}"`}
               ${overlay ? 'aria-current="false"' : ''}>${item.label}</a>
          `).join('')}
          <a href="#/agendar" class="btn btn-primary btn-sm nav-cta" id="nav-cta">Agendar</a>
        </nav>

        <button class="mobile-toggle" id="mobile-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  `;
}

export function initHeader() {
  const toggle = document.getElementById('mobile-toggle');
  const menu = document.getElementById('nav-menu');
  const header = document.getElementById('header');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link, .nav-cta, .btn').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }

  const sectionLinks = document.querySelectorAll('.nav-link[data-section], .header-logo[data-section]');
  const sections = [...sectionLinks]
    .map(link => document.getElementById(link.dataset.section))
    .filter(Boolean);

  if (sectionLinks.length && sections.length) {
    const setActiveSection = (sectionId) => {
      sectionLinks.forEach(link => {
        const isActive = link.dataset.section === sectionId;
        link.classList.toggle('active', isActive);
        if (link.classList.contains('nav-link')) {
          link.setAttribute('aria-current', isActive ? 'location' : 'false');
        }
      });
    };

    sectionLinks.forEach(link => {
      link.addEventListener('click', event => {
        const section = document.getElementById(link.dataset.section);
        if (!section) return;
        event.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    setActiveSection('hero');

    const sectionObserver = new IntersectionObserver(entries => {
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visibleSections[0]) setActiveSection(visibleSections[0].target.id);
    }, {
      rootMargin: '-25% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach(section => sectionObserver.observe(section));
  }

  // Scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Active nav link
  const hash = window.location.hash.slice(1) || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === hash || (hash.startsWith(route) && route !== '/')) {
      link.classList.add('active');
    }
  });

}
