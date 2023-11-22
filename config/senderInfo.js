require("dotenv").config();

module.exports = {
  "email": process.env.SENDER_EMAIL,
  "password": process.env.SENDER_PASSWORD,
}
