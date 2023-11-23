const express = require("express");
const ejs = require("ejs");
const { secretInsert, secretList } = require("./helper.js");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
require("./passportconfig.js")(passport);
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", async (req, res) => {
    if (req.isAuthenticated()) {
        res.redirect("/secrets")
    } else {
        res.render("home");
    }
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", passport.authenticate('local-signup', {
    successRedirect: "/login",
    failureRedirect: "/register",
    failureFlash: true
}));
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate('local-login', {
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true,
}));
app.get("/secrets", async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const result = await secretList(req.user.id);
            res.render("secrets", { secret: result });
        } catch (err) {
            console.log(err);
            res.render("secrets");
        }
    } else {
        res.redirect("/login");
    }
});
app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) return res.render("submit");
    res.redirect("/login");
});
app.post("/submit", async (req, res) => {
    if (req.isAuthenticated()) {
        const result = await secretInsert(req.body.secret, req.user.id);
        res.redirect("/secrets");
    } else {
        res.redirect("/login");
    }
});
app.get("/logout", async (req, res) => {
    req.logout((err) => {
        if (err) return err;
        res.redirect("/");
    });
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.get("/auth/google/secrets", passport.authenticate("google", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
}));
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get("/auth/facebook/secrets", passport.authenticate("facebook", {
    successRedirect: "/secrets",
    failureRedirect: "/login"
}));
app.listen(port, () => {
    console.log(`Your server started on port: ${port}`);
});