const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc");
const passport = require("passport");
const isLoggedIn = require("../middelware").isLoggedIn;
const Artwork = require("../models/Artwork");
const multer = require("multer");

const { storage } = require("../cloudconfig");
const upload = multer({ storage });
const artworkSchema = require("../validateSchema").artworkSchema;

const User = require("../models/user");

const validateArtwork = (req, res, next) => {
  const { error } = artworkSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(",");
    req.flash("error", errMsg);
    return res.redirect("/artworks/new"); // return here to stop further execution
  }
  next();
};


// Routes
router.get("/", wrapAsync(async (req, res) => {
  const allArtworks = await Artwork.find({});
  res.render("./layouts/main", { allArtworks });
}));

router.get("/artworks/new",isLoggedIn, wrapAsync((req, res) => {
  res.render("./layouts/new.ejs");
}));



router.post(
  "/artworks/new",
  isLoggedIn,
  upload.single("artwork[image]"),
  validateArtwork,
  wrapAsync(async (req, res) => {
    const newArtwork = new Artwork(req.body.artwork);
    newArtwork.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await newArtwork.save();
    req.flash("succes", "New Artwork Created!");
    return res.redirect("/");
  })
);





router.delete("/artworks/:id", isLoggedIn,wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Artwork.findByIdAndDelete(id);
   req.flash("succes", "Artworkd deleted.");
  res.redirect("/");
}));

module.exports = router;

