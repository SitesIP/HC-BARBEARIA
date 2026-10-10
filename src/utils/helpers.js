// ===== Application utilities =====

// Format currency BRL (returns R$ -- when price is 0 or empty)
export function formatCurrency(value) {
  if (value === null || value === undefined || value === 0 || value === '' || value === '--' || isNaN(value)) {
    return 'R$ --';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Format date to PT-BR
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// Format short date
export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Generate unique code
export function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RES-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Toast notifications
let toastContainer = null;

export function showToast(message, type = 'info', duration = 4000) {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || ''}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Scroll reveal observer
export function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxdcOeje9WTcOm6XIHWGWMdkUS5jxgPI2qQlLkD5o4MgP6iJE6Afm6l30JqWopCcMrR/exec';

// Format date to DD/MM/AAAA
export function formatDateDMY(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}/${month}/${year}`;
}

// Get weekday name
export function getWeekdayName(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T12:00:00');
  const weekdays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  return weekdays[date.getDay()] || '';
}

// Send appointment to Google Sheets
export async function sendToGoogleSheets(data) {
  const payload = {
    aba: data.aba || data.barbeiro || 'Barbeiro 1',
    barbeiro: data.barbeiro || 'Profissional 1',
    nome: data.nome || '',
    numero: data.telefone || data.numero || '',
    telefone: data.telefone || data.numero || '',
    servico: data.servico || '',
    data: data.dataFormatted || formatDateDMY(data.dataCorte),
    dataCorte: data.dataFormatted || formatDateDMY(data.dataCorte),
    dia: data.diaSemana || getWeekdayName(data.dataCorte),
    diaSemana: data.diaSemana || getWeekdayName(data.dataCorte),
    horario: data.horario || '',
  };

  try {
    // Try POST with text/plain body to avoid pre-flight CORS block in Apps Script
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error) {
    console.warn('Erro ao enviar para Google Sheets (salvando localmente):', error);
    return { success: false, error: error.message };
  }
}

// Fetch booked appointments directly from Google Sheets
export async function fetchGoogleSheetsAppointments(barberTab = 'Barbeiro 1') {
  try {
    const url = `${APPS_SCRIPT_URL}?aba=${encodeURIComponent(barberTab)}&t=${Date.now()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    if (result && result.success && Array.isArray(result.appointments)) {
      return result.appointments;
    }
    return [];
  } catch (err) {
    console.warn('Não foi possível carregar agendamentos remotos da planilha (usando cache local):', err);
    return [];
  }
}

export function getWhatsAppUrl(data, phone) {
  const recipient = String(phone || '5511999999999').replace(/\D/g, '');
  const dateFormatted = data.dataFormatted || formatDateDMY(data.dataCorte);
  const weekday = data.diaSemana || getWeekdayName(data.dataCorte);
  const message = [
    `Olá! Gostaria de confirmar meu agendamento na ${data.shopName || 'Barbearia'}.`,
    '',
    `Cliente: ${data.nome}`,
    `Telefone: ${data.telefone || data.numero || ''}`,
    `Serviço: ${data.servico}`,
    `Profissional: ${data.barbeiro}`,
    `Data: ${dateFormatted} (${weekday})`,
    `Horário: ${data.horario}`,
    `Código: ${data.code || ''}`,
  ].join('\n');

  return `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
}

// Build calendar event URL (Google Calendar)
export function getCalendarUrl(data) {
  const [year, month, day] = data.dataCorte.split('-');
  const [hour, min] = data.horario.split(':');
  const startDate = `${year}${month}${day}T${hour}${min}00`;

  // Calculate end time (add service duration)
  const startMinutes = parseInt(hour) * 60 + parseInt(min);
  const endMinutes = startMinutes + (data.duration || 30);
  const endH = Math.floor(endMinutes / 60).toString().padStart(2, '0');
  const endM = (endMinutes % 60).toString().padStart(2, '0');
  const endDate = `${year}${month}${day}T${endH}${endM}00`;

  const title = encodeURIComponent(`${data.servico} — Barbearia`);
  const details = encodeURIComponent(`Profissional: ${data.barbeiro}\nServiço: ${data.servico}\nCódigo: ${data.code || ''}`);

  return `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${startDate}/${endDate}&details=${details}`;
}

// Phone mask (DDD) 9XXXX-XXXX
export function phoneMask(value) {
  if (!value) return '';
  let digits = value.replace(/\D/g, '');
  if (digits.length > 11) digits = digits.slice(0, 11);

  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

// Validate phone
export function isValidPhone(phone) {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

// Debounce
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Month names in PT-BR
export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAYS_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

// SVG Icons
export const ICONS = {
  instagram: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  whatsapp: `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>`,
  razor: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19l4-4 10-10a2.12 2.12 0 0 1 3 3L11 18l-4 4H4v-3z"/><circle cx="5.5" cy="18.5" r="1"/><line x1="12" y1="6" x2="18" y2="12"/></svg>`,
  clipper: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="6" width="10" height="15" rx="3"/><path d="M7 6l1-4h8l1 4"/><line x1="9" y1="2" x2="9" y2="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="15" y1="2" x2="15" y2="4"/><line x1="10" y1="12" x2="14" y2="12"/><line x1="12" y1="16" x2="12" y2="18"/></svg>`,
  scissors: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="8.5" y1="8.5" x2="20" y2="20"/><line x1="8.5" y1="15.5" x2="20" y2="4"/></svg>`,
  beard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 9c0 5 3 11 7 11s7-6 7-11"/><path d="M7 8c2 1 4 1 5 0 1 1 3 1 5 0"/><path d="M9 13c1.5 1 4.5 1 6 0"/></svg>`,
  beardItalian: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8c1 6 4 13 8 13s7-7 8-13"/><path d="M6 7c2 2 4.5 2 6 0 1.5 2 4 2 6 0"/><path d="M8 12c2.5 1.5 5.5 1.5 8 0"/><line x1="12" y1="15" x2="12" y2="18"/></svg>`,
  eyebrow: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13c3-5 8-7 14-4 2 1 4 3 4 3"/><path d="M14 17l6-6"/><path d="M17 19l4-4"/></svg>`,
  colorBrush: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 11L13 5l-8 8a2 2 0 0 0 0 2.83l1.17 1.17a2 2 0 0 0 2.83 0L19 11z"/><path d="M5 19l-2 2h4l-2-2z"/><circle cx="16" cy="8" r="1"/></svg>`,
  comboCrown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  comboDiamond: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l3 6-9 12L3 9z"/><path d="M3 9h18"/><path d="M10 3l-2 6 4 12 4-12-2-6"/></svg>`,
  comboShield: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l8 4v6c0 5.25-3.5 10.75-8 12-4.5-1.25-8-6.75-8-12V6l8-4z"/><path d="M9 12l2 2 4-4"/></svg>`,
};

export function getServiceSvg(serviceName = '', icon = '') {
  if (icon && icon.includes('<svg')) return icon;
  const name = serviceName.toLowerCase();

  if (name.includes('navalhad') && name.includes('combo')) return ICONS.comboCrown;
  if (name.includes('zero') && name.includes('combo')) return ICONS.comboDiamond;
  if (name.includes('social') && name.includes('combo')) return ICONS.comboShield;
  if (name.includes('combo')) return ICONS.comboCrown;
  
  if (name.includes('navalhad')) return ICONS.razor;
  if (name.includes('zero')) return ICONS.clipper;
  if (name.includes('social')) return ICONS.scissors;
  if (name.includes('italiana')) return ICONS.beardItalian;
  if (name.includes('barba') && name.includes('pigment')) return ICONS.colorBrush;
  if (name.includes('barba')) return ICONS.beard;
  if (name.includes('sobrancelha')) return ICONS.eyebrow;
  if (name.includes('tesoura')) return ICONS.scissors;
  if (name.includes('pigment')) return ICONS.colorBrush;

  return ICONS.razor;
}
