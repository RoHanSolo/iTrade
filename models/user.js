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
		index: true,
		unique: true,
		trim: true
	},
	name: {
		type: String,
		trim: true
	},
	password: {
		type: String
	},
	city: {
		type: String,
		trim: true
	},
	state: {
		type: String,
		trim: true
	},
	requestedBooks: {
		type: [mongoose.Schema.Types.ObjectId]
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
		returnNewDocument: true
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

module.exports.addRequestId = (user, id, callback) => {
	User.update({
		username: user
	}, {
		$push: {
			requestedBooks: id
		}
	}, callback);
	console.log("After update function");
};

module.exports.removeBookRequest = (userId, bookId, callback) => {
	User.findOneAndUpdate({
		username: userId
	}, {
		$pull: {
			requestedBooks: new mongoose.Types.ObjectId(bookId)
		}
	}, callback);
}

module.exports.getUsersByUsername = (ids, callback) => {
	User.find({
		username: {
			$in: ids
		}
	}, callback);
}
