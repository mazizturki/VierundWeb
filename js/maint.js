  const MAINTENANCE_API_URL = 'https://vierund-maintenance.onrender.com/api/maintenance';
  
  // Fonction pour activer le mode maintenance
  function enableMaintenanceMode(message) {
    document.body.classList.add('maintenance-mode');
    
    // Créer ou mettre à jour la bannière de maintenance
    let alertDiv = document.getElementById('maintenance-alert');
    if (!alertDiv) {
      alertDiv = document.createElement('div');
      alertDiv.id = 'maintenance-alert';
      alertDiv.className = 'alert alert-danger text-center py-3 mb-0 rounded-0 position-fixed bottom-0 start-0 end-0';
      alertDiv.style.zIndex = '1000';
      alertDiv.innerHTML = `
        <strong>⚠️ Maintenance en cours :</strong> ${message || 'Le site est actuellement en maintenance. Nous serons de retour rapidement.'}
      `;
      document.body.appendChild(alertDiv);
    } else {
      alertDiv.innerHTML = `
        <strong>⚠️ Maintenance en cours :</strong> ${message || 'Le site est actuellement en maintenance. Nous serons de retour rapidement.'}
      `;
    }
  }
  
  // Fonction pour désactiver le mode maintenance
  function disableMaintenanceMode() {
    document.body.classList.remove('maintenance-mode');
    const alertDiv = document.getElementById('maintenance-alert');
    if (alertDiv) {
      alertDiv.remove();
    }
  }
  
  // Vérifier l'état de maintenance au chargement
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch(MAINTENANCE_API_URL);
      const data = await response.json();
      
      if (data.isActive) {
        enableMaintenanceMode(data.message);
      } else {
        disableMaintenanceMode();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mode maintenance:', error);
      // En cas d'erreur, on ne bloque pas le site
      disableMaintenanceMode();
    }
  });
  
  // Intercepter les soumissions de formulaire
  document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
    try {
      const maintenanceStatus = await fetch(MAINTENANCE_API_URL)
        .then(res => res.json())
        .catch(() => ({ isActive: false }));
      
      if (maintenanceStatus.isActive) {
        e.preventDefault();
        alert(`Désolé, le formulaire est temporairement indisponible en raison d'une maintenance.\n\n${maintenanceStatus.message}`);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du mode maintenance:', error);
      // En cas d'erreur, on laisse le formulaire se soumettre
    }
  });
// js/script.js
  // URL de l'API de maintenance