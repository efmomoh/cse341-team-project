//----------ROUTER----------//
// This file defines the routes for the application, including the home page, about page, trains page, and rail trips. It also includes an API endpoint for trains and a test error page.

//----------IMPORTS----------//
import railTripsRouter from './trips.js';
import { 
    trainsApi, 
    trainsPage 
} from './trains.js';
import { Router } from 'express';
import { 
    homePage, 
    aboutPage, 
    testErrorPage 
} from './index.js';

//----------ROUTES----------//
const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

//----------EXPORTS----------//
export default router;