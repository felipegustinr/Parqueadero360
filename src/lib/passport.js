const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database')

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
    await pool.query('INSERT INTO Usuario (nombresCompletos, nombreUsuario, password) VALUES (?, ?, ?)', newUser.nombresCompletos, newUser.nombreUsuario, newUser.password);
}));

// passport.serializeUser((nombreUsuario, done)=> {

// });