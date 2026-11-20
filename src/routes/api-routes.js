
import express from "express"
const scheduleApiRouter = express.Router();
import { scheduleHandler} from "../controllers/schedules.js";

/**
 * @openapi
 * /api/trips/{id}/schedules?month={month}:
 *   get:
 *     summary: Get schedules for a trip by month
 *     description: Retrieves schedules associated with a specific trip if the trip operates during the requested month.
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique ID of the trip.
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: true
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
scheduleApiRouter.get("/api/trips/:id/schedules",scheduleHandler);

export {scheduleApiRouter}