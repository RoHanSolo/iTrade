var express = require('express');
var router = express.Router();

// Importing the user model
var User = require('../models/user');
var Book = require('../models/books');


/* GET home page. */
router.get('/', function (req, res, next) {
	// res.render('index', { title: 'Express' });


	//TODO get all variables to send to index
	if (req.session.username) {
		var otherbooks, mybooks;
		console.log("Inside");
		Book.getOtherBooks(req.session.username, (err, books) => {
			if (err) throw err;
			otherbooks = JSON.stringify(books, undefined, 3);
			console.log(otherbooks);

			Books.getMyBooks(req.session.username, (err, books) => {
				if (err) throw err;
				mybooks = JSON.stringify(books, undefined, 3);



				res.render('index.hbs', {
					name: req.session.user.name,
					email: req.session.user.username,
					city: req.session.user.city,
					state: req.session.user.state,
					reqbooks: JSON.stringify(req.session.user.requestedBooks, undefined, 3),
					allbooks: otherbooks
				});
			});
		});

	} else {
		res.redirect('/login-register');
	}
});

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/login-register');
	}
}

router.get('/login-register', (req, res, next) => {
	res.render('login-register.hbs')
});

module.exports = router;
