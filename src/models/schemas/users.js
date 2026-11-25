// src/models/schemas/users.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            minlength: 3,
            maxlength: 30
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 255
        },

        passwordHash: {
            type: String,
            required: true,
            select: false // prevents Mongoose from returning password hashes in ordinary queries.
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;