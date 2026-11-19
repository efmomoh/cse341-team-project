//----------CONNECT----------//
// This file is responsible for connecting to the MongoDB database using both the native MongoDB driver and Mongoose.

//----------IMPORTS----------//
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

let database;
let client;

//----------CONNECT TO DATABASE FUNCTION----------//
// Connects to the MongoDB database using the provided connection string and database name. If no options are provided, it uses environment variables. It also ensures that Mongoose is connected to the same database.
const connectToDb = async (options = {}) => {
  if (database && mongoose.connection.readyState === 1) {
    return database;
  }

  const connectionString = options.connectionString || process.env.MONGODB_URI;
  const databaseName = options.databaseName || process.env.MONGODB_DB_NAME || 'practice';

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  if (!database) {
    client = new MongoClient(connectionString);
    await client.connect();
    database = client.db(databaseName);
  }

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(connectionString, { dbName: databaseName });
  }

  return database;
};

//----------GET DATABASE FUNCTION----------//
// Returns the current database instance. Throws an error if the database has not been initialized.
const getDb = () => {
  if (!database) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }
  return database;
};

//----------CLOSE DATABASE FUNCTION----------//
// Closes the database connection for both the native MongoDB driver and Mongoose. It resets the client and database variables to undefined.
const closeDb = async () => {
  if (client) {
    await client.close();
    client = undefined;
    database = undefined;
  }

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

//----------EXPORTS----------//
export { 
  closeDb, 
  connectToDb, 
  getDb 
};