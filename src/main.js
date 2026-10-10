// ===== Application entry and routing =====
import './styles/main.css';
import router from './utils/router.js';

// Pages
import { renderHome, initHome } from './pages/Home.js';
import { renderServices, initServicesPage } from './pages/Services.js';
import { renderBarbers, initBarbersPage } from './pages/Barbers.js';
import { renderContact, initContactPage } from './pages/Contact.js';
import { renderBooking, initBooking, resetBooking } from './pages/Booking.js';

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
  });

// Start routing on load
window.addEventListener('DOMContentLoaded', () => {
  router.resolve();
});
