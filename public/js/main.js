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