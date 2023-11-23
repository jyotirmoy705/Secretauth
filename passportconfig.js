const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const { db } = require("./dbconfig.js");
const { emailExists, createUser, matchPassword, googleIdExists, createGUser } = require("./helper.js");
const passport = require("passport");




module.exports = (passport)=>{
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/secrets"
      },
      function(accessToken, refreshToken, profile, cb) {
        return cb(null, profile);
      }
    ));
    passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets"
  },
  async function(accessToken, refreshToken, profile, cb) {

    try{
        const checkId = await googleIdExists(profile.id);
        if (!checkId){
            await createGUser(profile.emails[0].value, profile.id);
        }
    } catch (err){
        throw err;
    }
      return cb(null, profile);
  }
));
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