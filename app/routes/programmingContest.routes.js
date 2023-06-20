const express = require("express");
const router = express.Router();

const {
    ensureAuthenticated,
    addUserData, 
} = require("../middlewares/auth.middleware");

const {
    getPC,
    postPC,
    getPCList,
    deletePC,
    paymentPC,
    selectPC
} = require("../controllers/programmingContest.controllers");

router.get("/register", ensureAuthenticated, addUserData, getPC);
router.post("/register", ensureAuthenticated, addUserData, postPC);
router.get("/list", ensureAuthenticated, addUserData, getPCList);
router.get("/delete/:id", ensureAuthenticated, addUserData, deletePC);
router.get("/payment/:id", ensureAuthenticated, addUserData, paymentPC);
router.get("/select/:id", ensureAuthenticated, addUserData, selectPC);

module.exports = router;