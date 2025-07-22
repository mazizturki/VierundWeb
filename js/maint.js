const MAINTENANCE_API = 'https://vierund-maintenance.onrender.com/api/maintenance';

class MaintenanceSystem {
  constructor() {
    this.init();
  }

  async init() {
    await this.checkStatus();
    this.setupListeners();
    this.startPolling(300000); // 5 minutes
  }

  async checkStatus() {
    try {
      const response = await fetch(MAINTENANCE_API, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const { isActive, message } = await response.json();
      isActive ? this.activate(message) : this.deactivate();
      
    } catch (error) {
      console.error('Maintenance check failed:', error);
      this.deactivate(); // Fallback to normal mode
    }
  }

  activate(message = 'Maintenance en cours...') {
    if (document.body.classList.contains('maintenance-mode')) return;
    
    document.body.classList.add('maintenance-mode');
    
    // Create banner if not exists
    if (!document.getElementById('maintenance-banner')) {
      const banner = document.createElement('div');
      banner.id = 'maintenance-banner';
      banner.className = 'maintenance-banner';
      banner.innerHTML = `
        <div class="maintenance-content">
          <span class="maintenance-icon">⚠️</span>
          <span class="maintenance-message">${message}</span>
        </div>
      `;
      document.body.prepend(banner);
    }
  }

  deactivate() {
    document.body.classList.remove('maintenance-mode');
    const banner = document.getElementById('maintenance-banner');
    if (banner) banner.remove();
  }

  setupListeners() {
    // Block form submissions
    document.addEventListener('submit', async (e) => {
      if (document.body.classList.contains('maintenance-mode')) {
        e.preventDefault();
        const { message } = await this.getCurrentStatus();
        alert(`Service indisponible : ${message || 'Maintenance en cours'}`);
      }
    });

    // Optional: Add bypass for testing
    if (window.location.search.includes('maintenance_bypass')) {
      document.body.classList.add('maintenance-bypass');
    }
  }

  startPolling(interval) {
    setInterval(() => this.checkStatus(), interval);
  }

  async getCurrentStatus() {
    try {
      const response = await fetch(MAINTENANCE_API);
      return await response.json();
    } catch {
      return { isActive: false };
    }
  }
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new MaintenanceSystem());
} else {
  new MaintenanceSystem();
}