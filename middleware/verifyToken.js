const verifyToken = function (req, res, next) {
  const bearerHeader = req.headers.authorization;
  if (typeof bearerHeader === 'undefined') {
    return res.sendStatus(403);
  }
  const bearer = bearerHeader.split(' ');
  const token = bearer[1];
  req.token = token;
  next();
};
module.exports = verifyToken;
