// ===== H&C Barbearia — Main Entry & Router Setup =====
import './styles/main.css';
import router from './utils/router.js';
import store from './data/store.js';

// Pages
import { renderHome, initHome } from './pages/Home.js';
import { renderServices, initServicesPage } from './pages/Services.js';
import { renderBarbers, initBarbersPage } from './pages/Barbers.js';
import { renderContact, initContactPage } from './pages/Contact.js';
import { renderBooking, initBooking, resetBooking } from './pages/Booking.js';
import { renderAdminLogin, initAdminLogin } from './pages/AdminLogin.js';
import { renderAdmin, initAdmin } from './pages/Admin.js';

const app = document.querySelector('#app');

function renderPage(renderFn, initFn) {
  if (!app) return;
  app.classList.remove('page-enter-active');
  app.classList.add('page-enter');
  
  app.innerHTML = renderFn();
  
  // Trigger DOM reflow to enable animation
  void app.offsetWidth;
  app.classList.add('page-enter-active');

  if (typeof initFn === 'function') {
    // Delay slightly to ensure DOM is ready
    requestAnimationFrame(() => {
      initFn();
    });
  }
}

// Router Configuration
router
  // Public Routes
  .on('/', () => {
    renderPage(renderHome, initHome);
  })
  .on('/servicos', () => {
    renderPage(renderServices, initServicesPage);
  })
  .on('/profissionais', () => {
    renderPage(renderBarbers, initBarbersPage);
  })
  .on('/contato', () => {
    renderPage(renderContact, initContactPage);
  })
  .on('/agendar', () => {
    resetBooking();
    renderPage(renderBooking, initBooking);
  })

  // Admin Routes
  .on('/admin/login', () => {
    if (store.isAuthenticated()) {
      window.location.hash = '#/admin';
      return;
    }
    renderPage(renderAdminLogin, initAdminLogin);
  })
  .on('/admin', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('dashboard'), initAdmin);
  })
  .on('/admin/agendamentos', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('agendamentos'), initAdmin);
  })
  .on('/admin/servicos', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('servicos'), initAdmin);
  })
  .on('/admin/profissionais', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('profissionais'), initAdmin);
  })
  .on('/admin/bloqueios', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('bloqueios'), initAdmin);
  })
  .on('/admin/configuracoes', () => {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return;
    }
    renderPage(() => renderAdmin('configuracoes'), initAdmin);
  });

// Global Router guard for admin routes
router.beforeEach = (to) => {
  if (to.startsWith('/admin') && to !== '/admin/login') {
    if (!store.isAuthenticated()) {
      window.location.hash = '#/admin/login';
      return false;
    }
  }
  return true;
};

// Start routing on load
window.addEventListener('DOMContentLoaded', () => {
  router.resolve();
});
