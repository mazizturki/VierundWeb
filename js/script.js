  // Config
  const MAINTENANCE_API_URL = 'https://vierund-maintenance.onrender.com/api/maintenance';
  const BYPASS_TOKEN = 'tt44315015'; // À stocker côté serveur en prod

  // Éléments UI
  const maintenanceBanner = document.createElement('div');
  maintenanceBanner.id = 'maintenance-alert';
  maintenanceBanner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(220, 38, 38, 0.95);
    color: white;
    padding: 12px 0;
    z-index: 1000;
    backdrop-filter: blur(8px);
    transform: translateY(100%);
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  `;

  // Structure du bandeau
  maintenanceBanner.innerHTML = `
    <div class="container">
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center">
          <svg class="me-3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="flex-shrink: 0;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <span id="maintenance-message">Maintenance en cours</span>
        </div>
        <small id="maintenance-time" class="text-white-50"></small>
      </div>
    </div>
  `;

  document.body.appendChild(maintenanceBanner);

  // Vérification périodique
  function checkMaintenanceStatus() {
    fetch(MAINTENANCE_API_URL, {
      headers: { 'x-bypass-token': BYPASS_TOKEN }
    })
      .then(response => response.json())
      .then(data => {
        const alertElement = document.getElementById('maintenance-alert');
        const messageElement = document.getElementById('maintenance-message');
        const timeElement = document.getElementById('maintenance-time');

        if (data.isActive) {
          messageElement.textContent = data.message || "Maintenance en cours - Merci de votre patience";
          timeElement.textContent = new Date().toLocaleTimeString();
          alertElement.style.transform = 'translateY(0)';
          
          // Pulse animation
          alertElement.style.animation = 'pulse 2s infinite';
          document.head.insertAdjacentHTML('beforeend', `
            <style>
              @keyframes pulse {
                0% { opacity: 0.95; }
                50% { opacity: 0.8; }
                100% { opacity: 0.95; }
              }
            </style>
          `);
        } else {
          alertElement.style.transform = 'translateY(100%)';
        }
      })
      .catch(error => {
        console.error("Erreur API maintenance:", error);
      });
  }

  // Vérification initiale + toutes les 5 minutes
  checkMaintenanceStatus();
  setInterval(checkMaintenanceStatus, 300000);
