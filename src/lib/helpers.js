const bcrypt = require('bcryptjs');
const helpers = {};
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

helpers.matchPassword = async (password, newpassword) => {
    try {
        const passwordHash = await bcrypt.compare(password, newpassword);
        return passwordHash;
    } catch (error) {
        console.log(error)
    }
};

module.exports = helpers;