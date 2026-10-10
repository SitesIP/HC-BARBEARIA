// ===== Mobile Bottom Tab Navigation (Steel & Graphite Theme) =====

export function renderBottomNav(currentPath = '/') {
  const hash = window.location.hash.slice(1) || currentPath || '/';
  const cleanPath = hash.split('?')[0] || '/';

  const navItems = [
    {
      route: '/',
      label: 'Início',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
    },
    {
      route: '/servicos',
      label: 'Serviços',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="8.5" y1="8.5" x2="20" y2="20"></line><line x1="8.5" y1="15.5" x2="20" y2="4"></line></svg>`
    },
    {
      route: '/agendar',
      label: 'Agendar',
      isPrimary: true,
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><path d="M12 14v4M10 16h4"></path></svg>`
    },
    {
      route: '/profissionais',
      label: 'Profissionais',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
    },
    {
      route: '/contato',
      label: 'Contato',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`
    },
  ];

  return `
    <nav class="mobile-bottom-tabs" id="mobile-bottom-tabs" aria-label="Navegação em abas">
      <div class="mobile-tabs-container">
        ${navItems.map(item => {
          const isActive = cleanPath === item.route;
          if (item.isPrimary) {
            return `
              <a href="#${item.route}" class="tab-item tab-primary ${isActive ? 'active' : ''}" id="tab-bnav-agendar">
                <div class="tab-primary-btn">
                  ${item.icon}
                </div>
                <span class="tab-label">${item.label}</span>
              </a>
            `;
          }
          return `
            <a href="#${item.route}" class="tab-item ${isActive ? 'active' : ''}" id="tab-bnav-${item.route.replace('/', '') || 'home'}">
              <span class="tab-icon">${item.icon}</span>
              <span class="tab-label">${item.label}</span>
            </a>
          `;
        }).join('')}
      </div>
    </nav>
  `;
}
