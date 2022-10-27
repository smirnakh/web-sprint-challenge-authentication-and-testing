const db = require('../../data/dbConfig');
const bcrypt = require('bcryptjs');

async function add({ username, password }) {
  const hash = bcrypt.hashSync(password, 8);
  const [user_id] = await db('users').insert({
    username,
    password: hash,
  });
  const user = await db('users').where({ id: user_id }).first();
  return user;
}

async function findByUsername(username) {
  const user = await db('users').where({ username }).first();
  return user;
}

module.exports = {
  add,
  findByUsername,
};
