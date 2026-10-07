// ===== H&C Barbearia — Data Store (localStorage) =====

const STORAGE_KEYS = {
  SERVICES: 'hc_services',
  BARBERS: 'hc_barbers',
  APPOINTMENTS: 'hc_appointments',
  CLIENTS: 'hc_clients',
  CONFIG: 'hc_config',
  BLOCKED_DATES: 'hc_blocked_dates',
  ADMIN_AUTH: 'hc_admin_auth',
};

// Default Data
const DEFAULT_SERVICES = [
  { id: 1, name: 'Navalhado', description: 'Corte na navalha com acabamento impecável.', price: 30, duration: 40, icon: '', active: true },
  { id: 2, name: 'Na Zero', description: 'Corte na máquina zero com degradê perfeito.', price: 28, duration: 40, icon: '', active: true },
  { id: 3, name: 'Social', description: 'Corte social clássico e elegante.', price: 25, duration: 30, icon: '', active: true },
  { id: 4, name: 'Barba', description: 'Modelagem tradicional de barba.', price: 23, duration: 20, icon: '', active: true },
  { id: 5, name: 'Barba Italiana', description: 'Design sofisticado no estilo italiano.', price: 25, duration: 30, icon: '', active: true },
  { id: 6, name: 'Sobrancelha', description: 'Design e limpeza de sobrancelha.', price: 12, duration: 15, icon: '', active: true },
  { id: 7, name: 'Tesoura', description: 'Corte exclusivamente na tesoura.', price: 38, duration: 45, icon: '', active: true },
  { id: 8, name: 'Pigmentação Cabelo', description: 'Disfarce e realce no corte de cabelo.', price: 20, duration: 20, icon: '', active: true },
  { id: 9, name: 'Pigmentação Barba', description: 'Preenchimento de falhas e contorno na barba.', price: 15, duration: 15, icon: '', active: true },
  { id: 10, name: 'Combo: Navalhado + Barba + Sobrancelha', description: 'Corte navalhado, barba completa e sobrancelha.', price: 65, duration: 60, icon: '', active: true },
  { id: 11, name: 'Combo: Zero + Barba + Sobrancelha', description: 'Corte na zero, barba completa e sobrancelha.', price: 59, duration: 60, icon: '', active: true },
  { id: 12, name: 'Combo: Social + Barba + Sobrancelha', description: 'Corte social, barba completa e sobrancelha.', price: 57, duration: 55, icon: '', active: true },
];

const DEFAULT_BARBERS = [
  { id: 1, name: 'Barbeiro 1', sheetTab: 'Barbeiro 1', phone: '84981434692', whatsapp: '5584981434692', specialty: 'Cortes & Barba', image: '/images/barber1.jpg', active: true },
  { id: 2, name: 'Barbeiro 2', sheetTab: 'Barbeiro 2', phone: '84991294651', whatsapp: '5584991294651', specialty: 'Cortes & Barba', image: '/images/barber2.jpg', active: true },
];

const DEFAULT_CONFIG = {
  shopName: 'H&C Barbearia',
  phone: '5511999999999',
  whatsapp: '5511999999999',
  email: 'contato@hcbarbearia.com',
  address: 'Rua Exemplo, 123 — Centro, São Paulo - SP',
  openingHours: {
    seg: { open: '13:30', close: '17:30', active: true },
    ter: { open: '09:00', close: '18:00', active: true },
    qua: { open: '09:00', close: '18:30', active: true },
    qui: { open: '09:00', close: '18:30', active: true },
    sex: { open: '09:00', close: '18:30', active: true },
    sab: { open: '09:00', close: '16:00', active: true },
    dom: { open: null, close: null, active: false },
  },
  slotInterval: 30, // minutes
  instagram: 'https://www.instagram.com/hcbarbeariaa',
  facebook: '',
  adminPassword: 'admin123',
};

const DEFAULT_TESTIMONIALS = [
  { id: 1, name: 'Marcos Oliveira', text: 'Melhor barbearia da cidade! O Rafael é um mestre no degradê. Ambiente incrível e atendimento impecável.', rating: 5, date: '2026-09-15' },
  { id: 2, name: 'Pedro Santos', text: 'Já experimentei várias barbearias, mas a H&C é diferente. O combo corte + barba é uma experiência completa. Recomendo demais!', rating: 5, date: '2026-09-20' },
  { id: 3, name: 'Gabriel Lima', text: 'O Lucas fez a pigmentação na minha barba e ficou perfeito! Ninguém nota as falhas. Profissionalismo puro.', rating: 5, date: '2026-09-28' },
  { id: 4, name: 'Thiago Alves', text: 'Ambiente premium, atendimento de primeira. O André entende muito de corte moderno. Saio sempre satisfeito.', rating: 5, date: '2026-10-02' },
  { id: 5, name: 'Felipe Rocha', text: 'Agendamento online super prático. Cheguei na hora, fui atendido na hora. Corte ficou show!', rating: 4, date: '2026-10-04' },
];

// Store Class
class Store {
  constructor() {
    this.init();
  }

  init() {
    // Force overwrite for this update to clear previous values
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(STORAGE_KEYS.BARBERS, JSON.stringify(DEFAULT_BARBERS));
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));

    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTS)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES)) {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify([]));
    }
  }

  // Generic CRUD
  _get(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Services
  getServices() { return this._get(STORAGE_KEYS.SERVICES).filter(s => s.active); }
  getAllServices() { return this._get(STORAGE_KEYS.SERVICES); }
  getServiceById(id) { return this._get(STORAGE_KEYS.SERVICES).find(s => s.id === id); }
  saveService(service) {
    const services = this._get(STORAGE_KEYS.SERVICES);
    if (service.id) {
      const idx = services.findIndex(s => s.id === service.id);
      if (idx >= 0) services[idx] = { ...services[idx], ...service };
    } else {
      service.id = Date.now();
      service.active = true;
      services.push(service);
    }
    this._set(STORAGE_KEYS.SERVICES, services);
    return service;
  }
  deleteService(id) {
    const services = this._get(STORAGE_KEYS.SERVICES).map(s => s.id === id ? { ...s, active: false } : s);
    this._set(STORAGE_KEYS.SERVICES, services);
  }

  // Barbers
  getBarbers() { return this._get(STORAGE_KEYS.BARBERS).filter(b => b.active); }
  getAllBarbers() { return this._get(STORAGE_KEYS.BARBERS); }
  getBarberById(id) { return this._get(STORAGE_KEYS.BARBERS).find(b => b.id === id); }
  saveBarber(barber) {
    const barbers = this._get(STORAGE_KEYS.BARBERS);
    if (barber.id) {
      const idx = barbers.findIndex(b => b.id === barber.id);
      if (idx >= 0) barbers[idx] = { ...barbers[idx], ...barber };
    } else {
      barber.id = Date.now();
      barber.active = true;
      barbers.push(barber);
    }
    this._set(STORAGE_KEYS.BARBERS, barbers);
    return barber;
  }
  deleteBarber(id) {
    const barbers = this._get(STORAGE_KEYS.BARBERS).map(b => b.id === id ? { ...b, active: false } : b);
    this._set(STORAGE_KEYS.BARBERS, barbers);
  }

  // Appointments
  getAppointments() { return this._get(STORAGE_KEYS.APPOINTMENTS); }
  getAppointmentsByDate(date) {
    return this._get(STORAGE_KEYS.APPOINTMENTS).filter(a => a.dataCorte === date && a.status !== 'cancelled');
  }
  getAppointmentsByBarberAndDate(barberId, date) {
    return this._get(STORAGE_KEYS.APPOINTMENTS).filter(a => a.barberId === barberId && a.dataCorte === date && a.status !== 'cancelled');
  }
  getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointmentsByDate(today);
  }
  saveAppointment(appointment) {
    const appointments = this._get(STORAGE_KEYS.APPOINTMENTS);
    appointment.id = appointment.id || `HC-${Date.now().toString(36).toUpperCase()}`;
    appointment.status = appointment.status || 'confirmed';
    appointment.createdAt = appointment.createdAt || new Date().toISOString();
    appointments.push(appointment);
    this._set(STORAGE_KEYS.APPOINTMENTS, appointments);
    // Save/update client
    this.saveClient({ name: appointment.nome, phone: appointment.telefone });
    return appointment;
  }
  updateAppointmentStatus(id, status) {
    const appointments = this._get(STORAGE_KEYS.APPOINTMENTS);
    const idx = appointments.findIndex(a => a.id === id);
    if (idx >= 0) {
      appointments[idx].status = status;
      this._set(STORAGE_KEYS.APPOINTMENTS, appointments);
    }
  }
  isSlotAvailable(barberId, date, time) {
    const appointments = this._get(STORAGE_KEYS.APPOINTMENTS);
    return !appointments.some(a =>
      a.barberId === barberId &&
      a.dataCorte === date &&
      a.horario === time &&
      a.status !== 'cancelled'
    );
  }

  // Clients
  getClients() { return this._get(STORAGE_KEYS.CLIENTS); }
  saveClient(client) {
    const clients = this._get(STORAGE_KEYS.CLIENTS);
    const existing = clients.find(c => c.phone === client.phone);
    if (!existing && client.phone) {
      client.id = Date.now();
      client.createdAt = new Date().toISOString();
      clients.push(client);
      this._set(STORAGE_KEYS.CLIENTS, clients);
    }
    return client;
  }

  // Config
  getConfig() { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CONFIG) || '{}'); }
  saveConfig(config) {
    const current = this.getConfig();
    this._set(STORAGE_KEYS.CONFIG, { ...current, ...config });
  }

  // Blocked Dates
  getBlockedDates() { return this._get(STORAGE_KEYS.BLOCKED_DATES); }
  addBlockedDate(date, reason) {
    const blocked = this._get(STORAGE_KEYS.BLOCKED_DATES);
    if (!blocked.find(b => b.date === date)) {
      blocked.push({ date, reason, id: Date.now() });
      this._set(STORAGE_KEYS.BLOCKED_DATES, blocked);
    }
  }
  removeBlockedDate(id) {
    const blocked = this._get(STORAGE_KEYS.BLOCKED_DATES).filter(b => b.id !== id);
    this._set(STORAGE_KEYS.BLOCKED_DATES, blocked);
  }
  isDateBlocked(date) {
    return this._get(STORAGE_KEYS.BLOCKED_DATES).some(b => b.date === date);
  }

  // Auth
  login(password) {
    const config = this.getConfig();
    if (password === config.adminPassword) {
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  }
  isAuthenticated() {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  }
  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  }

  // Stats
  getStats() {
    const today = new Date().toISOString().split('T')[0];
    const appointments = this.getAppointments();
    const todayAppts = appointments.filter(a => a.dataCorte === today && a.status !== 'cancelled');
    const monthAppts = appointments.filter(a => {
      const d = new Date(a.dataCorte);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && a.status !== 'cancelled';
    });

    const services = this.getAllServices();
    let todayRevenue = 0;
    let monthRevenue = 0;
    todayAppts.forEach(a => {
      const svc = services.find(s => s.name === a.servico);
      if (svc) todayRevenue += svc.price;
    });
    monthAppts.forEach(a => {
      const svc = services.find(s => s.name === a.servico);
      if (svc) monthRevenue += svc.price;
    });

    return {
      todayCount: todayAppts.length,
      monthCount: monthAppts.length,
      todayRevenue,
      monthRevenue,
      totalClients: this.getClients().length,
      totalAppointments: appointments.length,
    };
  }

  // Testimonials (static)
  getTestimonials() { return DEFAULT_TESTIMONIALS; }

  // Generate available time slots
  getAvailableSlots(barberId, date) {
    const config = this.getConfig();
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
    const dayKey = days[dayOfWeek];
    const dayConfig = config.openingHours[dayKey];

    if (!dayConfig || !dayConfig.active) return [];
    if (this.isDateBlocked(date)) return [];

    const slots = [];
    const [openH, openM] = dayConfig.open.split(':').map(Number);
    const [closeH, closeM] = dayConfig.close.split(':').map(Number);
    const interval = config.slotInterval || 30;

    let current = openH * 60 + openM;
    const end = closeH * 60 + closeM;

    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0];

    while (current < end) {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;

      // Check if slot is in the past for today
      let available = true;
      if (isToday) {
        const slotTime = new Date();
        slotTime.setHours(parseInt(h), parseInt(m), 0, 0);
        if (slotTime <= now) available = false;
      }

      // Check if slot is booked
      if (available && barberId !== 'any') {
        available = this.isSlotAvailable(barberId, date, timeStr);
      }

      slots.push({ time: timeStr, available });
      current += interval;
    }

    return slots;
  }
}

export const store = new Store();
export default store;
