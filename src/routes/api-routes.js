import { Router } from 'express';
import { getAllBookings, getBookingById } from '../controllers/bookings.js';
import { scheduleHandler } from '../controllers/schedules.js';
import { getAllTrips, getTripById } from '../controllers/trips.js';

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
 *     summary: Retrieve all bookings
 *     description: Returns a list of all scenic railway bookings sorted by creation date (newest first).
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: A JSON array of booking objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 664f1c2e9a1b2c3d4e5f6a7b
 *                   id:
 *                     type: string
 *                     example: KIZ-123456
 *                   scheduleId:
 *                     type: number
 *                     example: 1
 *                   tripId:
 *                     type: string
 *                     example: alpine-panorama
 *                   ticketClass:
 *                     type: string
 *                     example: standard
 *                   selectedDay:
 *                     type: string
 *                     example: monday
 *                   passengers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         firstName:
 *                           type: string
 *                           example: Sakura
 *                         lastName:
 *                           type: string
 *                           example: Tanaka
 *                         email:
 *                           type: string
 *                           example: sakura.tanaka@example.com
 *                         phone:
 *                           type: string
 *                           example: "+81 120-555-1234"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Server error while fetching bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch bookings
 */
router.get('/api/bookings', getAllBookings);

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 scheduleId:
 *                   type: number
 *                 tripId:
 *                   type: string
 *                 ticketClass:
 *                   type: string
 *                 selectedDay:
 *                   type: string
 *                 passengers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                       lastName:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Booking not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while fetching the booking
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/api/bookings/:id', getBookingById);

export default router;