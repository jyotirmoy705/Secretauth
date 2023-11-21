import { db } from "./dbconfig";

const emailExists = async (email)=>{
    const data = await pgdb.query("select * from users where email=$1", [email]);
    if (data.rowCount == 0) return false;
    return data.rows[0];
}

const createUser = async (email, password)=>{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const data = await pgdb.query("insert into users(email, access_key) values($1, $2) returning id, email, access_key", [email, hash]);
    if (data.rowCount == 0) return false;
    return data.rows[0];
}
const matchPassword = async (password, hashPassword)=>{
    const match = await bcrypt.compare(password, hashPassword);
    return match;
}

module.exports = { emailExists, createUser, matchPassword };