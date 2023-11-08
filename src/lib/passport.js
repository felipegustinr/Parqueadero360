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
    console.log(req.body);
    if (rows.length > 0) {
        console.log(req.body);
        const nombreUsuario = rows[0];
        const validPassword =  await helpers.matchPassword(password,nombreUsuario.password);
        console.log(req.body);
        
        if (validPassword) {
            done(null, nombreUsuario, req.flash('success', 'Bienvenido ' + nombreUsuario.nombresCompletos));
        } else {
            done(null, false, req.flash('message', 'Contraseña invalida para ' + nombreUsuario.nombreUsuario + ' Verifique e intente nuevamente'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario ' + nombreUsuario + ' no se encuentra registrado'));
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
    req.flash('success','Usuario '+nombresCompletos+' registrado Correctamente');
    return done(null, newUser);
}));

passport.serializeUser((nombreUsuario, done) => {
    done(null, nombreUsuario.idUsuario);
});

passport.deserializeUser(async (idUsuario, done) => {
    const rows = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ? ', [idUsuario]);
    done(null, true);
});