// ===== H&C Barbearia - Barbers Page (Horizontal Slider & Side-by-Side) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';

export function renderBarbers() {
  const barbers = store.getBarbers();

  return `
    ${renderHeader()}

    <main class="main-content" id="main-content">
      <div class="page-top-banner">
        <div class="container">
          <div class="page-header-compact">
            <h1 class="page-title">Nossos Profissionais</h1>
            <p class="page-subtitle">Deslize para conhecer a equipe e escolha seu barbeiro de preferência.</p>
          </div>
        </div>
      </div>

      <section class="barbers-showcase-section">
        <div class="container">
          <!-- Mobile Slider Controls & Indicator -->
          <div class="slider-controls-bar">
            <span class="slider-hint-text">👉 Arraste para o lado para alternar</span>
            <div class="slider-dots-indicator" id="barber-dots">
              ${barbers.map((_, i) => `
                <button class="dot-btn ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Ver barbeiro ${i + 1}"></button>
              `).join('')}
            </div>
          </div>

          <!-- Barbers Horizontal Slider Grid -->
          <div class="barbers-horizontal-track" id="barbers-carousel">
            ${barbers.map((barber, index) => `
              <div class="barber-pro-card" id="barber-card-${index}">
                <div class="barber-card-visual">
                  <div class="barber-avatar-large">
                    <span class="barber-icon-symbol">💈</span>
                    <span class="barber-number-tag">Barbeiro 0${index + 1}</span>
                  </div>
                </div>

                <div class="barber-details">
                  <div class="barber-header-info">
                    <h2 class="barber-main-name">${barber.name}</h2>
                    <span class="barber-specialty-badge">${barber.specialty}</span>
                  </div>

                  <div class="barber-perks-list">
                    <div class="perk-item">
                      <span class="perk-icon">✂️</span>
                      <span>Degradê na navalha, social e barba alinhada</span>
                    </div>
                    <div class="perk-item">
                      <span class="perk-icon">⭐</span>
                      <span>Pontualidade e atendimento de excelência</span>
                    </div>
                    <div class="perk-item">
                      <span class="perk-icon">📅</span>
                      <span>Agendamento online direto na planilha oficial</span>
                    </div>
                  </div>

                  <div class="barber-footer-action">
                    <a href="#/agendar?barber=${barber.id}" class="btn btn-primary btn-block btn-lg barber-book-btn">
                      Agendar com ${barber.name} →
                    </a>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Bottom info callout -->
          <div class="barbers-info-box">
            <div class="info-box-icon">💡</div>
            <div class="info-box-text">
              <strong>Atendimento com qualquer profissional:</strong>
              <p>Você também pode optar por agendamento flexível escolhendo o horário que melhor se adapta à sua rotina.</p>
            </div>
            <a href="#/agendar" class="btn btn-secondary btn-sm">Agendar Qualquer</a>
          </div>
        </div>
      </section>
    </main>

    ${renderFooter()}
  `;
}

export function initBarbersPage() {
  initHeader();

  const carousel = document.getElementById('barbers-carousel');
  const dots = document.querySelectorAll('#barber-dots .dot-btn');

  if (carousel && dots.length > 0) {
    carousel.addEventListener('scroll', () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.firstElementChild?.offsetWidth || 300;
      const activeIdx = Math.round(scrollLeft / cardWidth);

      dots.forEach((d, idx) => {
        d.classList.toggle('active', idx === activeIdx);
      });
    }, { passive: true });

    dots.forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const card = document.getElementById(`barber-card-${idx}`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
    });
  }
}
