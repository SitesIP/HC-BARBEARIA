// ===== Application entry, BottomNav and SPA routing =====
import './styles/main.css';
import router from './utils/router.js';
import { renderBottomNav } from './components/BottomNav.js';

// Pages
import { renderHome, initHome } from './pages/Home.js';
import { renderServices, initServicesPage } from './pages/Services.js';
import { renderBarbers, initBarbersPage } from './pages/Barbers.js';
import { renderContact, initContactPage } from './pages/Contact.js';
import { renderBooking, initBooking, resetBooking, preselectService, preselectBarber } from './pages/Booking.js';

const app = document.querySelector('#app');

function renderPage(renderFn, initFn, routePath = '/') {
  if (!app) return;

  app.classList.remove('page-enter-active');
  app.classList.add('page-enter');

  // Render Page Content + Mobile Bottom Navigation
  const pageHtml = renderFn();
  const bottomNavHtml = renderBottomNav(routePath);

  app.innerHTML = `
    <div class="app-layout" id="app-layout">
      ${pageHtml}
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
  .on('/agendar', (context) => {
    resetBooking();

    // Check if query params were passed
    if (context?.query) {
      const svcParam = context.query.get('service');
      const barberParam = context.query.get('barber');

      if (svcParam) {
        preselectService(parseInt(svcParam, 10));
      }
      if (barberParam) {
        preselectBarber(parseInt(barberParam, 10));
      }
    }

    renderPage(renderBooking, initBooking, '/agendar');
  });

// Start routing on load
window.addEventListener('DOMContentLoaded', () => {
  router.resolve();
});
