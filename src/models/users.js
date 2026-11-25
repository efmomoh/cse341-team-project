// src/models/users.js

import bcrypt from 'bcrypt';
import Role from './schemas/roles.js';
import User from './schemas/users.js';

// Create a new user account
export async function createUser(name, username, email, password) {

    const customerRole = await Role.findOne({
        name: 'customer'
    });

    if (!customerRole) {
        throw new Error('Default customer role not found.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        passwordHash,
        role: customerRole._id
    });

    return user._id.toString();
}

// Find a user by their email address.
// Include the password hash for password verification.
export async function findUserByEmail(email) {

    return User.findOne({
        email: email.trim().toLowerCase()
    })
        .select('+passwordHash') // This is essential because the schema excludes password hashes by default. Without it, login password verification will not work
        .populate('role');
}

// Find a user by username
export async function findUserByUsername(username) {

    return User.findOne({
        username: username.trim().toLowerCase()
    });
}

// Verify a submitted password
export async function verifyPassword(password, passwordHash) {

    return bcrypt.compare(password, passwordHash);
}