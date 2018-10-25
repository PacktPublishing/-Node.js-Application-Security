const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const {
  checkSchema,
  validationResult
} = require('express-validator/check');

const mysqlCreds = require('./config');
const schema = require('./validationSchema');

const app = express();
const connection = mysql.createConnection(mysqlCreds);

connection.connect();

app.use(express.urlencoded({
  extended: false
}));

app.post('/login', checkSchema(schema), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  }

  // Extract the username and password properties from the req.body object.
  const {
    username,
    password
  } = req.body;
  
  // The SQL Query
  const sql = "SELECT * FROM members WHERE username = ?";

  // Executing the query
  connection.query(sql, [username], async (error, result) => {
    // Return an error if received here
    if (error) {
      return res.status(500).send(error);
    }

    // If no user was found, return "Invalid Credentials"
    if (result.length === 0) {
      return res.json({ error: 'Invalid Credentials' });
    }

    // If a user was found, use BCrypt for comparing the hash to authenticate
    const comparePwd = await bcrypt.compare(password, result[0].password);
    // If the supplied credentials are correct, then send back the user's fullname
    if (comparePwd) {
      res.json({ fullname: result[0].fullname });
    } else {
      // If the credentials were incorrect, send back the following error message
      res.json({
        error: 'Invalid Credentials'
      });
    }
  });
});

app.listen(3000, () => console.log('MySQL App Running on Port 3000'));