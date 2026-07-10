/* ==========================================
   11. SCRIPT GLOBAL, STATS, FAQ & CONTACT
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ANIMATION DES STATISTIQUES (Page d'accueil) ---
    // La fonction s'exécute de manière sécurisée même si les éléments n'existent pas sur la page active
    animateStatistics();


    // --- 2. ACCORDÉON DE LA FAQ (Page À Propos) ---
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
        const header = item.querySelector(".accordion-header");
        
        if (header) {
            header.addEventListener("click", () => {
                // Fermer tous les autres accordéons ouverts pour un effet propre
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                    }
                });
                // Ouvrir ou fermer l'accordéon sur lequel on a cliqué
                item.classList.toggle("active");
            });
        }
    });


    // --- 3. FORMULAIRE DE CONTACT (Page À Propos) ---
    const contactForm = document.getElementById("contactForm");
    const contactMessageAlert = document.getElementById("contactMessageAlert");

    // La condition "if (contactForm)" évite que le script ne plante sur les autres pages où le formulaire n'existe pas
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault(); // Empêche le rechargement de la page lors de la soumission
            
            // Simulation visuelle de l'envoi du message
            contactMessageAlert.textContent = "Merci ! Votre message a bien été envoyé à notre équipe.";
            contactMessageAlert.className = "form-message success";
            contactMessageAlert.style.display = "block";
            
            // Réinitialisation des champs du formulaire
            contactForm.reset();
        });
    }

});

/**
 * Fonction qui anime les compteurs numériques de la section Statistiques
 */
function animateStatistics() {
    const stats = document.querySelectorAll(".stat-number");
    
    // Si aucun élément de statistiques n'est trouvé (ex: sur la page À propos), on arrête la fonction ici
    if (stats.length === 0) return;

    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute("data-target"), 10);
        const duration = 2000; // Durée totale de l'animation en millisecondes (2 secondes)
        const stepTime = Math.max(Math.floor(duration / target), 15); // Vitesse d'incrémentation
        let current = 0;
        
        // Calcul de l'incrément par étape pour les grands nombres (ex: 3200)
        const increment = target > 100 ? Math.ceil(target / 100) : 1;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                stat.textContent = target; // S'assure de bloquer exactement sur le chiffre ciblé
                clearInterval(timer);
            } else {
                stat.textContent = current;
            }
        }, stepTime);
    });
}