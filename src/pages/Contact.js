// ===== Generic barbershop information page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

export function renderContact() {
  const { openingHours } = store.getConfig();
  const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-3xl));">
      <div class="container">
        <div class="section-header">
          <h2>Informações</h2>
          <p>Consulte os horários de atendimento da barbearia.</p>
        </div>

        <div class="hours-list reveal" style="max-width: 760px; margin: 0 auto;">
          <h3 style="margin-bottom: var(--space-lg); color: var(--gold);" class="hours-section-title">Horário de Funcionamento</h3>
          <div class="hours-table-container">
            ${dayKeys.map((key, i) => {
              const day = openingHours[key];

              return `
                <div class="hours-row">
                  <div class="hours-row-main">
                    <span class="hours-day-name">${dayNames[i]}</span>
                    <span class="hours-time-value">${day.active ? `${day.open} — ${day.close}` : 'Fechado'}</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initContactPage() {
  initHeader();
  initScrollReveal();
}
