// ===== Generic professionals page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

export function renderBarbers() {
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-3xl));">
      <div class="container">
        <div class="section-header">
          <h2>Nossos Profissionais</h2>
          <p>Conheça os profissionais que vão cuidar do seu estilo com dedicação e talento.</p>
        </div>
        <div class="barbers-grid" style="max-width: 900px; margin: 0 auto;">
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

    ${renderFooter()}
  `;
}

export function initBarbersPage() {
  initHeader();
  initScrollReveal();
}
