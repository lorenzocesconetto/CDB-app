// Imports
const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult, checkSchema } = require("express-validator");

const filledDailyCDI = require("./processFile.js");
const { getPrices } = require("./utils.js");
const { port } = require("./constants.js");

// Create app
const app = express();

// Middlewares
app.use(bodyParser.json());

app.post(
  "/api",
  [
    body("investmentDate").isDate().toDate(),
    body("currentDate").isDate().toDate(),
    body("cdbRate").isFloat(),
    body("currentDate").custom((value, { req }) => {
      if (value.getTime() <= req.body.investmentDate.getTime())
        throw new Error("Investment date must be earlier than current date");
      return true;
    }),
  ],
  (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send("Invalid parameters");
      // .send({ message: "Invalid parameters", errors: errors.array() });
    }
    const input = req.body;
    res.send(getPrices(input, filledDailyCDI));
  },
);

app.listen(port, () => console.log(`Server is running on localhost:${port}`));

// app.post(
//   "/user",
//   body("email").custom(value => {
//     return User.findUserByEmail(value).then(user => {
//       if (user) {
//         return Promise.reject("E-mail already in use");
//       }
//     });
//   }),
//   (req, res) => {
//     // Handle the request
//   },
// );
