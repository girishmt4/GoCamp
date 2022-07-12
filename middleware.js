module.exports.isLoggedIn = async (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        res.redirect('/login');
    }
    else {
        next();
    }
} 