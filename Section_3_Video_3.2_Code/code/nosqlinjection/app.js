const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const {
  checkSchema,
  validationResult
} = require('express-validator/check');
const schema = require('./validationSchema');

const app = express();
const dbURI = 'mongodb://localhost:27017';

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

  const {
    username,
    password
  } = req.body;

  
  MongoClient.connect(dbURI, { useNewUrlParser: true }, async (error, client) => {
    if (error) return res.status(500).send(error);
    const db = client.db('students');
    try {
      const result = await db.collection('members').findOne({
        username
      });
      const comparePwd = await bcrypt.compare(password, result.password);

      if (comparePwd) {
        res.json({ fullname: result.fullname });
      } else {
        res.json({
          error: 'Invalid credentials'
        });
      }
    } catch (error) {
      res.status(500).send(error);
    }
    client.close();
  });
});

app.listen(3000, () => console.log('MongoDB App Running on Port 3000'));