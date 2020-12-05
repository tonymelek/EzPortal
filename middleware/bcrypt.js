const bcrypt = require('bcrypt');
const bcrypter = {
    // Promisify bcrypt.comp
    bcryptComp: async function (plain, hash) {
        return await bcrypt.compare(plain, hash)
    },
    // Promisify bcrypt.hash
    bcryptHash: async function (plain) {
        return await bcrypt.hash(plain, 10)
    }
}
module.exports = bcrypter