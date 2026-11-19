// src/models/schemas/bookings.js
import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    scheduleId: {
      type: Number,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
      trim: true,
    },
    ticketClass: {
      type: String,
      required: true,
      trim: true,
    },
    selectedDay: {
      type: String,
      required: true,
      trim: true,
    },
    passengers: {
      type: [passengerSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 1 && value.length <= 8,
        message: 'A booking must include between 1 and 8 passengers.',
      },
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;