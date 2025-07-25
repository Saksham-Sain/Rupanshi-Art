const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc");
const passport = require("passport");
const User = require("../models/user");

// router.get("/signup", (req, res) => {
//    res.render("user/signup.ejs");
// });


// router.post(
//   "/signup",async (req, res, next) =>{
//     try {
//     const { username, email, password } = req.body;
//     const newUser = new User({ email, username });
//     const registeredUser = await User.register(newUser, password);
//     console.log(registeredUser);

//     // Automatically login after signup
//     req.login(registeredUser, (err) => {
//       if (err) return next(err);
//       req.flash("succes", "Welcome to Wanderlust!");
//       res.redirect("/");
//     });
//   } catch (e) {
//     req.flash("err", e.message);
//     res.redirect("/signup");
//   }
//   } 
// );

router.get("/login", (req, res) => {
  res.render("user/login.ejs"); 
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login"
  }),
  (req, res) => {
    req.flash("succes", "Welcome back!");
    res.redirect("/");
  }
);

router.get("/logout", (req,res,next )=>{
  req.logout((err)=>{
    if(err){
      return next(err)
    }
    req.flash("succes" ,"you are logged out Successfully")
    res.redirect("/")
  })
})
module.exports = router;