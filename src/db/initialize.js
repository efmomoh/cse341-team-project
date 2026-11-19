//----------INITIALIZE DATABASE WITH STARTER DATA----------//
//Resets the database to a clean state by loading starter seed data and configuring the bookings collection with a unique index.

//----------IMPORTS----------//
import trips from './seeds/trips.json' with { type: 'json' };
import schedules from './seeds/schedules.json' with { type: 'json' };
import stations from './seeds/stations.json' with { type: 'json' };
import ticketClasses from './seeds/ticket-classes.json' with { type: 'json' };
import trains from './seeds/trains.json' with { type: 'json' };

//----------STARTER COLLECTIONS----------//
// Pairs each MongoDB collection name with its corresponding seed JSON array so all starter collections can be reset in a single loop.
const starterCollections = [
  ['trips', trips],
  ['schedules', schedules],
  ['stations', stations],
  ['ticketClasses', ticketClasses],
  ['trains', trains]
];

//----------INITIALIZE DATABASE FUNCTION----------//
// Clears and repopulates every starter collection, then resets the "bookings" collection and enforces uniqueness on its "id" field.
const initializeDatabase = async (db) => {

  // Check if the database connection is valid. If not, throw an error.
  if (!db) {
    throw new Error('A database connection is required to initialize data.');
  }

  // Iterate over each collection in the starterCollections array, clear existing data, and insert the new documents.
  for (const [collectionName, documents] of starterCollections) {
    const collection = db.collection(collectionName);

    // Clear existing documents in the collection.
    await collection.deleteMany({});

    // Insert the new documents into the collection.
    await collection.insertMany(documents);
  }

  // Create a unique index on the 'id' field of the 'bookings' collection to ensure that each booking has a unique identifier.
  const bookings = db.collection('bookings');
  await bookings.deleteMany({});
  await bookings.createIndex({ id: 1 }, { unique: true });
};

//----------EXPORTS----------//
export { 
  initializeDatabase, 
  starterCollections 
};
