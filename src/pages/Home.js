// ===== Generic barbershop home page (Aba Início) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg } from '../utils/helpers.js';

const HUB_ICONS = {
  servicos: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="8.5" y1="8.5" x2="20" y2="20"/><line x1="8.5" y1="15.5" x2="20" y2="4"/></svg>`,
  profissionais: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  agendamentos: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M12 14v4M10 16h4"/></svg>`,
  contato: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
};

const BARBER_AVATAR_ICON = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

export function renderHome() {
  const services = store.getServices().slice(0, 4); // 4 principais serviços em linha única
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <!-- Hero -->
    <section class="hero hero-cinematic" id="hero">
      <div class="hero-bg"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <h1>Estilo clássico,<br><span>corte moderno</span></h1>
          <p class="hero-subtitle">Uma experiência feita para valorizar o seu estilo. Conheça nossos serviços e agende seu horário online.</p>
          <div class="hero-actions">
            <a href="#/agendar" class="btn btn-primary btn-lg" id="hero-cta">
              Agendar Horário
            </a>
            <a href="#/servicos" class="btn btn-secondary btn-lg">
              Ver Serviços
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Tabs Hub (Acesso Rápido às Abas) -->
    <section class="section-hub">
      <div class="container">
        <div class="hub-grid">
          <a href="#/servicos" class="hub-tile">
            <span class="hub-icon hub-icon-svg">${HUB_ICONS.servicos}</span>
            <div class="hub-info">
              <strong>Serviços</strong>
              <span>Tabela completa</span>
            </div>
            <span class="hub-arrow">${HUB_ICONS.arrowRight}</span>
          </a>
          <a href="#/profissionais" class="hub-tile">
            <span class="hub-icon hub-icon-svg">${HUB_ICONS.profissionais}</span>
            <div class="hub-info">
              <strong>Profissionais</strong>
              <span>Conheça a equipe</span>
            </div>
            <span class="hub-arrow">${HUB_ICONS.arrowRight}</span>
          </a>
          <a href="#/agendar" class="hub-tile highlight">
            <span class="hub-icon hub-icon-svg">${HUB_ICONS.agendamentos}</span>
            <div class="hub-info">
              <strong>Agendamentos</strong>
              <span>Horário online</span>
            </div>
            <span class="hub-arrow">${HUB_ICONS.arrowRight}</span>
          </a>
          <a href="#/contato" class="hub-tile">
            <span class="hub-icon hub-icon-svg">${HUB_ICONS.contato}</span>
            <div class="hub-info">
              <strong>Contato & Info</strong>
              <span>Horários e canais</span>
            </div>
            <span class="hub-arrow">${HUB_ICONS.arrowRight}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Services Preview (Alta densidade em linha única) -->
    <section class="section services-preview-section" id="services-preview-section">
      <div class="container">
        <div class="section-header section-header-compact reveal">
          <h2>Nossos Serviços</h2>
          <p>Conheça alguns dos nossos principais serviços.</p>
        </div>
        <div class="services-compact-list">
          ${services.map((svc, i) => `
            <div class="service-row-card reveal" style="transition-delay: ${i * 0.05}s">
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
          `).join('')}
        </div>
        <div style="text-align: center; margin-top: var(--space-md);" class="reveal">
          <a href="#/servicos" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px;">
            Ver Todos os Serviços ${HUB_ICONS.arrowRight}
          </a>
        </div>
      </div>
    </section>

    <!-- Barbers Preview (Side-by-side 50%/50% no Mobile) -->
    <section class="section barbers-preview-section" id="barbers-section">
      <div class="container">
        <div class="section-header section-header-compact reveal">
          <h2>Nossos Profissionais</h2>
          <p>Equipe qualificada para cuidar do seu estilo.</p>
        </div>
        <div class="barbers-grid-side-by-side reveal">
          ${barbers.map((barber, i) => `
            <div class="barber-compact-card" style="transition-delay: ${i * 0.1}s">
              <div class="barber-avatar-wrapper">
                <div class="barber-avatar-placeholder" aria-hidden="true">
                  ${BARBER_AVATAR_ICON}
                </div>
              </div>
              <div class="barber-compact-info">
                <h4 class="barber-compact-name">${barber.name}</h4>
                <p class="barber-compact-specialty">${barber.specialty}</p>
                <a href="#/agendar" class="btn btn-primary btn-xs btn-choose-barber">Escolher</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section" id="cta-section">
      <div class="container reveal">
        <h2>Pronto para transformar seu visual?</h2>
        <p>Agende seu horário com antecedência e garanta seu atendimento.</p>
        <a href="#/agendar" class="btn btn-primary btn-lg">Agendar Meu Horário</a>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initHome() {
  initHeader();
  initScrollReveal();
}
