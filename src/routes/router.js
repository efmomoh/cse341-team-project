import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json' with { type: 'json' };
import ejsRoutes from './ejs-routes.js';
import apiRoutes from './api-routes.js';
import { trainsApi, trainsPage } from './trains.js';
import { homePage, aboutPage, testErrorPage } from './index.js';

const router = Router();

// Swagger API documentation
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// Trains API
router.get('/api/trains', trainsApi);

// API routes (/api/trips, /api/bookings, /api/auth)
router.use('/', apiRoutes);

// EJS routes (/trips, /bookings-admin, /login, /register, /admin/dashboard)
router.use('/', ejsRoutes);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;