  document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Vérifier l'état de maintenance avant soumission
    const maintenanceStatus = await fetch(MAINTENANCE_API_URL)
      .then(res => res.json())
      .catch(() => ({ isActive: false }));

    if (maintenanceStatus.isActive) {
      alert("Désolé, le formulaire est temporairement indisponible en raison d'une maintenance.\n\n" + 
            maintenanceStatus.message);
      return;
    }

    // Soumission normale (remplacez par votre logique)
    alert("Formulaire soumis avec succès (simulation)");
    e.target.reset();
  });
