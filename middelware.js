module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("err", "You must be logged in to perform this action.");
    return res.redirect("/login"); // must return
  }
  next();
};


