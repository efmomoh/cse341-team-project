# schedules w03 spec 

## Feature: getSchedulesByTripId feature

### Goal: Update the trip details page (src/view/trips/details.ejs) so the schedules component is powered by the API and updates when the user selects a month. When the user selects a month, the client-side JavaScript should fetch the relevant schedule data from the API and update the displayed schedules accordingly.Update the existing trip details EJS controller function. It should no longer need to get the schedules, because those will be populated later on the client side.


### Data Model 
schedules document will be structured using a mongoose schema in `src/models/schemas/schedules.js` and exported for implementation in `models` directory.

### Routes

#### GET /api/trips/{id}/schedules
purpose: returns the schedules for a trip.

success: 
- Status code: `200`
- Response body: an array of schedules for the trip

- status code: `400` if provided input is invalid

Errors:
- `500` if an unexpected server or database error occurs

### GET /api/trips/{id}/schedules?month={month}
Purpose:  returns the schedules for a trip in a specific month.

Success:
- Status code: `200`
- Response body: an array of schedules for the tripId and month

Errors:
- `400` if provided input is invalid
- `500` if an unexpected server or database error occurs

### Swagger Documentation
swagger must document every ticket-class route

### Test plan
- `GET /api/trips/{id}/schedules` returns an array of schedule for the supplied tripId with a status code of 200
- `GET /api/trips/{id}/schedules` returns a status code of 400 with a safe message for an invalid input
- `GET /api/trips/{id}/schedules` returns a status code of 500 with a safe message for a server error
- `GET /api/trips/{id}/schedules?month={month}` returns an array of schedule for the supplied tripId operating in the provided `month` with a status code of 200
- `GET /api/trips/{id}/schedules?month={month}`returns a status code of 400 with a safe message for an invalid input
- `GET /api/trips/{id}/schedules?month={month}`  returns a status code of 500 with a safe message for a server error
- `available schedules` are displayed from the frontend
- `available schedules` for a selected month is displayed from the frontend
- `EJS controller function` no longer passes scchedule data to the templates