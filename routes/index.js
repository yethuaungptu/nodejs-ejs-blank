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
    user.save(function(err, result){
        if(err) next(err);
        res.redirect('/signin'); // redirect to other page
    });
});

/* GET sign in page. */
router.get('/signin', function(req, res, next) {
    res.render('users/sign-in', { title: 'Sign In'});
});

/* POST sign in action. */
router.post('/signin', function(req, res, next) {
    res.render('users/sign-in', { title: 'Sign In'});
});

module.exports = router;
