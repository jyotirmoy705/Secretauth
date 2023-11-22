const express = require("express");
const ejs = require("ejs");
const { secretInsert } = require("./helper.js");
const bodyParser = require("body-parser");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const flash = require("express-flash");
require("./passportconfig.js")(passport);
const { db } = require("./dbconfig.js");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
    secret: "any long string.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get("/", async (req, res) => {
    if (req.isAuthenticated()){
        res.redirect("/secrets")
    }else{
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

app.post("/login",passport.authenticate('local-login',{
    successRedirect: "/secrets",
    failureRedirect: "/login",
    failureFlash: true,
}));
app.get("/secrets", async (req, res) => {
    const result = await db.query("select secret from secrets");
    if (req.isAuthenticated()){
        res.render("secrets",{secret: result.rows });
    }else{
        res.redirect("/login");
    }
});
app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) return res.render("submit");
    res.redirect("/login");
});
app.post("/submit", async (req, res) => {
    if (req.isAuthenticated()){
        const result = await secretInsert(req.body.secret);
    res.redirect("/secrets");
    }else{
        res.redirect("/login");
    }
});
app.get("/logout", async (req, res)=>{
    req.logout( (err)=>{
        if (err) return err;
        res.redirect("/");
    });
});

app.listen(port, () => {
    console.log(`Your server started on port: ${port}`);
});