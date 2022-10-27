const db = require('../../data/dbConfig');
const bcrypt = require('bcryptjs');

async function add({ username, password }) {
  const hash = bcrypt.hashSync(password, 8);
  const user = await db('users').insert({
    username,
    password: hash,
  });
  return user;
}

module.exports = {
  add,
};
