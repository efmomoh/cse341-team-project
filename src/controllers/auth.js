import {
    createUser,
    findUserByEmail,
    findUserByUsername,
    verifyPassword
} from '../models/users.js';

// Check whether request came from an HTML form
const isHtmlForm = (req) => {

    return req.is('application/x-www-form-urlencoded');
};

// Preserve submitted registration information
const getFormData = (req) => {

    return {
        name: req.body.name || '',
        username: req.body.username || '',
        email: req.body.email || ''
    };
};

// Render registration or login errors
const renderFormError = (req, res, view, title, status, message) => {

    if (isHtmlForm(req)) {

        return res.status(status).render(view, {
            title,
            error: message,
            formData: getFormData(req),
            query: req.query
        });
    }

    return res.status(status).json({
        message
    });
};

// Regenerate session
const regenerateSession = async (req) => {

    return new Promise((resolve, reject) => {

        req.session.regenerate((error) => {

            if (error) {

                return reject(error);
            }

            return resolve();
        });
    });
};

// Save session
const saveSession = async (req) => {

    return new Promise((resolve, reject) => {

        req.session.save((error) => {

            if (error) {

                return reject(error);
            }

            return resolve();
        });
    });
};

// Destroy session
const destroySession = async (req) => {

    return new Promise((resolve, reject) => {

        req.session.destroy((error) => {

            if (error) {

                return reject(error);
            }

            return resolve();
        });
    });
};

// Display registration page
export function renderRegisterPage(req, res) {

    return res.status(200).render('auth/register', {
        title: 'Create an Account',
        error: null,
        formData: {}
    });
}

// Display login page
export function renderLoginPage(req, res) {

    return res.status(200).render('auth/login', {
        title: 'Log In',
        error: null,
        formData: {},
        query: req.query
    });
}

// Display account page
export function renderAccountPage(req, res) {

    return res.status(200).render('auth/account', {
        title: 'My Account',
        user: req.user
    });
}

// Display admin dashboard
export function renderAdminDashboardPage(req, res) {

    return res.status(200).render('auth/admin-dashboard', {
        title: 'Admin Dashboard',
        user: req.user
    });
}

// Register a new user
export async function register(req, res) {

    try {
        const name = req.body.name?.trim();
        const username = req.body.username?.trim().toLowerCase();
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        // Validate required fields
        if (!name || !username || !email || !password) {
            return renderFormError(req, res, 'auth/register', 'Create an Account', 400, 'All registration fields are required.');
        }

        // Validate full name
        if (name.length > 100) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                400,
                'Full name cannot exceed 100 characters.'
            );
        }

        // Validate username length
        if (username.length < 3 || username.length > 30) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                400,
                'Username must contain between 3 and 30 characters.'
            );
        }

        // Validate username characters
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                400,
                'Username can only contain letters, numbers, and underscores.'
            );
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                400,
                'Please enter a valid email address.'
            );
        }

        // Validate password length
        if (password.length < 8) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                400,
                'Password must contain at least 8 characters.'
            );
        }

        // Check duplicate email
        const existingEmail = await findUserByEmail(email);

        if (existingEmail) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                409,
                'An account with this email address already exists.'
            );
        }

        // Check duplicate username
        const existingUsername = await findUserByUsername(username);

        if (existingUsername) {

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                409,
                'This username is already taken. Please choose another.'
            );
        }

        // Create user
        await createUser(
            name,
            username,
            email,
            password
        );

        // Redirect after registration
        if (isHtmlForm(req)) {

            return res.redirect(303, '/login?registered=true');
        }

        return res.status(201).json({
            message: 'Account created successfully.'
        });

    } catch (error) {

        console.error('Registration error:', error);

        // Handle MongoDB duplicate-key race conditions
        if (error.code === 11000) {

            const field = Object.keys(error.keyPattern || {})[0];

            const message = field === 'email'
                ? 'An account with this email address already exists.'
                : 'This username is already taken.';

            return renderFormError(
                req,
                res,
                'auth/register',
                'Create an Account',
                409,
                message
            );
        }

        return renderFormError(
            req,
            res,
            'auth/register',
            'Create an Account',
            500,
            'Unable to create your account at this time. Please try again.'
        );
    }
}

// Log in an existing user
export async function login(req, res) {

    try {

        const email = req.body.email
            ?.trim()
            .toLowerCase();

        const password = req.body.password;

        if (!email || !password) {

            return renderFormError(
                req,
                res,
                'auth/login',
                'Log In',
                400,
                'Email address and password are required.'
            );
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {

            return renderFormError(
                req,
                res,
                'auth/login',
                'Log In',
                401,
                'Invalid email address or password.'
            );
        }

        // Verify password
        const passwordMatches = await verifyPassword(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {

            return renderFormError(
                req,
                res,
                'auth/login',
                'Log In',
                401,
                'Invalid email address or password.'
            );
        }

        // Verify assigned role
        if (!user.role) {

            return renderFormError(
                req,
                res,
                'auth/login',
                'Log In',
                500,
                'Your account role is not configured. Please contact support.'
            );
        }

        // Prevent session fixation
        await regenerateSession(req);

        // Store minimal user information in session
        req.session.user = {
            id: user._id.toString(),
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role.name
        };

        await saveSession(req);

        if (isHtmlForm(req)) {

            return res.redirect(303, '/account');
        }

        return res.status(200).json({
            message: 'Login successful.',
            user: req.session.user
        });

    } catch (error) {

        console.error('Login error:', error);

        return renderFormError(req, res, 'auth/login', 'Log In',
            500,
            'Unable to log in at this time. Please try again.'
        );
    }
}

// Log out current user
export async function logout(req, res) {

    try {

        await destroySession(req);

        res.clearCookie('kizuna.sid');

        if (isHtmlForm(req)) {

            return res.redirect(303, '/');
        }

        return res.status(200).json({
            message: 'Logout successful.'
        });

    } catch (error) {

        console.error('Logout error:', error);

        return res.status(500).json({
            message: 'Unable to log out at this time.'
        });
    }
}