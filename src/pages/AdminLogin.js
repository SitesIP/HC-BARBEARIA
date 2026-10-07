// ===== H&C Barbearia — Admin Login =====
import store from '../data/store.js';
import { showToast } from '../utils/helpers.js';

export function renderAdminLogin() {
  return `
    <div class="login-page">
      <div class="login-card">
        <img src="/images/logo.jpg" alt="H&C Barbearia" />
        <h2>Área Administrativa</h2>
        <p class="subtitle">Acesso restrito ao proprietário</p>
        <form id="login-form">
          <div class="form-group">
            <label class="form-label" for="admin-password">Senha</label>
            <input type="password" class="form-input" id="admin-password" placeholder="Digite a senha" autocomplete="current-password" />
            <div class="form-error" id="login-error" style="display: none;">Senha incorreta. Tente novamente.</div>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Entrar</button>
        </form>
        <a href="#/" style="display: block; margin-top: var(--space-lg); color: var(--gray-medium); font-size: 0.85rem;">← Voltar ao site</a>
      </div>
    </div>
  `;
}

export function initAdminLogin() {
  const form = document.getElementById('login-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const password = document.getElementById('admin-password').value;
      if (store.login(password)) {
        showToast('Login realizado com sucesso!', 'success');
        window.location.hash = '#/admin';
      } else {
        document.getElementById('login-error').style.display = 'block';
        document.getElementById('admin-password').classList.add('error');
      }
    });
  }
}
