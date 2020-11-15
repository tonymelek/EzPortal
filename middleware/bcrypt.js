const bcrypt = require('bcrypt');
const bcrypter = {
    // Promisify bcrypt.comp
    bcryptComp: function (plain, hash) {
        return new Promise((res, rej) => {
            bcrypt.compare(plain, hash, (err, result) => {
                result ? res(true) : res(false);
            });
        });
    },
    // Promisify bcrypt.hash
    bcryptHash: function (plain) {
        return new Promise((res, rej) => {
            bcrypt.hash(plain, 10, (err, hash) => {
                hash ? res(hash) : res(err);
            });
        });
    }

}
module.exports = bcrypter