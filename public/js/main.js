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

const hookTrainsCatalog = async () => {
    const listEl = document.getElementById('trains-list');
    const templateEl = document.getElementById('train-card-template');
    const loadingEl = document.getElementById('trains-loading');
    const errorEl = document.getElementById('trains-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/trains');
        if (!response.ok) {
            throw new Error(`Failed to load trains (${response.status})`);
        }

        const payload = await response.json();
        const trains = payload.trains || [];
        const fragment = document.createDocumentFragment();

        trains.forEach((train) => {
            const card = templateEl.content.cloneNode(true);
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

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
        if (loadingEl) {
            loadingEl.hidden = true;
        }
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

const hookBookingsAdmin = async () => {
    const listEl = document.getElementById('bookings-list');
    const templateEl = document.getElementById('booking-card-template');
    const loadingEl = document.getElementById('bookings-loading');
    const emptyEl = document.getElementById('bookings-empty');
    const errorEl = document.getElementById('bookings-error');

    if (!listEl || !templateEl) {
        return;
    }

    try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
            throw new Error(`Failed to load bookings (${response.status})`);
        }

        const payload = await response.json();
        const bookings = Array.isArray(payload) ? payload : payload.bookings || [];

        if (loadingEl) {
            loadingEl.hidden = true;
        }

        if (bookings.length === 0) {
            if (emptyEl) {
                emptyEl.hidden = false;
            }
            return;
        }

        const fragment = document.createDocumentFragment();

        bookings.forEach((booking) => {
            const card = templateEl.content.cloneNode(true);
            const passengers = Array.isArray(booking.passengers) ? booking.passengers : [];

            card.querySelector('[data-field="id"]').textContent = booking.id;
            card.querySelector('[data-field="tripId"]').textContent = booking.tripId;
            card.querySelector('[data-field="scheduleId"]').textContent = `#${booking.scheduleId}`;
            card.querySelector('[data-field="ticketClass"]').textContent = booking.ticketClass;
            card.querySelector('[data-field="selectedDay"]').textContent = booking.selectedDay;
            card.querySelector('[data-field="passengerCount"]').textContent = passengers.length;

            const formattedDate = booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                })
                : 'N/A';
            card.querySelector('[data-field="createdAt"]').textContent = formattedDate;

            const passengerListEl = card.querySelector('[data-field="passengers"]');
            passengers.forEach((passenger) => {
                const li = document.createElement('li');
                li.textContent = `${passenger.firstName} ${passenger.lastName} — ${passenger.email} (${passenger.phone})`;
                passengerListEl.appendChild(li);
            });

            const linkEl = card.querySelector('[data-field="confirmationLink"]');
            linkEl.href = `/trips/confirmation/${encodeURIComponent(booking.id)}`;

            fragment.appendChild(card);
        });

        listEl.replaceChildren(fragment);
    } catch (error) {
        if (loadingEl) {
            loadingEl.hidden = true;
        }
        if (errorEl) {
            errorEl.hidden = false;
            errorEl.textContent = 'Unable to load bookings right now. Please try again in a moment.';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    hookRegionSorter();
    hookSeasonSorter();
    hookTrainsCatalog();
    hookBookingsAdmin();
});