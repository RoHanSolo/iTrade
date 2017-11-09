var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/bookSharing', {
	useMongoClient: true
});

var db = mongoose.connection;

//Book Schema
var BookSchema = mongoose.Schema({
	bookname: {
		type: String,
		index: true
	},
	ownerName: {
		type: String
	},
	ownerEmail: {
		type: String,
		index: true;
	},
	genre: {
		type: [String]
	},
	thumbnail: {
		type: String
	},
	requestedUserEmail: {
		type: [String]
	}
});


var book = module.exports = mongoose.model('book', BookSchema);

module.exports.getBookByName = (bookname, callback) => {
	var query = {bookname: bookname};
	book.findOne(query, callback);
}

module.exports.getAllBooks = (callback) => {
	book.find({}, callback);
}

module.exports.addBook = function(newBook, callback) {
	newBook.save(callback);
}