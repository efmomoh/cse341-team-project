//----------TRAIN ROUTES----------//
// This file defines the routes for the trains page and the trains API endpoint. It includes functions to render the trains page and to retrieve train data from the database.

//----------IMPORTS----------//
import { getDb } from '../db/connect.js';

//----------ROUTE HANDLERS----------//
// This function renders the trains page, which displays a list of trains. It uses the 'trains' template and passes a title to the template for rendering.
const trainsPage = (req, res) => {
    res.render('trains', { title: 'Trains' });
};

//----------API HANDLER----------//
// This function handles the API request to retrieve all trains from the MongoDB. It queries the 'trains' collection and returns the data as a JSON response.
const trainsApi = async (req, res, next) => {
    try {
        const trains = await getDb().collection('trains').find({}).toArray();
        return res.json({ trains });
    } catch (error) {
        return next(error);
    }
};

//----------EXPORTS----------//
export { 
    trainsApi, 
    trainsPage 
};
