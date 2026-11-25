// Load authenticated user from session
export function loadSessionUser(req, res, next) {

    req.user = req.session?.user || null;

    res.locals.user = req.user;

    return next();
}

// Check whether user is authenticated or logged in
const isLoggedIn = (req) => {

    return Boolean(req.user);
};

// Check user role
const hasRole = (req, roleName) => {

    return req.user?.role === roleName;
};

// Require authentication for API requests
export function requireApiLogin(req, res, next) {

    if (!isLoggedIn(req)) {

        return res.status(401).json({
            message: 'Authentication required.'
        });
    }

    return next();
}

// Require authentication for EJS pages
export function requirePageLogin(req, res, next) {

    if (!isLoggedIn(req)) {

        return res.redirect('/login');
    }

    return next();
}

// Require a specific role for API requests
export function requireApiRole(roleName) {

    return (req, res, next) => {

        if (!isLoggedIn(req)) {

            return res.status(401).json({
                message: 'Authentication required.'
            });
        }

        if (!hasRole(req, roleName)) {

            return res.status(403).json({
                message: 'You do not have permission to perform this action.'
            });
        }

        return next();
    };
}

// Require a specific role for EJS pages
export function requirePageRole(roleName) {

    return (req, res, next) => {

        if (!isLoggedIn(req)) {

            return res.redirect('/login');
        }

        if (!hasRole(req, roleName)) {

            return res.status(403).render('errors/403', {
                title: 'Forbidden',
                message: 'You do not have permission to access this page.'
            });
        }

        return next();
    };
}