
import {
    getTripById as findTripById,
    getAllTrips as findAllTrips
} from '../models/trips.js';

// =====================================
// API CONTROLLERS
// =====================================

// GET /api/trips
export async function getAllTrips(req, res) {
    try {
        const trips = await findAllTrips();

        return res.status(200).json(trips);

    } catch (error) {
        console.error('Error fetching trips:', error);

        return res.status(500).json({
            error: 'Failed to fetch trips'
        });
    }
}

// GET /api/trips/:id
export async function getTripById(req, res) {
    try {
        const { id } = req.params;

        const trip = await findTripById(id);

        if (!trip) {
            return res.status(404).json({
                error: 'Trip not found'
            });
        }

        return res.status(200).json(trip);

    } catch (error) {
        console.error('Error fetching trip:', error);

        return res.status(500).json({
            error: 'Failed to fetch trip'
        });
    }
}

// =====================================
// EJS PAGE CONTROLLERS
// =====================================

// GET /trips
export async function renderTripsListPage(req, res) {
    return res.render('trips/list', {
        title: 'Explore Our Trips'
    });
}

// GET /trips/:id
export async function renderTripDetailsPage(req, res, next) {
    try {
        const { id } = req.params;

        const trip = await findTripById(id);

        if (!trip) {
            const error = new Error('Trip not found');
            error.status = 404;
            return next(error);
        }

        return res.render('trips/details', {
            title: trip.name,
            details: trip
        });

    } catch (error) {
        console.error('Error rendering trip details:', error);
        return next(error);
    }
}
