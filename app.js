import express from 'express';
import session from 'express-session';
import Path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };
import globalMiddleware from './src/middleware/global.js';
import { loadSessionUser } from './src/middleware/auth.js';
import routes from './src/routes/router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

const app = express();

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const isTestEnv = NODE_ENV === 'test' || Boolean(process.env.VITEST);
const SESSION_SECRET = process.env.SESSION_SECRET || (isTestEnv ? 'test-session-secret' : undefined);

if (!SESSION_SECRET) {
    throw new Error('SESSION_SECRET is required. Add it to your .env file.');
}

if (NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Add version info to res.locals for access in templates.
app.use((req, res, next) => {
    res.locals.appVersion = pkg.version;
    next();
});

// Configure static files and EJS templates.
app.use(express.static(Path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', Path.join(__dirname, 'src/views'));

// Parse JSON and URL-encoded request bodies.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration
app.use(session({
    name: 'kizuna.sid',
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000
    }
}));

// Load session user
app.use(loadSessionUser);

// Global middleware
app.use(globalMiddleware);

// API and Browser-facing routes
app.use('/', routes);

// 404 handler - catch requests that did not match a route.
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Centralized error handler - renders the appropriate error page.
app.use((err, req, res, next) => {
    const requestedStatus = Number(err.statusCode || err.status);
    const status = Number.isInteger(requestedStatus) && requestedStatus >= 400 && requestedStatus <= 599
        ? requestedStatus
        : 500;

    let template = status === 404 ? '404' : '500';
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };

    // Return JSON errors for API requests.
    if (req.originalUrl.startsWith('/api/')) {
        return res.status(status).json({
            error: {
                status,
                message: err.message
            }
        });
    }

    // Select the appropriate error page for 403 errors.
    if (status === 403) {
        template = '403';
        context.title = 'Forbidden';
        context.error = 'You do not have permission to access this resource.';
    }

    // Select the appropriate error page for other client errors.
    if (status >= 400 && status < 500 && status !== 403 && status !== 404) {
        template = 'error';
        context.title = 'Request Error';
        context.error = 'Your request could not be completed. Please check your request and try again.';
    }

    return res.status(status).render(`errors/${template}`, context);
});

export default app;