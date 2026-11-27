import { Router } from 'express';
import {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  processBookingRequest,
} from '../controllers/bookings.js';
import {
  renderTripsListPage,
  renderTripDetailsPage,
} from '../controllers/trips.js';

const router = Router();

// Booking workflow pages
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.get('/trips/confirmation/:confirmationId', confirmationPage);

// Bookings Admin page (hydrated client-side via /api/bookings)
router.get('/bookings-admin', bookingsAdminPage);

// Trips listing and details pages
router.get('/trips', renderTripsListPage);
router.get('/trips/:id', renderTripDetailsPage);

export default router;