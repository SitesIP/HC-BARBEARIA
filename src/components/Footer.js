// ===== Generic site footer =====
import store from '../data/store.js';
import { ICONS } from '../utils/helpers.js';

export function renderFooter() {
  const config = store.getConfig();

  return `
    <footer class="footer" id="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>${config.shopName || 'Barbearia'}</h3>
            <p>Estilo, cuidado e personalidade em cada atendimento.</p>
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
            <h4>Redes e contato</h4>
            <a href="${config.instagram || 'https://www.instagram.com/seu_perfil'}" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://wa.me/${String(config.whatsapp || '5511999999999').replace(/\D/g, '')}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© ${new Date().getFullYear()} ${config.shopName || 'Barbearia'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `;
}
