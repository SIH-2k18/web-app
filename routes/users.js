var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');

//
router.get('/register', ensureAuthenticated2,function(req, res){

});
function ensureAuthenticated2(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/users/dashboard');
    } else {
        res.render('register');
    }
}


// Login
router.get('/login', ensurelog,function(req, res){
	res.redirect('dashboard');
});


function ensurelog(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		console.log('chutiya');
		res.render('login');
	}
}



//Dashboard
router.get(
    '/dashboard',ensureAuthenticated,function(req, res) {
		res.render('dashboard',{welcome_msg:req.user.email});
	



	});
	
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}



// Register User
router.post('/register', function(req, res){
console.log("hello")

	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var employee_id=req.body.employee_id;
	var  mobile_no=req.body.mobile_no;
	var department=req.body.department;
	var designation=req.body.designation;
	var security_ques=req.body.security_ques;
	var security_ans=req.body.security_ans;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('employee_id','Employee id is required').notEmpty();
    req.checkBody('mobile_no','Mobile no is required').isInt();
    req.checkBody('department','Department Name is required').notEmpty();
    req.checkBody('designation','Designation is required').notEmpty();
    req.checkBody('security_ques','Security question is required').notEmpty();
    req.checkBody('security_ans','Security answer does not match').notEmpty();



	var errors = req.validationErrors();

	if(errors)
	{
       
		res.render('register',{
			errors:errors

		}

		);
      //  req.flash('success_msg', 'You are registered and can now login');

	}


	else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password,
			employee_id:employee_id,
			mobile_no:mobile_no,
			department:department,
             designation:designation,
             security_ques:security_ques,
              security_ans:security_ans
		});
		User.createUser(newUser,function (err,result) {
			console.log(result)
        });

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });

  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'./dashboard', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
	res.redirect('/login');
	
  });

router.get('/logout', function(req, res){
	req.logout();
console.log('fuddu')
	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;