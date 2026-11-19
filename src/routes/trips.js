//----------TRIPS ROUTER (LEGACY)----------//
// Keeps existing trip list and trip details routes active until Feature Set 1 migrates them to ejs-routes.js.

//----------IMPORTS----------//
import { Router } from 'express';
import listTripsPage from './list.js';
import tripDetailsPage from './details.js';

//----------ROUTER----------//
const router = Router();

// List all trips
router.get('/', listTripsPage);

// Trip details page
router.get('/:tripId', tripDetailsPage);

//----------EXPORTS----------//
export default router;