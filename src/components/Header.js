// ===== H&C Barbearia Header Component =====
import store from '../data/store.js';

export function renderHeader() {
  const config = store.getConfig();
  const hash = window.location.hash.slice(1) || '/';
  const cleanPath = hash.split('?')[0] || '/';

  const navLinks = [
    { route: '/', label: 'Início' },
    { route: '/servicos', label: 'Serviços' },
    { route: '/profissionais', label: 'Profissionais' },
    { route: '/contato', label: 'Contato & Horários' },
  ];

  // Determine current day status
  const now = new Date();
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const todayKey = days[now.getDay()];
  const dayConfig = config.openingHours?.[todayKey];
  const isOpenToday = dayConfig && dayConfig.active;

  return `
    <header class="header" id="header">
      <div class="container header-container">
        <a href="#/" class="header-brand" id="header-logo" aria-label="H&C Barbearia - Página Inicial">
          <div class="brand-badge">H&C</div>
          <div class="brand-text">
            <span class="brand-title">${config.shopName || 'H&C Barbearia'}</span>
            <span class="brand-tagline">
              <span class="status-dot ${isOpenToday ? 'open' : 'closed'}"></span>
              ${isOpenToday ? `Aberto hoje até ${dayConfig.close}` : 'Fechado hoje'}
            </span>
          </div>
        </a>

        <nav class="nav-menu" id="nav-menu" aria-label="Menu principal">
          ${navLinks.map(item => `
            <a href="#${item.route}"
               class="nav-link ${cleanPath === item.route ? 'active' : ''}"
               data-route="${item.route}">
               ${item.label}
            </a>
          `).join('')}
          <a href="#/agendar" class="btn btn-primary btn-sm header-cta" id="header-cta">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line></svg>
            Agendar Horário
          </a>
        </nav>

        <div class="header-actions-mobile">
          <a href="#/agendar" class="btn btn-primary btn-xs mobile-quick-book" aria-label="Agendar rápido">
            Agendar
          </a>
          <button class="mobile-toggle" id="mobile-toggle" aria-label="Abrir menu de navegação" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
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
      const isOpen = menu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);
    });

    // Close menu on link click
    menu.querySelectorAll('.nav-link, .header-cta, .btn').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // Scroll glassmorphism effect
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }
}
