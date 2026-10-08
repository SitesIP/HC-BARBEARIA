// ===== H&C Barbearia — Footer Component =====
import store from '../data/store.js';
import { ICONS } from '../utils/helpers.js';

export function renderFooter() {
  const config = store.getConfig();
  const instaUrl = config.instagram || 'https://www.instagram.com/hcbarbeariaa';

  return `
    <footer class="footer" id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <img src="/images/logo.png" alt="${config.shopName}" />
            <p>Mais do que um corte, uma experiência. Cuidado, precisão e personalidade em cada atendimento desde 2020.</p>
          </div>
          <div class="footer-col">
            <h4>Navegação</h4>
            <a href="#/">Início</a>
            <a href="#/servicos">Serviços</a>
            <a href="#/profissionais">Profissionais</a>
            <a href="#/contato">Contato</a>
          </div>
          <div class="footer-col">
            <h4>Serviços</h4>
            <a href="#/agendar">Navalhado</a>
            <a href="#/agendar">Na Zero</a>
            <a href="#/agendar">Social</a>
            <a href="#/agendar">Barba</a>
            <a href="#/agendar">Sobrancelha</a>
          </div>
          <div class="footer-col">
            <h4>Contato</h4>
            <a href="https://wa.me/${config.whatsapp}" target="_blank">💬 WhatsApp</a>
            <a href="${instaUrl}" target="_blank">📸 Instagram</a>
            <a href="#/contato">📍 Localização</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ${config.shopName}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}
