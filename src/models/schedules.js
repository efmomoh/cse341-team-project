import { schedules } from "./schemas/schedules.js";
import {getTripById} from "src/models/trips.js"

const getSchedulesByTripId = async (tripId, monthNumber=0) => {

    if(monthNumber === 0) return await schedules.find({tripId}).lean();
     
    const tripDetails = await getTripById(tripId);

    if(!tripDetails || !tripDetails.operatingMonths.includes(monthNumber)){
        return []
    }
    return await schedules.find({tripId}).lean()
}

export {getSchedulesByTripId}