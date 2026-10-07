// ===== H&C Barbearia — About Page =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { renderFooter } from '../components/Footer.js';
import { initScrollReveal } from '../utils/helpers.js';

export function renderAbout() {
  return `
    ${renderHeader()}

    <section class="about-hero">
      <div class="container">
        <h1>Sobre a <span style="color: var(--gold);">H&C Barbearia</span></h1>
        <p style="color: var(--gray-medium); max-width: 600px; margin: var(--space-md) auto 0;">Conheça nossa história, valores e o que nos torna referência em barbearia.</p>
      </div>
    </section>

    <section class="section" style="padding-top: 0;">
      <div class="container">
        <div class="about-content reveal">
          <div class="about-text">
            <h2>Nossa <span style="color: var(--gold);">História</span></h2>
            <p>Fundada em 2020, a H&C Barbearia nasceu da paixão pela arte de cuidar do visual masculino. Desde o início, nosso compromisso é oferecer muito mais do que um simples corte — proporcionamos uma experiência completa de cuidado, estilo e bem-estar.</p>
            <p>Com profissionais experientes e apaixonados, ambiente sofisticado e produtos de alta qualidade, nos tornamos referência na região. Cada atendimento é único, pensado para refletir a personalidade de cada cliente.</p>
            <p>Acreditamos que cuidar da aparência é uma forma de autoconfiança e expressão pessoal. Por isso, investimos constantemente em treinamentos, tendências e inovação.</p>
          </div>
          <div class="about-image">
            <img src="/images/hero-bg.jpg" alt="Interior da H&C Barbearia" loading="lazy" />
          </div>
        </div>

        <div class="features-list reveal" style="margin-top: var(--space-3xl);">
          <div class="feature-item">
            <div class="feature-icon">✂️</div>
            <div class="feature-text">
              <h4>Profissionais Qualificados</h4>
              <p>Barbeiros com anos de experiência e em constante atualização com as tendências.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🏆</div>
            <div class="feature-text">
              <h4>Produtos Premium</h4>
              <p>Utilizamos apenas produtos de alta qualidade para garantir o melhor resultado.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-text">
              <h4>Agendamento Online</h4>
              <p>Agende pelo celular sem complicação. Escolha o horário ideal sem sair de casa.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💈</div>
            <div class="feature-text">
              <h4>Ambiente Premium</h4>
              <p>Espaço sofisticado, confortável e preparado para oferecer uma experiência única.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">⏰</div>
            <div class="feature-text">
              <h4>Pontualidade</h4>
              <p>Respeitamos seu tempo. Chegou no horário, é atendido no horário.</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">❤️</div>
            <div class="feature-text">
              <h4>Atendimento Personalizado</h4>
              <p>Cada cliente é único. Ouvimos suas preferências e entregamos o resultado perfeito.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container reveal">
        <h2>Venha nos <span style="color: var(--gold);">conhecer</span></h2>
        <p>Agende uma visita e descubra por que somos a escolha de centenas de clientes.</p>
        <a href="#/agendar" class="btn btn-primary btn-lg">✂️ Agendar Horário</a>
      </div>
    </section>

    ${renderFooter()}
  `;
}

export function initAboutPage() {
  initHeader();
  initScrollReveal();
}
