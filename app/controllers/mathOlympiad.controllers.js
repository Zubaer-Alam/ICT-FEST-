const MathOlympiad = require("../models/MathOlympiad.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sendGreetingEmail } = require("./emailGen.controller");

const getMO = (req, res) => {
    res.render("math-olympiad/register.ejs", { error: req.flash("error") });
};

const getMOList = (req, res) => {
    let all_participant = [];
    let error = "";
    MathOlympiad.find().then((data) => {
        all_participant = data;
        res.render("math-olympiad/list.ejs", {
            error: req.flash("error", error),
            participants: all_participant,
        });  
    }).catch(() => {
        error = "Failed to fetch data!";
        res.render("math-olympiad/list.ejs", {
            error: req.flash("error", error),
            participants: all_participant,
        });
    });
};

const postMO = async (req, res) => {
    const { name, contact, email, category, institution, tshirt } = req.body;
    let registrationFee = 0;
    if (category == "school") {
        registrationFee = 250;
    } else if (category == "college") {
        registrationFee = 400;
    } else {
        registrationFee = 500;
    }

    let uniqueKey = crypto.randomBytes(32).toString('hex');
    const total = registrationFee;
    const paid = 0;
    const selected = false;

    let error = "";
    MathOlympiad.findOne({name: name, contact: contact}).then((participant) => {
        if (participant) {
            error = "participant with this name and contact number already exists";
            console.log(error);
            req.flash("error", error);
            res.redirect("/MathOlympiad/register");
        } else {
            const participant = new MathOlympiad({
                name,
                category,
                contact,
                email,
                institution,
                paid,
                total,
                selected,
                tshirt,
                uniqueKey,
            });
            participant.save().then(() => {
                sendGreetingEmail(email, uniqueKey, name, "Math Olympiad");
                error = "Participant has been registered successfully!";
                console.log(error);
                req.flash("error", error);
                res.redirect("/MathOlympiad/register");
            }).catch(() => {
                error = "Registration failed. Please try again.";
                console.log(error);
                req.flash("error", error);
                res.redirect("/MathOlympiad/register");
            });
        }
    });
};

const deleteMO = (req, res) => {
    let error ="";
    const id = req.params.id;
    console.log(id);
    MathOlympiad.deleteOne({ _id: id }, (err) => {
        if (err) {
            error = "Data couldn't be deleted!";
            req.flash("error", error);
            res.redirect("/MathOlympiad/list");
        } else {
            error = "Deleted successfully!";
            req.flash("error", error);
            res.redirect("/MathOlympiad/list");
        }
    });
};

const paymentMO = (req, res) => {
    let error = "";
    const id = req.params.id;
    console.log(id);
    MathOlympiad.findOne({_id: id}).then((participant) => {
        const total = participant.total;
        MathOlympiad.findByIdAndUpdate({_id: id}, {paid: total}, (err)=> {
            if (err) {
                error = "Data couldn't be updated";
                req.flash("error", error);
                res.redirect("/MathOlympiad/list");
            } else {
                error = "Data updated successfully!";
                req.flash("error", error);
                res.redirect("/MathOlympiad/list");
            }
        });
    }).catch(() => {
        error = "Data couldn't be updated";
        req.flash("error", error);
        res.redirect("/MathOlympiad/list");
    });
};

const selectMO = (req, res) => {
    let error = "";
    const id = req.params.id;
    console.log(id);
    MathOlympiad.findOne({_id: id}).then((participant) => {
        MathOlympiad.findByIdAndUpdate({_id: id}, {selected: true}, (err)=> {
            if (err) {
                error = "Data couldn't be updated";
                req.flash("error", error);
                res.redirect("/MathOlympiad/list");
            } else {
                error = "Data updated successfully!";
                req.flash("error", error);
                res.redirect("/MathOlympiad/list");
            }
        });
    }).catch(() => {
        error = "Data couldn't be updated";
        req.flash("error", error);
        res.redirect("/MathOlympiad/list");
    });
};

module.exports = { getMO, getMOList, postMO, deleteMO, paymentMO, selectMO };