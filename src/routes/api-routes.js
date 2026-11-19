//----------API ROUTES----------//
// Exposes JSON API endpoints and mounts interactive Swagger documentation at /api-docs.

//----------IMPORTS----------//
import { Router } from 'express';
import { fileURLToPath } from 'url';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { getAllBookings } from '../controllers/bookings.js';

//----------SWAGGER CONFIGURATION----------//
const __filename = fileURLToPath(import.meta.url);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kizuna Rail API',
      version: '1.0.0',
      description: 'JSON API endpoints for Kizuna Rail'
    }
  },
  apis: [__filename]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

//----------ROUTER----------//
const router = Router();

// Swagger UI documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     description: Retrieves all booking documents from the MongoDB bookings collection, sorted by newest first.
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: A JSON object containing an array of bookings.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: KR-AB12CD
 *                       scheduleId:
 *                         type: integer
 *                         example: 101
 *                       tripId:
 *                         type: string
 *                         example: tokaido-scenic
 *                       ticketClass:
 *                         type: string
 *                         example: green
 *                       selectedDay:
 *                         type: string
 *                         example: Friday
 *                       passengers:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             firstName:
 *                               type: string
 *                             lastName:
 *                               type: string
 *                             email:
 *                               type: string
 *                             phone:
 *                               type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Internal server error while fetching bookings.
 */
router.get('/api/bookings', getAllBookings);

//----------EXPORTS----------//
export default router;