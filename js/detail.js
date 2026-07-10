document.addEventListener("DOMContentLoaded", () => {
    const inscriptionForm = document.getElementById("inscriptionForm");
    const placesRestantesSpan = document.getElementById("placesRestantes");
    const formMessage = document.getElementById("formMessage");
    const submitBtn = inscriptionForm.querySelector("button[type='submit']");

    let places = parseInt(placesRestantesSpan.textContent, 10);

    inscriptionForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Empêche le rechargement de la page

        // Vérification si des places sont encore disponibles
        if (places <= 0) {
            afficherMessage("Désolé, cet événement est complet.", "error");
            return;
        }

        // Récupération des valeurs
        const nom = document.getElementById("nomInput").value.trim();
        const email = document.getElementById("emailInput").value.trim();
        const matricule = document.getElementById("matriculeInput").value.trim();

        // Validation basique (bien que le HTML5 'required' fasse déjà une partie du travail)
        if (nom === "" || email === "" || matricule === "") {
            afficherMessage("Veuillez remplir tous les champs obligatoires.", "error");
            return;
        }

        // Si tout est valide, on simule l'inscription
        places--; // On retire une place
        placesRestantesSpan.textContent = places; // Mise à jour de l'affichage

        // Changer l'apparence du compteur si l'événement devient complet
        if (places === 0) {
            placesRestantesSpan.parentElement.classList.add("sold-out");
            placesRestantesSpan.parentElement.innerHTML = "Événement complet";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.5";
            submitBtn.style.cursor = "not-allowed";
        }

        afficherMessage(`Merci ${nom} ! Votre inscription a bien été enregistrée.`, "success");
        
        // Optionnel : Réinitialiser le formulaire
        inscriptionForm.reset();
    });

    // Fonction utilitaire pour afficher les messages
    function afficherMessage(texte, type) {
        formMessage.textContent = texte;
        formMessage.className = "form-message"; // Réinitialise les classes
        formMessage.classList.add(type); // Ajoute 'success' ou 'error'
    }
});