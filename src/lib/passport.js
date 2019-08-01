const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const poolDB = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'credencial',
    passReqToCallback: true
}, async (req, email, credencial, done) => {
    //console.log(req.body);
    const filas = await poolDB.query('SELECT * FROM acceso WHERE email = ? ', [email]);
    if (filas.length > 0) {
        const acceso = filas[0];
       const credencialValida = await helpers.compararCredencial(credencial, acceso.credencial);
        if (credencialValida) {
            done(null, acceso, req.flash('realizado', 'Bienvenido: ' + acceso.email));
        } else {
            done(null, false, req.flash('fallido', 'Credencial invalida'));
        }
    } else {
        return done(null, false, req.flash('fallido', 'Email no esta registrado'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'credencial',
    passReqToCallback: true
}, async (req, email, credencial, done) => {
    const nuevoUsuario = {
        email,
        credencial
    };
    nuevoUsuario.credencial = await helpers.cifrarCredencial(credencial);
    const result = await poolDB.query('INSERT INTO acceso SET ?', [nuevoUsuario]);
    nuevoUsuario.id = result.insertId;
    return done(null, nuevoUsuario);
}));

passport.serializeUser((acceso, done) => {
    done(null, acceso.id_acceso);
    //console.log(done);
});

passport.deserializeUser(async (id, done) => {
    const filas = await poolDB.query('SELECT * FROM vendedor LEFT JOIN acceso ON vendedor.acceso_id = acceso.id_acceso WHERE acceso_id = ?', [id]);
    //console.log(filas[0]);
    done(null, filas[0]);
    //done(null, null);
});