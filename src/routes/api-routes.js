
import express from 'express';

import {
    getAllTrips,
    getTripById
} from '../controllers/trips.js';
import {
    register,
    login,
    logout
} from '../controllers/auth.js';

import {
    requireApiLogin,
    requireApiRole
} from '../middleware/auth.js';

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

// Register account
router.post('/api/auth/register', register);

// Login
router.post('/api/auth/login', login);

// Logout
router.post('/api/auth/logout', requireApiLogin, logout);

// Example protected admin API endpoint
router.get('/api/auth/admin', requireApiRole('admin'), (req, res) => {
    return res.status(200).json({
        message: 'Administrator access granted.',
        user: req.user
    });
}
);

export default router;
