// ===== Generic barbershop home page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg } from '../utils/helpers.js';

export function renderHome() {
  const services = store.getServices();
  const barbers = store.getBarbers();

  return `
    ${renderHeader(true)}

    <!-- Hero -->
    <section class="hero hero-cinematic" id="hero">
      <div class="hero-bg">
      </div>
      <div class="container hero-container">
        <div class="hero-content">
          <h1>Estilo clássico,<br><span>corte moderno</span></h1>
          <p class="hero-subtitle">Uma experiência feita para valorizar o seu estilo. Agende seu próximo horário.</p>
          <div class="hero-actions">
            <a href="#/agendar" class="btn btn-primary btn-lg" id="hero-cta">
              Agendar Horário
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview -->
    <section class="section" id="services-section">
      <div class="container">
        <div class="section-header reveal">
          <h2>Nossos Serviços</h2>
          <p>Cada detalhe pensado para o seu estilo. Conheça nossos serviços e escolha o melhor para você.</p>
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
        <div style="text-align: center; margin-top: var(--space-xl);" class="reveal">
          <a href="#/agendar" class="btn btn-primary">Agendar Agora</a>
        </div>
      </div>
    </section>

    <!-- Barbers Preview -->
    <section class="section" style="background: var(--graphite);" id="barbers-section">
      <div class="container">
        <div class="section-header reveal">
          <h2>Nossos Profissionais</h2>
          <p>Time de barbeiros experientes e apaixonados pela arte de transformar estilos.</p>
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
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" id="cta-section">
      <div class="container reveal">
        <h2>Pronto para transformar<br>seu <span class="copper-accent">visual</span>?</h2>
        <p>Agende seu horário e aproveite um atendimento pensado para você.</p>
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
