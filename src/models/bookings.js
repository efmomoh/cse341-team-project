//----------BOOKING MODELS----------//
// Data-access functions for creating and retrieving booking documents
// from the "bookings" collection using Mongoose.

//----------IMPORTS----------//
import Booking from './schemas/bookings.js';

//----------EXPORTS----------//
export const createBooking = async (bookingData) => {
  const newBooking = {
    id: bookingData.id,
    scheduleId: Number(bookingData.scheduleId),
    tripId: bookingData.tripId,
    ticketClass: bookingData.ticketClass,
    selectedDay: bookingData.selectedDay,
    passengers: bookingData.passengers
  };

  const created = await Booking.create(newBooking);
  return created.toObject();
};

export const getAllBookings = async () => {
  return Booking.find({}).sort({ createdAt: -1 }).lean();
};

export const getBookingById = async (id) => {
  return Booking.findOne({ id }).lean();
};