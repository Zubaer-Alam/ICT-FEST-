const express = require("express");
const router = express.Router();

const {
    getRegister,
    getLogin,
    postRegister,
    postLogin,
} = require("../controllers/users.controllers");

router.get("/register", getRegister);

router.get("/login", getLogin);

router.post("/register", postRegister);

router.post("/login", postLogin);

router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

module.exports = router;