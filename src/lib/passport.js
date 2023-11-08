const passport = require('passport');
const LocalStrategy = require('passport-local');

const pool = require('../database')
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, nombreUsuario, password, done) => {
    const rows = await pool.query('SELECT * FROM  Usuario WHERE nombreUsuario = ?', [nombreUsuario]);
    if (rows > 0) {
        const newUser = rows[0];
        const validPassword = helpers.matchPassword(password, newUser.password);
        if (validPassword) {
            done(null, newUser, req.flash('success','Bienvenido ' + newUser.nombresCompletos));
        } else {
            done(null, false, req.flash('message','Contraseña invalida para ' + newUser.nombreUsuario + ' Verifique e intente nuevamente'));
        }
    } else {
        return done(null, false, req.flash('message','El newUser ' + newUser.nombreUsuario + ' no se encuentra Registrado'));
    }
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
    return done(null, true);
});