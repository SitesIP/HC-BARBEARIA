// ===== Generic services page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg } from '../utils/helpers.js';

export function renderServices() {
  const services = store.getServices();

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-3xl));">
      <div class="container">
        <div class="section-header">
          <h2>Nossos Serviços</h2>
          <p>Conheça todos os nossos serviços e escolha o que melhor combina com o seu estilo.</p>
        </div>
        <div class="services-grid">
          ${services.map((svc, i) => `
            <div class="service-card reveal" style="transition-delay: ${i * 0.08}s">
              <div class="service-icon">${getServiceSvg(svc.name, svc.icon)}</div>
              <div class="service-info">
                <h4>${svc.name}</h4>
                <p>${svc.description}</p>
                <div class="service-meta">
                  <span class="service-price">${formatCurrency(svc.price)}</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div style="text-align: center; margin-top: var(--space-2xl);" class="reveal">
          <a href="#/agendar" class="btn btn-primary btn-lg">Agendar Agora</a>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <h2>Não encontrou o que procura?</h2>
        <p>Entre em contato conosco e vamos encontrar a melhor solução para você.</p>
        <a href="#/contato" class="btn btn-secondary btn-lg">Fale Conosco</a>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initServicesPage() {
  initHeader();
  initScrollReveal();
}
