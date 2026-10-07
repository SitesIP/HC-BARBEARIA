// ===== H&C Barbearia — Contact Page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal, WEEKDAYS_FULL } from '../utils/helpers.js';

export function renderContact() {
  const config = store.getConfig();
  const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  return `
    ${renderHeader()}

    <section class="section" style="padding-top: calc(var(--header-height) + var(--space-3xl));">
      <div class="container">
        <div class="section-header">
          <h2>Contato</h2>
          <p>Estamos à disposição para atendê-lo. Entre em contato ou visite-nos.</p>
        </div>

        <div class="contact-grid reveal">
          <div>
            <div class="contact-info-list">
              <div class="contact-info-item">
                <div class="contact-info-icon">📍</div>
                <div class="contact-info-text">
                  <h4>Endereço</h4>
                  <p>${config.address}</p>
                </div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">💬</div>
                <div class="contact-info-text">
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/${config.whatsapp}" target="_blank" style="color: var(--gold);">Clique aqui para conversar</a></p>
                </div>
              </div>
              <div class="contact-info-item">
                <div class="contact-info-icon">📸</div>
                <div class="contact-info-text">
                  <h4>Instagram</h4>
                  <p><a href="${config.instagram || 'https://www.instagram.com/hcbarbeariaa'}" target="_blank" style="color: var(--gold);">Visite nosso perfil</a></p>
                </div>
              </div>
            </div>

            <div class="hours-list" style="margin-top: var(--space-xl);">
              <h3 style="margin-bottom: var(--space-lg); color: var(--gold);" class="hours-section-title">Horário de Funcionamento</h3>
              <div class="hours-table-container">
                ${dayKeys.map((key, i) => {
                  const day = config.openingHours[key];
                  const isWeek = ['seg', 'ter', 'qua', 'qui'].includes(key);
                  const isWeekend = ['sex', 'sab'].includes(key);
                  const isClosed = key === 'dom' || !day.active;

                  return `
                    <div class="hours-row ${isWeekend ? 'hours-row-highlight' : ''}">
                      <div class="hours-row-main">
                        <span class="hours-day-name">${dayNames[i]}</span>
                        <span class="hours-time-value">${day.active ? `${day.open} — ${day.close}` : 'Fechado'}</span>
                      </div>
                      <div class="hours-row-badge">
                        ${isWeek ? `<span class="badge-schedule badge-standard">AGENDAMENTO OU ORDEM DE CHEGADA</span>` : ''}
                        ${isWeekend ? `<span class="badge-schedule badge-highlight">SOMENTE ORDEM DE CHEGADA</span>` : ''}
                        ${isClosed ? `<span class="badge-schedule badge-closed">FECHADO</span>` : ''}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <div>
            <div class="map-container reveal">
              <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 16px; color: var(--gray-medium);">
                <span style="font-size: 3rem;">📍</span>
                <p style="text-align: center; padding: 16px;">${config.address}</p>
                <a href="https://www.google.com/maps/search/${encodeURIComponent(config.address)}" target="_blank" class="btn btn-secondary btn-sm">Abrir no Google Maps</a>
              </div>
            </div>

            <div style="margin-top: var(--space-xl); text-align: center;" class="reveal">
              <h3 style="margin-bottom: var(--space-md);">Fale direto pelo WhatsApp</h3>
              <a href="https://wa.me/${config.whatsapp}" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-whatsapp-cta">
                <span>💬</span> Conversar pelo WhatsApp
              </a>
            </div>
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
