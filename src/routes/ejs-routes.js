
import { Router } from "express";
import {
    renderRegisterPage,
    renderLoginPage,
    renderAccountPage,
    renderAdminDashboardPage
} from '../controllers/auth.js';

import {
    requirePageLogin,
    requirePageRole
} from '../middleware/auth.js';
import {
    renderTripsListPage,
    renderTripDetailsPage
} from "../controllers/trips.js";

const router = Router();


// Registration page
router.get('/register', renderRegisterPage);

// Login page
router.get('/login', renderLoginPage);

// Account page
router.get('/account', requirePageLogin, renderAccountPage);

// Admin dashboard
router.get('/admin/dashboard', requirePageRole('admin'), renderAdminDashboardPage);


// Trips listing page.
router.get("/trips", renderTripsListPage);

// Trip details page.
router.get("/trips/:id", renderTripDetailsPage);

export default router;