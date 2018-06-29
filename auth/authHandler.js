/**
 * Spider Task 3
 * Mohamed Sohail
 */

const bCrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

exports = module.exports = (passport, user) => {
    const User = user;

    passport.serializeUser((user, callback) => {
        return callback(null, user.id);
    });

    passport.deserializeUser((id, callback) => {
        User.findById(id).then(user => {
            if (user) return callback(null, user.get());
            else return callback(user.errors, null);
        });
    });

    passport.use("local-signup", new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },

        function (req, email, password, callback) {

            const generateHash = password => {
                return bCrypt.hashSync(password, 10);
            };

            return User.findOne({where: { email: email }}).then(user => {
                if (user) {
                    return callback(null, false, req.flash("signupMessage", "E-mail is already in use!"));
                } else {
                    const hashedPassword = generateHash(password);
                    const dbPush = {
                        email: email,
                        password: hashedPassword,
                        name: req.body.name,
                    };

                    return User.create(dbPush).then((createdUser, created) => {
                        if (!createdUser) return callback(null, false);
                        if (createdUser) return callback(null, createdUser);
                    });
                }
            }).catch(error => {
                return callback(null, false, req.flash("signupMessage", "Server error! try again later."));
            });
        }
    ));

    passport.use("local-signin", new LocalStrategy({
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true
            },

            function (req, email, password, callback) {
                const validatePassword = (passwordSent, password) => {
                    return bCrypt.compareSync(password, passwordSent);
                };

                return User.findOne({where: { email: email } }).then(user => {
                        if (!user) {
                            return callback(null, false, req.flash("signinMessage", "No such user exists!"));
                        }

                        if (!validatePassword(user.password, password)) {
                            return callback(null, false, req.flash("signinMessage", "Incorrect password!"));
                        }

                        const userInfo = user.get();

                        return callback(null, userInfo);
                }).catch(err => {
                    return callback(null, false, req.flash("signinMessage", "Server error! try again later."));
                });
            }
        )
    );
};