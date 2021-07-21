const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.route('/logout')
    .get(users.logout)



// google part ------------------------------------------------------------------

router.get('/login/google', passport.authenticate('google', {
    scope: ['profile','email']
}));

router.get('/login/google/redirect', passport.authenticate('google',{failureFlash:true,failureRedirect:'/login'}), (req, res) => {
    req.flash('success',"Welcome to Recipe Adda...!")
    const redirectUrl=req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// facebook part ----------------------------------------------------------------

router.get("/login/facebook", passport.authenticate("facebook",{
    scope:['email']
}));

router.get("/login/facebook/redirect",passport.authenticate("facebook", { failureFlash:true,failureRedirect: "/login" }),(req, res)=> {
    // Successful authentication, redirect home.
        req.flash('success',"Welcome to Recipe Adda...!")
        const redirectUrl=req.session.returnTo || '/';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
  }
);


module.exports = router;