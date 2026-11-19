//----------ROUTER----------//
// Mounts application EJS routes, JSON API routes, and remaining legacy routes.

//----------IMPORTS----------//
import { Router } from 'express';
import apiRoutes from './api-routes.js';
import ejsRoutes from './ejs-routes.js';
import railTripsRouter from './trips.js';
import { trainsApi, trainsPage } from './trains.js';
import { homePage, aboutPage, testErrorPage } from './index.js';

//----------ROUTES----------//
const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page & API
router.get('/trains', trainsPage);
router.get('/api/trains', trainsApi);

// Refactored API routes (including Swagger at /api-docs) & EJS routes
router.use('/', apiRoutes);
router.use('/', ejsRoutes);

// Remaining legacy rail trip routes
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

//----------EXPORTS----------//
export default router;