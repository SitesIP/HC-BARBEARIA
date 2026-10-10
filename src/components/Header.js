// ===== Generic site header with Tab Navigation =====
import store from '../data/store.js';

export function renderHeader() {
  const config = store.getConfig();
  const hash = window.location.hash.slice(1) || '/';
  const cleanRoute = hash.split('?')[0] || '/';

  const navigation = [
    { label: 'Início', route: '/' },
    { label: 'Serviços', route: '/servicos' },
    { label: 'Profissionais', route: '/profissionais' },
    { label: 'Agendamentos', route: '/agendar' },
    { label: 'Contato', route: '/contato' },
  ];

  return `
    <header class="header" id="header">
      <div class="container header-container">
        <a href="#/" class="header-logo" id="header-logo">
          <span>${config.shopName || 'Barbearia'}</span>
        </a>

        <nav class="nav-menu" id="nav-menu">
          ${navigation.map(item => {
            const isActive = cleanRoute === item.route;
            return `
              <a href="#${item.route}"
                 class="nav-link ${isActive ? 'active' : ''}"
                 data-route="${item.route}">${item.label}</a>
            `;
          }).join('')}
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

    menu.querySelectorAll('.nav-link, .nav-cta, .btn').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
      });
    });
  }

  if (header) {
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Active nav link
  const hash = window.location.hash.slice(1) || '/';
  const cleanRoute = hash.split('?')[0] || '/';
  document.querySelectorAll('.nav-link').forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === cleanRoute) {
      link.classList.add('active');
    }
  });
}
