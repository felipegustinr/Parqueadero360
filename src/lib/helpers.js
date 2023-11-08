const bcrypt = require('bcryptjs');

const helpers = {};

helpers.encryptPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        throw error; 
    }
};

helpers.matchPassword = async (password, hashedPassword) => {
    try {
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        return passwordMatch;
    } catch (error) {
        throw error; 
    }
};

module.exports = helpers;
