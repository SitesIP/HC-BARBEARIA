// ===== H&C Barbearia - Contact & Quick Actions Page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';

export function renderContact() {
  const config = store.getConfig();
  const { openingHours } = config;
  const dayKeys = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
  const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];

  // Current day index in our array
  const now = new Date();
  const currentDayIndex = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const rawWhatsapp = String(config.whatsapp || '5511999999999').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre a H&C Barbearia.')}`;
  const instagramUrl = config.instagram || 'https://www.instagram.com/hcbarbeariaa';
  const mapsUrl = config.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('HC Barbearia')}`;
  const googleReviewUrl = config.googleReviewsUrl && config.googleReviewsUrl.length > 45 
    ? config.googleReviewsUrl 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('HC Barbearia')}`;

  return `
    ${renderHeader()}

    <main class="main-content" id="main-content">
      <div class="page-top-banner">
        <div class="container">
          <div class="page-header-compact">
            <h1 class="page-title">Contato & Informações</h1>
            <p class="page-subtitle">Central de atendimento, localização e redes sociais da barbearia.</p>
          </div>
        </div>
      </div>

      <section class="contact-hub-section">
        <div class="container">
          <!-- Quick Action Buttons Hub -->
          <div class="hub-cards-grid">
            <!-- WhatsApp Support Card -->
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="hub-card whatsapp-highlight" id="hub-whatsapp">
              <div class="hub-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </div>
              <div class="hub-card-body">
                <div class="hub-card-tag">Atendimento Rápido</div>
                <h3>Tirar Dúvidas no WhatsApp</h3>
                <p>Envie uma mensagem direta para a nossa equipe e receba suporte.</p>
              </div>
              <span class="hub-card-action">Iniciar Conversa →</span>
            </a>

            <!-- Google Maps Location Card -->
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="hub-card maps-highlight" id="hub-maps">
              <div class="hub-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div class="hub-card-body">
                <div class="hub-card-tag">Como Chegar</div>
                <h3>Localização & Google Maps</h3>
                <p>${config.address || 'Abra a rota direta para a nossa barbearia no Maps.'}</p>
              </div>
              <span class="hub-card-action">Abrir no Maps →</span>
            </a>

            <!-- Google Reviews Card -->
            <a href="${googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="hub-card review-highlight" id="hub-review">
              <div class="hub-card-icon">⭐</div>
              <div class="hub-card-body">
                <div class="hub-card-tag">Opinião dos Clientes</div>
                <h3>Avalie no Google (5 Estrelas)</h3>
                <p>Sua avaliação é fundamental para nós! Deixe seu feedback.</p>
              </div>
              <span class="hub-card-action">Deixar Avaliação ★★★★★</span>
            </a>

            <!-- Instagram Card -->
            <a href="${instagramUrl}" target="_blank" rel="noopener noreferrer" class="hub-card instagram-highlight" id="hub-instagram">
              <div class="hub-card-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </div>
              <div class="hub-card-body">
                <div class="hub-card-tag">Redes Sociais</div>
                <h3>Instagram Oficial</h3>
                <p>Siga ${config.instagramHandle || '@hcbarbeariaa'} para acompanhar cortes e novidades.</p>
              </div>
              <span class="hub-card-action">Seguir no Instagram →</span>
            </a>
          </div>

          <!-- Opening Hours Table Card -->
          <div class="hours-card-container">
            <div class="hours-card-header">
              <div class="hours-header-left">
                <span class="hours-header-icon">🕒</span>
                <div>
                  <h3>Horário de Funcionamento</h3>
                  <p>Consulte nossos dias e horários de atendimento</p>
                </div>
              </div>
              <span class="hours-today-badge">Hoje é ${dayNames[currentDayIndex]}</span>
            </div>

            <div class="hours-rows-list">
              ${dayKeys.map((key, i) => {
                const day = openingHours[key];
                const isToday = i === currentDayIndex;
                const isArrivalOnly = key === 'sex' || key === 'sab';

                return `
                  <div class="hours-row-item ${isToday ? 'is-today' : ''}">
                    <div class="hours-day-info">
                      <span class="day-bullet ${isToday ? 'active' : ''}"></span>
                      <strong class="day-name">${dayNames[i]}</strong>
                      ${isToday ? '<span class="today-pill">Hoje</span>' : ''}
                    </div>

                    <div class="hours-time-info">
                      <span class="time-text ${!day.active ? 'closed-text' : ''}">
                        ${day.active ? `${day.open} às ${day.close}` : 'Fechado'}
                      </span>
                      ${isArrivalOnly ? '<span class="arrival-pill">Ordem de chegada</span>' : ''}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <div class="hours-card-footer">
              <span class="footer-tip-icon">ℹ️</span>
              <p>Segunda a Quinta: <strong>Agendamento online disponível</strong>. Sexta e Sábado: Atendimento exclusivo por <strong>ordem de chegada</strong>.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;
}

export function initContactPage() {
  initHeader();
}
