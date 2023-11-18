import express from "express";
import ejs from "ejs";
import pg from "pg";
import bodyParser from "body-parser";
import {} from "dotenv/config";

const app = express();
const port = 3000;
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "jm1",
    password: process.env.PASSWORD,
    port: "5432"
});
db.connect();
async function randomEncryption(){
    const encryptionList = ['bf', 'des', 'xdes', 'md5']
    let randomNumber = Math.floor(Math.random()*encryptionList.length);
    return encryptionList[randomNumber];
}

async function secretPage() {
    const result = await db.query("select secret from secrets");
    let secrets = [];
    result.rows.forEach((i) => {
        secrets.push(i.secret);
    });
    return secrets;
}

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
let authenticated = false;
app.get("/", async (req, res) => {
    if (authenticated) {
        const secrets = await secretPage();
        res.render("secrets", { secret: secrets });
    } else {
        res.render("home");
    }

});

app.get("/register", (req, res) => {
    res.render("register");
});
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", async (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    const encryptionType = await randomEncryption();
    try {
        await db.query("insert into users(email, access_key) values($1, crypt($2, gen_salt($3)))", [userName, password, encryptionType]);
        res.render("login");
    } catch (error) {
        console.log(error);
        res.render("register");
    }
});

app.post("/login", async (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    try {
        const result = await db.query("select count(*) from users where email = $1 and access_key = crypt($2, access_key)", [userName, password]);
        if (result.rows[0].count === '1') {
            authenticated = true;
            const secrets = await secretPage();
            res.render("secrets", { secret: secrets });
        } else {
            res.render("login");
        }

    } catch (error) {
        console.log(error);
        res.render("login");
    }
});
app.get("/logout", (req, res) => {
    authenticated = false;
    res.redirect("/");
});
app.get("/submit", (req, res) => {
    if (authenticated) {
        res.render("submit");
    } else {
        res.redirect("/");
    }
});
app.post("/submit", async (req, res) => {
    const secret = req.body.secret;
    await db.query("insert into secrets(secret) values($1)", [secret]);
    const secrets = await secretPage();
    res.render("secrets", { secret: secrets });
})

app.listen(port, () => {
    console.log(`Your server started on port: ${port}`);
})