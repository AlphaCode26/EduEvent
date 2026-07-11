// script global 

/* =========================================================
   1. CHARGEMENT DYNAMIQUE DE 3 ÉVÉNEMENTS EN VEDETTE
   ========================================================= */
   
//foonction pour charger les evenements en vedette(3 premye yo) depuis le fichier JSON
function chargerEvenements() {
    //selection du conteneur d'evenement
    const eventGrid = document.querySelector('.events-grid');
    if(!eventGrid) return;
  
    // Recuperation du fichier JSON
    fetch('/data/evenements.json')
        .then(response => response.json())
        .then(evenements => {
        
            // les 3 premier evenements
            const enVedette = evenements.slice(0, 3);
      
            eventGrid.innerHTML = ""; 
      
            // construction de la carte html pour chaque evenements
            enVedette.forEach(evenement => {
            // on recupere la class de categorie de chaque evenements
                categorieBadge = obtenirClass(evenement.categorie)
        
            //la carte (html)
            const carteHtml = `
                        <article class="event-card">
                            <div class="card-image">
                                <img src="${evenement.image}" alt="${evenement.titre}" width="100">
                            </div>
                            <div class="card-content">
                                <span class="event-badge ${categorieBadge}">${evenement.categorie}</span>
                                <h3 class="event-card-title">${evenement.titre}</h3>
                                <p class="event-card-desc">${evenement.mini_desc}.</p>
                                <a href="detail.html" class="btn btn-secondary">Voir les details</a>
                            </div>
                        </article>
                `;
                //injection dans l fichier html
                eventGrid.insertAdjacentHTML('beforeend', carteHtml);
            });
        })
        //si le fichier json n'est pas charger
        .catch(error => console.error('Erreur lors du chargement des événements :', error));
        //nou ka aficher yon message nan index.html la si nou vle
}

// Fonction qui permet de verifirer lacategorie pour retourner la classe
function obtenirClass(categorie) {  
    const cat = categorie.toLowerCase();
    if (cat.includes('conference') || cat.includes("conférence") || cat.includes('soutenance')) return 'badge-tech';
    if (cat.includes('sport') || cat.includes('compétition') || cat.includes('competition')) return 'badge-sport';
    if (cat.includes('culture') || cat.includes('atelier')) return 'badge-culture';
}

// on lance la fonction 
chargerEvenements();

/* =========================================================
   2. ANIMATION DES STATISTIQUES AU SCROLL
   ========================================================= */
   
//Fonction compteur d'animation
function compteurAnimation(element) {
    // recuperation de la valeur cible 
    const target = parseInt(element.getAttribute('data-target'));
    const dure = 2000; //  2 seconde 
    const stepTime = Math.max(Math.floor(dure / target), 15); // vitesse de l'animation
    let valeur = 0;
    
    //
    const incrementation = target > 100 ? Math.ceil(target / 100) : 1;
    
    //
    const timer = setInterval(() => {
        valeur += incrementation;
    
        if (valeur >= target) {
            element.textContent = target; 
            clearInterval(timer);
        } else {
            element.textContent = valeur;
        }
    }, stepTime);
}

//fonction qui observer la setion statistique pour initialiser l'animation
function startAnimation() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return; // Si la section n'existe pas, on sort

    // On récupère tous les compteurs de la section
    const statNumber = statsSection.querySelectorAll('.stat-number');

    // On crée un observateur d'intersection
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            // Si la section est visible dans le viewport
            if (entry.isIntersecting) {
                // On anime chaque compteur
                statNumber.forEach(stat => compteurAnimation(stat));
                // On arrête d'observer (l'animation ne se joue qu'une fois)
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.3 // L'animation se déclenche quand 30% de la section est visible
    });

    // On commence à observer la section
    observer.observe(statsSection);
}

//on lance la function d'animation
startAnimation();

//foction
function afficherFAQ() {
    // Tab to edit
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
        const header = item.querySelector(".accordion-header");
        
        if (header) {
            header.addEventListener("click", () => {
                // Fermer tous les autres accordeons ouverts
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove("active");
                    }
                });
                // Ouvrir ou fermer l'accordeon a chaque clic
                item.classList.toggle("active");
            });
        }
    });
}
//on appelle la fonction 
afficherFAQ();

/* =========================================================
   3. VALIDATION DU FORMULAIRE DE CONTACT
   ========================================================= */

// Fonction qui valide le formulaire de contact (dans apropos.html)
function validerFormulaire() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    // On écoute la soumission du formulaire
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.querySelector('#contactNom').value.trim();
        const email = form.querySelector('#contactEmail').value.trim();
        const message = form.querySelector('#contactMessage').value.trim();

        // On réinitialise les messages d'erreur précédents
        effacerErreur(form);

        let estValid = true;

        // --- Validation du nom ---
        // Le nom doit faire au moins 2 caractères et contenir uniquement des lettres/espaces
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,}$/;
        if (!nameRegex.test(name)) {
            afficherErreur(form, '#contactNom', 'Veuillez entrer un nom valide (minimum 2 lettres).');
            estValid = false;
        }

        // --- Validation de l'email ---
        // Regex classique pour vérifier le format d'un email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            afficherErreur(form, '#contactEmail', 'Veuillez entrer une adresse email valide.');
            estValid = false;
        }

        // --- Validation du message ---
        // Le message doit faire au moins 10 caractères
        if (message.length < 10) {
            afficherErreur(form, '#contactMessage', 'Le message doit contenir au moins 10 caractères.');
            estValid = false;
        }

        // Si tout est valide, on affiche un message de succès
        if (estValid) {
            afficherSucces(form, 'Merci ! Votre message a bien été envoyé. Nous vous répondrons rapidement.');
            form.reset();
        }
    });
}


// Fonction qui affiche un message d'erreur sous un champ
function afficherErreur(form, selecteur, message) {
    const field = form.querySelector(selecteur); 
    const erreur = document.createElement('small'); 
    erreur.className = 'error-message'; 
    erreur.style.color = '#C62828';
    erreur.style.display = 'block';
    erreur.style.marginTop = '0.3rem';
    erreur.textContent = message; // Le texte de l'erreur
    field.parentNode.insertBefore(erreur, field.nextSibling); 
    field.style.borderColor = '#C62828';
}

// Fonction qui affiche un message de succès
function afficherSucces(form, message) {
    const success = document.createElement('div');       
    success.className = 'form-message success';          
    success.textContent = message;                       
    form.appendChild(success);                           

    // disparition après 5s
    setTimeout(() => success.remove(), 5000);
}

// Fonction qui effacera tous les messages d'erreur 
function effacerErreur(form) {
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('input, textarea').forEach(field => {
        field.style.borderColor = '#ccc';
    });
    const oldSuccess = form.querySelector('.form-message');
    if (oldSuccess) oldSuccess.remove();
}

validerFormulaire();
