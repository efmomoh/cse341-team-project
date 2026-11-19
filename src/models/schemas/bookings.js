//----------BOOKING SCHEMA----------//
// Defines the Mongoose schema for booking documents in the "bookings" collection, including embedded passenger subdocuments and automatic timestamps.

//----------IMPORTS----------//
import mongoose from 'mongoose';

//----------SUBDOCUMENT SCHEMA----------//
const passengerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

//----------SCHEMA DEFINITION----------//
const bookingSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    scheduleId: {
      type: Number,
      required: true,
      min: 1
    },
    tripId: {
      type: String,
      required: true,
      trim: true
    },
    ticketClass: {
      type: String,
      required: true,
      trim: true
    },
    selectedDay: {
      type: String,
      required: true,
      trim: true
    },
    passengers: {
      type: [passengerSchema],
      required: true,
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 1 && value.length <= 8,
        message: 'A booking must include between 1 and 8 passengers.'
      }
    }
  },
  {
    timestamps: true
  }
);

//----------MODEL CREATION----------//
// Mongoose maps the "Booking" model to the "bookings" collection automatically.
const Booking = mongoose.model('Booking', bookingSchema);

//----------EXPORTS----------//
export default Booking;