/* =========================================================
   evenements.js — Script de la page "Tous les événements"
   Gère : recherche, filtres, toggle vue, chargement progressif
   ========================================================= */


// variable globale 

let tousLesEvenements = []; //tableau qui contiendra tous les evenements
let filtreEvenements = []; // tableau qui contiendra les filtres
let nbrEvenementsAffiche = 0; //quantite d'evenement afffichees
let chargementParClick = 3;  // nbre d'evenements a afficher a chaque click sur charger plus.


// fonction de recuperation du fichier JSON
function chargerEvenements() {
    // Tab to edit
    fetch('/data/evenements.json')
        .then(response =>{
            if(!response.ok) throw new Error("Erreur lors du chargement du fichier JSON!");
            return response.json();
        })
        
        .then(data =>{
            // on charge tous les evenements dans la variable tousLesEvenements
            tousLesEvenements = data;
            
            // on initialise le filtre a tous les evenements
            filtreEvenements = [...tousLesEvenements];
            
            // On réinitialise le compteur d'affichage
            nbrEvenementsAffiche = 0;
            
            chargementDeFiltre();
        })
        
        .catch(error =>{
            Console.error('Erreur de chargement :', error);
        })
}

//fonction qui charge les evenements filtree dans leur containers
function chargementDeFiltre() {
    // on selectionne le container html
    const eventGrid = document.querySelector('.events-grid') || document.querySelector('.events-list-view');
    if(!eventGrid) return;
    
    const start = nbrEvenementsAffiche;
    const end = nbrEvenementsAffiche + chargementParClick;
    // On extrait les événements à afficher (slice ne modifie pas le tableau original)
    const evenementAfficher = filtreEvenements.slice(start, end);

    // On met e jour le compteur global
    nbrEvenementsAffiche = end;

    // Si c'est le premier affichage, on vide le conteneur
    if (nbrEvenementsAffiche === chargementParClick) {
        eventGrid.innerHTML = '';
    }
    
    // Si aucun événement ne correspond aux filtres
    if (filtreEvenements.length === 0) {
        eventGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--gray-text);">
                <h3>😕 Aucun événement trouvé</h3>
                <p>Essayez de modifier vos critères de recherche.</p>
            </div>
        `;
        // On masque le bouton "Charger plus"
        hideLoadMoreButton();
        return;
    }
    
    evenementAfficher.forEach(evenement => {
        // on recupere la class de categorie de chaque evenements
        categorieBadge = obtenirClass(evenement.categorie)
        // On construit le HTML de la carte (avec mini_desc, pas description)
        const carteHTML = `
            <article class="event-card">
                <div class="card-image">
                    <img src="${evenement.image}" alt="${evenement.titre}">
                </div>
                <div class="card-content">
                    <span class="event-badge ${categorieBadge}">${evenement.categorie}</span>
                    <h3 class="event-card-title">${evenement.titre}</h3>
                    <p class="event-card-date">📅 ${evenement.date} - ${evenement.heure}</p>
                    <p class="event-card-location">📍 ${evenement.lieu}</p>
                    <p class="event-card-desc">${evenement.mini_desc}</p>
                    <a href="detail.html?id=${evenement.id}" class="btn btn-cta">Voir le détail</a>
                </div>
            </article>
        `;
    // On ajoute la carte au conteneur
    eventGrid.insertAdjacentHTML('beforeend', carteHTML);
    });
    
    // On vérifie s'il faut masquer le bouton "Charger plus"
    updateLoadMoreButton();

}

// Fonction qui permet de verifirer lacategorie pour retourner la classe
function obtenirClass(categorie) {
    const cat = categorie.toLowerCase();
    if (cat.includes('conference') || cat.includes("conférence") || cat.includes('soutenance')) return 'badge-tech';
    if (cat.includes('sport') || cat.includes('compétition') || cat.includes('competition')) return 'badge-sport';
    if (cat.includes('culture') || cat.includes('atelier')) return 'badge-culture';
}

// Fonction principale qui applique tous les filtres ensemble
function appliquerFitre() {
    // On récupère la valeur de la barre de recherche
    const searchValue = document.querySelector('#searchInput').value.toLowerCase().trim();
    // On récupère la catégorie sélectionnée dans le <select>
    const categoryValue = document.querySelector('#categoryFilter').value;
    // On récupère le filtre de date sélectionné
    const dateValue = document.querySelector('#dateFilter').value;

    // On filtre le tableau allEvents selon les 3 critères (ET logique)
    filtreEvenements = tousLesEvenements.filter(event => {
        // --- Critère 1 : recherche textuelle ---
        // On cherche dans le titre, la description, le lieu et l'organisateur
        const matchSearch = searchValue === '' ||
            event.titre.toLowerCase().includes(searchValue) ||
            event.description.toLowerCase().includes(searchValue) ||
            event.lieu.toLowerCase().includes(searchValue) ||
            event.organisateur.toLowerCase().includes(searchValue);

        // --- Critère 2 : catégorie ---
        // On mappe les options du <select> aux catégories du JSON
        const matchCategory = matchCategoryFilter(event.categorie, categoryValue);

        // --- Critère 3 : date ---
        // On compare la date de l'événement avec le filtre choisi
        const matchDate = matchDateFilter(event.date, dateValue);

        // Un événement passe le filtre seulement s'il satisfait les 3 critères
        return matchSearch && matchCategory && matchDate;
    });

    // On réinitialise le compteur d'affichage
    nbrEvenementsAffiche = 0;
    
    // On vide le conteneur avant de réafficher
    const eventGrid = document.querySelector('.events-grid') || document.querySelector('.events-list-view');
    if (eventGrid) eventGrid.innerHTML = '';
    // On affiche les premiers événements filtrés
    chargementDeFiltre();
}

// Fonction qui vérifie si la catégorie correspond au filtre sélectionné
function matchCategoryFilter(eventCategory, filterValue) {
    // Si "Toutes" est sélectionné, tout passe
    if (filterValue === 'all') return true;

    // On met la catégorie en minuscule pour comparer
    const cat = eventCategory.toLowerCase();

    // Mapping des filtres du <select> vers les catégories du JSON
    switch (filterValue) {
        case 'conference':
            return cat.includes('conférence')  || cat.includes('conference');
        case 'sport':
            return cat.includes('sport');
        case 'culture':
            return cat.includes('culture');
        case 'atelier':
            return cat.includes('atelier');
        case 'soutenance':
            return cat.includes('soutenance');
        case 'Competition':
            return cat.includes('compétition') || cat.includes('competition');
        default:
            return true;
    }
}

// Fonction qui vérifie si la date correspond au filtre sélectionné
function matchDateFilter(eventDateStr, filterValue) {
    // Si "Toutes les dates" est sélectionné, tout passe
    if (filterValue === 'all') return true;

    // On parse la date de l'événement (format : "3 Aout 2026" ou "02 Août 2026")
    const eventDate = parseDate(eventDateStr);
    // Si la date n'a pas pu être parsée, on exclut l'événement
    if (!eventDate) return false;

    // Date d'aujourd'hui (sans les heures/minutes)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Selon le filtre choisi, on applique la comparaison
    switch (filterValue) {
        case 'today':
            // "Aujourd'hui" : même jour, même mois, même année
            return eventDate.toDateString() === today.toDateString();

        case 'week':
            // "Cette semaine" : dans les 7 prochains jours
            const weekEnd = new Date(today);
            weekEnd.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= weekEnd;

        case 'month':
            // "Ce mois-ci" : même mois et même année
            return eventDate.getMonth() === today.getMonth() &&
                   eventDate.getFullYear() === today.getFullYear();

        default:
            return true;
    }
}

// Fonction utilitaire qui parse une date française en objet Date
function parseDate(dateStr) {
    // Tableau de correspondance mois français → numéro (0-indexé pour JS)
    const months = {
        'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3,
        'mai': 4, 'juin': 5, 'juillet': 6, 'août': 7, 'aout': 7,
        'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };

    // On sépare la chaîne : "3 Aout 2026" → ["3", "Aout", "2026"]
    const parts = dateStr.split(' ');
    if (parts.length < 3) return null;

    // On extrait le jour, le mois (en minuscules) et l'année
    const day = parseInt(parts[0]);
    const monthName = parts[1].toLowerCase();
    const year = parseInt(parts[2]);

    // On récupère le numéro du mois depuis le tableau
    const month = months[monthName];
    // Si le mois n'est pas reconnu, on retourne null
    if (month === undefined) return null;

    // On crée et retourne l'objet Date
    return new Date(year, month, day);
}


// Fonction qui masque/affiche le bouton "Charger plus" selon le contexte
function updateLoadMoreButton() {
    // On récupère le bouton
    const loadMoreBtn = document.querySelector('.btn-load-more');
    // Si le bouton n'existe pas, on sort
    if (!loadMoreBtn) return;

    // Si tous les événements filtrés sont déjà affichés, on masque le bouton
    if (nbrEvenementsAffiche >= filtreEvenements.length) {
        loadMoreBtn.classList.add('hidden');
    } else {
        // Sinon, on l'affiche
        loadMoreBtn.classList.remove('hidden');
    }
}

// Fonction utilitaire pour masquer le bouton (cas "aucun résultat")
function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector('.btn-load-more');
    if (loadMoreBtn) loadMoreBtn.classList.add('hidden');
}


// Fonction qui initialise tous les écouteurs d'événements
function initEventListeners() {
    // --- Barre de recherche : filtrage en temps réel ---
    const searchInput = document.querySelector('#searchInput');
    if (searchInput) {
        // L'événement 'input' se déclenche à chaque frappe de touche
        searchInput.addEventListener('input', appliquerFitre);
    }
    
    // --- Filtre par catégorie ---
    const categoryFilter = document.querySelector('#categoryFilter');
    if (categoryFilter) {
        // À chaque changement de sélection, on réapplique les filtres
        categoryFilter.addEventListener('change', appliquerFitre);
    }
    
    // --- Filtre par date ---
    const dateFilter = document.querySelector('#dateFilter');
    if (dateFilter) {
        // À chaque changement de sélection, on réapplique les filtres
        dateFilter.addEventListener('change', appliquerFitre);
    }
    
    // On récupère le bouton
    const loadMoreBtn = document.querySelector('.btn-load-more');
    // Si le bouton n'existe pas, on sort
    if (!loadMoreBtn) return;
    
    // Au clic, on affiche 3 événements supplémentaires
    loadMoreBtn.addEventListener('click', function () {
        chargementDeFiltre();
    });
    
    // Logique de bascule de vue (Toggle Grille / Liste)
    const btnGrid = document.getElementById("btnGrid");
    const btnList = document.getElementById("btnList");
    const eventsContainer = document.getElementById("events-container");
    
    btnList.addEventListener("click", () => {
        eventsContainer.classList.remove("events-grid");
        eventsContainer.classList.add("events-list-view");
        
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
    });
    
    btnGrid.addEventListener("click", () => {
        eventsContainer.classList.remove("events-list-view");
        eventsContainer.classList.add("events-grid");
        
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
    });
}

// Quand le DOM est entièrement chargé, on lance toutes les initialisations
document.addEventListener('DOMContentLoaded', function() {
    // On charge les événements depuis le JSON
    chargerEvenements();
    // On initialise les écouteurs pour les filtres
    initEventListeners();
    // On initialise le toggle vue grille/liste
    //initViewToggle();
});
