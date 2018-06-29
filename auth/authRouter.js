/**
 * Spider Task 3
 * Mohamed Sohail
 */

const lib = require("../lib/gbooks");
const sqlDb = require("../lib/sqldb");

exports = module.exports = (app, passport) => {
    app.get("/", isLoggedIn, (req, res) => {
        return lib.getRecommendedBooks((error, ctx) => {
            if (!error) return res.render("home.ejs", { prefetch: ctx });
            return res.status(500).json({ error: error });
        });
    });

    app.get("/user/:id", (req, res) => {
        if (req.params.id === "private" && req.user) {
            sqlDb.getUserDetails(req.user.id, ctx => {
                ctx.host = req.header("Host");
                ctx.signedin = true;
                res.render("user.ejs", { prefetch: ctx });
            });
        } else {
            sqlDb.getUserDetails(req.params.id, ctx => {
                if (ctx.user === null) {
                    return res.redirect("/signup");
                }

                ctx.host = req.header("Host");
                ctx.signedin = false;
                res.render("user.ejs", { prefetch: ctx });
            });
        }
    });

    app.get("/signup", (req, res) => {
        return res.render("signup.ejs", { message: req.flash("signupMessage") });
    });

    app.post("/signup",passport.authenticate("local-signup", {
        successRedirect: "/signin",
        failureRedirect: "/signup",
        failureFlash: true
    }));

    app.get("/signin", (req, res) => {
       return res.render("signin.ejs", { message: req.flash("signinMessage") });
    });

    app.post("/signin", passport.authenticate("local-signin", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash : true
    }));

    app.get("/signout", (req, res) => {
        return req.session.destroy(err => {
            return res.redirect("/");
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        return res.redirect("/signin");
    };

};