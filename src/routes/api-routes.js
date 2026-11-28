import { Router } from 'express';
import {
    register,
    login,
    logout
} from '../controllers/auth.js';
import {
  deleteBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
} from '../controllers/bookings.js';
import { scheduleHandler } from '../controllers/schedules.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';
import {
    requireApiLogin,
    requireApiRole
} from '../middleware/auth.js';

const router = Router();

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
 *         description: Month number (1-12)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Successfully retrieved schedules
 *       404:
 *         description: Trip not found
 *       400:
 *         description: Invalid data format
 *       500:
 *         description: Failed to fetch schedules
 */
router.get('/api/trips/:id/schedules', scheduleHandler);

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
 *     responses:
 *       200:
 *         description: Trip retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Invalid trip ID format.
 *       404:
 *         description: Trip not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/api/trips/:id', getTripById);

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Retrieve bookings for the authenticated user
 *     description: Returns all bookings for admin users, or bookings where the signed-in user's email matches a passenger.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: A JSON array of authorized booking objects
 *       401:
 *         description: Authentication required
 *       500:
 *         description: Server error while fetching bookings
 */
router.get('/api/bookings', requireApiLogin, getAllBookings);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Retrieve a single booking by its confirmation ID
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique booking confirmation ID (e.g., JR00013X35)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking found and returned as JSON
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - not admin or a passenger on this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error while fetching the booking
 *   put:
 *     summary: Update a booking by its confirmation ID
 *     description: Admins can update any booking; standard users can update bookings where their email matches a passenger.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique booking confirmation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ticketClass:
 *                 type: string
 *                 example: standard
 *               selectedDay:
 *                 type: string
 *                 example: friday
 *               passengers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       400:
 *         description: Invalid booking update payload
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - not admin or a passenger on this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error while updating the booking
 *   delete:
 *     summary: Delete a booking by its confirmation ID
 *     description: Admins can delete any booking; standard users can delete bookings where their email matches a passenger.
 *     tags:
 *       - Bookings
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique booking confirmation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Forbidden - not admin or a passenger on this booking
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error while deleting the booking
 */
router.get('/api/bookings/:id', requireApiLogin, getBookingById);
router.put('/api/bookings/:id', requireApiLogin, updateBooking);
router.delete('/api/bookings/:id', requireApiLogin, deleteBooking);

// Authentication API routes
router.post('/api/auth/register', register);
router.post('/api/auth/login', login);
router.post('/api/auth/logout', requireApiLogin, logout);

// Example protected admin API endpoint
router.get('/api/auth/admin', requireApiRole('admin'), (req, res) => {
    return res.status(200).json({
        message: 'Administrator access granted.',
        user: req.user
    });
});

export default router;