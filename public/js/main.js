//---------- MAIN (CLIENT-SIDE JAVASCRIPT) ----------//
// This script is responsible for handling the client-side logic for the trains catalog page, including sorting and fetching train data from the server.

//----------SORTING HANDLERS----------//
// Function to handle sorting by region
const hookRegionSorter = () => {
    const regionSelect = document.getElementById('region-filter');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            const selectedRegion = regionSelect.value;
            const url = new URL(window.location.href);

            if (selectedRegion && selectedRegion !== 'all') {
                url.searchParams.set('region', selectedRegion);
            } else {
                url.searchParams.delete('region');
            }
            
            window.location.href = url.toString();
        });
    }
};

// Function to handle sorting by season
const hookSeasonSorter = () => {
    const seasonSelect = document.getElementById('season-filter');
    if (seasonSelect) {
        seasonSelect.addEventListener('change', () => {
            const selectedSeason = seasonSelect.value;
            const url = new URL(window.location.href);

            if (selectedSeason && selectedSeason !== 'all') {
                url.searchParams.set('season', selectedSeason);
            } else {
                url.searchParams.delete('season');
            }
            
            window.location.href = url.toString();
        });
    }
};

//----------FETCHING TRAIN DATA----------//
// Function to fetch and display the train catalog
const hookTrainsCatalog = async () => {

    // Get the list element where train cards will be displayed
    const listEl = document.getElementById('trains-list');

    // Get the template element for creating train cards
    const templateEl = document.getElementById('train-card-template');

    // Get the loading element to show a loading message while fetching data
    const loadingEl = document.getElementById('trains-loading');

    // Get the error element to display any errors that occur during data fetching
    const errorEl = document.getElementById('trains-error');

    // Verify that the necessary elements exist before proceeding
    if (!listEl || !templateEl) {
        return;
    }

    //Fetch the train data from the server and populate the catalog
    try {

        // Fetch the train data from the server
        const response = await fetch('/api/trains');

        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        // Parse the JSON response to get the train data
        const payload = await response.json();
        const trains = payload.trains || [];

        // Create a template fragment to hold the train cards before adding them to the DOM
        const fragment = document.createDocumentFragment();

        //----------HYDRATE TRAIN CARDS----------//
        // Iterate over the train data and create a card for each train
        trains.forEach((train) => {

            // Clone the template content to create a new train card
            const card = templateEl.content.cloneNode(true);

            // Populate the train card with data from the train object
            const imageEl = card.querySelector('[data-field="image"]');

            imageEl.src = train.imageUrl;
            imageEl.alt = train.imageAlt || `${train.name} train`;

            card.querySelector('[data-field="name"]').textContent = train.name;
            card.querySelector('[data-field="operator"]').textContent = train.operator;
            card.querySelector('[data-field="type"]').textContent = train.type;
            card.querySelector('[data-field="speed"]').textContent = `${train.maxSpeedKmh} km/h`;
            card.querySelector('[data-field="seats"]').textContent = `${train.capacity} seats`;
            card.querySelector('[data-field="power"]').textContent = train.powerSource;
            card.querySelector('[data-field="description"]').textContent = train.description;
            card.querySelector('[data-field="best-for"]').textContent = train.bestFor;

            // Add the populated train card to the template fragment
            fragment.appendChild(card);
        });

        // Replace the existing children of the list element with the newly created train cards
        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }

    // Handle any errors that occur during the fetch operation
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load trains right now. Please try again in a moment.';
        }
    }
};

//----------FETCHING BOOKINGS DATA----------//
// Fetches all bookings from /api/bookings and hydrates the Bookings Admin page.
const hookBookingsAdmin = async () => {
    const listEl = document.getElementById('bookings-list');
    const templateEl = document.getElementById('booking-card-template');
    const loadingEl = document.getElementById('bookings-loading');
    const errorEl = document.getElementById('bookings-error');
    const emptyEl = document.getElementById('bookings-empty');

    // Guard clause: only run on the Bookings Admin page
    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/bookings');

        if (!response.ok) {
            throw new Error(`Failed to load bookings (${response.status})`);
        }

        const payload = await response.json();
        const bookings = payload.bookings || [];

        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = true;
        }

        if (bookings.length === 0) {
            listEl.replaceChildren();
            if (emptyEl) {
                emptyEl.hidden = false;
            }
            return;
        }

        if (emptyEl) {
            emptyEl.hidden = true;
        }

        const fragment = document.createDocumentFragment();

        bookings.forEach((booking) => {
            const card = templateEl.content.cloneNode(true);
            const passengers = Array.isArray(booking.passengers) ? booking.passengers : [];
            const passengerNames = passengers
                .map((p) => `${p.firstName || ''} ${p.lastName || ''}`.trim())
                .filter(Boolean)
                .join(', ');

            const formattedDate = booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
                : 'N/A';

            card.querySelector('[data-field="id"]').textContent = booking.id || 'N/A';
            card.querySelector('[data-field="ticket-class"]').textContent = booking.ticketClass || 'N/A';
            card.querySelector('[data-field="trip-id"]').textContent = booking.tripId || 'N/A';
            card.querySelector('[data-field="schedule-id"]').textContent = booking.scheduleId
                ? `#${booking.scheduleId}`
                : 'N/A';
            card.querySelector('[data-field="selected-day"]').textContent = booking.selectedDay || 'N/A';
            card.querySelector('[data-field="created-at"]').textContent = formattedDate;
            card.querySelector('[data-field="passenger-count"]').textContent = `${passengers.length}`;
            card.querySelector('[data-field="passenger-names"]').textContent = passengerNames || 'None listed';

            const linkEl = card.querySelector('[data-field="confirmation-link"]');
            if (linkEl && booking.id) {
                linkEl.href = `/trips/confirmation/${encodeURIComponent(booking.id)}`;
            }

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (emptyEl) {
            emptyEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load bookings right now. Please try again in a moment.';
        }
    }
};

//----------INITIALIZATION----------//
document.addEventListener('DOMContentLoaded', () => {
    // Hook the region sorter to handle changes in the region filter
    hookRegionSorter();

    // Hook the season sorter to handle changes in the season filter
    hookSeasonSorter();

    // Fetch and display the train catalog when the page loads
    hookTrainsCatalog();

    // Fetch and display bookings on the Bookings Admin page
    hookBookingsAdmin();
});