// ===== SPA router =====

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.beforeEach = null;

    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  on(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const params = new URLSearchParams(queryString || '');

    // Find matching route
    let handler = null;
    let routeParams = {};

    for (const [routePath, routeHandler] of Object.entries(this.routes)) {
      const match = this.matchRoute(routePath, path);
      if (match) {
        handler = routeHandler;
        routeParams = match;
        break;
      }
    }

    if (!handler) {
      // Try default route
      handler = this.routes['/'] || this.routes['*'];
    }

    if (this.beforeEach) {
      const proceed = this.beforeEach(path, this.currentRoute);
      if (!proceed) return;
    }

    this.currentRoute = path;

    if (handler) {
      handler({ path, params: routeParams, query: params });
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  matchRoute(routePath, actualPath) {
    const routeParts = routePath.split('/');
    const actualParts = actualPath.split('/');

    if (routeParts.length !== actualParts.length) return null;

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = actualParts[i];
      } else if (routeParts[i] !== actualParts[i]) {
        return null;
      }
    }

    return params;
  }
}

export const router = new Router();
export default router;
