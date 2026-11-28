**# Feature Set 1: Core Authentication**

**## Goal**

Implement secure user registration, login, logout, session management, and role-based authorization using Express, Mongoose, MongoDB, bcrypt, and express-session.

**## Data Model**

MongoDB database: Existing Kizuna Rail team database

MongoDB collections: `users`, `roles`

**User fields:**
- `name`: string, required, maximum 100 characters
- `username`: string, required, unique, 3–30 characters
- `email`: string, required, unique
- `passwordHash`: string, required, excluded from ordinary queries
- `role`: ObjectId, required, references the Role collection
- `timestamps`: `createdAt` and `updatedAt`

**Role fields:**
- `name`: string, required, unique, enum: `customer`, `admin`
- `timestamps`: `createdAt` and `updatedAt`

Initialize both roles using idempotent upserts. New registrations must always receive the `customer` role.

**## Authentication Routes**

**### GET /register**

Purpose: Display the registration page.

Success:
- `200`: Render `auth/register.ejs`.

**### POST /api/auth/register**

Purpose: Register a new user.

Success:
- `201`: Account created successfully.

Errors:
- `400`: Invalid or missing information.
- `409`: Duplicate email or username.
- `500`: Unexpected server error.

Requirements:
- Hash passwords using bcrypt.
- Assign the default `customer` role.
- Never accept administrator privileges from public registration.

**### GET /login**

Purpose: Display the login page.

Success:
- `200`: Render `auth/login.ejs`.

**### POST /api/auth/login**

Purpose: Authenticate an existing user.

Success:
- `200`: Regenerate and save the session.
- Store the authenticated user's ID, name, username, email, and role.
- Redirect HTML form submissions to `/account`.

Errors:
- `400`: Missing email or password.
- `401`: Invalid credentials.
- `500`: Unexpected server error.

**### POST /api/auth/logout**

Purpose: End the authenticated user's session.

Requirements:
- Require authentication.
- Destroy the session.
- Clear the `kizuna.sid` cookie.

Success:
- `200`: API logout response.
- Redirect HTML form submissions to `/`.

**## Protected Routes**

**### GET /account**

Purpose: Display the authenticated user's account page.

Authorization:
- Requires login.
- Redirect unauthenticated users to `/login`.

**### GET /admin/dashboard**

Purpose: Display the administrator dashboard.

Authorization:
- Requires login and the `admin` role.
- Redirect unauthenticated users to `/login`.
- Return a `403` error page for non-admin users.

**### GET /api/admin**

Purpose: Demonstrate administrator-only API access.

Authorization:
- `401`: Unauthenticated requests.
- `403`: Authenticated users without the `admin` role.
- `200`: Authorized administrators.

**## MVC Structure**

**### Models – `src/models/`**

- `schemas/users.js`: Define the User schema.
- `schemas/roles.js`: Define the Role schema.
- `users.js`: Handle user creation, lookup, password hashing, and verification.

**### Controllers – `src/controllers/auth.js`**

- `renderRegisterPage`: Display registration page.
- `renderLoginPage`: Display login page.
- `renderAccountPage`: Display account page.
- `renderAdminDashboardPage`: Display admin dashboard.
- `register`: Create user accounts.
- `login`: Authenticate users and create sessions.
- `logout`: Destroy sessions.

**### Middleware – `src/middleware/auth.js`**

- `loadSessionUser`: Load authenticated user into `req.user` and `res.locals.user`.
- `requireApiLogin`: Protect API endpoints.
- `requirePageLogin`: Protect EJS pages.
- `requireApiRole`: Enforce API role authorization.
- `requirePageRole`: Enforce page role authorization.

**### Routes**

- `src/routes/api-routes.js`: Register authentication and protected API endpoints.
- `src/routes/ejs-routes.js`: Register authentication, account, and admin pages.
- `src/routes/router.js`: Mount API and EJS routes.

**## Frontend Updates**

**### Authentication Pages – `src/views/auth/`**

- `register.ejs`: Registration form.
- `login.ejs`: Login form.
- `account.ejs`: Authenticated account page.
- `admin-dashboard.ejs`: Administrator dashboard.

**### Error Pages – `src/views/errors/`**

- `403.ejs`: Forbidden access.
- `404.ejs`: Page not found.
- `500.ejs`: Server error.

**### Navigation – `src/views/partials/header.ejs`**

- Visitors: Display Register and Login.
- Authenticated users: Display My Account and Logout.
- Administrators: Display Admin Dashboard.
- Preserve existing Trips, Trains, and About links.

**## Database and Connection**

- Use the existing MongoDB Atlas database.
- Use Mongoose for database operations.
- Use environment variables for connection settings.
- Require `SESSION_SECRET`.
- Initialize `customer` and `admin` roles during database import.
- Integrate `initializeRoles()` into `src/db/import.js`.
- Preserve existing user accounts during role initialization.
- Keep `users` and `roles` separate from starter data collections.

**### Developer Role Management**

`src/scripts/manageUserRole.js` supports promoting and demoting registered accounts.

Promote to admin:

```bash
node --env-file=.env src/scripts/manageUserRole.js user@example.com admin
```

Demote to customer:

```bash
node --env-file=.env src/scripts/manageUserRole.js user@example.com customer
```

Users must log in again after role changes to refresh their session.

**## Session Security**

- Hash passwords using bcrypt with 12 salt rounds.
- Regenerate sessions after successful login.
- Store minimal user information in sessions.
- Destroy sessions during logout.
- Use HTTP-only and SameSite cookies.
- Enable secure cookies in production.
- Never expose passwords or password hashes.
- Prevent public registration from assigning administrator privileges.

**## Testing**

1. Verify MongoDB connection.
2. Confirm both roles are initialized.
3. Test valid registration.
4. Test duplicate email and username rejection.
5. Verify password hashing.
6. Test valid and invalid login.
7. Verify session creation and regeneration.
8. Test logout and session destruction.
9. Verify unauthenticated page requests redirect to `/login`.
10. Verify unauthenticated API requests return `401`.
11. Verify customer access to admin resources returns `403`.
12. Verify administrator access succeeds.
13. Test promoting and demoting accounts.
14. Verify authentication-aware navigation.
15. Run ESLint and resolve errors.

**## Out of Scope**

- Password reset and email verification.
- OAuth and third-party authentication.
- Public administrator registration.
- Full administrator management interface.
- Automatic role-based dashboard redirection.
- Schedule API and other railway feature sets.
- Booking and payment functionality.