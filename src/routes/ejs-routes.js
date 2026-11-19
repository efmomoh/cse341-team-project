//----------EJS ROUTES----------//
// Defines routes that render server-side EJS views (and handle HTML form submissions).

//----------IMPORTS----------//
import { Router } from 'express';
import {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  processBookingRequest
} from '../controllers/bookings.js';

//----------ROUTER----------//
const router = Router();

// Bookings admin page (client-side hydrated via /api/bookings)
router.get('/bookings-admin', bookingsAdminPage);

// Booking form, submission, and confirmation pages
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.get('/trips/confirmation/:bookingId', confirmationPage);

//----------EXPORTS----------//
export default router;