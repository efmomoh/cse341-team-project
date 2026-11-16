import { getSchedulesByTripId } from "../models/schedules.js";

const getSchedulesForTrip = async(req,res) => {

    try {
        const tripId = req.params.id;

        if(!tripId){
          return res.status(400).json({"message": "Trip Id is required"});
        }

        const tripSchedules = await getSchedulesByTripId(tripId)
        return res.status(200).json(tripSchedules);

        } catch (error) {
            console.error("An error occured", error)
            return res.status(500).json({"message": "Internal server error"})
    }
     
}

const getSchedulesForTripAndMonth = async(req,res) => {

   try {
      const tripId = req.params.id;
      const monthNumber = req.query.month

      if(!tripId || monthNumber.trim() === "" || monthNumber === undefined){
         return res.status(400).json({"message": "Invalid data format"})
      }

      const month = Number(monthNumber);

      if(Number.isNaN(month) || !Number.isInteger(month) || month < 1 || month > 12){
        
        return res.status(400).json({"message" : "Month is invalid"})
      }

      const tripSchedules = await getSchedulesByTripId(tripId,month);


      return res.status(200).json(tripSchedules)

   } catch (error) {
     console.error('An error occured', error)
     return res.status(500).json({"message": "Internal server error"})
   }
}

const scheduleHandler = async (req,res) => {

   const monthNumber = req.query.month; 
   if(monthNumber === undefined){
      await getSchedulesForTrip(req, res);
      return;
   }
   await getSchedulesForTripAndMonth(req,res);
   return;

}
export {scheduleHandler}