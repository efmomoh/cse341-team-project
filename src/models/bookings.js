// src/models/bookings.js
import Booking from './schemas/bookings.js';

const createBooking = async (bookingData) => {
  const createdBooking = await Booking.create(bookingData);
  return createdBooking.toObject();
};

const getAllBookings = async () => {
  return Booking.find({}).sort({ createdAt: -1 }).lean();
};

const getBookingById = async (bookingId) => {
  return Booking.findOne({ id: bookingId }).lean();
};

export { createBooking, getAllBookings, getBookingById };