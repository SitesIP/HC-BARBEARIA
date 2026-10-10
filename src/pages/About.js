// ===== Generic barbershop about page =====
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

const ABOUT_ICONS = {
  scissors: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="8.5" y1="8.5" x2="20" y2="20"/><line x1="8.5" y1="15.5" x2="20" y2="4"/></svg>`,
  award: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
  mobile: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
  store: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  clock: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  heart: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
};

export function renderAbout() {
  return `
    ${renderHeader()}

    <section class="about-hero">
      <div class="container">
        <h1>Sobre a <span style="color: var(--steel-light);">Barbearia</span></h1>
        <p style="color: var(--gray-medium); max-width: 600px; margin: var(--space-md) auto 0;">Conheça nossa história, valores e o que nos torna referência em barbearia.</p>
      </div>
    </section>

    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="about-content reveal">
          <div class="about-text">
            <h2>Nossa <span style="color: var(--steel-light);">História</span></h2>
            <p>Uma barbearia criada para cuidar do visual masculino com atenção, estilo e bem-estar. Cada atendimento é pensado para refletir a personalidade de cada cliente.</p>
            <p>Com profissionais experientes e dedicados, ambiente acolhedor e técnicas modernas, oferecemos uma experiência completa com pontualidade e precisão.</p>
            <p>Acreditamos que cuidar da aparência é uma forma de autoconfiança e expressão pessoal.</p>
          </div>
          <div class="about-image">
            <img src="/images/barber1.jpg" alt="Atendimento em barbearia" loading="lazy" />
          </div>
        </div>

        <div class="features-list reveal" style="margin-top: var(--space-3xl);">
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.scissors}</div>
            <div class="feature-text">
              <h4>Profissionais Qualificados</h4>
              <p>Barbeiros com experiência e constante atualização em tendências e técnicas.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.award}</div>
            <div class="feature-text">
              <h4>Qualidade e Precisão</h4>
              <p>Materiais de alto padrão e acabamento impecável em cada serviço prestado.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.mobile}</div>
            <div class="feature-text">
              <h4>Agendamento Online</h4>
              <p>Agende pelo celular sem complicação. Escolha o horário ideal em poucos toques.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.store}</div>
            <div class="feature-text">
              <h4>Ambiente Aconchegante</h4>
              <p>Espaço confortável e preparado para oferecer comodidade em cada visita.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.clock}</div>
            <div class="feature-text">
              <h4>Pontualidade</h4>
              <p>Respeitamos seu tempo com horários organizados e atendimento sem atrasos.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">${ABOUT_ICONS.heart}</div>
            <div class="feature-text">
              <h4>Atendimento Personalizado</h4>
              <p>Cada cliente é único. Entendemos suas preferências e entregamos o estilo ideal.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container reveal">
        <h2>Venha nos <span style="color: var(--steel-light);">conhecer</span></h2>
        <p>Agende um horário online e conheça nossos serviços.</p>
        <a href="#/agendar" class="btn btn-primary btn-lg">Agendar Horário</a>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initAboutPage() {
  initHeader();
  initScrollReveal();
}
