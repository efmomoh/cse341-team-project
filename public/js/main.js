const parseJsonSafely = async (response) => {
    try {
        return await response.json();
    } catch {
        return {};
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
    } catch {
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
    if (!listEl || !templateEl) {
        return;
    }

    const loadingEl = document.getElementById('bookings-loading');
    const emptyEl = document.getElementById('bookings-empty');
    const errorEl = document.getElementById('bookings-error');
    const feedbackEl = document.getElementById('bookings-feedback');

    const editPanel = document.getElementById('booking-edit-panel');
    const editForm = document.getElementById('booking-edit-form');
    const editIdInput = document.getElementById('edit-booking-id');
    const editIdLabel = document.getElementById('edit-booking-id-label');
    const editTicketClass = document.getElementById('edit-ticket-class');
    const editSelectedDay = document.getElementById('edit-selected-day');
    const editPassengersContainer = document.getElementById('edit-passengers-container');
    const editPassengerTemplate = document.getElementById('edit-passenger-row-template');
    const editAddPassengerBtn = document.getElementById('edit-add-passenger');
    const editCancelBtn = document.getElementById('edit-booking-cancel');
    const editErrorEl = document.getElementById('edit-booking-error');

    let currentBookings = [];

    const showFeedback = (message) => {
        if (!feedbackEl) {
            return;
        }
        feedbackEl.textContent = message;
        feedbackEl.hidden = !message;
    };

    const showError = (message) => {
        if (!errorEl) {
            return;
        }
        errorEl.textContent = message;
        errorEl.hidden = !message;
    };

    const showEditError = (message) => {
        if (!editErrorEl) {
            return;
        }
        editErrorEl.textContent = message;
        editErrorEl.hidden = !message;
    };

    const addPassengerRow = (passenger = {}) => {
        if (!editPassengersContainer || !editPassengerTemplate) {
            return;
        }
        if (editPassengersContainer.children.length >= 8) {
            showEditError('A booking can have at most 8 passengers.');
            return;
        }

        const rowFragment = editPassengerTemplate.content.cloneNode(true);
        rowFragment.querySelector('[data-passenger-field="firstName"]').value = passenger.firstName || '';
        rowFragment.querySelector('[data-passenger-field="lastName"]').value = passenger.lastName || '';
        rowFragment.querySelector('[data-passenger-field="email"]').value = passenger.email || '';
        rowFragment.querySelector('[data-passenger-field="phone"]').value = passenger.phone || '';

        const removeBtn = rowFragment.querySelector('[data-action="remove-passenger"]');
        removeBtn.addEventListener('click', (event) => {
            if (editPassengersContainer.children.length <= 1) {
                showEditError('A booking must include at least 1 passenger.');
                return;
            }
            event.currentTarget.closest('.edit-passenger-row')?.remove();
            showEditError('');
        });

        editPassengersContainer.appendChild(rowFragment);
    };

    const closeEditPanel = () => {
        if (!editPanel) {
            return;
        }
        editPanel.hidden = true;
        showEditError('');
    };

    const openEditPanel = (booking) => {
        if (!editPanel || !editForm) {
            return;
        }

        editIdInput.value = booking.id;
        editIdLabel.textContent = booking.id;
        editTicketClass.value = booking.ticketClass || '';
        editSelectedDay.value = String(booking.selectedDay || 'monday').toLowerCase();

        editPassengersContainer.replaceChildren();
        const passengers = Array.isArray(booking.passengers) && booking.passengers.length > 0
            ? booking.passengers
            : [{}];
        passengers.forEach((passenger) => addPassengerRow(passenger));

        showEditError('');
        editPanel.hidden = false;
        editPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const renderBookings = (bookings) => {
        listEl.replaceChildren();

        if (!Array.isArray(bookings) || bookings.length === 0) {
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

            card.querySelector('[data-field="id"]').textContent = booking.id || 'N/A';
            card.querySelector('[data-field="tripId"]').textContent = booking.tripId || 'N/A';
            card.querySelector('[data-field="scheduleId"]').textContent = `#${booking.scheduleId}`;
            card.querySelector('[data-field="ticketClass"]').textContent = booking.ticketClass || 'N/A';
            card.querySelector('[data-field="selectedDay"]').textContent = booking.selectedDay || 'N/A';
            card.querySelector('[data-field="passengerCount"]').textContent = String(passengers.length);

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

            const editBtn = card.querySelector('[data-action="edit"]');
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showFeedback('');
                    openEditPanel(booking);
                });
            }

            const deleteBtn = card.querySelector('[data-action="delete"]');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', async () => {
                    if (deleteBtn.dataset.confirming !== 'true') {
                        deleteBtn.dataset.confirming = 'true';
                        deleteBtn.textContent = 'Confirm Delete?';
                        return;
                    }

                    deleteBtn.disabled = true;
                    deleteBtn.textContent = 'Deleting...';
                    showError('');
                    showFeedback('');

                    try {
                        const response = await fetch(`/api/bookings/${encodeURIComponent(booking.id)}`, {
                            method: 'DELETE'
                        });

                        if (response.status === 401) {
                            window.location.href = '/login';
                            return;
                        }

                        const payload = await parseJsonSafely(response);
                        if (!response.ok) {
                            throw new Error(payload.error || payload.message || 'Unable to delete booking.');
                        }

                        if (editIdInput && editIdInput.value === booking.id) {
                            closeEditPanel();
                        }

                        currentBookings = currentBookings.filter((item) => item.id !== booking.id);
                        renderBookings(currentBookings);
                        showFeedback(`Booking ${booking.id} was deleted.`);
                    } catch (err) {
                        deleteBtn.disabled = false;
                        deleteBtn.dataset.confirming = 'false';
                        deleteBtn.textContent = 'Delete';
                        showError(err.message || 'Unable to delete booking.');
                    }
                });
            }

            fragment.appendChild(card);
        });

        listEl.appendChild(fragment);
    };

    const loadBookings = async () => {
        if (loadingEl) {
            loadingEl.hidden = false;
        }
        showError('');

        try {
            const response = await fetch('/api/bookings');
            if (response.status === 401) {
                window.location.href = '/login';
                return;
            }

            if (!response.ok) {
                const payload = await parseJsonSafely(response);
                throw new Error(payload.error || payload.message || `Failed to load bookings (${response.status})`);
            }

            const payload = await response.json();
            currentBookings = Array.isArray(payload) ? payload : payload.bookings || [];
            renderBookings(currentBookings);
        } catch (err) {
            showError(err.message || 'Unable to load bookings right now. Please try again in a moment.');
        } finally {
            if (loadingEl) {
                loadingEl.hidden = true;
            }
        }
    };

    if (editAddPassengerBtn) {
        editAddPassengerBtn.addEventListener('click', () => {
            showEditError('');
            addPassengerRow();
        });
    }

    if (editCancelBtn) {
        editCancelBtn.addEventListener('click', closeEditPanel);
    }

    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            showEditError('');
            showError('');
            showFeedback('');

            const bookingId = editIdInput.value;
            const rows = Array.from(editPassengersContainer.querySelectorAll('.edit-passenger-row'));
            const passengers = rows.map((row) => ({
                firstName: row.querySelector('[data-passenger-field="firstName"]').value.trim(),
                lastName: row.querySelector('[data-passenger-field="lastName"]').value.trim(),
                email: row.querySelector('[data-passenger-field="email"]').value.trim(),
                phone: row.querySelector('[data-passenger-field="phone"]').value.trim()
            }));

            try {
                const response = await fetch(`/api/bookings/${encodeURIComponent(bookingId)}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ticketClass: editTicketClass.value.trim(),
                        selectedDay: editSelectedDay.value,
                        passengers
                    })
                });

                if (response.status === 401) {
                    window.location.href = '/login';
                    return;
                }

                const payload = await parseJsonSafely(response);
                if (!response.ok) {
                    throw new Error(payload.error || payload.message || 'Unable to update booking.');
                }

                closeEditPanel();
                await loadBookings();
                showFeedback(`Booking ${bookingId} was updated.`);
            } catch (err) {
                showEditError(err.message || 'Unable to save booking changes.');
            }
        });
    }

    await loadBookings();
};

document.addEventListener('DOMContentLoaded', () => {
    hookTrainsCatalog();
    hookBookingsAdmin();
});