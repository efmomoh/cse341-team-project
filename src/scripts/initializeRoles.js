// Creates the standard customer and admin roles using upserts
import Role from '../models/schemas/roles.js';

export async function initializeRoles() {
    const roles = ['customer', 'admin'];

    for (const name of roles) {
        await Role.updateOne(
            { name },
            { $setOnInsert: { name } },
            { upsert: true }
        );
    }

    console.log('Authentication roles initialized.');
}