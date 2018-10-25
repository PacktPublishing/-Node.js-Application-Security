const { join } = require('path');
const { promisify } = require('util');
const Nedb = require('nedb');
const db = new Nedb({
  filename: join(__dirname, 'store','users'),
  autoload: true
});

//db.ensureIndex({ fieldName: 'user', unique: true}, err => console.log(err));

module.exports.db = db;
module.exports.findOne = obj => {
  return new Promise((resolve, reject) => {
    db.findOne(obj, (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
}

