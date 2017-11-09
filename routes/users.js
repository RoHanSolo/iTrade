var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
	dest: './uploads'
});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var getFormData = require('get-form-data');

// Importing the user model
var User = require('../models/user');
var Book = require('../models/books');


/* GET users listing. */
router.get('/', function (req, res, next) {
	res.send('respond with a resource');
});

router.get('/login-register', (req, res, next) => {
	res.render('login-register.hbs', {
		invalid: 'Invalid Username or Password'
	});
});

var sess;
router.post('/register', (req, res, next) => {
	// We can get data using (req.body.[anyfield](eg. req.body.email) but cannot handle file uploads, for that we use multer
	var name = req.body.name;
	var username = req.body.email;
	var password = req.body.password;

	if (name && username && password) {

		console.log(name, username);

		var newUser = new User({
			name: name,
			username: username,
			password: password
		});

		User.createUser(newUser, (err, user) => {
			if (err) throw err;
			console.log(user);
		});


		// req.flash('success', 'You are now registered and can login');
		// req.session['success'] = 'You are now registered and can login';
		res.location('/login-register');
		// res.redirect('/login-register');

		res.render('login-register.hbs', {
			success: 'You are now registered and can login'
		});

	} else {
		res.location('/login-register');
		res.render('login-register.hbs', {
			invalid: 'Invalid registration details'
		});
	}
});


router.get('/logout', (req, res) => {
	//emptying the session variable if user clicks logout
	req.session.username = "";
	req.logout();
	res.render('login-register.hbs', {
		success: 'Successful logout. Have a nice day!'
	})
})


router.get('/login', (req, res, next) => {
	res.render('index.hbs');
});

router.post('/login',
	passport.authenticate('local', {
		failureRedirect: '/users/login-register'
	}),
	function (req, res) {
		req.session.username = req.body.username;

		User.getUserByUsername(req.body.username, (err, user) => {
			if (err) throw err;

			req.session.user = user;

			res.redirect('/');
			// res.render('index.hbs', {
			// 	userName: user.name
			// 	});
		});
	});
// (req, res) => {
// 	// req.flash('success', 'You are now logged in');
// 	// res.redirect('/');
// 	req.render('index.hbs');
// });


passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.getUserById(id, (err, user) => {
		done(err, user);
	});
});


passport.use(new LocalStrategy(function (username, password, done) {
	console.log(username);

	// console.log(User.findOne({email:username}));
	// console.log(User.findOne({username:username}));

	User.getUserByUsername(username, function (err, user) {
		if (err) throw err;
		if (!user) {
			return done(null, false, {
				message: 'Unknown User'
			});
		}

		User.comparePassword(password, user.password, function (err, isMatch) {
			if (err) return done(err);
			if (isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {
					message: 'Invalid Password'
				});
			}

		});
	});
}));


// bookImage is the name of the option in form while giving it a type file
router.post('/upload-book', (req, res, next) => {
	// We can get data using (req.body.[anyfield](eg. req.body.email) but cannot handle file uploads, for that we use multer

	// console.log(bookname);
	// console.log(req.session.username);

	User.getUserByUsername(req.session.username, (err, user) => {
		if (err) throw err;
		// console.log(user.name);
		var genre = ['all'];
		var bookname = req.body.bookname;
		var ownerEmail = req.session.username;
		req.session.name = user.name;
		var ownerName = user.name;

		if (req.body.art) {
			genre.push('art');
		}

		if (req.body.biography) {
			genre.push('biography');
		}

		if (req.body.business) {
			genre.push('business');
		}

		if (req.body.comics) {
			genre.push('comics');
		}

		if (req.body.educational) {
			genre.push('educational');
		}
		if (req.body.fiction) {
			genre.push('fiction');
		}

		if (req.body.journals) {
			genre.push('journals');
		}

		if (req.body.philosophical) {
			genre.push('philosophical');
		}

		if (req.body.poetry) {
			genre.push('poetry');
		}

		if (req.body.religious) {
			genre.push('religious');
		}

		if (req.body.satire) {
			genre.push('satire');
		}

		if (req.body.selfhelp) {
			genre.push('selfhelp');
		}

		if (req.body.sports) {
			genre.push('sports');
		}

		if (req.body.travel) {
			genre.push('travel');
		}


		var thumbnail = req.body.thumburl;


		var newBook = new Book({
			bookname: bookname,
			ownerName: ownerName,
			ownerEmail: ownerEmail,
			genre: genre,
			thumbnail: thumbnail
		});

		Book.addBook(newBook, (err, book) => {
			if (err) throw err;
			console.log(book);
		});
		// var getFieldData = getFormData.getNamedFormElementData;

		// var form = document.querySelector('#booksForm');

		// var genreList = getFieldData(form, 'genreChk');

		// console.log(genreList);

		// console.log("String Format");
		// console.log(JSON.stringify(genreList));
		console.log('genre');
		console.log(genre);
	});


	// console.log(user);
	// var password = req.body.password;


	// console.log(name, username);

	// var newUser = new User({
	// 	name: name,
	// 	username: username,
	// 	password: password
	// });

	// User.createUser(newUser, (err, user) => {
	// 	if(err) throw err;
	// 	console.log(user);
	// });


	// req.flash('success', 'You are now registered and can login');
	// req.session['success'] = 'You are now registered and can login';
	// res.location('/login-register');
	// res.redirect('/login-register');

	res.redirect('/');
	// , {
	// 	success: 'Book Successfully Added' 
	// });
});

module.exports = router;
