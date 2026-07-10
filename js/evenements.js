document.addEventListener("DOMContentLoaded", () => {
    // 1. Sélection des éléments du DOM
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    
    const btnGrid = document.getElementById("btnGrid");
    const btnList = document.getElementById("btnList");
    const eventsContainer = document.getElementById("events-container");
    const eventCards = document.querySelectorAll(".event-card");

    // 2. Écouteurs d'événements pour la recherche et les filtres
    searchInput.addEventListener("input", filterEvents);
    categoryFilter.addEventListener("change", filterEvents);
    dateFilter.addEventListener("change", filterEvents);

    // 3. Logique de filtrage
    function filterEvents() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        // La logique de date complexe peut être ajoutée ici. 
        // Pour l'instant, on se concentre sur le texte et la catégorie.

        eventCards.forEach(card => {
            const title = card.querySelector(".event-card-title").textContent.toLowerCase();
            const desc = card.querySelector(".event-card-desc").textContent.toLowerCase();
            const category = card.getAttribute("data-category");

            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = selectedCategory === "all" || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = "flex"; // ou "block" selon le mode
            } else {
                card.style.display = "none";
            }
        });
    }

    // 4. Logique de bascule de vue (Toggle Grille / Liste)
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
});