var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('index.hbs');
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
