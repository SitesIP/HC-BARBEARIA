// ===== Generic barbershop information page (Aba Contato / Informações) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

export function renderContact() {
  const config = store.getConfig();
  const { openingHours } = config;
  const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Seg = 0, Dom = 6

  const rawPhone = String(config.whatsapp || '5511999999999').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a barbearia.')}`;

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-xl)); padding-bottom: var(--space-xl);">
      <div class="container">
        <div class="section-header">
          <h2>Contato & Informações</h2>
          <p>Consulte nossos horários de atendimento e canais de contato.</p>
        </div>

        <div class="contact-cards-row" style="max-width: 760px; margin: 0 auto 30px;">
          <div class="contact-info-card">
            <span class="contact-icon">📍</span>
            <h4>Endereço</h4>
            <p>${config.address || 'Rua Principal, 123 - Centro'}</p>
          </div>

          <div class="contact-info-card">
            <span class="contact-icon">💬</span>
            <h4>Atendimento</h4>
            <p>Dúvidas e suporte rápido via WhatsApp</p>
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-xs" style="margin-top: 8px;">Falar no WhatsApp</a>
          </div>
        </div>

        <div class="hours-list reveal" style="max-width: 760px; margin: 0 auto;">
          <h3 style="margin-bottom: var(--space-lg); color: var(--steel-light);" class="hours-section-title">Horário de Funcionamento</h3>
          <div class="hours-table-container">
            ${dayKeys.map((key, i) => {
              const day = openingHours[key];
              const isToday = i === currentDayIndex;
              const isArrival = key === 'sex' || key === 'sab';

              return `
                <div class="hours-row ${isToday ? 'hours-row-highlight' : ''}">
                  <div class="hours-row-main">
                    <span class="hours-day-name">
                      ${dayNames[i]}
                      ${isToday ? '<span class="today-tag">Hoje</span>' : ''}
                    </span>
                    <span class="hours-time-value">
                      ${day.active ? `${day.open} — ${day.close}` : 'Fechado'}
                      ${isArrival ? '<span class="arrival-tag">Ordem de chegada</span>' : ''}
                    </span>
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
