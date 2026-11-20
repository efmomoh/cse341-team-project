import { getDb } from "../db/connect.js";


const getTripById = async(tripId) => {
    const db = getDb();

    const trip = await db.collection("trips").findOne({id: tripId});

    return trip;
}

export {getTripById}