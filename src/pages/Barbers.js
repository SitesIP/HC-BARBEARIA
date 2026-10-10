// ===== Generic professionals page (Aba Profissionais) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

export function renderBarbers() {
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-xl)); padding-bottom: var(--space-xl);">
      <div class="container">
        <div class="section-header">
          <h2>Nossos Profissionais</h2>
          <p>Profissionais qualificados para cuidar do seu estilo. No celular, deslize para o lado.</p>
        </div>

        <div class="barbers-scroll-hint">
          <span>↔ Deslize para o lado para ver todos</span>
        </div>

        <div class="barbers-grid barbers-slider-mobile" style="max-width: 900px; margin: 0 auto;">
          ${barbers.map((barber, i) => `
            <div class="barber-card" style="transition-delay: ${i * 0.15}s">
              <div class="barber-image">
                <div class="barber-placeholder" aria-hidden="true">✂</div>
              </div>
              <div class="barber-info">
                <h4>${barber.name}</h4>
                <p class="barber-specialty">${barber.specialty}</p>
                <a href="#/agendar" class="btn btn-primary btn-sm" style="margin-top: 14px; width: 100%;">Agendar com este profissional</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initBarbersPage() {
  initHeader();
  initScrollReveal();
}
