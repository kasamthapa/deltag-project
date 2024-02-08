const User= require("../models/user.js");


const userController = {
    renderSignUp: (req, res) => {
        res.render("users/signup.ejs");
    },
    signUp: async (req, res) => {
        try{
            let {username,email,password}=req.body;
            const newUser= new User ({email,username});
            const registeredUser= await User.register(newUser,password);
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        }
        catch(e){
            req.flash("error",e.message);
            res.redirect("/signup");
        }
    },
    renderLogin: (req, res) => {
        res.render("users/login.ejs");
    },
    login: async (req, res) => {
        console.log("Authenticated User:", req.user);
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    },
    logout: (req, res) => {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        });
    }
};

module.exports = userController;
