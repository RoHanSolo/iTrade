var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/bookSharing', {
	useMongoClient: true
});

var db = mongoose.connection;

//User Schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	name: {
		type: String
	},
	password: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	requestedBooks: {
		type: [String]
	}
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
	User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
	var query = {
		username: username
	};
	User.findOne(query, callback);
}

module.exports.updateUserDetails = (username, newName, newCity, newState, callback) => {
	User.findOneAndUpdate({
		username: username
	}, {
		$set: {
			name: newName,
			city: newCity,
			state: newState
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log('Update:' + result);
		console.log("after update");
		callback();
	});

}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
	bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
		callback(null, isMatch);
	});
}

module.exports.createUser = function (newUser, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		bcrypt.hash(newUser.password, salt, function (err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});

}
