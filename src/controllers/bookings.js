//----------BOOKINGS CONTROLLERS----------//
// Handles both JSON API responses and EJS page rendering for bookings.

//----------IMPORTS----------//
import { getDb } from '../db/connect.js';
import { generateConfirmationCode } from '../includes/helpers.js';
import * as bookingModel from '../models/bookings.js';

//----------API CONTROLLERS----------//
// GET /api/bookings - Returns all bookings as JSON.
const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel.getAllBookings();
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

//----------EJS CONTROLLERS----------//
// GET /trips/booking/:scheduleId - Renders the trip booking form.
const bookingPage = async (req, res, next) => {
  try {
    const { scheduleId } = req.params;
    const db = getDb();

    // Uses native driver reads for schedules, trips, and ticketClasses
    // until Feature Sets 1, 2, and 4 are merged.
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
      description: ticketClass.description
    }));

    return res.render('trips/book', {
      title: 'Book Trip',
      schedule,
      ticketOptions
    });
  } catch (error) {
    return next(error);
  }
};

// POST /trips/book - Creates a new booking in MongoDB via Mongoose and redirects to confirmation.
const processBookingRequest = async (req, res, next) => {
  try {
    const bookingData = {
      id: generateConfirmationCode(),
      ...req.body
    };

    const booking = await bookingModel.createBooking(bookingData);
    return res.redirect(`/trips/confirmation/${booking.id}`);
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = 400;
    }
    return next(error);
  }
};

// GET /trips/confirmation/:bookingId - Renders the confirmation page for a single booking.
const confirmationPage = async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const booking = await bookingModel.getBookingById(bookingId);

    if (!booking) {
      const err = new Error('Booking not found');
      err.status = 404;
      return next(err);
    }

    return res.render('trips/confirm', {
      title: 'Trip Confirmation',
      booking
    });
  } catch (error) {
    return next(error);
  }
};

// GET /bookings-admin - Renders the Bookings Admin shell (hydrated on the client via /api/bookings).
const bookingsAdminPage = (req, res) => {
  return res.render('bookings', {
    title: 'Bookings Admin'
  });
};

//----------EXPORTS----------//
export {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  getAllBookings,
  processBookingRequest
};