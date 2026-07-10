document.addEventListener("DOMContentLoaded", () => {
    
    // Éléments d'Authentification
    const authSection = document.getElementById("auth-section");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const registerMessage = document.getElementById("registerMessage");
    const navConnectBtn = document.getElementById("navConnectBtn");
    
    // Éléments du Tableau de bord
    const dashboardSection = document.getElementById("dashboard-section");
    const displayStudentName = document.getElementById("displayStudentName");
    const logoutBtn = document.getElementById("logoutBtn");

    // 1. GESTION DE LA CONNEXION (Simulation)
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Bloque le rechargement
        
        // On récupère juste l'email pour simuler la session
        const email = document.getElementById("loginEmail").value;
        const pseudoName = email.split('@')[0]; // Extrait un faux nom depuis l'email
        
        connectUser(pseudoName);
    });

    // 2. GESTION DE L'INSCRIPTION & VALIDATION COMPLÈTE
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const name = document.getElementById("regName").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value;
        const confirm = document.getElementById("regConfirm").value;

        // Validation des mots de passe
        if (password !== confirm) {
            registerMessage.textContent = "Les mots de passe ne correspondent pas.";
            registerMessage.className = "form-message error";
            return;
        }

        if (password.length < 6) {
            registerMessage.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
            registerMessage.className = "form-message error";
            return;
        }

        // Si tout est bon, on connecte l'utilisateur
        connectUser(name);
    });

    // 3. FONCTION DE CONNEXION (Bascule l'affichage)
    function connectUser(name) {
        // Met à jour le nom sur le dashboard
        displayStudentName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
        
        // Cache la section Auth et affiche le Dashboard
        authSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
        
        // Masque le bouton connexion de la barre de navigation
        navConnectBtn.classList.add("hidden");
        
        // Optionnel : Nettoyer les formulaires
        loginForm.reset();
        registerForm.reset();
    }

    // 4. GESTION DE LA DÉCONNEXION
    logoutBtn.addEventListener("click", () => {
        dashboardSection.classList.add("hidden");
        authSection.classList.remove("hidden");
        navConnectBtn.classList.remove("hidden");
    });

    // 5. ANNULER UNE INSCRIPTION
    const cancelButtons = document.querySelectorAll(".btn-cancel");
    
    cancelButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            // Demander confirmation via le navigateur
            const confirmCancel = confirm("Êtes-vous sûr de vouloir annuler votre participation à cet événement ?");
            
            if (confirmCancel) {
                // e.target = le bouton cliqué.
                // .closest('.event-card') trouve la carte d'événement parente et la supprime du DOM.
                const eventCard = e.target.closest(".event-card");
                if (eventCard) {
                    eventCard.remove();
                    alert("Inscription annulée avec succès.");
                }
            }
        });
    });
});