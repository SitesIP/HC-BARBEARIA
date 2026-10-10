// ===== Generic services page (Aba Serviços) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg } from '../utils/helpers.js';

let activeCategory = 'todos';

export function renderServices() {
  const services = store.getServices();

  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'cabelo', label: 'Cabelo' },
    { id: 'barba', label: 'Barba' },
    { id: 'combos', label: 'Combos' },
    { id: 'outros', label: 'Outros' },
  ];

  const filtered = activeCategory === 'todos'
    ? services
    : services.filter(s => (s.category || 'cabelo') === activeCategory);

  return `
    ${renderHeader()}

    <section class="section services-page-section">
      <div class="container">
        <div class="section-header section-header-compact">
          <h2>Nossos Serviços</h2>
          <p>Escolha um serviço para agendar seu horário.</p>
        </div>

        <!-- Category Tabs Filter (Pills) -->
        <div class="services-filter-pills" id="services-pills">
          ${categories.map(cat => `
            <button class="filter-pill ${activeCategory === cat.id ? 'active' : ''}"
                    data-category="${cat.id}">
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <!-- High-density single-line Services List -->
        <div class="services-compact-list" id="services-list-container">
          ${renderServicesList(filtered)}
        </div>

        <div class="services-page-cta">
          <a href="#/agendar" class="btn btn-primary btn-md">Agendar Horário Online</a>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;
}

function renderServicesList(servicesList) {
  if (!servicesList || servicesList.length === 0) {
    return `<div class="empty-state"><p>Nenhum serviço encontrado nesta categoria.</p></div>`;
  }

  return servicesList.map((svc, i) => `
    <div class="service-row-card" style="transition-delay: ${i * 0.03}s">
      <div class="service-row-icon">
        ${getServiceSvg(svc.name, svc.icon)}
      </div>
      <div class="service-row-info">
        <h4 class="service-row-title">${svc.name}</h4>
        <p class="service-row-desc">${svc.description}</p>
      </div>
      <div class="service-row-price">
        <span>${formatCurrency(svc.price)}</span>
      </div>
      <div class="service-row-action">
        <a href="#/agendar" class="btn btn-primary btn-xs btn-service-select">Selecionar</a>
      </div>
    </div>
  `).join('');
}

export function initServicesPage() {
  initHeader();
  initScrollReveal();

  const pills = document.querySelectorAll('.filter-pill');
  const container = document.getElementById('services-list-container');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      activeCategory = pill.dataset.category;
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const all = store.getServices();
      const filtered = activeCategory === 'todos'
        ? all
        : all.filter(s => (s.category || 'cabelo') === activeCategory);

      if (container) {
        container.innerHTML = renderServicesList(filtered);
      }
    });
  });
}
