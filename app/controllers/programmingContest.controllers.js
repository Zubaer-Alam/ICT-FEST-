const ProgrammingContest = require("../models/ProgrammingContest.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { sendGreetingEmail } = require("./emailGen.controller");

const getPC = (req, res) => {
    res.render("programming-contest/register.ejs", { error: req.flash("error") });
};

const getPCList = (req, res) => {
    let all_teams = [];
    let error = "";
    ProgrammingContest.find().then((data) => {
        all_teams = data;
        res.render("programming-contest/list.ejs", {
            error: req.flash("error", error),
            teams: all_teams,
        });  
    }).catch(() => {
        error = "Failed to fetch data!";
        res.render("programming-contest/list.ejs", {
            error: req.flash("error", error),
            teams: all_teams,
        });
    });
};

const postPC = (req, res) => {
    const {
        teamName, institution,
        coachName, coachContact, coachEmail, coachTshirt,
        leaderName, leaderContact, leaderEmail, leaderTshirt,
        member1Name, member1Contact, member1Email, member1Tshirt,
        member2Name, member2Contact, member2Email, member2Tshirt,
    } = req.body;

    let uniqueKey = crypto.randomBytes(32).toString('hex');
    const total = 3000;
    const paid = 0;
    const selected = false;

    let error = "";
    ProgrammingContest.findOne({teamName: teamName, institution: institution}).then((team) => {
        if (team) {
            error = "A team with this name from this varsity already exists";
            console.log(error);
            req.flash("error", error);
            res.redirect("/ProgrammingContest/register");
        } else {
            const team = new ProgrammingContest({
                teamName, institution,
                coachName, coachContact, coachEmail, coachTshirt,
                leaderName, leaderContact, leaderEmail, leaderTshirt,
                member1Name, member1Contact, member1Email, member1Tshirt,
                member2Name, member2Contact, member2Email, member2Tshirt,
                total, paid, selected, uniqueKey,
            });
            team.save().then(() => {
                sendGreetingEmail(leaderEmail, uniqueKey, teamName, "Math Olympiad");
                sendGreetingEmail(coachEmail, uniqueKey, teamName, "Math Olympiad");
                error = "This team has registered successfully!";
                console.log(error);
                req.flash("error", error);
                res.redirect("/ProgrammingContest/register");
            }).catch(() => {
                error = "Registration failed. Please try again.";
                console.log(error);
                req.flash("error", error);
                res.redirect("/ProgrammingContest/register");
            });
        }
    });
};

const deletePC = (req, res) => {
    let error ="";
    const id = req.params.id;
    console.log(id);
    ProgrammingContest.deleteOne({ _id: id }, (err) => {
        if (err) {
            error = "Data couldn't be deleted!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
        } else {
            error = "Team deleted successfully!";
            req.flash("error", error);
            res.redirect("/ProgrammingContest/list");
        }
    });
};

const paymentPC = (req, res) => {
    let error = "";
    const id = req.params.id;
    console.log(id);
    ProgrammingContest.findOne({_id: id}).then((team) => {
        const total = team.total;
        ProgrammingContest.findByIdAndUpdate({_id: id}, {paid: total}, (err)=> {
            if (err) {
                error = "Data couldn't be updated";
                req.flash("error", error);
                res.redirect("/ProgrammingContest/list");
            } else {
                error = "Data updated successfully!";
                req.flash("error", error);
                res.redirect("/ProgrammingContest/list");
            }
        });
    }).catch(() => {
        error = "Data couldn't be updated";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
    });
};

const selectPC = (req, res) => {
    let error = "";
    const id = req.params.id;
    console.log(id);
    ProgrammingContest.findOne({_id: id}).then((team) => {
        ProgrammingContest.findByIdAndUpdate({_id: id}, {selected: true}, (err)=> {
            if (err) {
                error = "Data couldn't be updated";
                req.flash("error", error);
                res.redirect("/ProgrammingContest/list");
            } else {
                error = "Data updated successfully!";
                req.flash("error", error);
                res.redirect("/ProgrammingContest/list");
            }
        });
    }).catch(() => {
        error = "Data couldn't be updated";
        req.flash("error", error);
        res.redirect("/ProgrammingContest/list");
    });
};

module.exports = { getPC, getPCList, postPC, deletePC, paymentPC, selectPC };