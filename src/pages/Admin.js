// ===== H&C Barbearia — Admin Dashboard & Management =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import { formatCurrency, formatDate, formatDateShort, showToast, WEEKDAYS, sendToGoogleSheets } from '../utils/helpers.js';

let activeTab = 'dashboard';
let statusFilter = 'all';
let searchQuery = '';
let dateFilter = '';
let editingItem = null;

export function renderAdmin(tab = 'dashboard') {
  activeTab = tab;
  const config = store.getConfig();
  const stats = store.getStats();

  return `
    ${renderHeader(true)}
    <div class="admin-layout" id="admin-layout">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div style="padding: 0 var(--space-xl) var(--space-lg); border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: var(--space-md);">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--gold); font-weight: 600;">Painel de Controle</div>
          <div style="font-size: 0.9rem; font-weight: 500; color: var(--off-white); margin-top: 4px;">${config.shopName}</div>
        </div>
        <nav class="admin-sidebar-nav">
          <a href="#/admin" class="${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
            <span>📊</span> Visão Geral
          </a>
          <a href="#/admin/agendamentos" class="${activeTab === 'agendamentos' ? 'active' : ''}" data-tab="agendamentos">
            <span>📅</span> Agendamentos
          </a>
          <a href="#/admin/servicos" class="${activeTab === 'servicos' ? 'active' : ''}" data-tab="servicos">
            <span>✂️</span> Serviços
          </a>
          <a href="#/admin/profissionais" class="${activeTab === 'profissionais' ? 'active' : ''}" data-tab="profissionais">
            <span>💈</span> Profissionais
          </a>
          <a href="#/admin/bloqueios" class="${activeTab === 'bloqueios' ? 'active' : ''}" data-tab="bloqueios">
            <span>🚫</span> Bloqueio de Datas
          </a>
          <a href="#/admin/configuracoes" class="${activeTab === 'configuracoes' ? 'active' : ''}" data-tab="configuracoes">
            <span>⚙️</span> Configurações
          </a>
        </nav>
        <div style="padding: var(--space-xl); margin-top: auto; border-top: 1px solid rgba(255,255,255,0.05);">
          <a href="#/" class="btn btn-secondary btn-sm btn-block" style="margin-bottom: var(--space-sm);">🌐 Ver Site</a>
          <button id="admin-logout-btn" class="btn btn-danger btn-sm btn-block">🚪 Sair do Painel</button>
        </div>
      </aside>

      <!-- Toggle for mobile sidebar -->
      <button class="admin-sidebar-toggle" id="admin-sidebar-toggle" aria-label="Abrir Menu Lateral">
        ☰
      </button>

      <!-- Main Admin Content -->
      <main class="admin-main">
        ${renderTabContent()}
      </main>
    </div>

    <!-- Modals Container -->
    <div id="admin-modal-container"></div>
  `;
}

function renderTabContent() {
  switch (activeTab) {
    case 'dashboard':
      return renderDashboardTab();
    case 'agendamentos':
      return renderAppointmentsTab();
    case 'servicos':
      return renderServicesTab();
    case 'profissionais':
      return renderBarbersTab();
    case 'bloqueios':
      return renderBlockedDatesTab();
    case 'configuracoes':
      return renderSettingsTab();
    default:
      return renderDashboardTab();
  }
}

// 1. DASHBOARD TAB
function renderDashboardTab() {
  const stats = store.getStats();
  const todayAppts = store.getTodayAppointments();
  const allAppts = store.getAppointments();

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">📊 Visão Geral</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Resumo dos agendamentos e métricas da barbearia</p>
      </div>
      <div style="display: flex; gap: var(--space-sm);">
        <a href="#/agendar" class="btn btn-primary btn-sm">+ Novo Agendamento</a>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Agendamentos Hoje</span>
          <div class="stat-card-icon" style="color: var(--gold); background: rgba(200,164,106,0.1);">📅</div>
        </div>
        <div class="stat-card-value">${stats.todayCount}</div>
        <div style="font-size: 0.8rem; color: var(--gray-medium); margin-top: 4px;">Data: ${formatDateShort(new Date().toISOString().split('T')[0])}</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Faturamento Hoje</span>
          <div class="stat-card-icon" style="color: #4CAF50; background: rgba(76,175,80,0.1);">💰</div>
        </div>
        <div class="stat-card-value" style="color: #4CAF50;">${formatCurrency(stats.todayRevenue)}</div>
        <div style="font-size: 0.8rem; color: var(--gray-medium); margin-top: 4px;">Com base nos serviços confirmados</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Agendamentos no Mês</span>
          <div class="stat-card-icon" style="color: #42A5F5; background: rgba(66,165,245,0.1);">📈</div>
        </div>
        <div class="stat-card-value">${stats.monthCount}</div>
        <div style="font-size: 0.8rem; color: var(--gray-medium); margin-top: 4px;">Total acumulado este mês</div>
      </div>

      <div class="stat-card">
        <div class="stat-card-header">
          <span class="stat-card-label">Faturamento no Mês</span>
          <div class="stat-card-icon" style="color: var(--gold); background: rgba(200,164,106,0.1);">👑</div>
        </div>
        <div class="stat-card-value" style="color: var(--gold);">${formatCurrency(stats.monthRevenue)}</div>
        <div style="font-size: 0.8rem; color: var(--gray-medium); margin-top: 4px;">Previsão do mês</div>
      </div>
    </div>

    <!-- Today's Appointments Section -->
    <div style="margin-top: var(--space-2xl);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
        <h2 style="font-size: 1.2rem; font-family: var(--font-heading); color: var(--off-white);">⏰ Agendamentos de Hoje</h2>
        <a href="#/admin/agendamentos" class="btn btn-secondary btn-sm">Ver Todos (${allAppts.length})</a>
      </div>

      ${todayAppts.length === 0 ? `
        <div class="empty-state" style="background: var(--graphite); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05);">
          <div class="empty-state-icon">📅</div>
          <h3>Nenhum agendamento para hoje</h3>
          <p>Quando novos clientes agendarem horários para hoje, eles aparecerão listados aqui.</p>
        </div>
      ` : `
        <div class="admin-table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Horário</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Serviço</th>
                <th>Barbeiro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${todayAppts.sort((a,b) => a.horario.localeCompare(b.horario)).map(a => `
                <tr>
                  <td style="font-weight: 700; color: var(--gold);">${a.horario}</td>
                  <td style="font-weight: 600;">${a.nome}</td>
                  <td>
                    <a href="https://wa.me/55${a.telefone.replace(/\\D/g, '')}" target="_blank" style="color: #25D366; text-decoration: underline;">
                      ${a.telefone} 💬
                    </a>
                  </td>
                  <td>${a.servico}</td>
                  <td>${a.barbeiro}</td>
                  <td>${renderStatusBadge(a.status)}</td>
                  <td>
                    <div style="display: flex; gap: 6px;">
                      ${a.status !== 'completed' ? `
                        <button class="btn btn-sm btn-success btn-action" data-action="status" data-id="${a.id}" data-status="completed" title="Marcar como Concluído">✓</button>
                      ` : ''}
                      ${a.status !== 'cancelled' ? `
                        <button class="btn btn-sm btn-danger btn-action" data-action="status" data-id="${a.id}" data-status="cancelled" title="Cancelar Agendamento">✕</button>
                      ` : `
                        <button class="btn btn-sm btn-secondary btn-action" data-action="status" data-id="${a.id}" data-status="confirmed" title="Reativar Agendamento">↺</button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `}
    </div>
  `;
}

// 2. APPOINTMENTS TAB
function renderAppointmentsTab() {
  let appointments = store.getAppointments();

  // Apply search
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    appointments = appointments.filter(a =>
      a.nome.toLowerCase().includes(q) ||
      a.telefone.includes(q) ||
      (a.id && a.id.toLowerCase().includes(q)) ||
      a.servico.toLowerCase().includes(q) ||
      a.barbeiro.toLowerCase().includes(q)
    );
  }

  // Apply status filter
  if (statusFilter !== 'all') {
    appointments = appointments.filter(a => a.status === statusFilter);
  }

  // Apply date filter
  if (dateFilter) {
    appointments = appointments.filter(a => a.dataCorte === dateFilter);
  }

  // Sort by date and time descending
  appointments.sort((a, b) => {
    const dateComp = (b.dataCorte || '').localeCompare(a.dataCorte || '');
    if (dateComp !== 0) return dateComp;
    return (b.horario || '').localeCompare(a.horario || '');
  });

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">📅 Gestão de Agendamentos</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Consulte, filtre e gerencie todos os agendamentos registrados</p>
      </div>
      <div style="display: flex; gap: var(--space-sm); flex-wrap: wrap;">
        <button id="btn-export-csv" class="btn btn-secondary btn-sm">📥 Exportar CSV</button>
        <a href="#/agendar" class="btn btn-primary btn-sm">+ Novo Agendamento</a>
      </div>
    </div>

    <!-- Filters Row -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-lg); background: var(--graphite); padding: var(--space-md); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
      <div class="admin-search">
        <span class="admin-search-icon">🔍</span>
        <input type="text" id="admin-search-input" placeholder="Buscar por nome, telefone, código..." value="${searchQuery}" />
      </div>

      <div>
        <select id="admin-status-filter" class="form-select" style="padding: 10px 14px; width: 100%;">
          <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>Todos os Status</option>
          <option value="confirmed" ${statusFilter === 'confirmed' ? 'selected' : ''}>Confirmados</option>
          <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>Concluídos</option>
          <option value="cancelled" ${statusFilter === 'cancelled' ? 'selected' : ''}>Cancelados</option>
        </select>
      </div>

      <div>
        <input type="date" id="admin-date-filter" class="form-input" style="padding: 10px 14px; width: 100%;" value="${dateFilter}" />
      </div>

      <div style="display: flex; gap: 6px;">
        <button id="btn-clear-filters" class="btn btn-secondary btn-sm" style="flex: 1;">Limpar Filtros</button>
      </div>
    </div>

    <!-- Appointments Table -->
    ${appointments.length === 0 ? `
      <div class="empty-state" style="background: var(--graphite); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05);">
        <div class="empty-state-icon">📋</div>
        <h3>Nenhum agendamento encontrado</h3>
        <p>Tente ajustar os termos de busca ou filtros selecionados.</p>
      </div>
    ` : `
      <div class="admin-table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Cód.</th>
              <th>Data</th>
              <th>Horário</th>
              <th>Cliente</th>
              <th>Telefone</th>
              <th>Serviço</th>
              <th>Barbeiro</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(a => `
              <tr>
                <td style="font-family: monospace; font-size: 0.8rem; color: var(--gold);">${a.id || '-'}</td>
                <td>${formatDateShort(a.dataCorte)}</td>
                <td style="font-weight: 700;">${a.horario}</td>
                <td style="font-weight: 600;">${a.nome}</td>
                <td>
                  <a href="https://wa.me/55${a.telefone.replace(/\\D/g, '')}" target="_blank" style="color: #25D366; text-decoration: underline;" title="Conversar no WhatsApp">
                    ${a.telefone}
                  </a>
                </td>
                <td>${a.servico}</td>
                <td>${a.barbeiro}</td>
                <td>${renderStatusBadge(a.status)}</td>
                <td>
                  <div style="display: flex; gap: 6px;">
                    ${a.status !== 'completed' ? `
                      <button class="btn btn-sm btn-success btn-action" data-action="status" data-id="${a.id}" data-status="completed" title="Concluir">✓</button>
                    ` : ''}
                    ${a.status !== 'cancelled' ? `
                      <button class="btn btn-sm btn-danger btn-action" data-action="status" data-id="${a.id}" data-status="cancelled" title="Cancelar">✕</button>
                    ` : `
                      <button class="btn btn-sm btn-secondary btn-action" data-action="status" data-id="${a.id}" data-status="confirmed" title="Reativar">↺</button>
                    `}
                    <button class="btn btn-sm btn-secondary btn-action" data-action="delete-appt" data-id="${a.id}" title="Excluir do Registro" style="color: var(--error);">🗑️</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `}
  `;
}

// 3. SERVICES TAB
function renderServicesTab() {
  const services = store.getAllServices();

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">✂️ Catálogo de Serviços</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Cadastre, edite preços e personalize os serviços oferecidos</p>
      </div>
      <div>
        <button id="btn-add-service" class="btn btn-primary btn-sm">+ Novo Serviço</button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg);">
      ${services.map(s => `
        <div class="service-card" style="background: var(--graphite); border: 1px solid ${s.active ? 'rgba(200,164,106,0.15)' : 'rgba(255,255,255,0.05)'}; opacity: ${s.active ? '1' : '0.6'};">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-md);">
            <div class="service-icon" style="font-size: 2rem;">${s.icon || '✂️'}</div>
            <span class="badge ${s.active ? 'badge-success' : 'badge-danger'}">${s.active ? 'Ativo' : 'Inativo'}</span>
          </div>
          <h3 class="service-name" style="margin-bottom: 4px;">${s.name}</h3>
          <p class="service-desc" style="color: var(--gray-light); font-size: 0.85rem; margin-bottom: var(--space-md); min-height: 40px;">${s.description || 'Sem descrição.'}</p>
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: var(--space-md); border-top: 1px solid rgba(255,255,255,0.05); margin-bottom: var(--space-md);">
            <div>
              <div style="font-size: 0.75rem; color: var(--gray-medium);">DURAÇÃO</div>
              <div style="font-weight: 600;">⏱️ ${s.duration} min</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.75rem; color: var(--gray-medium);">VALOR</div>
              <div style="font-size: 1.2rem; font-weight: 700; color: var(--gold);">${formatCurrency(s.price)}</div>
            </div>
          </div>

          <div style="display: flex; gap: var(--space-sm);">
            <button class="btn btn-secondary btn-sm btn-block btn-edit-service" data-id="${s.id}">✏️ Editar</button>
            <button class="btn ${s.active ? 'btn-danger' : 'btn-success'} btn-sm btn-toggle-service" data-id="${s.id}">
              ${s.active ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 4. BARBERS TAB
function renderBarbersTab() {
  const barbers = store.getAllBarbers();

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">💈 Equipe de Profissionais</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Gerencie a equipe de barbeiros, especialidades e avaliações</p>
      </div>
      <div>
        <button id="btn-add-barber" class="btn btn-primary btn-sm">+ Novo Barbeiro</button>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-lg);">
      ${barbers.map(b => `
        <div class="barber-card" style="background: var(--graphite); border: 1px solid ${b.active ? 'rgba(200,164,106,0.15)' : 'rgba(255,255,255,0.05)'}; opacity: ${b.active ? '1' : '0.6'}; text-align: center; padding: var(--space-xl);">
          <div style="width: 100px; height: 100px; border-radius: var(--radius-full); overflow: hidden; margin: 0 auto var(--space-md); border: 2px solid var(--gold);">
            <img src="${b.image || '/images/barber1.jpg'}" alt="${b.name}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/barber1.jpg'" />
          </div>
          <span class="badge ${b.active ? 'badge-success' : 'badge-danger'}" style="margin-bottom: var(--space-sm);">${b.active ? 'Disponível' : 'Inativo'}</span>
          <h3 style="font-size: 1.2rem; margin-bottom: 4px;">${b.name}</h3>
          <p style="color: var(--gold); font-size: 0.85rem; margin-bottom: var(--space-sm);">${b.specialty}</p>
          <div style="color: var(--warning); font-size: 0.9rem; margin-bottom: var(--space-lg);">★ ${b.rating || '5.0'} / 5.0</div>

          <div style="display: flex; gap: var(--space-sm);">
            <button class="btn btn-secondary btn-sm btn-block btn-edit-barber" data-id="${b.id}">✏️ Editar</button>
            <button class="btn ${b.active ? 'btn-danger' : 'btn-success'} btn-sm btn-toggle-barber" data-id="${b.id}">
              ${b.active ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// 5. BLOCKED DATES TAB
function renderBlockedDatesTab() {
  const blockedDates = store.getBlockedDates();

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">🚫 Bloqueio de Datas & Folgas</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Impeça novos agendamentos em dias específicos como feriados ou manutenções</p>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 2fr; gap: var(--space-xl); align-items: flex-start;">
      <!-- Add Block Form -->
      <div style="background: var(--graphite); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid rgba(200,164,106,0.15);">
        <h3 style="margin-bottom: var(--space-md); font-family: var(--font-heading);">Bloquear Nova Data</h3>
        <form id="form-block-date">
          <div class="form-group">
            <label class="form-label">Data a bloquear</label>
            <input type="date" id="block-date-input" class="form-input" required min="${new Date().toISOString().split('T')[0]}" />
          </div>
          <div class="form-group">
            <label class="form-label">Motivo do bloqueio</label>
            <input type="text" id="block-reason-input" class="form-input" placeholder="Ex: Feriado Nacional, Reforma..." required />
          </div>
          <button type="submit" class="btn btn-primary btn-block">+ Adicionar Bloqueio</button>
        </form>
      </div>

      <!-- List of Blocked Dates -->
      <div>
        <h3 style="margin-bottom: var(--space-md); font-family: var(--font-heading);">Datas Bloqueadas Atualmente</h3>
        ${blockedDates.length === 0 ? `
          <div class="empty-state" style="background: var(--graphite); border-radius: var(--radius-lg); border: 1px solid rgba(255,255,255,0.05);">
            <div class="empty-state-icon">✅</div>
            <h3>Nenhuma data bloqueada</h3>
            <p>Todas as datas com dias de funcionamento estão liberadas para agendamento online.</p>
          </div>
        ` : `
          <div class="admin-table-container">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Motivo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                ${blockedDates.map(b => `
                  <tr>
                    <td style="font-weight: 700; color: var(--gold);">${formatDate(b.date)}</td>
                    <td>${b.reason}</td>
                    <td>
                      <button class="btn btn-danger btn-sm btn-remove-block" data-id="${b.id}">Desbloquear</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>
    </div>
  `;
}

// 6. SETTINGS TAB
function renderSettingsTab() {
  const config = store.getConfig();
  const days = [
    { key: 'seg', label: 'Segunda-feira' },
    { key: 'ter', label: 'Terça-feira' },
    { key: 'qua', label: 'Quarta-feira' },
    { key: 'qui', label: 'Quinta-feira' },
    { key: 'sex', label: 'Sexta-feira' },
    { key: 'sab', label: 'Sábado' },
    { key: 'dom', label: 'Domingo' },
  ];

  return `
    <div class="admin-header-bar">
      <div>
        <h1 style="font-family: var(--font-heading); color: var(--gold);">⚙️ Configurações Gerais</h1>
        <p style="color: var(--gray-medium); font-size: 0.9rem;">Personalize dados do negócio, integração com Google Sheets e horários</p>
      </div>
    </div>

    <form id="form-settings">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl);">
        <!-- Column 1: Info & Integrations -->
        <div style="display: flex; flex-direction: column; gap: var(--space-xl);">
          <div style="background: var(--graphite); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid rgba(200,164,106,0.15);">
            <h3 style="margin-bottom: var(--space-lg); font-family: var(--font-heading); color: var(--gold);">💈 Dados da Barbearia</h3>
            
            <div class="form-group">
              <label class="form-label">Nome da Barbearia</label>
              <input type="text" id="cfg-shopName" class="form-input" value="${config.shopName || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label">WhatsApp (com DDI e DDD, apenas números)</label>
              <input type="text" id="cfg-whatsapp" class="form-input" value="${config.whatsapp || ''}" required placeholder="5511999999999" />
            </div>

            <div class="form-group">
              <label class="form-label">Telefone Fixo / Comercial</label>
              <input type="text" id="cfg-phone" class="form-input" value="${config.phone || ''}" placeholder="5511999999999" />
            </div>

            <div class="form-group">
              <label class="form-label">E-mail de Contato</label>
              <input type="email" id="cfg-email" class="form-input" value="${config.email || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Endereço Completo</label>
              <input type="text" id="cfg-address" class="form-input" value="${config.address || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Instagram URL</label>
              <input type="url" id="cfg-instagram" class="form-input" value="${config.instagram || ''}" placeholder="https://instagram.com/..." />
            </div>
          </div>

          <!-- Google Sheets Webhook -->
          <div style="background: var(--graphite); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid rgba(76,175,80,0.3);">
            <h3 style="margin-bottom: var(--space-md); font-family: var(--font-heading); color: #4CAF50;">📊 Integração Google Sheets</h3>
            <p style="color: var(--gray-light); font-size: 0.85rem; margin-bottom: var(--space-md);">
              URL do Webhook do Google Apps Script para sincronização automática de todos os novos agendamentos direto na planilha.
            </p>
            <div class="form-group">
              <label class="form-label">URL do Webhook (Apps Script)</label>
              <input type="url" id="cfg-sheetsUrl" class="form-input" value="${config.sheetsUrl || 'https://script.google.com/macros/s/AKfycbyLECb171-edlA7VRtFPZ81obWqu2ZGnhWIk7qZxliYlY647L9yE5JhfGjJzGY1F-TS/exec'}" placeholder="https://script.google.com/macros/s/.../exec" />
            </div>
            <button type="button" id="btn-test-sheets" class="btn btn-secondary btn-sm">🧪 Testar Envio para Planilha</button>
          </div>

          <!-- Admin Password -->
          <div style="background: var(--graphite); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid rgba(229,57,53,0.3);">
            <h3 style="margin-bottom: var(--space-md); font-family: var(--font-heading); color: var(--error);">🔒 Segurança do Painel</h3>
            <div class="form-group">
              <label class="form-label">Senha de Acesso do Administrador</label>
              <input type="password" id="cfg-adminPassword" class="form-input" value="${config.adminPassword || 'admin123'}" required />
            </div>
          </div>
        </div>

        <!-- Column 2: Working Hours -->
        <div style="background: var(--graphite); padding: var(--space-xl); border-radius: var(--radius-lg); border: 1px solid rgba(200,164,106,0.15);">
          <h3 style="margin-bottom: var(--space-lg); font-family: var(--font-heading); color: var(--gold);">⏰ Horários de Funcionamento</h3>
          
          <div class="form-group" style="margin-bottom: var(--space-xl);">
            <label class="form-label">Intervalo de tempo entre agendamentos</label>
            <select id="cfg-slotInterval" class="form-select" style="padding: 10px;">
              <option value="15" ${config.slotInterval === 15 ? 'selected' : ''}>15 minutos</option>
              <option value="30" ${config.slotInterval === 30 || !config.slotInterval ? 'selected' : ''}>30 minutos (Padrão)</option>
              <option value="45" ${config.slotInterval === 45 ? 'selected' : ''}>45 minutos</option>
              <option value="60" ${config.slotInterval === 60 ? 'selected' : ''}>60 minutos (1 hora)</option>
            </select>
          </div>

          <div style="display: flex; flex-direction: column; gap: var(--space-md);">
            ${days.map(d => {
              const dayCfg = config.openingHours?.[d.key] || { active: false, open: '09:00', close: '20:00' };
              return `
                <div style="padding: var(--space-md); background: rgba(0,0,0,0.2); border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.05);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <label style="font-weight: 600; font-size: 0.95rem;">${d.label}</label>
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.85rem;">
                      <input type="checkbox" id="day-active-${d.key}" ${dayCfg.active ? 'checked' : ''} />
                      Aberto
                    </label>
                  </div>
                  <div style="display: flex; gap: var(--space-md); align-items: center;">
                    <div style="flex: 1;">
                      <span style="font-size: 0.75rem; color: var(--gray-medium);">Abertura:</span>
                      <input type="time" id="day-open-${d.key}" class="form-input" style="padding: 6px 10px;" value="${dayCfg.open || '09:00'}" ${!dayCfg.active ? 'disabled' : ''} />
                    </div>
                    <div style="flex: 1;">
                      <span style="font-size: 0.75rem; color: var(--gray-medium);">Fechamento:</span>
                      <input type="time" id="day-close-${d.key}" class="form-input" style="padding: 6px 10px;" value="${dayCfg.close || '20:00'}" ${!dayCfg.active ? 'disabled' : ''} />
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <div style="margin-top: var(--space-xl); display: flex; justify-content: flex-end;">
        <button type="submit" class="btn btn-primary btn-lg" style="min-width: 250px;">💾 Salvar Todas as Configurações</button>
      </div>
    </form>
  `;
}

// Helpers
function renderStatusBadge(status) {
  switch (status) {
    case 'confirmed':
      return '<span class="badge badge-info">Confirmado</span>';
    case 'completed':
      return '<span class="badge badge-success">Concluído</span>';
    case 'cancelled':
      return '<span class="badge badge-danger">Cancelado</span>';
    default:
      return `<span class="badge badge-info">${status || 'Pendente'}</span>`;
  }
}

// Event handlers
export function initAdmin() {
  initHeader();

  // Mobile sidebar toggle
  const sidebarToggle = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      store.logout();
      showToast('Sessão encerrada com sucesso.', 'info');
      window.location.hash = '#/admin/login';
    });
  }

  // Action buttons for appointments
  document.querySelectorAll('.btn-action').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'status') {
        const status = btn.getAttribute('data-status');
        store.updateAppointmentStatus(id, status);
        showToast(`Status atualizado para: ${status}!`, 'success');
        refreshAdminView();
      } else if (action === 'delete-appt') {
        if (confirm('Tem certeza que deseja excluir permanentemente este agendamento?')) {
          const appts = store.getAppointments().filter(a => a.id !== id);
          store._set('hc_appointments', appts);
          showToast('Agendamento excluído!', 'info');
          refreshAdminView();
        }
      }
    });
  });

  // Filter handlers
  const searchInput = document.getElementById('admin-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      refreshAdminView();
    });
  }

  const statusSelect = document.getElementById('admin-status-filter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      statusFilter = e.target.value;
      refreshAdminView();
    });
  }

  const dateInput = document.getElementById('admin-date-filter');
  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      dateFilter = e.target.value;
      refreshAdminView();
    });
  }

  const clearBtn = document.getElementById('btn-clear-filters');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      searchQuery = '';
      statusFilter = 'all';
      dateFilter = '';
      refreshAdminView();
    });
  }

  // Export CSV
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportAppointmentsCSV);
  }

  // Service toggle & edit & add
  document.querySelectorAll('.btn-toggle-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const svc = store.getServiceById(id);
      if (svc) {
        svc.active = !svc.active;
        store.saveService(svc);
        showToast(`Serviço ${svc.name} ${svc.active ? 'ativado' : 'desativado'}!`, 'info');
        refreshAdminView();
      }
    });
  });

  document.querySelectorAll('.btn-edit-service').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      openServiceModal(store.getServiceById(id));
    });
  });

  const addServiceBtn = document.getElementById('btn-add-service');
  if (addServiceBtn) {
    addServiceBtn.addEventListener('click', () => openServiceModal(null));
  }

  // Barber toggle & edit & add
  document.querySelectorAll('.btn-toggle-barber').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      const barber = store.getBarberById(id);
      if (barber) {
        barber.active = !barber.active;
        store.saveBarber(barber);
        showToast(`Barbeiro ${barber.name} ${barber.active ? 'ativado' : 'desativado'}!`, 'info');
        refreshAdminView();
      }
    });
  });

  document.querySelectorAll('.btn-edit-barber').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      openBarberModal(store.getBarberById(id));
    });
  });

  const addBarberBtn = document.getElementById('btn-add-barber');
  if (addBarberBtn) {
    addBarberBtn.addEventListener('click', () => openBarberModal(null));
  }

  // Block date form
  const blockForm = document.getElementById('form-block-date');
  if (blockForm) {
    blockForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = document.getElementById('block-date-input').value;
      const reason = document.getElementById('block-reason-input').value;
      if (date && reason) {
        store.addBlockedDate(date, reason);
        showToast('Data bloqueada com sucesso!', 'success');
        refreshAdminView();
      }
    });
  }

  // Remove block date
  document.querySelectorAll('.btn-remove-block').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'));
      store.removeBlockedDate(id);
      showToast('Bloqueio removido!', 'info');
      refreshAdminView();
    });
  });

  // Settings form
  const settingsForm = document.getElementById('form-settings');
  if (settingsForm) {
    // Checkbox toggling time input state
    ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].forEach(day => {
      const chk = document.getElementById(`day-active-${day}`);
      const openInp = document.getElementById(`day-open-${day}`);
      const closeInp = document.getElementById(`day-close-${day}`);
      if (chk && openInp && closeInp) {
        chk.addEventListener('change', () => {
          openInp.disabled = !chk.checked;
          closeInp.disabled = !chk.checked;
        });
      }
    });

    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const openingHours = {};
      ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'].forEach(day => {
        openingHours[day] = {
          active: document.getElementById(`day-active-${day}`).checked,
          open: document.getElementById(`day-open-${day}`).value,
          close: document.getElementById(`day-close-${day}`).value,
        };
      });

      const updated = {
        shopName: document.getElementById('cfg-shopName').value,
        whatsapp: document.getElementById('cfg-whatsapp').value,
        phone: document.getElementById('cfg-phone').value,
        email: document.getElementById('cfg-email').value,
        address: document.getElementById('cfg-address').value,
        instagram: document.getElementById('cfg-instagram').value,
        sheetsUrl: document.getElementById('cfg-sheetsUrl').value,
        adminPassword: document.getElementById('cfg-adminPassword').value,
        slotInterval: parseInt(document.getElementById('cfg-slotInterval').value),
        openingHours,
      };

      store.saveConfig(updated);
      showToast('Configurações salvas com sucesso!', 'success');
      refreshAdminView();
    });
  }

  // Test Google Sheets integration
  const testSheetsBtn = document.getElementById('btn-test-sheets');
  if (testSheetsBtn) {
    testSheetsBtn.addEventListener('click', async () => {
      showToast('Enviando agendamento de teste para a planilha...', 'info');
      const testResult = await sendToGoogleSheets({
        nome: 'Teste Sistema Admin',
        barbeiro: 'Rafael Silva',
        servico: 'Corte Degradê',
        dataCorte: new Date().toISOString().split('T')[0],
        horario: '10:00',
      });

      if (testResult.success) {
        showToast('✅ Teste enviado com sucesso para o Google Sheets!', 'success');
      } else {
        showToast('⚠️ Erro ao conectar com Google Sheets: ' + testResult.error, 'error');
      }
    });
  }
}

function refreshAdminView() {
  const main = document.querySelector('.admin-main');
  if (main) {
    main.innerHTML = renderTabContent();
    initAdmin();
  }
}

// Modal functions
function openServiceModal(service = null) {
  const modalContainer = document.getElementById('admin-modal-container');
  if (!modalContainer) return;

  const isEdit = !!service;
  modalContainer.innerHTML = `
    <div class="modal-overlay" id="service-modal">
      <div class="modal-content" style="max-width: 500px; background: var(--graphite); border: 1px solid rgba(200,164,106,0.2); border-radius: var(--radius-lg); padding: var(--space-xl); position: relative;">
        <button id="modal-close" style="position: absolute; top: 16px; right: 16px; font-size: 1.2rem; color: var(--gray-medium);">✕</button>
        <h2 style="font-family: var(--font-heading); margin-bottom: var(--space-lg); color: var(--gold);">${isEdit ? 'Editar Serviço' : 'Novo Serviço'}</h2>
        
        <form id="form-service-modal">
          <div class="form-group">
            <label class="form-label">Nome do Serviço</label>
            <input type="text" id="modal-svc-name" class="form-input" value="${service?.name || ''}" required placeholder="Ex: Corte Degradê" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
            <div class="form-group">
              <label class="form-label">Preço (R$)</label>
              <input type="number" step="0.50" id="modal-svc-price" class="form-input" value="${service?.price || ''}" required placeholder="45.00" />
            </div>
            <div class="form-group">
              <label class="form-label">Duração (minutos)</label>
              <input type="number" id="modal-svc-duration" class="form-input" value="${service?.duration || '30'}" required placeholder="30" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Ícone / Emoji</label>
            <input type="text" id="modal-svc-icon" class="form-input" value="${service?.icon || '✂️'}" placeholder="✂️, 💈, 🪒, 👑..." />
          </div>

          <div class="form-group">
            <label class="form-label">Descrição detalhada</label>
            <textarea id="modal-svc-desc" class="form-textarea" rows="3" placeholder="Descreva os detalhes deste serviço...">${service?.description || ''}</textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-lg);">
            <button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Salvar Alterações' : 'Criar Serviço'}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('modal-close').onclick = () => modalContainer.innerHTML = '';
  document.getElementById('modal-cancel').onclick = () => modalContainer.innerHTML = '';

  document.getElementById('form-service-modal').onsubmit = (e) => {
    e.preventDefault();
    const newService = {
      id: service?.id || undefined,
      name: document.getElementById('modal-svc-name').value,
      price: parseFloat(document.getElementById('modal-svc-price').value),
      duration: parseInt(document.getElementById('modal-svc-duration').value),
      icon: document.getElementById('modal-svc-icon').value || '✂️',
      description: document.getElementById('modal-svc-desc').value,
      active: service ? service.active : true,
    };

    store.saveService(newService);
    showToast(isEdit ? 'Serviço atualizado com sucesso!' : 'Novo serviço adicionado!', 'success');
    modalContainer.innerHTML = '';
    refreshAdminView();
  };
}

function openBarberModal(barber = null) {
  const modalContainer = document.getElementById('admin-modal-container');
  if (!modalContainer) return;

  const isEdit = !!barber;
  modalContainer.innerHTML = `
    <div class="modal-overlay" id="barber-modal">
      <div class="modal-content" style="max-width: 500px; background: var(--graphite); border: 1px solid rgba(200,164,106,0.2); border-radius: var(--radius-lg); padding: var(--space-xl); position: relative;">
        <button id="modal-close" style="position: absolute; top: 16px; right: 16px; font-size: 1.2rem; color: var(--gray-medium);">✕</button>
        <h2 style="font-family: var(--font-heading); margin-bottom: var(--space-lg); color: var(--gold);">${isEdit ? 'Editar Profissional' : 'Novo Profissional'}</h2>
        
        <form id="form-barber-modal">
          <div class="form-group">
            <label class="form-label">Nome Completo</label>
            <input type="text" id="modal-barber-name" class="form-input" value="${barber?.name || ''}" required placeholder="Ex: Lucas Mendes" />
          </div>

          <div class="form-group">
            <label class="form-label">Especialidades</label>
            <input type="text" id="modal-barber-spec" class="form-input" value="${barber?.specialty || ''}" required placeholder="Ex: Cortes Modernos & Barba" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
            <div class="form-group">
              <label class="form-label">Avaliação Inicial</label>
              <input type="number" step="0.1" min="1" max="5" id="modal-barber-rating" class="form-input" value="${barber?.rating || '5.0'}" required />
            </div>
            <div class="form-group">
              <label class="form-label">URL da Foto</label>
              <input type="text" id="modal-barber-image" class="form-input" value="${barber?.image || '/images/barber1.jpg'}" placeholder="/images/barber1.jpg" />
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: var(--space-md); margin-top: var(--space-lg);">
            <button type="button" class="btn btn-secondary" id="modal-cancel">Cancelar</button>
            <button type="submit" class="btn btn-primary">${isEdit ? 'Salvar Alterações' : 'Cadastrar Profissional'}</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.getElementById('modal-close').onclick = () => modalContainer.innerHTML = '';
  document.getElementById('modal-cancel').onclick = () => modalContainer.innerHTML = '';

  document.getElementById('form-barber-modal').onsubmit = (e) => {
    e.preventDefault();
    const newBarber = {
      id: barber?.id || undefined,
      name: document.getElementById('modal-barber-name').value,
      specialty: document.getElementById('modal-barber-spec').value,
      rating: parseFloat(document.getElementById('modal-barber-rating').value),
      image: document.getElementById('modal-barber-image').value || '/images/barber1.jpg',
      active: barber ? barber.active : true,
    };

    store.saveBarber(newBarber);
    showToast(isEdit ? 'Barbeiro atualizado com sucesso!' : 'Novo barbeiro cadastrado!', 'success');
    modalContainer.innerHTML = '';
    refreshAdminView();
  };
}

function exportAppointmentsCSV() {
  const appointments = store.getAppointments();
  if (appointments.length === 0) {
    showToast('Não há agendamentos para exportar.', 'warning');
    return;
  }

  const headers = ['Código', 'Data', 'Horário', 'Cliente', 'Telefone', 'Serviço', 'Barbeiro', 'Status', 'Criado Em'];
  const rows = appointments.map(a => [
    `"${a.id || ''}"`,
    `"${a.dataCorte || ''}"`,
    `"${a.horario || ''}"`,
    `"${a.nome || ''}"`,
    `"${a.telefone || ''}"`,
    `"${a.servico || ''}"`,
    `"${a.barbeiro || ''}"`,
    `"${a.status || ''}"`,
    `"${a.createdAt || ''}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(';'), ...rows.map(e => e.join(';'))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `agendamentos_barbearia_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Planilha CSV gerada com sucesso!', 'success');
}
