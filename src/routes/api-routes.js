// src/routes/api-routes.js
import { Router } from 'express';
import { getAllBookings } from '../controllers/bookings.js';

const router = Router();

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
router.get('/bookings', getAllBookings);

export default router;