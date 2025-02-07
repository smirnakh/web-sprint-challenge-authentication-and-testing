const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers.authorization;
  console.log('midddlewear token: ' + token);
  if (!token) {
    res.status(401).json({ message: 'token required' });
    return;
  }
  //token = token.split(' ')[1];
  jwt.verify(token, 'shh', (err) => {
    if (err) {
      res.status(401).json({ message: 'token invalid' });
    } else {
      next();
    }
  });

  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
