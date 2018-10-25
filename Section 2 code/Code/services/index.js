const bcrypt = require('bcrypt');
const {
  db,
  findOne
} = require('../db');

module.exports.signup = async function (email, password, name) {
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.insert({
      email,
      password: hash,
      name
    });

    return true;
  } catch (err) {
    console.log(err);
  }
}

module.exports.login = async function (email, password) {
  try {
    const result = await findOne({
      email
    });
    const comparePasswd = await bcrypt.compare(password, result.password);
    
    if (comparePasswd) {
      console.log("PASSWORD IS CORRECT!");
      console.log(`Welcome, ${result.name}!`);
    } else {
      console.log("PASSWORD IS INCORRECT :(");
    }
  } catch (err) {
    console.log(err);
  }
}