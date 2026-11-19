//----------TRAIN CONTROLLER----------//
// This file defines the controller functions for handling train-related requests. It includes functions to retrieve a train by its ID and to retrieve all trains from the database.

//----------IMPORTS----------//
import {
  getTrainById as findTrainById,
  getAllTrains as findAllTrains,
} from "../models/trains.js";

//----------CONTROLLER FUNCTIONS----------//
// Function to get a train by its ID
export async function getTrainById(req, res) {
  try {
    const { id } = req.params;

    const train = await findTrainById(id);

    if (!train) {
      return res.status(404).json({
        error: "Train not found",
      });
    }

    return res.status(200).json(train);
  } catch (error) {
    console.error("Error fetching train:", error);

    return res.status(500).json({
      error: "Failed to fetch train",
    });
  }
}

//function to get all trains
export async function getAllTrains(req, res) {
  try {
    const trains = await findAllTrains();

    return res.status(200).json(trains);
  } catch (error) {
    console.error("Error fetching trains:", error);

    return res.status(500).json({
      error: "Failed to fetch trains",
    });
  }
}