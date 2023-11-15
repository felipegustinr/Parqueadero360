const express = require('express');
const morgan = require('morgan');
const {engine} = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require ('passport');

const {database} = require('./keys');
// Modulo de inicializacion
const app= express();
require('./lib/passport');


// moddulo de configuracion
app.set('port', process.env.PORT || 5500);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs',engine({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars'),
}));

app.set('view engine','.hbs');

// modulo de funciones
app.use(session({
    secret: 'parking360SQLSession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


// modulo de variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.newUser = req.newUser;
    next();
});

// modulo de rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/vehicles',require('./routes/vehicles'));

//modulo archivos publicos
app.use(express.static(path.join(__dirname,'public')));

//modulo de server start
app.listen(app.get('port'), () => {
    console.log('Servidor funcionando en el puerto', app.get('port'));
});