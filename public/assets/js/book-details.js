jQuery(document).ready(function () {

	var data = document.getElementById("bookgenres").innerText;
	var genres = JSON.parse(data);

	genres.forEach(function (elem) {
		$("#genres").append("<a rel=\"category tag\">" + elem + "</a> ");
	});




	data = document.getElementById("requsers").innerText;
	var users = JSON.parse(data);

	data = document.getElementById("userbooks").innerText;
	var books = JSON.parse(data);

	var mybook = document.getElementById("mybook").innerText;


	var i = 0;
	users.forEach(function (elem) {
		var str = "<div class=\"media\" name=\"" + elem.username + "\" ><h4 style=\"color: #ff6600; text-transform: capitalize;\">" + elem.name + "</h4><h5 style=\"color: #666\">Available books:</h5>";

		books[i].forEach(function (book) {
			str += "<div class=\"row\" style=\"margin: 0;\"><a class=\"pull-left\" href=\"#\"><img class=\"media-object\" src=\"" + book.thumbnail + "\" /></a>";

			str += "<div class=\"media-body\"><div class=\"media-heading\">" + book.bookname + "<a class=\"btn btn-default pull-right\" name=\"" + mybook + "\" id=\"" + book._id.toString() + "\" onclick=\"grantfunc(this)\" href=\"#\"><i class=\"fa fa-thumbs-up\"></i> Grant request</a></div></div></div><hr>";

		});

		str += "</div>";
		$("#requests").append(str);
		i++;
	});



	stellar_init('.content');

});





function grantfunc(elem) {

}
