// ===== Application entry and routing =====
import './styles/main.css';
import router from './utils/router.js';
import { renderBottomNav } from './components/BottomNav.js';

// Pages
import { renderHome, initHome } from './pages/Home.js';
import { renderServices, initServicesPage } from './pages/Services.js';
import { renderBarbers, initBarbersPage } from './pages/Barbers.js';
import { renderContact, initContactPage } from './pages/Contact.js';
import { renderBooking, initBooking, resetBooking } from './pages/Booking.js';

const app = document.querySelector('#app');

function renderPage(renderFn, initFn, routePath = '/') {
  if (!app) return;
  app.classList.remove('page-enter-active');
  app.classList.add('page-enter');
  
  const contentHtml = renderFn();
  const bottomNavHtml = renderBottomNav(routePath);

  app.innerHTML = `
    <div class="app-layout">
      ${contentHtml}
      ${bottomNavHtml}
    </div>
  `;
  
  // Trigger DOM reflow to enable animation
  void app.offsetWidth;
  app.classList.add('page-enter-active');

  if (typeof initFn === 'function') {
    requestAnimationFrame(() => {
      initFn();
    });
  }
}

// Router Configuration
router
  // Public Routes (Abas distintas)
  .on('/', () => {
    renderPage(renderHome, initHome, '/');
  })
  .on('/servicos', () => {
    renderPage(renderServices, initServicesPage, '/servicos');
  })
  .on('/profissionais', () => {
    renderPage(renderBarbers, initBarbersPage, '/profissionais');
  })
  .on('/contato', () => {
    renderPage(renderContact, initContactPage, '/contato');
  })
  .on('/agendar', () => {
    resetBooking();
    renderPage(renderBooking, initBooking, '/agendar');
  });

// Start routing on load
window.addEventListener('DOMContentLoaded', () => {
  router.resolve();
});
