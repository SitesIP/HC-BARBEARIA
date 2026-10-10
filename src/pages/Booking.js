// ===== H&C Barbearia - Mobile-First 5-Step Booking Wizard =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import {
  formatCurrency, formatDateDMY, formatDateShort, getWeekdayName, generateCode,
  sendToGoogleSheets, fetchGoogleSheetsAppointments, getCalendarUrl, getWhatsAppUrl,
  phoneMask, isValidPhone, showToast, MONTHS, WEEKDAYS
} from '../utils/helpers.js';

let bookingState = {
  step: 1, // 1: Serviço, 2: Barbeiro, 3: Data & Horário, 4: Seus Dados, 5: Confirmação
  serviceCategory: 'todos',
  selectedServices: [],
  selectedBarber: null,
  selectedDate: null,
  selectedTime: null,
  clientName: '',
  clientPhone: '',
  calendarMonth: new Date().getMonth(),
  calendarYear: new Date().getFullYear(),
  remoteAppointments: [],
  loadingSlots: false,
  isSubmitting: false,
  confirmationCode: '',
};

export function preselectService(serviceId) {
  if (serviceId && !bookingState.selectedServices.includes(serviceId)) {
    bookingState.selectedServices = [serviceId];
  }
}

export function preselectBarber(barberId) {
  if (barberId) {
    bookingState.selectedBarber = barberId;
  }
}

export function resetBooking() {
  bookingState = {
    step: 1,
    serviceCategory: 'todos',
    selectedServices: [],
    selectedBarber: null,
    selectedDate: null,
    selectedTime: null,
    clientName: '',
    clientPhone: '',
    calendarMonth: new Date().getMonth(),
    calendarYear: new Date().getFullYear(),
    remoteAppointments: [],
    loadingSlots: false,
    isSubmitting: false,
    confirmationCode: '',
  };
}

export function renderBooking() {
  return `
    ${renderHeader()}

    <main class="main-content booking-main-wrap" id="main-content">
      <div class="booking-page" id="booking-page">
        <div class="container booking-container">
          ${renderStepProgressBar()}
          
          <div class="booking-wizard-card" id="booking-wizard-card">
            ${renderStepContent()}
          </div>
        </div>
      </div>

      ${renderStickySummaryBar()}
    </main>
  `;
}

// 5-Step Compact Progress Bar
function renderStepProgressBar() {
  const steps = [
    { num: 1, label: 'Serviço' },
    { num: 2, label: 'Barbeiro' },
    { num: 3, label: 'Data & Hora' },
    { num: 4, label: 'Identificação' },
    { num: 5, label: 'Confirmação' },
  ];

  return `
    <div class="wizard-stepper" id="wizard-stepper" aria-label="Progresso do Agendamento">
      ${steps.map((s, i) => {
        const isCurrent = bookingState.step === s.num;
        const isCompleted = bookingState.step > s.num;
        return `
          <div class="stepper-item ${isCurrent ? 'active' : ''} ${isCompleted ? 'completed' : ''}">
            <div class="stepper-bubble">
              ${isCompleted ? '✓' : s.num}
            </div>
            <span class="stepper-text">${s.label}</span>
          </div>
          ${i < steps.length - 1 ? `<div class="stepper-line ${isCompleted ? 'completed' : ''}"></div>` : ''}
        `;
      }).join('')}
    </div>
  `;
}

function renderStepContent() {
  switch (bookingState.step) {
    case 1: return renderStep1Services();
    case 2: return renderStep2Barbers();
    case 3: return renderStep3DateTime();
    case 4: return renderStep4Client();
    case 5: return renderStep5Confirmation();
    default: return renderStep1Services();
  }
}

// ==========================================
// PASSO 1: ESCOLHA DO SERVIÇO
// ==========================================
function renderStep1Services() {
  const allServices = store.getServices();
  const categories = [
    { id: 'todos', label: 'Todos' },
    { id: 'cabelo', label: 'Cabelo' },
    { id: 'barba', label: 'Barba' },
    { id: 'combos', label: 'Combos' },
    { id: 'outros', label: 'Outros' },
  ];

  const filtered = bookingState.serviceCategory === 'todos'
    ? allServices
    : allServices.filter(s => (s.category || 'cabelo') === bookingState.serviceCategory);

  const total = bookingState.selectedServices.reduce((sum, id) => {
    const s = allServices.find(item => item.id === id);
    return sum + (s ? s.price : 0);
  }, 0);

  return `
    <div class="wizard-header">
      <div class="step-badge">Passo 1 de 4</div>
      <h2 class="wizard-title">Escolha o Serviço</h2>
      <p class="wizard-desc">Selecione um ou mais serviços que deseja realizar hoje.</p>
    </div>

    <!-- Category Tabs Filter -->
    <div class="wizard-category-pills">
      ${categories.map(cat => `
        <button class="wizard-pill-btn ${bookingState.serviceCategory === cat.id ? 'active' : ''}"
                data-wizard-cat="${cat.id}">
          ${cat.label}
        </button>
      `).join('')}
    </div>

    <!-- Services Compact Selection List -->
    <div class="wizard-services-grid" id="wizard-services-list">
      ${filtered.map(svc => {
        const isSelected = bookingState.selectedServices.includes(svc.id);
        return `
          <div class="wizard-service-card ${isSelected ? 'selected' : ''}"
               data-service-id="${svc.id}"
               role="checkbox"
               aria-checked="${isSelected}">
            <div class="wizard-svc-check">
              <span class="check-box ${isSelected ? 'checked' : ''}">${isSelected ? '✓' : ''}</span>
            </div>
            <div class="wizard-svc-info">
              <div class="wizard-svc-name-row">
                <span class="wizard-svc-name">${svc.name}</span>
                ${svc.category === 'combos' ? '<span class="mini-combo-badge">Combo</span>' : ''}
              </div>
              <p class="wizard-svc-desc">${svc.description}</p>
              <span class="wizard-svc-duration">⏱️ ~${svc.duration} min</span>
            </div>
            <div class="wizard-svc-price">
              ${formatCurrency(svc.price)}
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Step 1 Desktop Actions -->
    <div class="wizard-desktop-actions">
      <div class="selected-count-badge">
        ${bookingState.selectedServices.length === 0 
          ? 'Nenhum serviço selecionado' 
          : `${bookingState.selectedServices.length} serviço(s) • Total: <strong>${formatCurrency(total)}</strong>`}
      </div>
      <button class="btn btn-primary btn-lg" id="btn-step1-next" ${bookingState.selectedServices.length === 0 ? 'disabled' : ''}>
        Próximo: Escolher Barbeiro →
      </button>
    </div>
  `;
}

// ==========================================
// PASSO 2: ESCOLHA DO BARBEIRO
// ==========================================
function renderStep2Barbers() {
  const barbers = store.getBarbers();

  return `
    <div class="wizard-header">
      <div class="step-badge">Passo 2 de 4</div>
      <h2 class="wizard-title">Escolha o Barbeiro</h2>
      <p class="wizard-desc">Selecione o profissional para o seu atendimento.</p>
    </div>

    <div class="wizard-barbers-grid" id="wizard-barber-list">
      ${barbers.map((barber, i) => {
        const isSelected = bookingState.selectedBarber === barber.id;
        return `
          <div class="wizard-barber-card ${isSelected ? 'selected' : ''}"
               data-barber-id="${barber.id}"
               role="radio"
               aria-checked="${isSelected}">
            <div class="barber-card-radio">
              <span class="radio-circle ${isSelected ? 'checked' : ''}"></span>
            </div>
            <div class="barber-avatar-box">
              <span class="barber-avatar-emoji">💈</span>
            </div>
            <div class="barber-details-box">
              <h3 class="barber-card-name">${barber.name}</h3>
              <p class="barber-card-spec">${barber.specialty}</p>
              <span class="barber-sheet-tag">Agendamento em tempo real</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <!-- Step 2 Desktop Actions -->
    <div class="wizard-desktop-actions">
      <button class="btn btn-secondary btn-lg" id="btn-step2-prev">
        ← Voltar
      </button>
      <button class="btn btn-primary btn-lg" id="btn-step2-next" ${!bookingState.selectedBarber ? 'disabled' : ''}>
        Próximo: Data & Horário →
      </button>
    </div>
  `;
}

// ==========================================
// PASSO 3: DATA E HORÁRIO
// ==========================================
function renderStep3DateTime() {
  const { calendarMonth, calendarYear } = bookingState;
  const today = new Date();
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startDay = firstDay.getDay();

  const config = store.getConfig();
  const dayKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const barber = store.getBarberById(bookingState.selectedBarber) || store.getBarbers()[0];

  let daysHtml = '';
  for (let i = 0; i < startDay; i++) {
    daysHtml += '<div class="cal-cell empty"></div>';
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const dateObj = new Date(calendarYear, calendarMonth, d);
    const dayOfWeek = dateObj.getDay();
    const dayConfig = config.openingHours?.[dayKeys[dayOfWeek]];

    const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    maxDate.setDate(maxDate.getDate() + 14);
    const isTooFar = dateObj > maxDate;

    // Friday and Saturday are arrival only in this template
    const isArrivalOnly = dayKeys[dayOfWeek] === 'sex' || dayKeys[dayOfWeek] === 'sab';
    const isClosed = !dayConfig || !dayConfig.active || isArrivalOnly;
    const isBlocked = store.isDateBlocked(dateStr);
    const isDisabled = isPast || isTooFar || isClosed || isBlocked;

    const localTodayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const isToday = dateStr === localTodayStr;
    const isSelected = bookingState.selectedDate === dateStr;

    daysHtml += `
      <button class="cal-cell ${isDisabled ? 'disabled' : 'available'} ${isToday ? 'is-today' : ''} ${isSelected ? 'selected' : ''}"
              ${!isDisabled ? `data-date="${dateStr}"` : 'disabled'}
              aria-label="${d} de ${MONTHS[calendarMonth]} ${calendarYear}">
        <span class="cal-num">${d}</span>
        ${isToday ? '<span class="today-dot"></span>' : ''}
      </button>
    `;
  }

  // Calculate available time slots if a date is selected
  let timeSlotsHtml = '';
  if (bookingState.selectedDate) {
    if (bookingState.loadingSlots) {
      timeSlotsHtml = `
        <div class="slots-loading-box">
          <span class="spinner"></span>
          <p>Consultando disponibilidade com ${barber?.name}...</p>
        </div>
      `;
    } else {
      const baseSlots = store.getAvailableSlots(barber?.id, bookingState.selectedDate);
      const selectedDateFormatted = formatDateDMY(bookingState.selectedDate);

      const slots = baseSlots.map(slot => {
        let available = slot.available;
        if (available && bookingState.remoteAppointments.length > 0) {
          const isBookedInSheet = bookingState.remoteAppointments.some(appt => {
            const matchDate = (appt.data === selectedDateFormatted) || (appt.data === bookingState.selectedDate);
            const matchTime = (appt.horario === slot.time) || (appt.horario?.replace(':00', '') === slot.time);
            return matchDate && matchTime;
          });
          if (isBookedInSheet) available = false;
        }
        return { ...slot, available };
      });

      if (slots.length > 0) {
        timeSlotsHtml = `
          <div class="time-slots-header">
            <h4>Horários para ${formatDateShort(bookingState.selectedDate)} (${getWeekdayName(bookingState.selectedDate)})</h4>
            <span class="slots-hint">Toque para selecionar</span>
          </div>
          <div class="slots-grid-3col" id="time-slots-container">
            ${slots.map(slot => {
              const isSelected = bookingState.selectedTime === slot.time;
              return `
                <button class="time-slot-btn ${slot.available ? 'available' : 'booked'} ${isSelected ? 'selected' : ''}"
                        ${slot.available ? `data-time="${slot.time}"` : 'disabled'}
                        aria-pressed="${isSelected}">
                  <span class="slot-time-text">${slot.time}</span>
                  <span class="slot-status-text">${slot.available ? 'Livre' : 'Ocupado'}</span>
                </button>
              `;
            }).join('')}
          </div>
        `;
      } else {
        timeSlotsHtml = `
          <div class="no-slots-box">
            <span>😔</span>
            <h4>Sem horários livres nesta data</h4>
            <p>Por favor, selecione outro dia no calendário.</p>
          </div>
        `;
      }
    }
  }

  return `
    <div class="wizard-header">
      <div class="step-badge">Passo 3 de 4</div>
      <h2 class="wizard-title">Escolha a Data & Horário</h2>
      <p class="wizard-desc">Atendimento com <strong>${barber?.name}</strong>.</p>
      <div class="calendar-alert-notice">
        <span>ℹ️</span> Sexta e Sábado o atendimento é <strong>exclusivo por ordem de chegada</strong>.
      </div>
    </div>

    <!-- Calendar Card -->
    <div class="clean-calendar-box">
      <div class="cal-nav-row">
        <button class="cal-arrow-btn" id="cal-prev" aria-label="Mês anterior">◀</button>
        <span class="cal-month-title">${MONTHS[calendarMonth]} de ${calendarYear}</span>
        <button class="cal-arrow-btn" id="cal-next" aria-label="Próximo mês">▶</button>
      </div>

      <div class="cal-weekdays-grid">
        ${WEEKDAYS.map(w => `<span class="cal-weekday-label">${w}</span>`).join('')}
      </div>

      <div class="cal-days-grid" id="cal-days-grid">
        ${daysHtml}
      </div>
    </div>

    <!-- Time Slots Section -->
    <div class="time-selection-wrapper" id="time-selection-area">
      ${bookingState.selectedDate ? timeSlotsHtml : `
        <div class="pick-date-prompt">
          <span class="pick-date-icon">📅</span>
          <p>Selecione um dia no calendário acima para visualizar os horários disponíveis.</p>
        </div>
      `}
    </div>

    <!-- Step 3 Desktop Actions -->
    <div class="wizard-desktop-actions">
      <button class="btn btn-secondary btn-lg" id="btn-step3-prev">
        ← Voltar
      </button>
      <button class="btn btn-primary btn-lg" id="btn-step3-next" ${!bookingState.selectedDate || !bookingState.selectedTime ? 'disabled' : ''}>
        Próximo: Identificação →
      </button>
    </div>
  `;
}

// ==========================================
// PASSO 4: IDENTIFICAÇÃO DO CLIENTE
// ==========================================
function renderStep4Client() {
  const services = store.getServices();
  const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
  const barber = store.getBarberById(bookingState.selectedBarber) || store.getBarbers()[0];
  const total = selectedSvcs.reduce((sum, s) => sum + s.price, 0);

  return `
    <div class="wizard-header">
      <div class="step-badge">Passo 4 de 4</div>
      <h2 class="wizard-title">Seus Dados de Contato</h2>
      <p class="wizard-desc">Informe seu nome e WhatsApp para gravarmos o seu horário.</p>
    </div>

    <div class="wizard-form-container">
      <div class="form-group-accessible">
        <label for="client-name" class="accessible-label">
          <span>👤 Nome Completo *</span>
        </label>
        <input type="text"
               class="accessible-input"
               id="client-name"
               placeholder="Ex: João da Silva"
               value="${bookingState.clientName}"
               autocomplete="name"
               required />
        <span class="field-error-msg" id="name-error" style="display: none;">Por favor, digite seu nome completo.</span>
      </div>

      <div class="form-group-accessible">
        <label for="client-phone" class="accessible-label">
          <span>📱 WhatsApp com DDD *</span>
        </label>
        <input type="tel"
               class="accessible-input"
               id="client-phone"
               placeholder="(11) 99999-9999"
               value="${bookingState.clientPhone}"
               autocomplete="tel"
               required />
        <span class="field-error-msg" id="phone-error" style="display: none;">Informe um número válido com DDD.</span>
      </div>

      <!-- Quick Summary Card before confirmation -->
      <div class="pre-confirm-summary">
        <div class="summary-header">
          <span>📋 Resumo do Agendamento</span>
          <span class="summary-total-tag">${formatCurrency(total)}</span>
        </div>
        <div class="summary-grid">
          <div class="sum-item">
            <span class="sum-label">Serviço:</span>
            <span class="sum-val">${selectedSvcs.map(s => s.name).join(', ')}</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">Barbeiro:</span>
            <span class="sum-val">${barber?.name}</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">Data:</span>
            <span class="sum-val">${formatDateDMY(bookingState.selectedDate)} (${getWeekdayName(bookingState.selectedDate)})</span>
          </div>
          <div class="sum-item">
            <span class="sum-label">Horário:</span>
            <span class="sum-val">${bookingState.selectedTime}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 4 Desktop Actions -->
    <div class="wizard-desktop-actions">
      <button class="btn btn-secondary btn-lg" id="btn-step4-prev">
        ← Voltar
      </button>
      <button class="btn btn-primary btn-lg" id="btn-step4-confirm" ${bookingState.isSubmitting ? 'disabled' : ''}>
        ${bookingState.isSubmitting ? '<span class="spinner"></span> Gravando...' : 'Confirmar e Enviar para o WhatsApp →'}
      </button>
    </div>
  `;
}

// ==========================================
// PASSO 5: CONFIRMAÇÃO E ENVIO AO WHATSAPP
// ==========================================
function renderStep5Confirmation() {
  const barbers = store.getBarbers();
  const services = store.getServices();
  const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
  const barber = barbers.find(b => b.id === bookingState.selectedBarber) || barbers[0];
  const totalDuration = selectedSvcs.reduce((sum, s) => sum + s.duration, 0);
  const total = selectedSvcs.reduce((sum, s) => sum + s.price, 0);

  const data = {
    shopName: store.getConfig().shopName || 'H&C Barbearia',
    nome: bookingState.clientName,
    barbeiro: barber?.name || 'Barbeiro 1',
    aba: barber?.sheetTab || 'Barbeiro 1',
    telefone: bookingState.clientPhone,
    numero: bookingState.clientPhone,
    servico: selectedSvcs.map(s => s.name).join(', '),
    dataCorte: bookingState.selectedDate,
    dataFormatted: formatDateDMY(bookingState.selectedDate),
    diaSemana: getWeekdayName(bookingState.selectedDate),
    horario: bookingState.selectedTime,
    duration: totalDuration,
    code: bookingState.confirmationCode || '',
  };

  const whatsappUrl = getWhatsAppUrl(data, store.getConfig().whatsapp);
  const calendarUrl = getCalendarUrl(data);

  return `
    <div class="confirmation-success-card">
      <div class="success-icon-circle">✓</div>
      <h2 class="success-title">Agendamento Realizado!</h2>
      <p class="success-sub">Seu horário foi reservado e gravado no sistema.</p>

      <div class="voucher-card">
        <div class="voucher-header">
          <span>H&C BARBEARIA</span>
          <span class="voucher-code">Cód: ${data.code}</span>
        </div>
        <div class="voucher-body">
          <div class="voucher-row">
            <span class="v-label">Cliente:</span>
            <strong class="v-val">${data.nome}</strong>
          </div>
          <div class="voucher-row">
            <span class="v-label">Serviço:</span>
            <strong class="v-val">${data.servico}</strong>
          </div>
          <div class="voucher-row">
            <span class="v-label">Barbeiro:</span>
            <strong class="v-val">${data.barbeiro}</strong>
          </div>
          <div class="voucher-row">
            <span class="v-label">Data & Hora:</span>
            <strong class="v-val">${data.dataFormatted} às ${data.horario}</strong>
          </div>
          <div class="voucher-row total">
            <span class="v-label">Total a pagar no local:</span>
            <strong class="v-total">${formatCurrency(total)}</strong>
          </div>
        </div>
      </div>

      <div class="confirmation-action-buttons">
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp btn-block btn-lg" id="btn-whatsapp-confirm">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          <span>Confirmar no WhatsApp do Barbeiro</span>
        </a>

        <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block">
          <span>📅 Adicionar ao Google Agenda</span>
        </a>

        <a href="#/" class="btn btn-secondary btn-block" style="margin-top: 8px;">
          <span>🏠 Voltar ao Início</span>
        </a>
      </div>
    </div>
  `;
}

// ==========================================
// BARRA FLUTUANTE DE RESUMO (STICKY BAR MOBILE)
// ==========================================
function renderStickySummaryBar() {
  if (bookingState.step === 5) return ''; // No sticky bar on confirmation

  const services = store.getServices();
  const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
  const total = selectedSvcs.reduce((sum, s) => sum + s.price, 0);

  let nextBtnText = 'Avançar →';
  let canAdvance = false;

  if (bookingState.step === 1) {
    nextBtnText = 'Escolher Barbeiro →';
    canAdvance = bookingState.selectedServices.length > 0;
  } else if (bookingState.step === 2) {
    nextBtnText = 'Escolher Data →';
    canAdvance = !!bookingState.selectedBarber;
  } else if (bookingState.step === 3) {
    nextBtnText = 'Seus Dados →';
    canAdvance = !!bookingState.selectedDate && !!bookingState.selectedTime;
  } else if (bookingState.step === 4) {
    nextBtnText = bookingState.isSubmitting ? 'Gravando...' : 'Confirmar Reserva';
    canAdvance = !bookingState.isSubmitting;
  }

  return `
    <div class="booking-sticky-bar" id="booking-sticky-bar">
      <div class="sticky-bar-inner">
        <div class="sticky-bar-info">
          <span class="sticky-label">Total (${bookingState.selectedServices.length} item)</span>
          <span class="sticky-price">${formatCurrency(total)}</span>
        </div>
        <button class="btn btn-primary btn-lg sticky-next-btn" id="btn-sticky-next" ${!canAdvance ? 'disabled' : ''}>
          ${nextBtnText}
        </button>
      </div>
    </div>
  `;
}

// ==========================================
// EVENT HANDLERS & STEP CONTROLLER
// ==========================================
export function initBooking() {
  initHeader();
  bindWizardEvents();
}

function updateWizardDOM() {
  const stepper = document.getElementById('wizard-stepper');
  const card = document.getElementById('booking-wizard-card');
  const stickyBar = document.getElementById('booking-sticky-bar');

  if (stepper) stepper.outerHTML = renderStepProgressBar();
  if (card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(6px)';
    setTimeout(() => {
      card.innerHTML = renderStepContent();
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      bindWizardEvents();
    }, 120);
  }

  if (stickyBar) {
    stickyBar.outerHTML = renderStickySummaryBar();
    document.getElementById('btn-sticky-next')?.addEventListener('click', handleNextAction);
  }
}

function bindWizardEvents() {
  switch (bookingState.step) {
    case 1: bindStep1Events(); break;
    case 2: bindStep2Events(); break;
    case 3: bindStep3Events(); break;
    case 4: bindStep4Events(); break;
    case 5: break;
  }

  // Desktop action buttons
  document.getElementById('btn-step1-next')?.addEventListener('click', handleNextAction);
  document.getElementById('btn-step2-next')?.addEventListener('click', handleNextAction);
  document.getElementById('btn-step3-next')?.addEventListener('click', handleNextAction);
  document.getElementById('btn-step4-confirm')?.addEventListener('click', handleNextAction);

  document.getElementById('btn-step2-prev')?.addEventListener('click', () => {
    bookingState.step = 1;
    updateWizardDOM();
  });
  document.getElementById('btn-step3-prev')?.addEventListener('click', () => {
    bookingState.step = 2;
    updateWizardDOM();
  });
  document.getElementById('btn-step4-prev')?.addEventListener('click', () => {
    bookingState.step = 3;
    updateWizardDOM();
  });

  // Mobile Sticky bar trigger
  document.getElementById('btn-sticky-next')?.addEventListener('click', handleNextAction);
}

function handleNextAction() {
  if (bookingState.step === 1) {
    if (bookingState.selectedServices.length > 0) {
      bookingState.step = 2;
      updateWizardDOM();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (bookingState.step === 2) {
    if (bookingState.selectedBarber) {
      bookingState.step = 3;
      updateWizardDOM();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (bookingState.selectedDate) {
        syncRemoteSlots();
      }
    }
  } else if (bookingState.step === 3) {
    if (bookingState.selectedDate && bookingState.selectedTime) {
      bookingState.step = 4;
      updateWizardDOM();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  } else if (bookingState.step === 4) {
    submitBooking();
  }
}

// Step 1 events
function bindStep1Events() {
  document.querySelectorAll('.wizard-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      bookingState.serviceCategory = btn.dataset.wizardCat;
      updateWizardDOM();
    });
  });

  document.querySelectorAll('.wizard-service-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.serviceId);
      const idx = bookingState.selectedServices.indexOf(id);
      if (idx >= 0) {
        bookingState.selectedServices.splice(idx, 1);
      } else {
        bookingState.selectedServices.push(id);
      }
      updateWizardDOM();
    });
  });
}

// Step 2 events
function bindStep2Events() {
  document.querySelectorAll('.wizard-barber-card').forEach(card => {
    card.addEventListener('click', () => {
      bookingState.selectedBarber = parseInt(card.dataset.barberId);
      updateWizardDOM();
    });
  });
}

// Step 3 events
function bindStep3Events() {
  document.querySelectorAll('.cal-cell.available').forEach(cell => {
    cell.addEventListener('click', () => {
      bookingState.selectedDate = cell.dataset.date;
      bookingState.selectedTime = null;
      updateWizardDOM();
      syncRemoteSlots();
    });
  });

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    bookingState.calendarMonth--;
    if (bookingState.calendarMonth < 0) {
      bookingState.calendarMonth = 11;
      bookingState.calendarYear--;
    }
    updateWizardDOM();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    bookingState.calendarMonth++;
    if (bookingState.calendarMonth > 11) {
      bookingState.calendarMonth = 0;
      bookingState.calendarYear++;
    }
    updateWizardDOM();
  });

  document.querySelectorAll('.time-slot-btn.available').forEach(btn => {
    btn.addEventListener('click', () => {
      bookingState.selectedTime = btn.dataset.time;
      updateWizardDOM();
    });
  });
}

// Step 4 events
function bindStep4Events() {
  const nameInput = document.getElementById('client-name');
  const phoneInput = document.getElementById('client-phone');

  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      bookingState.clientName = e.target.value;
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = phoneMask(e.target.value);
      bookingState.clientPhone = e.target.value;
    });
  }
}

// Sincronização remota dos horários com o Google Sheets
async function syncRemoteSlots() {
  const barber = store.getBarberById(bookingState.selectedBarber) || store.getBarbers()[0];
  const tabName = barber?.sheetTab || 'Barbeiro 1';

  bookingState.loadingSlots = true;
  updateWizardDOM();

  try {
    const appointments = await fetchGoogleSheetsAppointments(tabName);
    bookingState.remoteAppointments = appointments || [];
  } catch (err) {
    console.warn('Erro ao sincronizar com Google Sheets:', err);
    bookingState.remoteAppointments = [];
  } finally {
    bookingState.loadingSlots = false;
    updateWizardDOM();
  }
}

// Submissão do agendamento
async function submitBooking() {
  const nameInput = document.getElementById('client-name');
  const phoneInput = document.getElementById('client-phone');
  const nameError = document.getElementById('name-error');
  const phoneError = document.getElementById('phone-error');

  let valid = true;

  if (!bookingState.clientName || bookingState.clientName.trim().length < 3) {
    if (nameError) nameError.style.display = 'block';
    nameInput?.classList.add('error');
    valid = false;
  } else {
    if (nameError) nameError.style.display = 'none';
    nameInput?.classList.remove('error');
  }

  if (!isValidPhone(bookingState.clientPhone)) {
    if (phoneError) phoneError.style.display = 'block';
    phoneInput?.classList.add('error');
    valid = false;
  } else {
    if (phoneError) phoneError.style.display = 'none';
    phoneInput?.classList.remove('error');
  }

  if (!valid) return;

  bookingState.isSubmitting = true;
  updateWizardDOM();

  try {
    const services = store.getServices();
    const barbers = store.getBarbers();
    const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
    const barber = barbers.find(b => b.id === bookingState.selectedBarber) || barbers[0];
    const code = generateCode();
    bookingState.confirmationCode = code;

    const appointmentData = {
      aba: barber?.sheetTab || 'Barbeiro 1',
      barbeiro: barber?.name || 'Barbeiro 1',
      nome: bookingState.clientName.trim(),
      numero: bookingState.clientPhone.trim(),
      telefone: bookingState.clientPhone.trim(),
      servico: selectedSvcs.map(s => s.name).join(', '),
      dataCorte: bookingState.selectedDate,
      dataFormatted: formatDateDMY(bookingState.selectedDate),
      diaSemana: getWeekdayName(bookingState.selectedDate),
      horario: bookingState.selectedTime,
      duration: selectedSvcs.reduce((sum, s) => sum + s.duration, 0),
      code: code,
    };

    // 1. Envia para o Google Sheets (Apps Script)
    await sendToGoogleSheets(appointmentData);

    // 2. Salva localmente
    store.saveAppointment({
      ...appointmentData,
      id: code,
      barberId: barber.id,
      total: selectedSvcs.reduce((sum, s) => sum + s.price, 0),
    });

    showToast('Agendamento gravado com sucesso!', 'success');

    // 3. Avança para a tela final de confirmação
    bookingState.step = 5;
    updateWizardDOM();
    window.scrollTo({ top: 0, behavior: 'smooth' });

  } catch (err) {
    console.error('Erro ao agendar:', err);
    showToast('Erro ao gravar agendamento. Tente novamente.', 'error');
  } finally {
    bookingState.isSubmitting = false;
  }
}
