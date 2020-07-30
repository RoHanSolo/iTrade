$(document).ready(function () {

	console.log("User: " + document.getElementById("mymail").innerText);

	//AVAILABLE BOOKS LOADING
	var books = document.getElementById("allbooks").innerText;
	var allbooks = JSON.parse(books);

	function checkrequest(id) {
		return id == document.getElementById("mymail").innerText;
	}

	allbooks.forEach(function (elem) {
		if (elem.requestedUserEmail.find(checkrequest) === undefined) {
			var num = elem.requestedUserEmail.length;
			var str = "<figure class=\"item\" data-groups='" + JSON.stringify(elem.genre, undefined, 3) + "' id=\"" + elem._id.toString() + "\"> <a><img src=\"";
			if (elem.thumbnail) {
				str += elem.thumbnail;
			} else {
				str += "/assets/img/thumb.jpg";
			}
			str += "\" alt=\"" + elem.bookname + "\"> <div> <h5 class=\"name\">" + elem.bookname + "</h5> <small> <i class=\"fa fa-user tip\" style=\"left: 0px\">&nbsp;" + num + "<span class=\"tiptext\"> No. of requests</span></i></small> <button class=\"btn btn-request\" name=\"" + elem._id.toString() + "\" onclick=\"requestfunc(this)\">Request</button></div> </a> </figure>";

			$("#all-books").append(str);
		}
	});



	//REQUESTED BOOKS LOADING
	books = document.getElementById("reqbooks").innerText;
	var reqbooks = JSON.parse(books);

	reqbooks.forEach(function (elem) {
		var num = elem.requestedUserEmail.length;
		var str = "<figure class=\"item\" data-groups='" + JSON.stringify(elem.genre, undefined, 3) + "' id=\"" + elem._id.toString() + "\"> <a><img src=\"";
		if (elem.thumbnail) {
			str += elem.thumbnail;
		} else {
			str += "/assets/img/thumb.jpg";
		}
		str += "\" alt=\"" + elem.bookname + "\"> <div> <h5 class=\"name\">" + elem.bookname + "</h5> <small> <i class=\"fa fa-user tip\" style=\"left: 0px\">&nbsp;" + num + "<span class=\"tiptext\"> No. of requests</span></i></small> <button class=\"btn btn-request\" name=\"" + elem._id.toString() + "\" onclick=\"deletefunc(this)\">Delete</button></div> </a> </figure>";

		$("#requested-books").append(str);
	});



	//MY BOOKS LOADING
	books = document.getElementById("mybooks").innerText;
	var mybooks = JSON.parse(books);
	var notify = false;

	mybooks.forEach(function (elem) {
		var num = elem.requestedUserEmail.length;
		if (num > 0)
			notify = true;
		var str = "<div class=\"item\">	<div class=\"blog-box anim-shadow\"> <div class=\"blog-box-img2\"><img src=\"";
		if (elem.thumbnail)
			str += elem.thumbnail;
		else
			str += "/assets/img/thumb.jpg";

		str += "\" class=\"img-responsive\">	</div><div class=\"blog-box-caption\"> <div class=\"category\">";
		for (i = 0; i < elem.genre.length; i++)
			str += "<a rel=\"category tag\">" + elem.genre[i] + "</a> &nbsp;";
		str += "</div> <h5 class=\"title\">" + elem.bookname;
		if (num > 0)
			str += " <span class=\"notif\"></span>";
		str += "</h5></div><div class=\"blog-box-footer\"><div class=\"row\"><div class=\"col-xs-6\"><span><i class=\"fa fa-fw fa-user\" style=\"left: 0px\"></i>No. of requests: " + num;
		str += "</span>	</div>	<div class=\"col-xs-6\"><button name=\"" + elem._id.toString() + "\" class=\"btn btn-details\" onclick=\"bookDetails(this)\" >More Details</button></div></div></div></div></div>";

		$("#my-books").append(str);
	});

	if (notify) {
		$("#nav-books").append(" <span class=\"notif\"></span>");
	}


	//CHART.JS CODE

	var booknames = [''];
	var requests = [0];
	mybooks.forEach(function (elem) {
		booknames.push(elem.bookname);
		requests.push(elem.requestedUserEmail.length);
	});
	booknames.push('');
	requests.push(0);

	new Chart(document.getElementById("line-chart"), {
		type: 'line',
		data: {
			labels: booknames,
			datasets: [{
				data: requests,
				label: "Book Requested",
				borderColor: "#FF6600",
				fill: true,
				pointRadius: 5,
				pointBackgroundColor: "#FF6600"
					}]
		},
		options: {
			title: {
				display: false,
				text: 'Number of requests per book'
			},
			layout: {
				padding: {
					left: 50,
					right: 50,
					top: 0,
					bottom: 0
				}
			},
			legend: {
				labels: {
					fontColor: "white",
					fontSize: 18
				}
			},
			scales: {
				yAxes: [{
					ticks: {
						fontColor: "white",
						fontSize: 15
					}
						}],
				xAxes: [{
					ticks: {
						fontColor: "white",
						fontSize: 13
					}
						}]
			}
		}
	});
});



//redirecting to book-details route on clicking of more detail page
function bookDetails(elem) {
	window.location = '/users/book-details/?book=' + elem.name;
}





function requestfunc(elem) {
	console.log("name:" + elem.name);
	var obj = {
		name: elem.name
	};
	$.ajax({
		type: 'POST',
		data: obj,
		url: "/users/book-request",
		success: removeFromOthers
	});

	function removeFromOthers(res) {
		console.log("success result:" + res);
		window.location = '/';

		//		$("#all-books").empty();
		//		$("#requested-books").empty();
		//
		//		var data = res;
		//
		//		//Add to requested
		//		var num = data.requestedUserEmail.length + 1;
		//		var str = "<figure class=\"item\" data-groups='" + JSON.stringify(data.genre, undefined, 3) + "' id=\"" + data._id.toString() + "\"> <a><img src=\"";
		//		if (data.thumbnail) {
		//			str += data.thumbnail;
		//		} else {
		//			str += "/assets/img/thumb.jpg";
		//		}
		//		str += "\" alt=\"" + data.bookname + "\"> <div> <h5 class=\"name\">" + data.bookname + "</h5> <small> <i class=\"fa fa-user tip\" style=\"left: 0px\">&nbsp;" + num + "<span class=\"tiptext\"> No. of requests</span></i></small> <button class=\"btn btn-request\" name=\"" + data._id.toString() + "\" onclick=\"deletefunc(this)\">Delete</button></div> </a> </figure>";
		//
		//		$("#requested-books").append(str);
		//
		//		$("#scripts").load("/scripts.html");
		//
		//		//Remove from available
		//		var id = "#" + elem.name;
		//		$(id).remove();

	}
}





function deletefunc(elem) {

	console.log("name:" + elem.name);
	var obj = {
		name: elem.name
	};
	$.ajax({
		type: 'POST',
		data: obj,
		url: "/users/cancel-request",
		success: removeFromRequested
	});

	function removeFromRequested(res) {
		console.log("success result:" + res);
		window.location = '/';

		//		$("#all-books").empty();
		//		$("#requested-books").empty();
		//
		//		//Remove from available
		//		var id = "#" + elem.name;
		//		$(id).remove();
		//
		//		var data = res;
		//
		//		//Add to requested
		//		var num = data.requestedUserEmail.length - 1;
		//		var str = "<figure class=\"item\" data-groups='" + JSON.stringify(data.genre, undefined, 3) + "' id=\"" + data._id.toString() + "\"> <a><img src=\"";
		//		if (data.thumbnail) {
		//			str += data.thumbnail;
		//		} else {
		//			str += "/assets/img/thumb.jpg";
		//		}
		//		str += "\" alt=\"" + data.bookname + "\"> <div> <h5 class=\"name\">" + data.bookname + "</h5> <small> <i class=\"fa fa-user tip\" style=\"left: 0px\">&nbsp;" + num + "<span class=\"tiptext\"> No. of requests</span></i></small> <button class=\"btn btn-request\" name=\"" + data._id.toString() + "\" onclick=\"deletefunc(this)\">Delete</button></div> </a> </figure>";
		//
		//		$("#all-books").append(str);
		//
		//		$("#scripts").load("/scripts.html");

	}
}
