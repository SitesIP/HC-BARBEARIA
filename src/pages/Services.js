// ===== H&C Barbearia - Services Page (Categorized & Compact) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, getServiceSvg } from '../utils/helpers.js';

let activeCategory = 'todos';

export function renderServices() {
  const services = store.getServices();

  const categories = [
    { id: 'todos', label: 'Todos', icon: '✨' },
    { id: 'cabelo', label: 'Cabelo', icon: '✂️' },
    { id: 'barba', label: 'Barba', icon: '🧔' },
    { id: 'combos', label: 'Combos', icon: '👑' },
    { id: 'outros', label: 'Outros', icon: '✨' },
  ];

  const filteredServices = activeCategory === 'todos'
    ? services
    : services.filter(s => (s.category || 'cabelo') === activeCategory);

  return `
    ${renderHeader()}

    <main class="main-content" id="main-content">
      <div class="page-top-banner">
        <div class="container">
          <div class="page-header-compact">
            <h1 class="page-title">Nossos Serviços</h1>
            <p class="page-subtitle">Escolha o atendimento ideal e agende com facilidade.</p>
          </div>

          <!-- Category Filter Tabs / Pills -->
          <div class="category-tabs-scroll">
            <div class="category-tabs-nav" id="category-tabs" role="tablist">
              ${categories.map(cat => `
                <button class="category-tab-btn ${activeCategory === cat.id ? 'active' : ''}"
                        data-category="${cat.id}"
                        role="tab"
                        aria-selected="${activeCategory === cat.id}"
                        id="tab-${cat.id}">
                  <span class="cat-icon">${cat.icon}</span>
                  <span class="cat-label">${cat.label}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <section class="services-list-section">
        <div class="container">
          <div class="compact-services-list" id="services-container">
            ${renderServiceCards(filteredServices)}
          </div>

          <div class="services-cta-banner">
            <div class="cta-banner-content">
              <h3>Deseja agendar mais de um serviço?</h3>
              <p>No fluxo de agendamento você pode marcar múltiplos serviços de uma só vez.</p>
            </div>
            <a href="#/agendar" class="btn btn-primary btn-lg">
              Abrir Agendamento Completo →
            </a>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;
}

function renderServiceCards(servicesList) {
  if (!servicesList || servicesList.length === 0) {
    return `
      <div class="empty-state-card">
        <span class="empty-icon">✂️</span>
        <h4>Nenhum serviço nesta categoria</h4>
        <p>Selecione outra categoria acima para ver as opções.</p>
      </div>
    `;
  }

  return servicesList.map(svc => `
    <div class="compact-service-card hover-glow" data-category="${svc.category || 'cabelo'}">
      <div class="compact-service-left">
        <div class="compact-service-icon">
          ${getServiceSvg(svc.name, svc.icon)}
        </div>
        <div class="compact-service-info">
          <div class="service-name-row">
            <h3 class="compact-service-name">${svc.name}</h3>
            ${svc.category === 'combos' ? '<span class="combo-badge">Combo</span>' : ''}
          </div>
          <p class="compact-service-desc">${svc.description}</p>
          <span class="compact-service-time">⏱️ Duração: ~${svc.duration} min</span>
        </div>
      </div>

      <div class="compact-service-right">
        <div class="compact-service-price">${formatCurrency(svc.price)}</div>
        <a href="#/agendar?service=${svc.id}" class="btn btn-primary btn-sm book-direct-btn" aria-label="Agendar ${svc.name}">
          Agendar
        </a>
      </div>
    </div>
  `).join('');
}

export function initServicesPage() {
  initHeader();

  const tabButtons = document.querySelectorAll('.category-tab-btn');
  const container = document.getElementById('services-container');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      activeCategory = cat;

      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const allServices = store.getServices();
      const filtered = activeCategory === 'todos'
        ? allServices
        : allServices.filter(s => (s.category || 'cabelo') === activeCategory);

      if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(8px)';
        setTimeout(() => {
          container.innerHTML = renderServiceCards(filtered);
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        }, 150);
      }
    });
  });
}
