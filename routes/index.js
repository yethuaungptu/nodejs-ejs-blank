var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express EJS Home' });
});

/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('users/sign-up', { title: 'Sign up' });
});

/* POST check email duplication. */
router.post('/dupEmail', function(req, res, next) {
    User.findOne({email:req.body.email}, function(err, user){
        if(err) next(err);
        if(user) res.json({ success: false, msg: '"' + req.body.email+ '" is an already signed email.'});
        else res.json({ success: true });
    });
});

/* POST sign up action. */
router.post('/signup', function(req, res, next) {
    // make model using req.body
    var user = new User();
    user.name = req.body.name;
    user.phone = (req.body.phone1 && req.body.phone2)?(req.body.phone1+'-'+req.body.phone2):'';
    user.email = req.body.email;
    user.password = req.body.password;
    user.job = req.body.job;
    user.insertedby = user._id;
    user.updatedby = user._id;

    // save to database using Model
    user.save(function(err, user){
        if(err) next(err);
        req.session.user = { _id: user._id, name: user.name, email: user.email, role:user.role};
        req.flash('success', 'Welcome to Atutu!');
        res.redirect('/');
    });
});

/* GET sign in page. */
router.get('/signin', function(req, res, next) {
    res.render('users/sign-in', { title: 'Sign In'});
});

/* POST sign in action. */
router.post('/signin', function(req, res, next) {
    // find email in Users
    User.findOne({ email: req.body.email}, function(err, user){
        if(err) throw err;
        if(user == null || !User.compare(req.body.password, user.password)){
            req.flash('warning', 'Your email does not exist or password is invalid.');
            res.redirect('/signin');
        }else { // user exists
            req.session.user = { _id: user._id, name: user.name, email: user.email, role:user.role};
            res.redirect('/');
        }
    });
});
/* GET sign out. */
router.get('/signout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
