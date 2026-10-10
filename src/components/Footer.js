// ===== H&C Barbearia Footer Component =====
import store from '../data/store.js';

export function renderFooter() {
  const config = store.getConfig();
  const currentYear = new Date().getFullYear();

  return `
    <footer class="footer" id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-brand-header">
              <div class="brand-badge small">H&C</div>
              <h3>${config.shopName || 'H&C Barbearia'}</h3>
            </div>
            <p class="footer-desc">Tradição, estilo clássico e cortes modernos feitos por profissionais qualificados.</p>
            <div class="footer-social-links">
              <a href="${config.instagram || 'https://www.instagram.com/hcbarbeariaa'}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                <span>Instagram</span>
              </a>
              <a href="https://wa.me/${String(config.whatsapp || '5511999999999').replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="WhatsApp">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          <div class="footer-col">
            <h4>Navegação</h4>
            <ul class="footer-links">
              <li><a href="#/">Início</a></li>
              <li><a href="#/servicos">Serviços & Preços</a></li>
              <li><a href="#/profissionais">Nossos Barbeiros</a></li>
              <li><a href="#/agendar">Agendamento Online</a></li>
              <li><a href="#/contato">Contato & Horários</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h4>Atendimento</h4>
            <p class="footer-info-item">
              <strong>Segunda:</strong> 13:30 – 17:30
            </p>
            <p class="footer-info-item">
              <strong>Terça a Sexta:</strong> 09:00 – 18:30
            </p>
            <p class="footer-info-item">
              <strong>Sábado:</strong> 09:00 – 16:00
            </p>
            <p class="footer-info-note">Sexta e Sábado: atendimento por ordem de chegada.</p>
          </div>
        </div>

        <div class="footer-bottom">
          <p>© ${currentYear} ${config.shopName || 'H&C Barbearia'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}
