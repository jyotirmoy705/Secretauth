import express from "express";
import ejs from "ejs";
import { db } from "./dbconfig.js";
import { emailExists, createUser, matchPassword } from "./helper.js";
import bodyParser from "body-parser";
import { } from "dotenv/config";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import bcrypt from "bcrypt";
import bcryptjs from "bcryptjs";

const a = await db.query("select * from users");
console.log(a.rows);

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: "any long string.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());



app.get("/", async (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
   
});
app.get("/logout", (req, res) => {

});
app.get("/submit", (req, res) => {

});
app.post("/submit", async (req, res) => {

});

app.listen(port, () => {
    console.log(`Your server started on port: ${port}`);
});