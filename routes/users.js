/*jshint esnext: true */

var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
	dest: './uploads'
});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var getFormData = require('get-form-data');
var bodyparser = require('body-parser');
var urlencodedparser = bodyparser.urlencoded({
	extended: false
});
var async = require('async');
var nodemailer = require('nodemailer');

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

		User.getUserByUsername(username, (err, result) => {
			if (result === null) {

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
		})

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


router.post('/login',
	passport.authenticate('local', {
		failureRedirect: '/users/login-register'
	}),
	function (req, res) {
		req.session.username = req.body.username;
		res.redirect('/');
	});


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
		var genre = [];
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
		var isImage = thumbnail.endsWith("jpg") || thumbnail.endsWith("jpeg") || thumbnail.endsWith("png") || thumbnail.endsWith("gif") || thumbnail.endsWith("ico") || thumbnail.endsWith("tiff") || thumbnail.endsWith("bmp");

		if (thumbnail == null || !isImage)
			thumbnail = "/assets/img/thumb.jpg"


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

	res.redirect('/');
});

router.post('/update-profile', (req, res, next) => {
	var name = req.body.name;
	var city = req.body.city;
	var state = req.body.state;

	User.updateUserDetails(req.session.username, name, city, state, (err) => {
		if (err) throw err;
		console.log('Details Updated');
		res.redirect('/');
	});

});


router.get('/book-details', (req, res, next) => {
	var bookId = req.query.book;
	console.log("IN Path " + bookId);

	if (!req.session.username)
		res.redirect('/');

	Book.getBookById(bookId, (err, book) => {
		if (err) throw err;

		console.log(book);
		User.getUsersByUsername(book.requestedUserEmail, (err, users) => {
			console.log("Users: " + users);

			async.map(users, (elem, callback) => {
				console.log("In map for" + elem);

				Book.getMyBooks(elem.username, (err, books) => {
					console.log("Got book for " + elem.username);
					console.log("User books:" + JSON.stringify(books, undefined, 3));
					callback(null, books);
				});
			}, (err, result) => {
				console.log("Result: " + result);

				User.getUserByUsername(book.ownerEmail, (err, user) => {
					console.log("User:" + user);

					res.render('book-details.hbs', {
						bookid: book._id,
						bookname: book.bookname,
						thumbnail: book.thumbnail,
						genres: JSON.stringify(book.genre, undefined, 3),
						reqnum: book.requestedUserEmail.length,
						requsers: JSON.stringify(users, undefined, 3),
						userbooks: JSON.stringify(result, undefined, 3),
						name: user.name
					});
				});
			});

		});

	});
});


router.post('/book-request', urlencodedparser, (req, res, next) => {
	console.log("Request is: " + req.body.name);
	User.addRequestId(req.session.username, req.body.name, (err) => {
		if (err) throw err;
		console.log('Request added to user and done');

		Book.addRequestedUser(req.session.username, req.body.name, (err, result) => {
			if (err) throw err;
			console.log(result);
			res.json(result);
			//			res.redirect('/#available');
		});
	});
});


router.post('/cancel-request', urlencodedparser, (req, res, next) => {
	console.log("Cancelled Request is: " + req.body.name);
	User.removeBookRequest(req.session.username, req.body.name, (err) => {
		if (err) throw err;
		console.log('Request removed from user and done');

		Book.removeUserRequest(req.body.name, req.session.username, (err, result) => {
			if (err) throw err;
			console.log("Result:" + result);
			res.json(result);
		});
	});
});

router.post('/grant-request', urlencodedparser, (req, res, next) => {
	console.log("Granted Request is: " + req.body.grantee);
	User.removeBookRequest(req.body.grantee, req.body.requestedbook, (err, grantee) => {
		if (err) throw err;
		console.log('Request removed from user and done');

		Book.removeBook(req.body.requestedbook, (err, requestedbook) => {
			if (err) throw err;
			console.log('Requested book removed and done');

			Book.removeBook(req.body.selectedbook, (err, selectedbook) => {
				if (err) throw err;
				console.log("Selected book removed");

				User.getUserByUsername(req.session.username, (err, user) => {
					if (err) throw err;
					console.log("User:" + user);
					//SEND MAILS TO BOTH

					var transporter = nodemailer.createTransport({
						service: 'gmail',
						auth: {
							user: 'itradebooks@gmail.com',
							pass: 'iTrade@IIIT'
						}
					});

					var granteeMailOptions = {
						from: 'itradebooks@gmail.com',
						to: grantee.username,
						subject: 'iTrade - Your trade request has been accepted!',
						text: 'Dear user, \nYour trade request for the book ' + requestedbook.bookname + ' has been accepted by ' + user.name + ' in exchange for ' + selectedbook.bookname + '. You can contact him at: ' + user.username + '.\n\nCheers,\niTrade Team'
					};

					transporter.sendMail(granteeMailOptions, function (error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email to grantee sent: ' + info.response);
						}
					});

					var userMailOptions = {
						from: 'itradebooks@gmail.com',
						to: user.username,
						subject: 'iTrade - You performed a successful book trade!',
						text: 'Dear user, \nYou have accepted trade request for the book ' + requestedbook.bookname + ' from user ' + grantee.name + ' in exchange for ' + selectedbook.bookname + '. You can contact him at: ' + grantee.username + '.\n\nCheers,\niTrade Team'
					};

					transporter.sendMail(userMailOptions, function (error, info) {
						if (error) {
							console.log(error);
						} else {
							console.log('Email to user sent: ' + info.response);
						}
					});


					res.json(user);
				});
			});
		});

	});
});

module.exports = router;
