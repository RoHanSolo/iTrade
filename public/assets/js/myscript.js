$(document).ready(function () {

	//OTHER BOOKS LOADING
	var books = document.getElementById("allbooks").innerText;
	var allbooks = JSON.parse(books);

	function checkrequest(id) {
		return id == $("#myemail").text;
	}

	allbooks.forEach(function (elem) {
		if (!elem.requestedUserEmail.find(checkrequest)) {
			var num = elem.requestedUserEmail.length;
			var str = "<figure class=\"item\" data-groups='" + JSON.stringify(elem.genre, undefined, 3) + "' id=\"" + elem._id.toString() + "\"> <a><img src=\"";
			if (elem.thumbnail) {
				str += elem.thumbnail;
			} else {
				str += "/assets/img/thumb.jpg";
			}
			str += "\"> <div> <h5 class=\"name\">" + elem.bookname + "</h5> <small> <i class=\"fa fa-user tip\" style=\"left: 0px\">&nbsp;" + num + "<span class=\"tiptext\"> No. of requests</span></i></small> <button class=\"btn btn-request\" name=\"requestbook\">Request</button></div> </a> </figure>";

			$("#all-books").append(str);
		}
	});



	//MY BOOKS LOADING
	books = document.getElementById("mybooks").innerText;
	var mybooks = JSON.parse(books);

	mybooks.forEach(function (elem) {
		var num = elem.requestedUserEmail.length;
		var str = "<div class=\"item\">	<div class=\"blog-box anim-shadow\"> <div class=\"blog-box-img2\"><img src=\"";
		if (elem.thumbnail)
			str += elem.thumbnail;
		else
			str += "/assets/img/thumb.jpg";

		str += "\" class=\"img-responsive\">	</div><div class=\"blog-box-caption\"> <div class=\"category\">";
		for (i = 0; i < elem.genre.length; i++)
			str += "<a rel=\"category tag\">" + elem.genre[i] + "</a> &nbsp;";
		str += "</div> <h5 class=\"title\">" + elem.bookname + "</h5></div><div class=\"blog-box-footer\"><div class=\"row\"><div class=\"col-xs-6\"><span><i class=\"fa fa-fw fa-user\" style=\"left: 0px\"></i>No. of requests: " + num;
		str += "</span>	</div>	<div class=\"col-xs-6\"><button name=\"book-details\" class=\"btn btn-details\">More Details</button></div></div></div></div></div>";

		$("#my-books").append(str);
	});




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
