
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const dbUrl = process.env.ATLASDB_URL;
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const app = express();
const User = require("./models/user");
const artworks = require("./routes/artworks.js");
const user = require("./routes/user.js");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");


const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET ,
  },
  touchAfter: 24 * 3600
});

store.on("error", (err) => {
  console.log("Session store error", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.succes = req.flash("succes");
  res.locals.err = req.flash("err");
  res.locals.currUser = req.user;
  next();
});

// Connect to MongoDB
main()
  .then(() => {
    console.log("Connected to Db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}
// View engine setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// Routes

app.use("/", artworks);
app.use("/", user);

app.all("*", (req, res, next) => {
  // next(new ExpressError(404, "Page not found"));
  req.flash("err", "Page not found");
  res.redirect("/");
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    // Let default Express handler deal with it
    return next(err);
  }

  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});

// Start server
app.listen(8080, () => {
  console.log("Server running on port 8080");
});
