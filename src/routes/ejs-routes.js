import { Router } from 'express';
import {
    renderRegisterPage,
    renderLoginPage,
    renderAccountPage,
    renderAdminDashboardPage
} from '../controllers/auth.js';
import {
    bookingPage,
    bookingsAdminPage,
    confirmationPage,
    processBookingRequest
} from '../controllers/bookings.js';
import {
    renderTripsListPage,
    renderTripDetailsPage
} from '../controllers/trips.js';
import {
    requirePageLogin,
    requirePageRole
} from '../middleware/auth.js';

const router = Router();

// Authentication pages
router.get('/register', renderRegisterPage);
router.get('/login', renderLoginPage);
router.get('/account', requirePageLogin, renderAccountPage);
router.get('/admin/dashboard', requirePageRole('admin'), renderAdminDashboardPage);

// Booking workflow pages
router.get('/trips/booking/:scheduleId', bookingPage);
router.post('/trips/book', processBookingRequest);
router.get('/trips/confirmation/:confirmationId', confirmationPage);

// Bookings Admin page (hydrated client-side via /api/bookings)
router.get('/bookings-admin', requirePageLogin, bookingsAdminPage);

// Trips listing and details pages
router.get('/trips', renderTripsListPage);
router.get('/trips/:id', renderTripDetailsPage);

export default router;