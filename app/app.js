const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

//Passport Strategy
require("./config/passport")(passport);

//db connection
mongoose.connect(process.env.MongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => {
    console.log("Database connection successful!");
}).catch((error) => {
    console.log(error);
});

//static resources
app.use(express.static("public"));

//view engine
app.set("view engine", "ejs");

//body-parser
app.use(express.urlencoded({ extended: false }));


//Session and Flash
app.use(
    session({
        secret: "secret",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

//Auth_Related
app.use(passport.initialize());
app.use(passport.session());

//routes
const indexRoutes = require("./routes/index.routes");
app.use(indexRoutes);

const userRoutes = require("./routes/users.routes");
app.use("/users", userRoutes);

const MORoutes = require("./routes/mathOlympiad.routes");
app.use("/MathOlympiad", MORoutes);

const PCRoutes = require("./routes/programmingContest.routes");
app.use("/ProgrammingContest", PCRoutes);


module.exports = app;