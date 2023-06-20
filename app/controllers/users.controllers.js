const User = require("../models/users.model");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const getRegister = (req, res) => {
    res.render("users/register.ejs", { errors: req.flash("errors") });
};

const getLogin = (req, res) => {
    res.render("users/login.ejs", { error: req.flash("error") });
};

const postRegister = (req, res) => {
    const {
        name,
        email,
        password,
        confirm_password
    } = req.body;

    const errors = [];

    if (!name || !email || !password || !confirm_password) {
        errors.push("All fields are required!");
    }
    if (password.length < 6) {
        errors.push("Password must be at least 6 characters!");
    }

    if (password !== confirm_password) {
        errors.push("Passwords don't match");
    }

    if (errors.length > 0) {
        req.flash("errors", errors);
        res.redirect("/users/register");
    } else {
        User.findOne({ email: email }).then((user) => {
            if (user) {
                errors.push("User already exists");
                req.flash("errors", errors);
                res.redirect("/users/register");
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) {
                        errors.push(err);
                        req.flash("errors", errors);
                        res.redirect("/users/register");
                    } else {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                errors.push(err);
                                req.flash("errors", errors);
                                res.redirect("/users/register");
                            } else {
                                const newUser = new User({
                                    name, email, password: hash,
                                });
                                newUser.save().then(() => {
                                    res.redirect("/users/login");
                                }).catch(() => {
                                    errors.push("Sorry. Unsuccessful registration. Try again.");
                                    req.flash("errors", errors);
                                    res.redirect("/users/register");
                                });
                            }
                        });
                    }
                });
            }
        });
    }
};

const postLogin = (req, res, next) => {
    //const { email, password } = req.body;
    passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/users/login",
        failureFlash: true,
    })(req, res, next);
};

module.exports = { getLogin, getRegister, postLogin, postRegister };