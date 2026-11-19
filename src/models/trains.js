//----------TRAIN MODELS----------//
// This file defines the data models and functions for interacting with train data in the database. It includes functions to retrieve a train by its ID and to retrieve all trains.

//----------IMPORTS----------//
import train from "./schemas/trains.js";

//----------EXPORTS----------//
export async function getTrainById(id) {
  return train.findOne({ id }).lean();
}

export async function getAllTrains() {
  return train.find({}).lean();
}