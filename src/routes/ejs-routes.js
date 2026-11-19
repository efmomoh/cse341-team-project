// src/routes/ejs-routes.js
import { Router } from 'express';
import {
  bookingPage,
  bookingsAdminPage,
  confirmationPage,
  processBookingRequest,
} from '../controllers/bookings.js';

const router = Router();

// Booking workflow pages
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.get('/trips/confirmation/:confirmationId', confirmationPage);

// Bookings Admin page (hydrated client-side via /api/bookings)
router.get('/bookings-admin', bookingsAdminPage);

export default router;