const { jwtSign, jwtVerify, jwtRefresh } = require('./jwt')
const secret = process.env.JWT_SECRET

const verifyToken = async (req, res, next) => {

  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader === 'undefined') {
    return res.sendStatus(403);
  }
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  let newToken = token;
  let authData;
  try {
    authData = await jwtVerify(token, secret);

  }
  catch (err) {
    if (err.name === 'TokenExpiredError') {
      newToken = jwtRefresh(token, '15m')
      authData = await jwtVerify(newToken, secret);
    } else {
      throw err
    }
  }
  req.token = token;
  req.authData = authData;
  next();
};
module.exports = verifyToken;
