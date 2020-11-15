const jwt = require('jsonwebtoken');

const jwter = {
    // Promisify jwt.verify
    jwtVerify: function (token, secret) {
        return new Promise((res, rej) => {
            jwt.verify(token, secret, (err, authData) => {
                if (err) {
                    rej(err);
                } else {
                    res(authData);
                }
            });
        });
    }

// Promisify jwt.sign
jwtSign: function (user, expireTime) {
        return new Promise((res, rej) => {
            jwt.sign({ user }, secret, { expiresIn: expireTime }, (err, token) => {
                if (err) {
                    rej(err)
                } else {
                    res({ token })
                }
            })
        })
    }
}
module.exports = jwter