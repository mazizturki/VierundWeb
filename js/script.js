        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
        
        // Initialize Particles.js
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('particles-js')) {
                particlesJS('particles-js', {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#00F0FF"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            }
                        },
                        "opacity": {
                            "value": 0.3,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#00F0FF",
                            "opacity": 0.2,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 1,
                            "direction": "none",
                            "random": true,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 140,
                                "line_linked": {
                                    "opacity": 0.5
                                }
                            },
                            "push": {
                                "particles_nb": 4
                            }
                        }
                    },
                    "retina_detect": true
                });
            }
            
            // Form validation
            const form = document.getElementById('contactForm');
            form.addEventListener('submit', function(event) {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
// Gestion du loader
let loaderTimeout;

function showLoaderFor15Seconds() {
  const loader = document.getElementById('global-loader');
  
  // Annuler tout timeout précédent
  if (loaderTimeout) clearTimeout(loaderTimeout);
  
  // Afficher le loader
  loader.style.opacity = '1';
  loader.style.pointerEvents = 'auto';
  
  // Cacher après 15 secondes
  loaderTimeout = setTimeout(() => {
    hideLoader();
  }, 15000); // 15 secondes
}

function hideLoader() {
  const loader = document.getElementById('global-loader');
  loader.style.opacity = '0';
  
  // Désactiver les interactions après l'animation
  setTimeout(() => {
    loader.style.pointerEvents = 'none';
  }, 500); // Doit correspondre à la durée de la transition CSS
}

// Masquer le loader quand la page est chargée
window.addEventListener('DOMContentLoaded', () => {
  showLoaderFor15Seconds();
});

window.addEventListener('load', () => {
  // Si la page est déjà chargée avant 15s, cacher immédiatement
  if (performance.now() < 15000) {
    setTimeout(hideLoader, 500);
  }
});

// Exemple d'utilisation pour les requêtes
async function fetchMaintenanceStatus() {
  showLoaderFor15Seconds();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // Timeout API à 10s
  
  try {
    const response = await fetch('https://vierund-maintenance.onrender.com/api/maintenance', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('Erreur serveur');
    return await response.json();
    
  } catch (error) {
    console.error('Erreur fetch:', error);
    throw error;
  } finally {
    // Ne pas cacher si les 15s ne sont pas écoulées
    const elapsed = performance.now();
    if (elapsed >= 15000) {
      hideLoader();
    } else {
      setTimeout(hideLoader, 15000 - elapsed);
    }
  }
}

// Utilisation
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const status = await fetchMaintenanceStatus();
    console.log('Status:', status);
  } catch (error) {
    console.error('Failed to load status:', error);
  }
});