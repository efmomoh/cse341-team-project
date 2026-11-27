import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
   },
    tripId: {
    type: String,
    required: true,
    trim: true,
    ref: 'trips',
    },
    departureTime: {
        type: String,
        required: true,
        trim: true,
    },
    arrivalTime: {
        type: String,
        required: true,
        trim: true,
    },
    daysOfWeek: {
    type: [{
        type: String,
        enum: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
        ]
    }],
    required: true,
    },
    status: {
        type: Boolean,
        required: true
    }

}, { timestamps: true });

const schedules = mongoose.model('Schedules', scheduleSchema);

export {schedules};