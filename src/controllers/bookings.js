// src/controllers/bookings.js
import { getDb } from '../db/connect.js';
import { generateConfirmationCode } from '../includes/helpers.js';
import {
  createBooking,
  getAllBookings as findAllBookings,
  getBookingById as findBookingById,
} from '../models/bookings.js';

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

// EJS Controller: Render the empty Bookings Admin shell (hydrated on the client)
const bookingsAdminPage = (req, res) => {
  return res.render('bookings', {
    title: 'Bookings Admin',
  });
};

// API Controller: Return all bookings as JSON
const getAllBookings = async (req, res) => {
  try {
    const bookings = await findAllBookings();
    return res.status(200).json(bookings);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};


// API Controller: Return a single booking by ID as JSON
const getBookingById = async (req, res) => {
  try {
    const booking = await findBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    return res.status(200).json(booking);
  } catch {
    return res.status(500).json({ error: 'Failed to fetch booking' });
  }
};
export {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  getAllBookings,
  getBookingById,
  processBookingRequest,
};