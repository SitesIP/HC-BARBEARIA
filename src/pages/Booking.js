// ===== H&C Barbearia — Booking Page (7-Step Flow) =====
import store from '../data/store.js';
import { renderHeader, initHeader } from '../components/Header.js';
import {
  formatCurrency, formatDate, formatDateShort, formatDateDMY, getWeekdayName, generateCode,
  sendToGoogleSheets, fetchGoogleSheetsAppointments, getWhatsAppUrl, getCalendarUrl,
  phoneMask, isValidPhone, showToast, MONTHS, WEEKDAYS
} from '../utils/helpers.js';

let bookingState = {
  step: 1,
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
  confirmationCode: '',
};

export function renderBooking() {
  return `
    ${renderHeader()}
    <div class="booking-page" id="booking-page">
      <div class="container">
        ${renderProgress()}
        <div class="booking-content" id="booking-content">
          ${renderStep()}
        </div>
      </div>
    </div>
  `;
}

function renderProgress() {
  const steps = [
    { num: 1, label: 'Serviço' },
    { num: 2, label: 'Barbeiro' },
    { num: 3, label: 'Data' },
    { num: 4, label: 'Horário' },
    { num: 5, label: 'Dados' },
    { num: 6, label: 'Revisão' },
    { num: 7, label: 'Confirmação' },
  ];

  return `
    <div class="booking-progress" id="booking-progress">
      ${steps.map((s, i) => `
        <div class="booking-step-indicator">
          <div class="step-circle ${bookingState.step === s.num ? 'active' : ''} ${bookingState.step > s.num ? 'completed' : ''}">${bookingState.step > s.num ? '✓' : s.num}</div>
          <span class="step-label ${bookingState.step === s.num ? 'active' : ''}">${s.label}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="step-connector ${bookingState.step > s.num ? 'completed' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `;
}

function renderStep() {
  switch (bookingState.step) {
    case 1: return renderStepService();
    case 2: return renderStepBarber();
    case 3: return renderStepDate();
    case 4: return renderStepTime();
    case 5: return renderStepClient();
    case 6: return renderStepReview();
    case 7: return renderStepConfirmation();
    default: return renderStepService();
  }
}

// Step 1 — Select Service(s)
function renderStepService() {
  const services = store.getServices();
  const total = bookingState.selectedServices.reduce((sum, id) => {
    const svc = services.find(s => s.id === id);
    return sum + (svc ? svc.price : 0);
  }, 0);

  return `
    <div class="booking-title">
      <h2>Escolha o Serviço</h2>
      <p>Selecione um ou mais serviços que deseja agendar.</p>
    </div>
    <div class="service-select-list" id="service-list">
      ${services.map(svc => `
        <div class="service-select-item ${bookingState.selectedServices.includes(svc.id) ? 'selected' : ''}"
             data-service-id="${svc.id}" id="svc-${svc.id}">
          <div class="service-select-info">
            <h4>${svc.name}</h4>
            <p>${svc.description}</p>
          </div>
          <div class="service-select-price">
            <div class="price">${formatCurrency(svc.price)}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-xl); flex-wrap: wrap; gap: var(--space-md);">
      <div>
        <span style="color: var(--gray-medium); font-size: 0.85rem;">Total:</span>
        <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--copper-light); margin-left: 8px;">${formatCurrency(total)}</span>
      </div>
      <button class="btn btn-primary" id="btn-next" ${bookingState.selectedServices.length === 0 ? 'disabled' : ''}>
        Próximo: Barbeiro →
      </button>
    </div>
  `;
}

// Step 2 — Select Barber
function renderStepBarber() {
  const barbers = store.getBarbers();

  return `
    <div class="booking-title">
      <h2>Escolha o Profissional</h2>
      <p>Selecione o barbeiro para o seu atendimento.</p>
    </div>
    <div class="barber-select-grid" id="barber-list">
      ${barbers.map(barber => `
        <div class="barber-select-item ${bookingState.selectedBarber === barber.id ? 'selected' : ''}" data-barber-id="${barber.id}" id="barber-${barber.id}">
          <img src="${barber.image}" alt="${barber.name}" />
          <h4>${barber.name}</h4>
          <p>${barber.specialty}</p>
        </div>
      `).join('')}
    </div>
    <div class="booking-actions">
      <button class="btn btn-secondary" id="btn-prev">← Voltar</button>
      <button class="btn btn-primary" id="btn-next" ${!bookingState.selectedBarber ? 'disabled' : ''}>Próximo: Data →</button>
    </div>
  `;
}

// Step 3 — Select Date (Calendar)
function renderStepDate() {
  const { calendarMonth, calendarYear } = bookingState;
  const today = new Date();
  const firstDay = new Date(calendarYear, calendarMonth, 1);
  const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
  const startDay = firstDay.getDay(); // 0=Sun

  const config = store.getConfig();
  const dayKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

  let days = '';
  // Empty cells
  for (let i = 0; i < startDay; i++) {
    days += '<div class="calendar-day empty"></div>';
  }
  // Day cells
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
    const dateObj = new Date(calendarYear, calendarMonth, d);
    const dayOfWeek = dateObj.getDay();
    const dayConfig = config.openingHours[dayKeys[dayOfWeek]];

    const isPast = dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    maxDate.setDate(maxDate.getDate() + 14);
    const isTooFar = dateObj > maxDate;
    
    const isClosed = !dayConfig || !dayConfig.active || dayKeys[dayOfWeek] === 'sex' || dayKeys[dayOfWeek] === 'sab';
    const isBlocked = store.isDateBlocked(dateStr);
    const isDisabled = isPast || isTooFar || isClosed || isBlocked;
    const localTodayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const isToday = dateStr === localTodayStr;
    const isSelected = bookingState.selectedDate === dateStr;

    days += `<div class="calendar-day ${isDisabled ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" ${!isDisabled ? `data-date="${dateStr}"` : ''} id="day-${d}">${d}</div>`;
  }

  return `
    <div class="booking-title">
      <h2>Escolha a Data</h2>
      <p>Selecione o dia para seu atendimento.</p>
      <p style="color: var(--gold); font-size: 0.85rem; margin-top: 5px;">Nota: Sexta e Sábado o atendimento é <strong>somente ordem de chegada</strong>.</p>
    </div>
    <div class="calendar-container">
      <div class="calendar-header">
        <button class="calendar-nav" id="cal-prev" style="width: 36px; height: 36px; border-radius: 50%; background: var(--graphite-lighter); display: flex; align-items: center; justify-content: center;">◀</button>
        <h3>${MONTHS[calendarMonth]} ${calendarYear}</h3>
        <button class="calendar-nav" id="cal-next" style="width: 36px; height: 36px; border-radius: 50%; background: var(--graphite-lighter); display: flex; align-items: center; justify-content: center;">▶</button>
      </div>
      <div class="calendar-weekdays">
        ${WEEKDAYS.map(d => `<span>${d}</span>`).join('')}
      </div>
      <div class="calendar-days" id="calendar-days">
        ${days}
      </div>
    </div>
    <div class="booking-actions">
      <button class="btn btn-secondary" id="btn-prev">← Voltar</button>
      <button class="btn btn-primary" id="btn-next" ${!bookingState.selectedDate ? 'disabled' : ''}>Próximo: Horário →</button>
    </div>
  `;
}

// Step 4 — Select Time
function renderStepTime() {
  const barber = store.getBarberById(bookingState.selectedBarber) || store.getBarbers()[0];
  const barberId = barber?.id;

  if (bookingState.loadingSlots) {
    return `
      <div class="booking-title">
        <h2>Escolha o Horário</h2>
        <p>Consultando disponibilidade em tempo real na planilha...</p>
      </div>
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 0;">
        <span class="spinner" style="width: 36px; height: 36px; border-width: 3px; border-color: var(--copper); border-top-color: transparent;"></span>
        <p style="color: var(--gray-medium); margin-top: 15px; font-size: 0.95rem;">Verificando horários do ${barber?.name || 'Barbeiro'}...</p>
      </div>
    `;
  }

  const baseSlots = store.getAvailableSlots(barberId, bookingState.selectedDate);
  const selectedDateFormatted = formatDateDMY(bookingState.selectedDate);

  // Cross-reference with remote Google Sheets appointments
  const slots = baseSlots.map(slot => {
    let available = slot.available;
    if (available && bookingState.remoteAppointments.length > 0) {
      const isBookedInSheet = bookingState.remoteAppointments.some(appt => {
        const matchDate = (appt.data === selectedDateFormatted) || (appt.data === bookingState.selectedDate);
        const matchTime = (appt.horario === slot.time) || (appt.horario.replace(':00', '') === slot.time);
        return matchDate && matchTime;
      });
      if (isBookedInSheet) {
        available = false;
      }
    }
    return { ...slot, available };
  });

  return `
    <div class="booking-title">
      <h2>Escolha o Horário</h2>
      <p>Horários disponíveis para ${formatDateShort(bookingState.selectedDate)} com <strong>${barber?.name}</strong>.</p>
    </div>
    ${slots.length > 0 ? `
      <div class="time-slots-grid" id="time-slots">
        ${slots.map(slot => `
          <div class="time-slot ${slot.available ? '' : 'disabled'} ${bookingState.selectedTime === slot.time ? 'selected' : ''}"
               ${slot.available ? `data-time="${slot.time}"` : ''} 
               id="slot-${slot.time.replace(':', '')}"
               title="${slot.available ? 'Horário disponível' : 'Horário já reservado na planilha'}">
            ${slot.time}
            ${!slot.available ? '<span style="display: block; font-size: 0.65rem; color: #888;">Ocupado</span>' : ''}
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <div class="empty-state-icon">😔</div>
        <h3>Nenhum horário disponível</h3>
        <p>Não há horários livres nesta data. Tente outra data.</p>
      </div>
    `}
    <div class="booking-actions">
      <button class="btn btn-secondary" id="btn-prev">← Voltar</button>
      <button class="btn btn-primary" id="btn-next" ${!bookingState.selectedTime ? 'disabled' : ''}>Próximo: Seus Dados →</button>
    </div>
  `;
}

// Step 5 — Client Info
function renderStepClient() {
  return `
    <div class="booking-title">
      <h2>Seus Dados</h2>
      <p>Preencha seus dados de contato para confirmação da reserva.</p>
    </div>
    <div style="max-width: 480px; margin: 0 auto;">
      <div class="form-group">
        <label class="form-label" for="client-name">Nome Completo *</label>
        <input type="text" class="form-input" id="client-name" placeholder="Ex: João da Silva" value="${bookingState.clientName}" autocomplete="name" required />
        <div class="form-error" id="name-error" style="display: none; color: #ff5252; font-size: 0.8rem; margin-top: 4px;">Por favor, digite seu nome completo.</div>
      </div>
      <div class="form-group">
        <label class="form-label" for="client-phone">Telefone / WhatsApp (com DDD) *</label>
        <input type="tel" class="form-input" id="client-phone" placeholder="(84) 9XXXX-XXXX" value="${bookingState.clientPhone}" autocomplete="tel" required />
        <div class="form-error" id="phone-error" style="display: none; color: #ff5252; font-size: 0.8rem; margin-top: 4px;">Por favor, digite um número de WhatsApp válido com DDD (ex: (84) 98143-4692).</div>
      </div>
    </div>
    <div class="booking-actions">
      <button class="btn btn-secondary" id="btn-prev">← Voltar</button>
      <button class="btn btn-primary" id="btn-next">Próximo: Revisão →</button>
    </div>
  `;
}

// Step 6 — Review
function renderStepReview() {
  const services = store.getServices();
  const barbers = store.getBarbers();
  const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
  const barber = barbers.find(b => b.id === bookingState.selectedBarber) || barbers[0];
  const total = selectedSvcs.reduce((sum, s) => sum + s.price, 0);

  return `
    <div class="booking-title">
      <h2>Revise seu Agendamento</h2>
      <p>Confira os detalhes antes de gravar sua reserva.</p>
    </div>
    <div class="review-card">
      <div class="review-item">
        <span class="review-item-label">👤 Cliente</span>
        <span class="review-item-value">${bookingState.clientName}</span>
      </div>
      <div class="review-item">
        <span class="review-item-label">📱 Telefone / WhatsApp</span>
        <span class="review-item-value">${bookingState.clientPhone}</span>
      </div>
      <div class="review-item">
        <span class="review-item-label">✂️ Serviço(s)</span>
        <span class="review-item-value">${selectedSvcs.map(s => s.name).join(', ')}</span>
      </div>
      <div class="review-item">
        <span class="review-item-label">💈 Barbeiro</span>
        <span class="review-item-value">${barber?.name || 'Barbeiro 1'} (${barber?.sheetTab || 'Barbeiro 1'})</span>
      </div>
      <div class="review-item">
        <span class="review-item-label">📅 Data</span>
        <span class="review-item-value">${formatDateDMY(bookingState.selectedDate)} (${getWeekdayName(bookingState.selectedDate)})</span>
      </div>
      <div class="review-item">
        <span class="review-item-label">⏰ Horário</span>
        <span class="review-item-value">${bookingState.selectedTime}</span>
      </div>
      <div class="review-total">
        <span class="review-total-label">Valor Total</span>
        <span class="review-total-value">${formatCurrency(total)}</span>
      </div>
    </div>
    <div class="booking-actions">
      <button class="btn btn-secondary" id="btn-prev">← Voltar</button>
      <button class="btn btn-primary btn-lg" id="btn-confirm">✅ Confirmar e Gravar Reserva</button>
    </div>
  `;
}

// Step 7 — Confirmation
function renderStepConfirmation() {
  const barbers = store.getBarbers();
  const services = store.getServices();
  const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
  const barber = barbers.find(b => b.id === bookingState.selectedBarber) || barbers[0];
  const totalDuration = selectedSvcs.reduce((sum, s) => sum + s.duration, 0);

  const data = {
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

  const barberWhatsApp = barber?.whatsapp || (barber?.name === 'Barbeiro 2' ? '5584991294651' : '5584981434692');
  const whatsappUrl = getWhatsAppUrl(data, barberWhatsApp);
  const calendarUrl = getCalendarUrl(data);

  return `
    <div class="confirmation-card" style="margin: 0 auto; max-width: 520px;">
      <div class="confirmation-icon">✅</div>
      <h2 style="font-size: 1.5rem; margin-bottom: var(--space-sm);">Agendamento Gravado com Sucesso!</h2>
      <p style="color: var(--gray-medium); margin-bottom: var(--space-lg); font-size: 0.95rem; line-height: 1.5;">
        Seus dados foram registrados com sucesso. Clique no botão verde abaixo para enviar o resumo ao WhatsApp do barbeiro e finalizar sua confirmação.
      </p>

      <div class="review-card" style="text-align: left; margin-top: var(--space-md);">
        <div class="review-item">
          <span class="review-item-label">👤 Cliente</span>
          <span class="review-item-value">${data.nome}</span>
        </div>
        <div class="review-item">
          <span class="review-item-label">📱 Telefone</span>
          <span class="review-item-value">${data.telefone}</span>
        </div>
        <div class="review-item">
          <span class="review-item-label">✂️ Serviço</span>
          <span class="review-item-value">${data.servico}</span>
        </div>
        <div class="review-item">
          <span class="review-item-label">💈 Barbeiro</span>
          <span class="review-item-value">${data.barbeiro}</span>
        </div>
        <div class="review-item">
          <span class="review-item-label">📅 Data</span>
          <span class="review-item-value">${data.dataFormatted} (${data.diaSemana})</span>
        </div>
        <div class="review-item">
          <span class="review-item-label">⏰ Horário</span>
          <span class="review-item-value">${data.horario}</span>
        </div>
      </div>

      <div class="confirmation-actions" style="margin-top: var(--space-lg); display: flex; flex-direction: column; gap: 12px;">
        <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block" style="background: #25D366; color: #000000; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.5px; padding: 16px 18px; box-shadow: 0 4px 20px rgba(37,211,102,0.35); text-align: center; display: flex; align-items: center; justify-content: center; text-transform: uppercase;">
          📲 Confirmação Obrigatória via WhatsApp
        </a>
        <a href="${calendarUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-block" style="text-align: center; font-size: 0.9rem; padding: 14px 18px;">
          📅 Adicionar ao Google Agenda
        </a>
        <a href="#/" class="btn btn-secondary btn-block" style="text-align: center; font-size: 0.9rem; padding: 14px 18px;">
          🏠 Voltar à Página Inicial
        </a>
      </div>
    </div>
  `;
}

// Fetch remote slots helper
async function syncRemoteSlots() {
  const barber = store.getBarberById(bookingState.selectedBarber) || store.getBarbers()[0];
  const tabName = barber?.sheetTab || barber?.name || 'Barbeiro 1';
  
  bookingState.loadingSlots = true;
  updateBookingUI();

  try {
    const appointments = await fetchGoogleSheetsAppointments(tabName);
    bookingState.remoteAppointments = appointments || [];
  } catch (err) {
    console.warn('Erro ao sincronizar planilha:', err);
    bookingState.remoteAppointments = [];
  } finally {
    bookingState.loadingSlots = false;
    updateBookingUI();
  }
}

// Initialize interactions
export function initBooking() {
  initHeader();
  bindStepEvents();
}

function bindStepEvents() {
  const content = document.getElementById('booking-content');
  if (!content) return;

  switch (bookingState.step) {
    case 1: bindServiceEvents(); break;
    case 2: bindBarberEvents(); break;
    case 3: bindDateEvents(); break;
    case 4: bindTimeEvents(); break;
    case 5: bindClientEvents(); break;
    case 6: bindReviewEvents(); break;
  }
}

function updateBookingUI() {
  const progress = document.getElementById('booking-progress');
  const content = document.getElementById('booking-content');
  if (progress) progress.outerHTML = renderProgress();
  if (content) {
    content.innerHTML = renderStep();
    content.classList.add('fade-in');
    bindStepEvents();
  }
}

// Step 1 events
function bindServiceEvents() {
  document.querySelectorAll('.service-select-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = parseInt(item.dataset.serviceId);
      const idx = bookingState.selectedServices.indexOf(id);
      if (idx >= 0) {
        bookingState.selectedServices.splice(idx, 1);
      } else {
        bookingState.selectedServices.push(id);
      }
      updateBookingUI();
    });
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (bookingState.selectedServices.length > 0) {
      bookingState.step = 2;
      updateBookingUI();
    }
  });
}

// Step 2 events
function bindBarberEvents() {
  document.querySelectorAll('.barber-select-item').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.barberId;
      bookingState.selectedBarber = parseInt(id);
      updateBookingUI();
    });
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    bookingState.step = 1;
    updateBookingUI();
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (bookingState.selectedBarber) {
      bookingState.step = 3;
      updateBookingUI();
    }
  });
}

// Step 3 events
function bindDateEvents() {
  document.querySelectorAll('.calendar-day:not(.disabled):not(.empty)').forEach(day => {
    day.addEventListener('click', () => {
      bookingState.selectedDate = day.dataset.date;
      bookingState.selectedTime = null; // reset time when date changes
      updateBookingUI();
    });
  });

  document.getElementById('cal-prev')?.addEventListener('click', () => {
    bookingState.calendarMonth--;
    if (bookingState.calendarMonth < 0) {
      bookingState.calendarMonth = 11;
      bookingState.calendarYear--;
    }
    updateBookingUI();
  });

  document.getElementById('cal-next')?.addEventListener('click', () => {
    bookingState.calendarMonth++;
    if (bookingState.calendarMonth > 11) {
      bookingState.calendarMonth = 0;
      bookingState.calendarYear++;
    }
    updateBookingUI();
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    bookingState.step = 2;
    updateBookingUI();
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (bookingState.selectedDate) {
      bookingState.step = 4;
      syncRemoteSlots();
    }
  });
}

// Step 4 events
function bindTimeEvents() {
  document.querySelectorAll('.time-slot:not(.disabled)').forEach(slot => {
    slot.addEventListener('click', () => {
      bookingState.selectedTime = slot.dataset.time;
      updateBookingUI();
    });
  });

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    bookingState.step = 3;
    updateBookingUI();
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    if (bookingState.selectedTime) {
      bookingState.step = 5;
      updateBookingUI();
    }
  });
}

// Step 5 events
function bindClientEvents() {
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

  document.getElementById('btn-prev')?.addEventListener('click', () => {
    bookingState.step = 4;
    updateBookingUI();
  });

  document.getElementById('btn-next')?.addEventListener('click', () => {
    let valid = true;
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');

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

    if (valid) {
      bookingState.step = 6;
      updateBookingUI();
    }
  });
}

// Step 6 events
function bindReviewEvents() {
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    bookingState.step = 5;
    updateBookingUI();
  });

  document.getElementById('btn-confirm')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-confirm');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></span> Gravando Reserva...';

    try {
      const services = store.getServices();
      const barbers = store.getBarbers();
      const selectedSvcs = bookingState.selectedServices.map(id => services.find(s => s.id === id)).filter(Boolean);
      const barber = barbers.find(b => b.id === bookingState.selectedBarber) || barbers[0];
      const barberName = barber?.name || 'Barbeiro 1';
      const barberTab = barber?.sheetTab || 'Barbeiro 1';
      const barberWhatsApp = barber?.whatsapp || (barberName === 'Barbeiro 2' ? '5584991294651' : '5584981434692');

      const code = generateCode();
      bookingState.confirmationCode = code;

      const appointmentData = {
        aba: barberTab,
        barbeiro: barberName,
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

      // 1. Send to Google Sheets
      await sendToGoogleSheets(appointmentData);

      // 2. Save locally in client store
      store.saveAppointment({
        ...appointmentData,
        id: code,
        barberId: barber.id,
        total: selectedSvcs.reduce((sum, s) => sum + s.price, 0),
      });

      showToast('Agendamento gravado com sucesso!', 'success');

      // 3. Go to confirmation step
      bookingState.step = 7;
      updateBookingUI();

      // Auto redirect to WhatsApp after 1.5 seconds if supported
      setTimeout(() => {
        const url = getWhatsAppUrl(appointmentData, barberWhatsApp);
        window.open(url, '_blank');
      }, 1200);

    } catch (err) {
      console.error('Erro ao confirmar:', err);
      showToast('Erro ao gravar agendamento. Tente novamente.', 'error');
      btn.disabled = false;
      btn.innerHTML = '✅ Confirmar e Gravar Reserva';
    }
  });
}

// Reset booking state for new bookings
export function resetBooking() {
  bookingState = {
    step: 1,
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
    confirmationCode: '',
  };
}
