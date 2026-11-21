import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';
import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);

// API routes (/api/bookings, etc.)
router.use('/api', apiRoutes);

// EJS booking and admin routes
router.use('/', ejsRoutes);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;