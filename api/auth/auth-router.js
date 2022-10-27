const router = require('express').Router();
const { add, findByUsername } = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      //res.status(400);
      throw new Error('username and password required');
    } else {
      const userExists = await findByUsername(req.body.username);
      if (userExists) {
        throw new Error('username taken');
      } else {
        const user = await add(req.body);
        res.json(user);
      }
    }
  } catch (error) {
    console.log('register failed', error);
    res.status(400).send(error.message);
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      //res.status(400);
      throw new Error('username and password required');
    } else {
      const userExists = await findByUsername(req.body.username);
      if (!userExists) {
        throw new Error('invalid credentials');
      } else {
        const isValid = bcrypt.compareSync(
          req.body.password,
          userExists.password
        );
        if (!isValid) {
          throw new Error('invalid credentials');
        } else {
          const token = buildToken(userExists);
          res.json({ message: `welcome, ${userExists.username}`, token });
        }
      }
    }
  } catch (error) {
    console.log('register failed', error);
    res.status(400).send(error.message);
  }

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});
function buildToken(user) {
  const payload = {
    username: user.username,
  };
  const options = {
    expiresIn: '1d',
  };
  return jwt.sign(payload, 'shh', options);
}

module.exports = router;
