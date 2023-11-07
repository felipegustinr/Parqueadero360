const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, nombreUsuario, password, done) => {
    const { nombresCompletos } = req.body;
    const newUser = {
        nombreUsuario,
        password,
        nombresCompletos

    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO Usuario (nombresCompletos, nombreUsuario, password) VALUES (?, ?, ?)', [newUser.nombresCompletos, newUser.nombreUsuario, newUser.password]);
    newUser.idUsuario = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((nombreUsuario, done) => {
    done(null, nombreUsuario.idUsuario);
});

passport.deserializeUser(async (idUsuario, done) => {
    const rows = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ? ', [idUsuario]);
    done(null, rows[0]);
});