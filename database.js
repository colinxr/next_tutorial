const dotenv = require('dotenv');
dotenv.config();

const Database = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
}

module.exports = Database

