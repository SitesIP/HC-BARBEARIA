// ===== Generic barbershop home page (Aba Início) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg } from '../utils/helpers.js';

export function renderHome() {
  const services = store.getServices().slice(0, 3); // Apenas destaques para não rolar infinito
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <!-- Hero -->
    <section class="hero hero-cinematic" id="hero">
      <div class="hero-bg"></div>
      <div class="container hero-container">
        <div class="hero-content">
          <h1>Estilo clássico,<br><span>corte moderno</span></h1>
          <p class="hero-subtitle">Uma experiência feita para valorizar o seu estilo. Conheça nossos serviços e agende seu horário.</p>
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
            <span class="hub-icon">✂️</span>
            <div class="hub-info">
              <strong>Serviços</strong>
              <span>Tabela completa</span>
            </div>
            <span class="hub-arrow">→</span>
          </a>
          <a href="#/profissionais" class="hub-tile">
            <span class="hub-icon">💈</span>
            <div class="hub-info">
              <strong>Profissionais</strong>
              <span>Conheça a equipe</span>
            </div>
            <span class="hub-arrow">→</span>
          </a>
          <a href="#/agendar" class="hub-tile highlight">
            <span class="hub-icon">📅</span>
            <div class="hub-info">
              <strong>Agendamentos</strong>
              <span>Horário online</span>
            </div>
            <span class="hub-arrow">→</span>
          </a>
          <a href="#/contato" class="hub-tile">
            <span class="hub-icon">📍</span>
            <div class="hub-info">
              <strong>Contato & Info</strong>
              <span>Horários de atendimento</span>
            </div>
            <span class="hub-arrow">→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Services Preview (Apenas 3 destaques compactos) -->
    <section class="section" style="padding-top: var(--space-xl); padding-bottom: var(--space-xl);" id="services-preview-section">
      <div class="container">
        <div class="section-header reveal">
          <h2>Nossos Serviços</h2>
          <p>Conheça alguns dos nossos principais serviços.</p>
        </div>
        <div class="services-grid services-compact-grid">
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
        <div style="text-align: center; margin-top: var(--space-lg);" class="reveal">
          <a href="#/servicos" class="btn btn-secondary">Ver Todos os Serviços →</a>
        </div>
      </div>
    </section>

    <!-- Barbers Preview (Carrossel Horizontal no Mobile) -->
    <section class="section" style="background: var(--graphite); padding-top: var(--space-xl); padding-bottom: var(--space-xl);" id="barbers-section">
      <div class="container">
        <div class="section-header reveal">
          <h2>Nossos Profissionais</h2>
          <p>Time de barbeiros experientes. Deslize para o lado para conhecer.</p>
        </div>
        <div class="barbers-grid">
          ${barbers.map((barber, i) => `
            <div class="barber-card reveal" style="transition-delay: ${i * 0.15}s">
              <div class="barber-image">
                <div class="barber-placeholder" aria-hidden="true">✂</div>
              </div>
              <div class="barber-info">
                <h4>${barber.name}</h4>
                <p class="barber-specialty">${barber.specialty}</p>
                <a href="#/agendar" class="btn btn-primary btn-sm" style="margin-top: 12px;">Agendar com este profissional</a>
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
