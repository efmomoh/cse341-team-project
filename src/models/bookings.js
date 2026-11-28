// src/models/bookings.js
import Booking from './schemas/bookings.js';

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createBooking = async (bookingData) => {
  const createdBooking = await Booking.create(bookingData);
  return createdBooking.toObject();
};

const getAllBookings = async () => {
  return Booking.find({}).sort({ createdAt: -1 }).lean();
};

const getBookingsByPassengerEmail = async (email) => {
  const normalizedEmail = String(email || '').trim();
  if (!normalizedEmail) {
    return [];
  }

  const emailRegex = new RegExp(`^${escapeRegex(normalizedEmail)}$`, 'i');
  return Booking.find({ 'passengers.email': emailRegex })
    .sort({ createdAt: -1 })
    .lean();
};

const getBookingById = async (bookingId) => {
  return Booking.findOne({ id: bookingId }).lean();
};

const updateBookingById = async (bookingId, updates) => {
  return Booking.findOneAndUpdate(
    { id: bookingId },
    { $set: updates },
    { new: true, runValidators: true }
  ).lean();
};

const deleteBookingById = async (bookingId) => {
  return Booking.findOneAndDelete({ id: bookingId }).lean();
};

export {
  createBooking,
  deleteBookingById,
  getAllBookings,
  getBookingById,
  getBookingsByPassengerEmail,
  updateBookingById,
};