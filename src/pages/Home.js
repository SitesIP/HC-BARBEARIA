// ===== H&C Barbearia - Mobile First Home Page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { formatCurrency, getServiceSvg } from '../utils/helpers.js';

export function renderHome() {
  const services = store.getServices().slice(0, 4); // Featured services
  const barbers = store.getBarbers();
  const config = store.getConfig();

  return `
    ${renderHeader()}

    <main class="main-content" id="main-content">
      <!-- App Hero Banner -->
      <section class="app-hero">
        <div class="container">
          <div class="hero-card">
            <div class="hero-badge">
              <span class="badge-star">★</span> Barbearia Premium
            </div>
            <h1 class="hero-title">Estilo Clássico,<br><span class="gradient-text">Corte Moderno</span></h1>
            <p class="hero-subtitle">Ambiente climatizado, atendimento pontual e profissionais especializados em cortes e barba.</p>
            
            <div class="hero-cta-group">
              <a href="#/agendar" class="btn btn-primary btn-lg hero-main-btn" id="hero-cta">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                <span>Agendar Horário</span>
              </a>
              <a href="#/servicos" class="btn btn-secondary btn-lg" id="hero-services-btn">
                <span>Ver Serviços</span>
              </a>
            </div>

            <div class="hero-highlights">
              <div class="highlight-item">
                <span class="highlight-icon">⏱️</span>
                <span>Sem filas</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">💈</span>
                <span>Profissionais</span>
              </div>
              <div class="highlight-item">
                <span class="highlight-icon">⭐</span>
                <span>5.0 no Google</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Action Tiles (App Hub) -->
      <section class="quick-actions-section">
        <div class="container">
          <div class="section-title-compact">
            <h3>Acesso Rápido</h3>
          </div>
          <div class="quick-actions-grid">
            <a href="#/servicos" class="quick-action-card">
              <div class="quick-icon-box">✂️</div>
              <div class="quick-action-text">
                <strong>Serviços</strong>
                <span>Tabela e preços</span>
              </div>
              <span class="quick-arrow">→</span>
            </a>

            <a href="#/profissionais" class="quick-action-card">
              <div class="quick-icon-box">💈</div>
              <div class="quick-action-text">
                <strong>Barbeiros</strong>
                <span>Conheça a equipe</span>
              </div>
              <span class="quick-arrow">→</span>
            </a>

            <a href="#/agendar" class="quick-action-card highlight">
              <div class="quick-icon-box">📅</div>
              <div class="quick-action-text">
                <strong>Agendar</strong>
                <span>Escolha seu horário</span>
              </div>
              <span class="quick-arrow">→</span>
            </a>

            <a href="#/contato" class="quick-action-card">
              <div class="quick-icon-box">📍</div>
              <div class="quick-action-text">
                <strong>Local & Contato</strong>
                <span>Horários e Maps</span>
              </div>
              <span class="quick-arrow">→</span>
            </a>
          </div>
        </div>
      </section>

      <!-- Services Preview Section (Compact Cards) -->
      <section class="home-services-section">
        <div class="container">
          <div class="section-header-row">
            <div>
              <h2 class="section-heading">Serviços Populares</h2>
              <p class="section-sub">Os mais pedidos pelos nossos clientes</p>
            </div>
            <a href="#/servicos" class="see-all-link">Ver todos →</a>
          </div>

          <div class="compact-services-list">
            ${services.map(svc => `
              <div class="compact-service-card">
                <div class="compact-service-left">
                  <div class="compact-service-icon">
                    ${getServiceSvg(svc.name, svc.icon)}
                  </div>
                  <div class="compact-service-info">
                    <h4 class="compact-service-name">${svc.name}</h4>
                    <p class="compact-service-desc">${svc.description}</p>
                    <span class="compact-service-time">⏱️ ~${svc.duration} min</span>
                  </div>
                </div>
                <div class="compact-service-right">
                  <div class="compact-service-price">${formatCurrency(svc.price)}</div>
                  <a href="#/agendar?service=${svc.id}" class="btn btn-primary btn-sm book-direct-btn" aria-label="Agendar ${svc.name}">
                    Agendar
                  </a>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="view-all-cta-wrap">
            <a href="#/servicos" class="btn btn-secondary btn-block">
              Ver Todos os Serviços e Combos
            </a>
          </div>
        </div>
      </section>

      <!-- Barbers Preview Section (Horizontal Swipeable Carousel) -->
      <section class="home-barbers-section">
        <div class="container">
          <div class="section-header-row">
            <div>
              <h2 class="section-heading">Nossos Barbeiros</h2>
              <p class="section-sub">Arraste para o lado para conhecer</p>
            </div>
            <a href="#/profissionais" class="see-all-link">Ver todos →</a>
          </div>

          <div class="barbers-slider-container" id="barbers-slider">
            <div class="barbers-slider-track">
              ${barbers.map((barber, index) => `
                <div class="barber-slider-card">
                  <div class="barber-card-top">
                    <div class="barber-avatar">
                      <span class="barber-avatar-icon">💈</span>
                      <span class="barber-avatar-badge">${index + 1}</span>
                    </div>
                    <div class="barber-meta">
                      <h4 class="barber-name">${barber.name}</h4>
                      <p class="barber-role">${barber.specialty}</p>
                    </div>
                  </div>
                  <div class="barber-card-body">
                    <div class="barber-tag-row">
                      <span class="barber-pill">Atendimento Dedicado</span>
                      <span class="barber-pill">Pontualidade</span>
                    </div>
                    <a href="#/agendar?barber=${barber.id}" class="btn btn-primary btn-block barber-action-btn">
                      Agendar com ${barber.name}
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Contact & Location Banner -->
      <section class="home-contact-banner">
        <div class="container">
          <div class="info-card-highlight">
            <div class="info-card-content">
              <h3>Dúvidas ou Informações?</h3>
              <p>Fale diretamente conosco pelo WhatsApp ou veja nossa localização.</p>
            </div>
            <div class="info-card-actions">
              <a href="https://wa.me/${String(config.whatsapp || '5511999999999').replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a barbearia.')}"
                 target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>Falar no WhatsApp</span>
              </a>
              <a href="#/contato" class="btn btn-secondary">
                <span>Ver Horários & Local</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;
}

export function initHome() {
  initHeader();
}
