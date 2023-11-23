const { db } = require("./dbconfig.js");
const bcrypt = require("bcrypt");
const emailExists = async (email)=>{
    const data = await db.query("select * from users where email=$1", [email]);
    if (data.rowCount == 0) return false;
    return data.rows[0];
}

const createUser = async (email, password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const data = await db.query("insert into users(email, access_key) values($1, $2) returning id, email, access_key", [email, hash]);
    if (data.rowCount == 0) return false;
    return data.rows[0];
}
const matchPassword = async (password, hashPassword)=>{
    const match = await bcrypt.compare(password, hashPassword);
    return match;
}
const secretInsert = async (secret, uid)=>{
    const result = await db.query("insert into secrets(secret, u_id) values($1,$2)",[secret, uid]);
}
const googleIdExists = async (id)=>{
    const result = await db.query("select * from g_user where g_id=$1",[id]);
    if (result.rowCount == 0) return false;
    return result.rows[0];
}
const createGUser = async (email, id)=>{
    await db.query("insert into g_user(email, g_id) values($1, $2)",[email, id]);
}
const secretList = async (id)=>{
    const result = await db.query("select secret from secrets where u_id=$1", [id]);
    if (result.rowCount == 0) return false;
    return result.rows;
}
module.exports = { emailExists, createUser, matchPassword, secretInsert, googleIdExists, createGUser, secretList};