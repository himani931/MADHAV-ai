const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// REGISTER FORM
router.get("/register", (req, res) => {
    res.render("users/register");
});


// REGISTER LOGIC
router.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Madhav AI!");
            res.redirect("/");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
});


// LOGIN FORM
router.get("/login", (req, res) => {
    res.render("users/login");
});


// LOGIN LOGIC
router.post("/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login"
    }),
    (req, res) => {
        req.flash("success", "Welcome Back!");
        res.redirect("/");
    }
);


// LOGOUT
router.get("/logout", (req, res) => {
    req.logout(function (err) {
        if (err) return next(err);
        req.flash("success", "Goodbye!");
        res.redirect("/");
    });
});

module.exports = router;