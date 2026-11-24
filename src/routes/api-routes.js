
import express from "express"
import { scheduleHandler} from "../controllers/schedules.js";
import { getAllTrips,getTripById} from '../controllers/trips.js';
const router = express.Router();

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get schedules for a trip by month
 *     description: Retrieves schedules associated with a specific trip, optionally filtered by month.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique trip identifier
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: false
 *         description: Month number (1–12)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to fetch schedules
 */
router.get("/api/trips/:id/schedules", scheduleHandler);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all railway trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Successfully retrieved all trips
 *       500:
 *         description: Failed to fetch trips
 */
router.get('/api/trips', getAllTrips);

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a railway trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the trip.
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: false
 *         description: The month number (1–12).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Schedules retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Schedule'
 *       400:
 *         description: Invalid trip ID or month parameter.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/trips/:id', getTripById);

export default router;
