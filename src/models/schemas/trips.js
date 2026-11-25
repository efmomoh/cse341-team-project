
import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        region: {
            type: String,
            required: true,
            enum: [
                'central',
                'northern',
                'kansai',
                'hokkaido'
            ],
            lowercase: true,
            trim: true
        },

        startStation: {
            type: String,
            required: true,
            trim: true
        },

        endStation: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: String,
            required: true,
            trim: true
        },

        distance: {
            type: Number,
            required: true,
            min: 0
        },

        highlights: {
            type: [String],
            default: []
        },

        bestSeason: {
            type: String,
            required: true,
            enum: [
                'spring',
                'summer',
                'autumn',
                'winter'
            ],
            lowercase: true,
            trim: true
        },

        operatingMonths: {
            type: [{
                type: Number,
                min: 1,
                max: 12
            }],
            required: true,
            validate: {
                validator: (months) =>
                    months.length > 0 &&
                    new Set(months).size === months.length,
                message: 'Operating months must contain unique months.'
            }
        },

        imageUrl: {
            type: String,
            default: '',
            trim: true
        }
    },
    {
        timestamps: true
    }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;
