const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");
// Telling passport we want to use a Local Strategy. In other words, we want login with a username and password
passport.use(new LocalStrategy(
    function(username, password, done) {
        // When a user tries to sign in first look for someone with that username
        db.Users.findOne({
            where: {
                username: username
            }
        }).then((dbUser) => {
            // If there's no user with the given username
            if (!dbUser) {
                return done(null, false, {
                    message: "Incorrect username or password."
                });
            } 
            // If there is a user with the given username, but the password the user gives us is incorrect
            else if (!dbUser.validPassword(password)) {
                return done(null, false, {
                    message: "Incorrect username or password."
                });
            }
            // If none of the above, return the user
            return done(null, dbUser);
        });
    }
));

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
