const passport = require ('passport');
const LocalStrategy = require ('passport-local');

passport.use('local.signup', new LocalStrategy({
    usernameField : 'nombreUsuario',
    passwordField : 'password',
    passReqToCallback : true
}, async (req, nombreUsuario, password, done)=> {
    console.log(req.body);
}));

// passport.serializeUser((nombreUsuario, done)=> {

// });