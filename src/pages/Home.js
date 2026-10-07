// ===== H&C Barbearia — Home Page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, initScrollReveal, getServiceSvg, ICONS } from '../utils/helpers.js';

export function renderHome() {
  const services = store.getServices();
  const barbers = store.getBarbers();
  const config = store.getConfig();

  return `
    ${renderHeader()}

    <!-- Hero -->
    <section class="hero" id="hero">
      <div class="hero-bg">
        <div class="hero-radial-glow"></div>
      </div>
      <div class="container hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-star">✦</span> Desde 2020 — Tradição & Estilo
          </div>
          <h1>Seu estilo<br><span class="copper-accent">começa aqui.</span></h1>
          <p class="hero-subtitle">Mais do que um corte, uma experiência. Cuidado, precisão e personalidade em cada atendimento.</p>
          <div class="hero-actions">
            <a href="#/agendar" class="btn btn-primary btn-lg" id="hero-cta">
              Agendar Horário
            </a>
            <a href="#/servicos" class="btn btn-secondary btn-lg" id="hero-services">
              Conhecer Serviços
            </a>
          </div>
          
          <!-- Schedule Mode Badges in Hero -->
          <div class="hero-schedule-wrapper">
            <div class="schedule-badge-item">
              <span class="schedule-day-label">Segunda a Quinta:</span>
              <span class="badge-schedule badge-standard">AGENDAMENTO OU ORDEM DE CHEGADA</span>
            </div>
            <div class="schedule-badge-item">
              <span class="schedule-day-label">Sexta e Sábado:</span>
              <span class="badge-schedule badge-highlight">SOMENTE ORDEM DE CHEGADA</span>
            </div>
          </div>
        </div>

        <!-- Featured Emblem Showcase (Logo H&C + Instrumentos em Destaque) -->
        <div class="hero-visual">
          <div class="hero-emblem-card">
            <img src="/images/hero-emblem.jpg" alt="H&C Barbearia — Desde 2020" class="hero-emblem-img" />
            <div class="hero-emblem-glow"></div>
          </div>
        </div>
      </div>
      <div class="hero-scroll" aria-hidden="true">
        <span></span>
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
                <img src="${barber.image}" alt="${barber.name}" loading="lazy" />
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
        <p>Agende agora e garanta seu horário com os melhores barbeiros da cidade.</p>
        <a href="#/agendar" class="btn btn-primary btn-lg">Agendar Meu Horário</a>
      </div>
    </section>

    ${renderFooter()}

    <!-- WhatsApp Float -->
    <a href="https://wa.me/${config.whatsapp}" target="_blank" rel="noopener" class="whatsapp-float" id="whatsapp-float" aria-label="WhatsApp">
      ${ICONS.whatsapp}
    </a>
  `;
}

export function initHome() {
  initHeader();
  initScrollReveal();
}
