const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


// MODULO DE INICIO DE SESIÓN
passport.use('local.signin', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, nombreUsuario, password, done) => {
    try {
        const rows = await pool.query('SELECT * FROM Usuario WHERE nombreUsuario = ?', [nombreUsuario]);
        if (rows.length > 0) {
            const usuarioEncontrado = rows[0];
            const validPassword = await helpers.matchPassword(password, usuarioEncontrado.password);
            if (validPassword) {
                done(null, usuarioEncontrado, req.flash('success', 'Bienvenido ' + usuarioEncontrado.nombresCompletos));
            } else {
                done(null, false, req.flash('error', 'Contraseña incorrecta para ' + usuarioEncontrado.nombreUsuario + '. Verifique e intente nuevamente'));
            }
        } else {
            done(null, false, req.flash('error', 'El usuario ' + nombreUsuario + ' no se encuentra registrado'));
        }
    } catch (error) {
        console.error(error);
        done(error);
    }
}));

// MODULO DE REGISTRO DE USUARIOS 
passport.use('local.signup', new LocalStrategy({
    usernameField: 'nombreUsuario',
    passwordField: 'password',
    passReqToCallback: true
}, 
async (req, nombreUsuario, password, done) => {
    const { nombresCompletos } = req.body;
    const newUser = {
        nombreUsuario,
        password,
        nombresCompletos
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO Usuario (nombresCompletos, nombreUsuario, password) VALUES (?, ?, ?)', 
    [newUser.nombresCompletos, newUser.nombreUsuario, newUser.password]);
    newUser.idUsuario = result.insertId;
    req.flash('success','Usuario '+nombresCompletos+' registrado Correctamente');
    return done(null, newUser);
}));

// MODULOS DE SERILIZACION DE USUARIOS Y DESERILIZACIÓN DE USUARIOS
passport.serializeUser((newUser, done) => {
    done(null, newUser.idUsuario);
});

passport.deserializeUser(async (idUsuario, done) => {
    const rows = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ? ', [idUsuario]);
    done(null, true);
});