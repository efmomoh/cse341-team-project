
import express from 'express';

import {
    getAllTrips,
    getTripById
} from '../controllers/trips.js';

const router = express.Router();

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
 *         schema:
 *           type: string
 *         description: Unique trip identifier
 *     responses:
 *       200:
 *         description: Successfully retrieved trip
 *       404:
 *         description: Trip not found
 *       500:
 *         description: Failed to fetch trip
 */
router.get('/api/trips/:id', getTripById);

export default router;
