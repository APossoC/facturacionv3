const express = require('express');
const router = express.Router();

const passport = require('passport');
const {isLoggedIn}= require('../lib/auth');
const {isNotLoggedIn}= require('../lib/auth');

/*router.get('/signup',isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/singup', (req, res) => {
    passport.authenthicate('local.signup',{
        successRedirect:'/profile',
        failureRedirect: '/singup',
        failureFlash: true
    });
    //console.log(req.body);
    res.send('recibido');
});*/

/*router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));*/

router.get('/signin', isNotLoggedIn,(req, res) => {
    res.render('auth/signin');
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin',{
        successRedirect:'/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req,res,next);   
});


router.get('/profile', isLoggedIn, (req, res) => {   
    res.render('profile');

});

router.get('/logout',isLoggedIn, (req, res) => {   
    req.logOut();
    res.redirect('/');
});



module.exports = router;