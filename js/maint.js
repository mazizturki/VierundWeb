// js/maintenance.js
const MAINTENANCE_API_URL = 'https://vierund-maintenance.onrender.com/api/maintenance';

async function checkMaintenance() {
  try {
    const response = await fetch(MAINTENANCE_API_URL);
    if (!response.ok) throw new Error('Erreur réseau');
    return await response.json();
  } catch (error) {
    console.error('Erreur API Maintenance:', error);
    return { isActive: false }; // Mode normal si l'API échoue
  }
}

function showMaintenanceBanner(message) {
  // Crée la bannière si elle n'existe pas
  let banner = document.getElementById('maintenance-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'maintenance-banner';
    banner.className = 'maintenance-banner';
    banner.innerHTML = `
      <div class="maintenance-content">
        <span class="maintenance-icon">⚠️</span>
        <span class="maintenance-text">${message}</span>
      </div>
    `;
    document.body.prepend(banner);
  }
}

function enableMaintenanceMode(message) {
  document.body.classList.add('maintenance-mode');
  showMaintenanceBanner(message || 'Maintenance en cours...');
}

function disableMaintenanceMode() {
  document.body.classList.remove('maintenance-mode');
  const banner = document.getElementById('maintenance-banner');
  if (banner) banner.remove();
}

// Vérifie l'état toutes les 5 minutes (optionnel)
async function initMaintenanceCheck() {
  const { isActive, message } = await checkMaintenance();
  isActive ? enableMaintenanceMode(message) : disableMaintenanceMode();
  
  // Vérification périodique (optionnel)
  setInterval(async () => {
    const status = await checkMaintenance();
    status.isActive ? enableMaintenanceMode(status.message) : disableMaintenanceMode();
  }, 300000); // 5 minutes
}

// Bloque les formulaires en maintenance
function handleForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      const { isActive, message } = await checkMaintenance();
      if (isActive) {
        e.preventDefault();
        alert(`Service indisponible : ${message}`);
      }
    });
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  initMaintenanceCheck();
  handleForms();
});