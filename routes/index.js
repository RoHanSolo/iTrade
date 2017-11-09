var express = require('express');
var router = express.Router();

// Importing the user model
var User = require('../models/user');
var Book = require('../models/books');


/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  	Book.getAllBooks((err, books) => {
		if(err) throw err;
		var booksFromDB = JSON.stringify(books, undefined, 3);
		console.log(booksFromDB);
	});


  	if(req.session.username){
	  	res.render('index.hbs', {
	  	userName: req.session.name
	  	}
	  );
	}
	else{
		res.redirect('/login-register');
	}
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect('/login-register');
	}
}

router.get('/login-register', (req, res, next) => {
	res.render('login-register.hbs')
});

module.exports = router;
