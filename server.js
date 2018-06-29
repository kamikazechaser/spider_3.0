/**
 * Spider Task 3
 * Mohamed Sohail
 */

const bodyParser = require("body-parser");
const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const path = require("path");
const passport = require("passport");

const apiRouter = require("./api");
const config = require("./config");
const authRouter = require("./auth/authRouter")
const models = require("./models");
const passportStrategy = require("./auth/authHandler")

const app = express();
const viewsPath = path.join(__dirname, "views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session(config.session));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set("views", viewsPath);
app.set("view engine", "ejs");
app.use(express.static("public"))
app.use("/api", apiRouter);

authRouter(app, passport);
passportStrategy(passport, models.User);

models.sequelize.sync().then(() => {
    console.log("Connected to SQLite DB!");

    app.listen(config.server.port, err => {
        if (!err) console.log(`Connected at http://localhost:${config.server.port}`);
        else console.log(err);
    });
}).catch(err => {
    console.log(err, "Error: Could not sync DB!");
});