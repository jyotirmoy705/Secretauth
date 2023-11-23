const { db } = require("./dbconfig.js");
const bcrypt = require("bcrypt");
const emailExists = async (email) => {
    const data = await db.query("select * from users where email=$1", [email]);
    if (data.rowCount == 0) return false;
    return data.rows[0];
}

const createUser = async (email, password, password2) => {
    const checkEmail = await emailExists(email);
    if (password == password2) {
        if (!checkEmail) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const data = await db.query("insert into users(email, access_key) values($1, $2) returning id, email, access_key", [email, hash]);
            if (data.rowCount == 0) return false;
            return data.rows[0];
        }
    }
    return false;
}
const matchPassword = async (password, hashPassword) => {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
}
const secretInsert = async (secret) => {
    const result = await db.query("insert into secrets(secret) values($1)", [secret]);
}
module.exports = { emailExists, createUser, matchPassword, secretInsert };