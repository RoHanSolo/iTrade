var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// Importing the user model
var User = require('../models/user');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login-register', (req, res, next) => {
	res.render('login-register.hbs', {
		success: 'Invalid Username or Password'
	});
});

router.post('/register', (req, res, next) => {
	// We can get data using (req.body.[anyfield](eg. req.body.email) but cannot handle file uploads, for that we use multer
	var name = req.body.name;
	var username = req.body.email;
	var password = req.body.password;

	console.log(name, username);

	var newUser = new User({
		name: name,
		username: username,
		password: password
	});

	User.createUser(newUser, (err, user) => {
		if(err) throw err;
		console.log(user);
	});


	// req.flash('success', 'You are now registered and can login');
	// req.session['success'] = 'You are now registered and can login';
	res.location('/login-register');
	// res.redirect('/login-register');

	res.render('login-register.hbs', {
		success: 'You are now registered and can login' 
	});
});


router.get('/logout', (req, res) => {
	req.logout();
	res.render('login-register.hbs', {
		success : 'Successful logout. Have a nice day!'
	})
})


router.get('/login', (req, res, next) => {
	res.render('index.hbs');
});

router.post('/login',
	passport.authenticate('local', {failureRedirect:'/users/login-register'}),
	function(req, res) {
		res.render('index.hbs');
	});
	// (req, res) => {
	// 	// req.flash('success', 'You are now logged in');
	// 	// res.redirect('/');
	// 	req.render('index.hbs');
// });


passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id,done) => {
	User.getUserById(id, (err, user) => {
		done(err, user);
	});
});


passport.use(new LocalStrategy(function(username, password, done){
		console.log(username);
		
		// console.log(User.findOne({email:username}));
		// console.log(User.findOne({username:username}));

		User.getUserByUsername(username, function(err, user){
			if(err) throw err;
			if(!user){
				return done(null, false, {message: 'Unknown User'});
			}

			User.comparePassword(password, user.password, function(err, isMatch){
				if(err) return done(err);
				if(isMatch){
					return done(null, user);
				}else{
					return done(null, flase, {message: 'Invalid Password'});
				}

		});
	});
}));




// bookImage is the name of the option in form while giving it a type file
router.post('/upload-book', upload.single('bookImage'), (req, res, next) =>{
	// to get the image do (req.file)

	if(req.file){
		console.log('Uploading Book Image..');
		var bookImage = req.file.filename;
	}
	else{
		console.log('No image file uploaded...')
		var bookImage = 'noImage.jpg';
	}
});

module.exports = router;
