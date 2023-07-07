const mysql = require("mysql")
require("dotenv").config()

const db = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USER,
    password:process.env.DB_PASSW,
    database:process.env.DB_NAME
})

module.exports = db