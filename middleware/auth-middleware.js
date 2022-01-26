module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.send('You must be logged in first')
    } else {
        next();
    }
}
