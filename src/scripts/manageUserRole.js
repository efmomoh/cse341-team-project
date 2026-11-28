
import mongoose from 'mongoose';
import User from '../models/schemas/users.js';
import Role from '../models/schemas/roles.js';

const manageUserRole = async () => {
    const [, , emailArg, roleArg] = process.argv;

    const email = emailArg?.trim().toLowerCase();
    const roleName = roleArg?.trim().toLowerCase();

    const validRoles = ['admin', 'customer'];

    if (!email || !roleName || !validRoles.includes(roleName)) {
        console.error(
            'Usage: node --env-file=.env src/scripts/manageUserRole.js <email> <admin|customer>'
        );
        process.exitCode = 1;
        return;
    }

    try {
        // await mongoose.connect(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.MONGODB_DB_NAME || 'kizuna-rail'
        });

        console.log('Connected to MongoDB Atlas.');

        const user = await User.findOne({ email });

        if (!user) {
            throw new Error(`User not found: ${email}`);
        }

        const role = await Role.findOne({ name: roleName });

        if (!role) {
            throw new Error(
                `Role '${roleName}' does not exist. Run database initialization first.`
            );
        }

        if (user.role?.toString() === role._id.toString()) {
            console.log(
                `${email} already has the ${roleName} role.`
            );
            return;
        }

        user.role = role._id;
        await user.save();

        console.log(
            `Successfully changed ${email} to ${roleName}.`
        );
    } catch (error) {
        console.error('Role update failed:', error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }

        console.log('MongoDB connection closed.');
    }
};

await manageUserRole();
