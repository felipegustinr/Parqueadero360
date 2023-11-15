const bcrypt = require('bcryptjs');

const helpers = {};

// MODULO DE ENCRIPTACIÓN CONTRASEÑA
helpers.encryptPassword = async (password) => {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return await bcrypt.hash(password,10);
        
    } catch (error) {
        throw error; 
    }
};

//MODULO DE COINCIDENCIA DE CONTRASEÑAS
helpers.matchPassword = async (password, hashedPassword) => {
    try {
        const passwordMatch = await bcrypt.compare(password, hashedPassword);
        return passwordMatch;
    } catch (error) {
        throw error; 
    }
};

module.exports = helpers;
