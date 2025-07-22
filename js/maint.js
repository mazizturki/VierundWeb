// js/maint.js
const MAINTENANCE_API = 'https://vierund-maintenance.onrender.com/api/maintenance';
const BYPASS_TOKEN = 'tt44315015'; // Doit correspondre à celui de l'API

class MaintenanceSystem {
  constructor() {
    this.init();
  }

  async init() {
    // Vérifie d'abord le bypass avant tout
    if (this.checkBypass()) {
      this.showBypassIndicator();
      return; // Ne pas activer la maintenance si bypass est actif
    }
    
    await this.checkStatus();
    this.startPolling(300000);
  }

  checkBypass() {
    // Vérifie dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const bypassToken = urlParams.get('bypass');
    
    // Vérifie dans le localStorage
    const storedToken = localStorage.getItem('maintenance_bypass');
    
    // Si token valide dans l'URL, le stocker pour les visites suivantes
    if (bypassToken === BYPASS_TOKEN) {
      localStorage.setItem('maintenance_bypass', BYPASS_TOKEN);
      return true;
    }
    
    // Vérifier le token stocké
    return storedToken === BYPASS_TOKEN;
  }

  showBypassIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'bypass-indicator';
    indicator.innerHTML = `
      <div class="bypass-banner">
        Mode admin actif - Maintenance bypassée
        <button id="disable-bypass">Désactiver</button>
      </div>
    `;
    document.body.appendChild(indicator);
    
    document.getElementById('disable-bypass').addEventListener('click', () => {
      localStorage.removeItem('maintenance_bypass');
      window.location.search = '';
    });
  }

  async checkStatus() {
    try {
      const response = await fetch(MAINTENANCE_API, {
        headers: {
          'X-Bypass-Token': localStorage.getItem('maintenance_bypass') || ''
        }
      });
      
      const data = await response.json();
      data.isActive ? this.showMaintenancePage(data.message) : this.hideMaintenancePage();
    } catch (error) {
      console.error('Maintenance check failed:', error);
      this.hideMaintenancePage();
    }
  }

  showMaintenancePage(message) {
    // Ne rien faire si la page de maintenance est déjà affichée
    if (document.getElementById('full-maintenance-page')) return;
    
    // Créer la page de maintenance complète
    const maintenancePage = document.createElement('div');
    maintenancePage.id = 'full-maintenance-page';
    maintenancePage.innerHTML = `
      <div class="maintenance-container">
        <div class="maintenance-content">
          <h1>🛠 Maintenance </h1>
          <p class="maintenance-message">${message}</p>
          <div class="maintenance-details">
            <p>Vieurnd Web v1.0.0</p>
            <p>Veuillez nous excuser pour la gêne occasionnée.</p>
          </div>
          <div class="maintenance-footer">
            <p>Contact d'urgence : <a href="mailto:contact.vierund@gmail.com">contact.vierund@gmail.com</a></p>
          </div>
        </div>
      </div>
    `;
    
    // Masquer le contenu original
    document.body.style.overflow = 'hidden';
    document.body.innerHTML = '';
    document.body.appendChild(maintenancePage);
  }

  hideMaintenancePage() {
    const maintenancePage = document.getElementById('full-maintenance-page');
    if (maintenancePage) {
      // Recharger la page pour restaurer le contenu original
      window.location.reload();
    }
  }

  startPolling(interval) {
    setInterval(() => this.checkStatus(), interval);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => new MaintenanceSystem());