// js/maint.js - Version optimisée
const MAINTENANCE_API = 'https://vierund-maintenance.onrender.com/api/maintenance';

class MaintenanceSystem {
  constructor() {
    this.lastStatus = { isActive: false };
    this.init();
  }

  async init() {
    await this.checkStatus();
    this.setupListeners();
    this.startPolling(300000); // Vérifie toutes les 5 minutes
  }

  async checkStatus() {
    try {
      const response = await fetch(MAINTENANCE_API, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      // Gestion spéciale du statut 503
      if (response.status === 503) {
        const data = await response.json().catch(() => ({
          isActive: true,
          message: "Maintenance planifiée en cours"
        }));
        this.activate(data.message);
        return;
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      this.lastStatus = data;
      data.isActive ? this.activate(data.message) : this.deactivate();
      
    } catch (error) {
      console.error('Maintenance check failed:', error);
      // En cas d'erreur, conserve le dernier statut connu
      this.lastStatus.isActive ? this.activate(this.lastStatus.message) : this.deactivate();
    }
  }

  activate(message = 'Maintenance en cours...') {
    if (document.body.classList.contains('maintenance-mode')) return;
    
    document.body.classList.add('maintenance-mode');
    
    // Crée ou met à jour la bannière
    let banner = document.getElementById('maintenance-banner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'maintenance-banner';
      banner.className = 'maintenance-banner';
      document.body.prepend(banner);
    }
    banner.innerHTML = `
      <div class="maintenance-content">
        ⚠️ ${message}
      </div>
    `;
  }

  deactivate() {
    document.body.classList.remove('maintenance-mode');
    const banner = document.getElementById('maintenance-banner');
    if (banner) banner.remove();
  }

  setupListeners() {
    // Bloque les formulaires en maintenance
    document.addEventListener('submit', (e) => {
      if (this.lastStatus.isActive) {
        e.preventDefault();
        alert(`Service indisponible : ${this.lastStatus.message}`);
      }
    });
  }

  startPolling(interval) {
    setInterval(() => this.checkStatus(), interval);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => new MaintenanceSystem());