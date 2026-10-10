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

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-xl)); padding-bottom: var(--space-xl);">
      <div class="container">
        <div class="section-header">
          <h2>Nossos Serviços</h2>
          <p>Conheça nossa lista completa de serviços e cuidados masculinos.</p>
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

        <!-- Compact Services List -->
        <div class="services-grid services-compact-grid" id="services-list-container">
          ${renderServicesList(filtered)}
        </div>

        <div style="text-align: center; margin-top: var(--space-xl);">
          <a href="#/agendar" class="btn btn-primary btn-lg">Agendar Horário Online</a>
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
    <div class="service-card service-card-compact" style="transition-delay: ${i * 0.05}s">
      <div class="service-icon">${getServiceSvg(svc.name, svc.icon)}</div>
      <div class="service-info">
        <h4>${svc.name}</h4>
        <p>${svc.description}</p>
        <div class="service-meta">
          <span class="service-price">${formatCurrency(svc.price)}</span>
        </div>
      </div>
      <div class="service-action-compact">
        <a href="#/agendar" class="btn btn-secondary btn-xs">Agendar</a>
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
