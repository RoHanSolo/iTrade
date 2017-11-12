/*jshint esnext: true*/
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bookSharing', {
	useMongoClient: true
});

var db = mongoose.connection;

//Book Schema
var BookSchema = mongoose.Schema({
	bookname: {
		type: String,
		index: true,
		trim: true
	},
	ownerName: {
		type: String
	},
	ownerEmail: {
		type: String,
		index: true
	},
	genre: {
		type: [String]
	},
	thumbnail: {
		type: String,
		trim: true
	},
	requestedUserEmail: {
		type: [String]
	}
});


var book = module.exports = mongoose.model('book', BookSchema);

module.exports.getBookById = (bookId, callback) => {
	book.findById(bookId, callback);
}

module.exports.getAllBooks = (callback) => {
	book.find({}, callback);
};

module.exports.addBook = function (newBook, callback) {
	newBook.save(callback);
};

module.exports.getOtherBooks = (username, callback) => {
	book.find({
		ownerEmail: {
			$ne: username
		}
	}, callback);
};

module.exports.getMyBooks = (username, callback) => {
	console.log("username in getmybooks:" + username);
	book.find({
		ownerEmail: {
			$eq: username
		}
	}, callback);
};

module.exports.getBooksById = (ids, callback) => {
	book.find({
		_id: {
			$in: ids
		}
	}, callback);
};


module.exports.addRequestedUser = (user, id, callback) => {
	console.log(user + '-' + id);
	book.findOneAndUpdate({
		_id: new mongoose.Types.ObjectId(id)
	}, {
		$push: {
			requestedUserEmail: user
		}
	}, {
		returnOriginal: true
	}, callback);
};


module.exports.removeUserRequest = (bookId, userId, callback) => {
	book.findOneAndUpdate({
		_id: new mongoose.Types.ObjectId(bookId)
	}, {
		$pull: {
			requestedUserEmail: userId
		}
	}, {
		returnOriginal: true
	}, callback);
};

module.exports.removeBook = (id, callback) => {
	book.findOneAndRemove({
		_id: mongoose.Types.ObjectId(id)
	}, callback);
};
