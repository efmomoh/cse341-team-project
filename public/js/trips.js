
const hookTripsCatalog = async () => {
    const listEl = document.getElementById("trips-list");
    const templateEl = document.getElementById("trip-card-template");

    const loadingEl = document.getElementById("trips-loading");
    const errorEl = document.getElementById("trips-error");
    const emptyEl = document.getElementById("trips-empty");

    const regionSelect = document.getElementById("region-filter");
    const seasonSelect = document.getElementById("season-filter");

    // Only execute on the trips listing page.
    if (!listEl || !templateEl) {
        return;
    }

    try {
        // Request trips from the API.
        const response = await fetch("/api/trips");

        if (!response.ok) {
            throw new Error(
                `Failed to load trips: ${response.status}`
            );
        }

        const trips = await response.json();

        if (!Array.isArray(trips)) {
            throw new Error("Invalid trips response.");
        }

        // Populate region and season filters.
        const regions = [
            ...new Set(trips.map(trip => trip.region).filter(Boolean))
        ].sort();

        const seasons = [
            ...new Set(trips.map(trip => trip.bestSeason).filter(Boolean))
        ].sort();

        regions.forEach(region => {
            const option = document.createElement("option");

            option.value = region;
            option.textContent =
                region.charAt(0).toUpperCase() + region.slice(1);

            regionSelect?.appendChild(option);
        });

        seasons.forEach(season => {
            const option = document.createElement("option");

            option.value = season;
            option.textContent =
                season.charAt(0).toUpperCase() + season.slice(1);

            seasonSelect?.appendChild(option);
        });

        // Render trips based on selected filters.
        const renderTrips = () => {
            const selectedRegion = regionSelect?.value || "all";
            const selectedSeason = seasonSelect?.value || "all";

            const filteredTrips = trips.filter(trip => {

                const matchesRegion =
                    selectedRegion === "all" ||
                    trip.region === selectedRegion;

                const matchesSeason =
                    selectedSeason === "all" ||
                    trip.bestSeason === selectedSeason;

                return matchesRegion && matchesSeason;
            });

            const fragment = document.createDocumentFragment();

            filteredTrips.forEach(trip => {

                // Clone the EJS card template.
                const card = templateEl.content.cloneNode(true);

                // Populate basic trip information.
                card.querySelector('[data-field="name"]').textContent =
                    trip.name || "";

                card.querySelector('[data-field="region"]').textContent =
                    trip.region || "";

                card.querySelector('[data-field="startStation"]').textContent =
                    trip.startStation || "";

                card.querySelector('[data-field="endStation"]').textContent =
                    trip.endStation || "";

                card.querySelector('[data-field="duration"]').textContent =
                    trip.duration || "";

                card.querySelector('[data-field="distance"]').textContent =
                    trip.distance ?? "";

                card.querySelector('[data-field="description"]').textContent =
                    trip.description || "";

                // Populate best season.
                const seasonEl =
                    card.querySelector('[data-field="bestSeason"]');

                const season = trip.bestSeason || "";

                seasonEl.textContent = season
                    ? `Best in ${season}`
                    : "Season unavailable";

                if (season) {
                    seasonEl.classList.add(
                        `season-${season.toLowerCase()}`
                    );
                }

                // Populate trip highlights.
                const highlightsEl =
                    card.querySelector('[data-field="highlights"]');

                (trip.highlights || []).forEach(highlight => {

                    const tag = document.createElement("span");

                    tag.className = "highlight-tag";
                    tag.textContent = highlight;

                    highlightsEl.appendChild(tag);
                });

                // Create trip details link.
                const detailsLink =
                    card.querySelector('[data-field="details-link"]');

                detailsLink.href =
                    `/trips/${encodeURIComponent(trip.id)}`;

                fragment.appendChild(card);
            });

            // Replace existing cards.
            listEl.replaceChildren(fragment);

            // Display empty state when no trips match.
            if (emptyEl) {
                emptyEl.hidden = filteredTrips.length > 0;
            }
        };

        // Listen for filter changes.
        regionSelect?.addEventListener("change", renderTrips);
        seasonSelect?.addEventListener("change", renderTrips);

        // Initially display all trips.
        renderTrips();

        // Hide loading message.
        if (loadingEl) {
            loadingEl.hidden = true;
        }

    } catch (error) {

        console.error("Error loading trips:", error);

        if (loadingEl) {
            loadingEl.hidden = true;
        }

        if (errorEl) {
            errorEl.hidden = false;

            errorEl.textContent =
                "Unable to load trips right now. Please try again later.";
        }
    }
};

// Initialize trips catalog after page loads.
document.addEventListener("DOMContentLoaded", hookTripsCatalog);