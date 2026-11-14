# Feature 1: Trips API – Version 1

## Goal

Build a read-only Trips API using Express, Mongoose, and MongoDB. Refactor the existing Trips functionality to follow the MVC architecture and dynamically populate the Trips listing page using the Fetch API and an HTML template.

## Data Model

MongoDB database: Existing Kizuna Rail team database

MongoDB collection: `trips`

Seed file: `src/db/seeds/trips.json`

Required Trip fields:
- `id`: string, required, unique, custom string ID
- `name`: string, required
- `description`: string, required
- `region`: string, required
- `startStation`: string, required, references a station ID
- `endStation`: string, required, references a station ID
- `duration`: string, required
- `distance`: number, required
- `highlights`: array of strings, required
- `bestSeason`: string, required
- `operatingMonths`: array of numbers, required
- `imageUrl`: string, required

Use Mongoose timestamps and preserve existing custom string IDs and station references.

## API Routes

### GET /api/trips

Purpose: Return all trips.

Success:
- Status code: `200`
- Response body: Direct JSON array of trip objects.

Example:

```json
[
  {
    "id": "alpine-panorama",
    "name": "Alpine Panorama Express",
    "description": "Journey through the Japanese Alps with stunning mountain views and traditional villages.",
    "region": "central",
    "startStation": "nagoya",
    "endStation": "toyama",
    "duration": "4.5 hours",
    "distance": 180,
    "highlights": [
      "Mount Tateyama views",
      "Hida River gorge",
      "Traditional alpine villages"
    ],
    "bestSeason": "autumn",
    "operatingMonths": [4, 5, 6, 7, 8, 9, 10, 11],
    "imageUrl": "/images/routes/alpine-panorama.png"
  }
]
```

Errors:
- `500` if an unexpected server or database error occurs.

### GET /api/trips/:id

Purpose: Return one trip using its custom string ID.

Success:
- Status code: `200`
- Response body: The matching trip object.

Example:

```json
{
  "id": "alpine-panorama",
  "name": "Alpine Panorama Express",
  "description": "Journey through the Japanese Alps with stunning mountain views and traditional villages.",
  "region": "central",
  "startStation": "nagoya",
  "endStation": "toyama",
  "duration": "4.5 hours",
  "distance": 180,
  "highlights": [
    "Mount Tateyama views",
    "Hida River gorge",
    "Traditional alpine villages"
  ],
  "bestSeason": "autumn",
  "operatingMonths": [4, 5, 6, 7, 8, 9, 10, 11],
  "imageUrl": "/images/routes/alpine-panorama.png"
}
```

Errors:
- `404` if the trip does not exist.

Example:

```json
{
  "error": "Trip not found"
}
```

- `500` if an unexpected server or database error occurs.

Example:

```json
{
  "error": "Failed to fetch trips"
}
```

## MVC Structure

### Models – `src/models/`

- `schemas/trips.js`: Define the Trips Mongoose schema.
- `trips.js`: Implement `getAllTrips()` and `getTripById(id)`.

### Controllers – `src/controllers/trips.js`

- `getAllTrips`: Return all trips as a JSON array.
- `getTripById`: Return one trip and handle 404 and 500 responses.
- `renderTripsList`: Render the Trips listing page without retrieving trip documents.
- `renderTripDetails`: Retrieve a trip using the model and render its details page.

### Routes

- `src/routes/api-routes.js`: Register both Trips API endpoints.
- `src/routes/ejs-routes.js`: Register the Trips listing and details page routes.
- `src/routes/router.js`: Update the existing router to use the new route structure.

## Frontend Updates

### Trips Listing – `src/views/trips/list.ejs`

- Remove the EJS loop that renders individual trip cards.
- Keep an HTML template for trip cards.
- Include loading, error, and empty states.

### Client-Side JavaScript – `public/js/trips.js`

- Fetch trips from `/api/trips`.
- Verify that the response is a direct JSON array.
- Clone the HTML template and populate trip information.
- Generate links to individual trip details pages.
- Handle region and season filtering within `trips.js`.

The region and season filter handlers were removed from `main.js` because filtering is now managed within `trips.js`. This keeps Trips-specific functionality together and avoids duplicate event listeners.

## Swagger Documentation

Document both Trips API endpoints in Swagger.

The endpoints must be accessible through the deployed Swagger interface at `/api-docs`.

## Database and Connection

- Use the existing MongoDB Atlas database.
- Use environment variables for connection settings.
- Use Mongoose for database operations.
- Refactor `connect.js` to support the Mongoose connection.
- Import the existing trip seed data using `npm run db:import`.
- Preserve existing trip IDs and station references.

## Testing

1. Verify the MongoDB Atlas connection.
2. Confirm that the trips collection contains seeded documents.
3. Test `GET /api/trips` and verify status 200 and a direct JSON array.
4. Test `GET /api/trips/:id` with a valid ID.
5. Test an invalid ID and verify status 404.
6. Verify server errors return status 500 without exposing stack traces.
7. Verify dynamic trip card rendering.
8. Test region and season filtering.
9. Verify trip details navigation.
10. Test loading, error, and empty states.
11. Verify both Swagger endpoints.
12. Run ESLint and resolve reported errors.

## Out of Scope

- Creating, updating, and deleting trips.
- Authentication and authorization.
- Schedule API (Feature Set 2).
- Booking API (Feature Set 3).
- Ticket Class functionality (Feature Set 4).
- Station API (Feature Set 5).
- Additional sorting functionality.