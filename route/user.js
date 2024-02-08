const express = require("express");
const router = express.Router();
const User= require("../models/user.js");
const passport= require("passport");
const {savedRedirectUrl}=require("../middleware.js")
const userController= require("../controllers/user.js");

router.route("/signup")
.get(userController.renderSignUp)
.post(userController.signUp);

router.route("/login")
.get(userController.renderLogin)
.post( savedRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});




router
    router.get("/logout",(req,res)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","You are logged out!");
            res.redirect("/listings");
        });

    });



module.exports= router;