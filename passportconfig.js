const LocalStrategy = require("passport-local").Strategy;
const { db } = require("./dbconfig.js");
const { emailExists, createUser, matchPassword } = require("./helper.js");
const passport = require("passport");

module.exports = (passport)=>{
    passport.use(
        "local-signup",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password"
            },
            async (username, password, done)=>{
                try{
                    const user = await emailExists(username);
                    if (user) return done(null, false);
                    const insert = await createUser(username, password);
                    return done(null, {id: insert.id, username: insert.email} );
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );
    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "username",
                passwordField: "password"
            },
            async (username, password, done)=>{
                try{
                    const user = await emailExists(username);
                    if (!user) return done(null, false);
                    const isMatch = await matchPassword(password, user.access_key);
                    if (!isMatch) return done(null, false);
                    return done(null, {id: user.id, username: user.email} );
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
};