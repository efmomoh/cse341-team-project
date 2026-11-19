//----------SERVER----------//
// This file is the entry point for the server application. It sets up the Express app, connects to the database, and starts the server.

//----------IMPORTS----------//
import app from './app.js';
import { connectToDb } from './src/db/connect.js';

//----------CONFIG----------//
// Get the environment variables for NODE_ENV and PORT, with default values if not set.
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Set the port to the value from the environment variable or default to 3000.
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before accepting requests.
await connectToDb();

//----------WEBSOCKET SERVER (DEV ONLY)----------//
if (NODE_ENV.includes('dev')) {
    const ws = await import('ws');

    try {

        // Create a WebSocket server on a port one higher than the HTTP server port.
        const wsPort = parseInt(PORT) + 1;
        const wsServer = new ws.WebSocketServer({ port: wsPort });

        wsServer.on('listening', () => {
            console.log(`WebSocket server is running on port ${wsPort}`);
        });

        wsServer.on('error', (error) => {
            console.error('WebSocket server error:', error);
        });
    } catch (error) {
        console.error('Failed to start WebSocket server:', error);
    }
}

//----------START SERVER----------//
app.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
