// ===== H&C Barbearia — Header Component =====
import store from '../data/store.js';

export function renderHeader() {
  const config = store.getConfig();

  return `
    <header class="header" id="header">
      <div class="container">
        <a href="#/" class="header-logo" id="header-logo">
          <img src="/images/logo.png" alt="${config.shopName}" />
          <span>${config.shopName}</span>
        </a>

        <nav class="nav-menu" id="nav-menu">
          <a href="#/" class="nav-link" data-route="/">Início</a>
          <a href="#/servicos" class="nav-link" data-route="/servicos">Serviços</a>
          <a href="#/profissionais" class="nav-link" data-route="/profissionais">Profissionais</a>
          <a href="#/contato" class="nav-link" data-route="/contato">Contato</a>
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

  // Scroll effect
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
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
