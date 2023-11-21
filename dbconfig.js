import pkg from "pg";
const { Pool } = pkg;
import {  } from "dotenv/config";

const isProduction = process.env.NODE_ENV === "production";

/*const db = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,

});*/

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;
export const db = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

const a = await db.query("select * from users");
console.log(a.rows);





