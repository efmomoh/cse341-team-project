//----------TRAIN SCHEMA----------//
// This file defines the Mongoose schema for the train data model, which includes fields such as id, name, operator, imageUrl, imageAlt, type, maxSpeedKmh, capacity, powerSource, bestFor, and description. It also includes timestamps for createdAt and updatedAt.

//----------IMPORTS----------//
import mongoose from "mongoose";

//----------SCHEMA DEFINITION----------//
const trainSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    operator: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
      trim: true,
    },
    imageAlt: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    maxSpeedKmh: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    powerSource: {
      type: String,
      required: true,
      trim: true,
      enum: ["Electric", "Diesel", "Diesel-Electric", "Hybrid", "Hydrogen", "Steam", "Other"],
    },
    bestFor: {
      type: String,
      required: false,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

//----------MODEL CREATION----------//
const train = mongoose.model("Train", trainSchema);

//----------EXPORTS----------//
export default train;