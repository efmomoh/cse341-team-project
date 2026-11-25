import { closeDb, connectToDb } from './connect.js';
import { initializeDatabase } from './initialize.js';
import { initializeRoles } from '../scripts/initializeRoles.js';

try {
  const db = await connectToDb();
  await initializeDatabase(db);
  await initializeRoles(); // let's initialize the roles
  console.log('MongoDB import complete.');
} finally {
  await closeDb();
}
