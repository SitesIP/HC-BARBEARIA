// ===== Generic professionals page (Aba Profissionais) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

const BARBER_AVATAR_ICON = `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

export function renderBarbers() {
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <section class="section barbers-page-section">
      <div class="container">
        <div class="section-header section-header-compact">
          <h2>Nossos Profissionais</h2>
          <p>Escolha o profissional de sua preferência para o seu atendimento.</p>
        </div>

        <!-- Side-by-Side 50%/50% Fixed Grid without horizontal sliding -->
        <div class="barbers-grid-side-by-side">
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

    ${renderFooter()}
  `;
}

export function initBarbersPage() {
  initHeader();
  initScrollReveal();
}
