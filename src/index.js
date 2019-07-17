const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const mysql_store = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');

//inizaliaciones
const app = express();
require('./lib/passport');

//Configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Capa Traduccion
app.use(session({
  secret: 'wpseller',
  resave: false,
  saveUninitialized: false,
  store: new mysql_store(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//Variables Globales
app.use((req, res, next) => {
  app.locals.fallido = req.flash('fallido');
  app.locals.realizado = req.flash('realizado');  
  app.locals.importante = req.flash('importante');  
  app.locals.usuario = req.user;
//  console.log(app.locals.usuario);
  next();
});

//Rutas
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/links', require('./routes/links'));
app.use('/clientes', require('./routes/clientes'));
app.use('/vendedor', require('./routes/vendedor'));



//Public
app.use(express.static(path.join(__dirname, 'public')));


//Iniciar Servidor
app.listen(app.get('port'), () => {
  console.log('servidor en puerto:', app.get('port'));
});
