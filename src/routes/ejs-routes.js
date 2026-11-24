
import { Router } from "express";

import {
    renderTripsListPage,
    renderTripDetailsPage
} from "../controllers/trips.js";

const router = Router();

// Trips listing page.
router.get("/trips", renderTripsListPage);

// Trip details page.
router.get("/trips/:id", renderTripDetailsPage);

export default router;