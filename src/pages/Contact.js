// ===== Generic barbershop information page (Aba Contato / Informações) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

const CONTACT_SVGS = {
  maps: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  star: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  whatsapp: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  external: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
};

export function renderContact() {
  const config = store.getConfig();
  const { openingHours } = config;
  const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Seg = 0, Dom = 6

  const rawPhone = String(config.whatsapp || '5511999999999').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a barbearia.')}`;
  const addressQuery = encodeURIComponent(config.address || 'Barbearia');
  const mapsUrl = `https://maps.google.com/?q=${addressQuery}`;
  const googleReviewUrl = `https://www.google.com/search?q=${addressQuery}+avaliacoes`;
  const instagramUrl = config.instagram || 'https://www.instagram.com';

  return `
    ${renderHeader()}

    <section class="section contact-page-section">
      <div class="container">
        <div class="section-header section-header-compact">
          <h2>Contato & Localização</h2>
          <p>Acesse nossos canais rápidos e veja o horário de atendimento.</p>
        </div>

        <!-- 2-Column Wide Action Grid with Minimalist Left-Aligned SVG Icons -->
        <div class="contact-actions-grid">
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="contact-action-btn">
            <span class="action-btn-icon">${CONTACT_SVGS.maps}</span>
            <div class="action-btn-info">
              <strong>Localização Maps</strong>
              <span>Ver no mapa ${CONTACT_SVGS.external}</span>
            </div>
          </a>

          <a href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="contact-action-btn">
            <span class="action-btn-icon">${CONTACT_SVGS.star}</span>
            <div class="action-btn-info">
              <strong>Avaliação Google</strong>
              <span>Deixar nota ${CONTACT_SVGS.external}</span>
            </div>
          </a>

          <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="contact-action-btn">
            <span class="action-btn-icon">${CONTACT_SVGS.instagram}</span>
            <div class="action-btn-info">
              <strong>Instagram</strong>
              <span>@perfil ${CONTACT_SVGS.external}</span>
            </div>
          </a>

          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="contact-action-btn action-btn-whatsapp">
            <span class="action-btn-icon">${CONTACT_SVGS.whatsapp}</span>
            <div class="action-btn-info">
              <strong>WhatsApp Suporte</strong>
              <span>Falar conosco ${CONTACT_SVGS.external}</span>
            </div>
          </a>
        </div>

        <!-- Compact Operating Hours List (Simple, minimal vertical footprint) -->
        <div class="hours-compact-section">
          <div class="hours-compact-header">
            <span class="hours-icon-svg">${CONTACT_SVGS.clock}</span>
            <h3>Horário de Funcionamento</h3>
          </div>

          <div class="hours-compact-list">
            ${dayKeys.map((key, i) => {
              const day = openingHours[key];
              const isToday = i === currentDayIndex;
              const isArrival = key === 'sex' || key === 'sab';

              return `
                <div class="hours-compact-row ${isToday ? 'is-today' : ''}">
                  <span class="hours-compact-day">
                    ${dayNames[i]}
                    ${isToday ? '<span class="today-badge">Hoje</span>' : ''}
                  </span>
                  <span class="hours-compact-time">
                    ${day && day.active ? `${day.open} – ${day.close}` : '<span class="closed-badge">Fechado</span>'}
                    ${isArrival && day && day.active ? '<span class="arrival-badge">Ordem de chegada</span>' : ''}
                  </span>
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
