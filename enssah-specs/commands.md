# RUN COMMANDS:
1. npm install
2. npm run lint
3. npm run db:import
4. npm run dev

**Initializes the two required application roles**
- node --env-file=.env -e "import('./src/scripts/initializeRoles.js').then(m => m.initializeRoles())"

**Promotes an existing registered account to administrator. This is an administrative script, not a public registration feature**
- node --env-file=.env src/scripts/manageUserRole.js admin@kizunarail.com admin
- node --env-file=.env src/scripts/manageUserRole.js jesuschrist@savior.com admin

**Demote an administrator if necessary**
- node --env-file=.env src/scripts/manageUserRole.js user@example.com customer

**Dependencies and environment configuration**
- npm install express-session 
- npm install bcrypt 
- npm install mongoose
- npm install mongodb

**Generate a new secret key by running the following command in the terminal:**
- node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"