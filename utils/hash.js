const bcrypt = require("bcrypt");

const generateHashAsync = async (string) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(string, 10, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
};

const compareWithHashAsync = async (string, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(string, hash, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

module.exports = { generateHashAsync, compareWithHashAsync };
