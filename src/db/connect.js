
import mongoose from 'mongoose';

let connectingPromise = null;

const connectToDb = async (options = {}) => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.db;
  }

  if (connectingPromise) {
    await connectingPromise;
    return mongoose.connection.db;
  }

  const connectionString =
    options.connectionString || process.env.MONGODB_URI;

  const databaseName =
    options.databaseName ||
    process.env.MONGODB_DB_NAME ||
    'practice';

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  connectingPromise = mongoose.connect(connectionString, {
    dbName: databaseName
  });

  try {
    await connectingPromise;
    console.log('Connected to MongoDB Atlas.');
    return mongoose.connection.db;
  } finally {
    connectingPromise = null;
  }
};

const getDb = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not initialized. Call connectToDb first.');
  }

  return mongoose.connection.db;
};

const closeDb = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export { closeDb, connectToDb, getDb };
