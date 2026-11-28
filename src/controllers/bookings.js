// src/controllers/bookings.js
import { getDb } from '../db/connect.js';
import { generateConfirmationCode } from '../includes/helpers.js';
import {
  createBooking,
  deleteBookingById as removeBookingById,
  getAllBookings as findAllBookings,
  getBookingById as findBookingById,
  getBookingsByPassengerEmail as findBookingsByPassengerEmail,
  updateBookingById as modifyBookingById,
} from '../models/bookings.js';

const VALID_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const isAdminUser = (user) => user?.role === 'admin';

const isPassengerOnBooking = (user, booking) => {
  const userEmail = String(user?.email || '').trim().toLowerCase();
  if (!userEmail || !Array.isArray(booking?.passengers)) {
    return false;
  }

  return booking.passengers.some(
    (passenger) => String(passenger?.email || '').trim().toLowerCase() === userEmail
  );
};

const canManageBooking = (user, booking) => {
  return isAdminUser(user) || isPassengerOnBooking(user, booking);
};

const sanitizeBookingUpdatePayload = (body) => {
  if (!body || typeof body !== 'object') {
    return { error: 'Request body is required.' };
  }

  const updates = {};

  if (body.ticketClass !== undefined) {
    const ticketClass = String(body.ticketClass).trim();
    if (!ticketClass) {
      return { error: 'Ticket class cannot be empty.' };
    }
    updates.ticketClass = ticketClass;
  }

  if (body.selectedDay !== undefined) {
    const selectedDay = String(body.selectedDay).trim().toLowerCase();
    if (!VALID_DAYS.includes(selectedDay)) {
      return { error: 'Selected day must be a valid day of the week.' };
    }
    updates.selectedDay = selectedDay;
  }

  if (body.passengers !== undefined) {
    if (!Array.isArray(body.passengers) || body.passengers.length < 1 || body.passengers.length > 8) {
      return { error: 'A booking must include between 1 and 8 passengers.' };
    }

    const sanitizedPassengers = [];
    for (const passenger of body.passengers) {
      const firstName = String(passenger?.firstName || '').trim();
      const lastName = String(passenger?.lastName || '').trim();
      const email = String(passenger?.email || '').trim();
      const phone = String(passenger?.phone || '').trim();

      if (!firstName || !lastName || !email || !phone) {
        return { error: 'Every passenger must include firstName, lastName, email, and phone.' };
      }

      sanitizedPassengers.push({ firstName, lastName, email, phone });
    }

    updates.passengers = sanitizedPassengers;
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'Provide at least one editable field: ticketClass, selectedDay, or passengers.' };
  }

  return { updates };
};

// EJS Controller: Render the booking form for a specific schedule
const bookingPage = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;

    const db = getDb();
    const schedule = await db.collection('schedules').findOne({ id: Number(scheduleId) });
    if (!schedule) {
      const err = new Error('Schedule not found');
      err.status = 404;
      return next(err);
    }

    const trip = await db.collection('trips').findOne({ id: schedule.tripId });
    if (!trip) {
      const err = new Error('Trip not found');
      err.status = 404;
      return next(err);
    }

    const ticketClasses = await db.collection('ticketClasses').find({}).toArray();
    const ticketOptions = ticketClasses.map((ticketClass) => ({
      class: ticketClass.class,
      name: ticketClass.name,
      price: trip.distance * ticketClass.pricePerKm,
      amenities: ticketClass.amenities,
      description: ticketClass.description,
    }));

    return res.render('trips/book', {
      title: 'Book Trip',
      schedule,
      ticketOptions,
    });
  } catch (error) {
    return next(error);
  }
};

// EJS Controller: Save a new booking via Mongoose and redirect to confirmation
const processBookingRequest = async (req, res, next) => {
  try {
    const bookingData = {
      ...req.body,
      id: generateConfirmationCode(),
      scheduleId: Number(req.body.scheduleId),
    };

    const booking = await createBooking(bookingData);

    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    return next(error);
  }
};

// EJS Controller: Display a booking confirmation by its booking code
const confirmationPage = async (req, res, next) => {
  try {
    const { confirmationId } = req.params;

    const confirmation = await findBookingById(confirmationId);
    if (!confirmation) {
      const err = new Error('Booking confirmation not found');
      err.status = 404;
      return next(err);
    }

    return res.render('trips/confirm', {
      title: 'Trip Confirmation',
      confirmation,
    });
  } catch (error) {
    return next(error);
  }
};

// EJS Controller: Render the protected Bookings Admin shell (hydrated on the client)
const bookingsAdminPage = (req, res) => {
  return res.render('bookings', {
    title: 'Bookings Admin',
  });
};

// API Controller: Return all bookings for admin, or passenger-matched bookings for standard users
const getAllBookings = async (req, res) => {
  try {
    const bookings = isAdminUser(req.user)
      ? await findAllBookings()
      : await findBookingsByPassengerEmail(req.user.email);

    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

// API Controller: Return a single booking by ID if authorized
const getBookingById = async (req, res) => {
  try {
    const booking = await findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!canManageBooking(req.user, booking)) {
      return res.status(403).json({ error: 'You do not have permission to view this booking.' });
    }

    return res.status(200).json(booking);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

// API Controller: Update a booking if user is admin or a passenger on that booking
const updateBooking = async (req, res) => {
  try {
    const existingBooking = await findBookingById(req.params.id);
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!canManageBooking(req.user, existingBooking)) {
      return res.status(403).json({ error: 'You do not have permission to update this booking.' });
    }

    const { updates, error } = sanitizeBookingUpdatePayload(req.body);
    if (error) {
      return res.status(400).json({ error });
    }

    const updatedBooking = await modifyBookingById(req.params.id, updates);
    return res.status(200).json(updatedBooking);
  } catch (error) {
    if (error?.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Failed to update booking' });
  }
};

// API Controller: Delete a booking if user is admin or a passenger on that booking
const deleteBooking = async (req, res) => {
  try {
    const existingBooking = await findBookingById(req.params.id);
    if (!existingBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (!canManageBooking(req.user, existingBooking)) {
      return res.status(403).json({ error: 'You do not have permission to delete this booking.' });
    }

    const deletedBooking = await removeBookingById(req.params.id);
    return res.status(200).json({
      message: 'Booking deleted successfully',
      id: deletedBooking.id,
    });
  } catch {
    return res.status(500).json({ error: 'Failed to delete booking' });
  }
};

export {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  deleteBooking,
  getAllBookings,
  getBookingById,
  processBookingRequest,
  updateBooking,
};