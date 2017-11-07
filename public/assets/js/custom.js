/*
	TABLE CONTENTS
	-------------------------------
           
           - PRELOADER & PAGE TRANSITIONS (requires: functions.js)
           - BLOG MASONRY                 (requires: masonry.pkgd.min.js)
           - ADD NEW STYLE "max-height"   (requires: functions.js)
           - DL-MENU                      (requires: functions.js)
           - LOAD FULL SCREEN IMAGE       (requires: backstretch.min.js)
           - TEXT ROTATOR                 (requires: owl.carousel.min.js)
           - TESTIMONIALS                 (requires: owl-carousel.min.js)
           - PORTFOLIO FILTER CATEGORY    (requires: jquery.shuffle.min.js)
           - PORTFOLIO HOVERDIR           (requires: jquery.hoverdir.js)
           - CONTACT FORM VALID           (requires: functions.js)
           - TOOLTIP                      (requires: bootstrap.min.js)

	------------------------------- 
*/
(function ($) {
	"use strict";


	$(window).load(function () {

		/*==========================================
		   PRELOADER & PAGE TRANSITIONS (requires: functions.js)
		=====================================================*/

		// active navigation
		$("nav").addClass('activ');

		// delete preloader
		$(".preloader").delay("500").fadeOut(500);

		// page transitions
		var myTimer = setTimeout(function () {

			PageTransitions.init({
				pages: $('.page-wrapper'),
				menu: 'ul.dl-menu',
				animcursor: 55, // 1 - 60
				nextAnimcursor: true // true, false
			});
			clearTimeout(myTimer);

		}, 1500);



		/*==========================================
		   BLOG MASONRY (requires: masonry.pkgd.min.js)
		=====================================================*/

		var containerBlog = document.querySelector('.blog-masonry');
		if (containerBlog) {
			new Masonry(containerBlog, {
				itemSelector: '.item',
				columnWidth: containerBlog.querySelector('.item-sizer')
			});
		}





	}); // end window load  


	$(document).ready(function () {


		/*==========================================
		   ADD NEW STYLE "max-height" (requires: functions.js)
		=====================================================*/

		addMenuHeight();


		/*==========================================
		   DL-MENU (requires: functions.js)
		=====================================================*/

		$('#dl-menu').dlmenu();


		/*==========================================
		   LOAD FULL SCREEN IMAGE (requires: backstretch.min.js)
		=====================================================*/

		var homeBg = document.querySelector('.home-bg');
		if (homeBg) {
			$('.home-bg').backstretch("assets/img/bg/1.jpg");
		}



		/*==========================================
		   TEXT ROTATOR (requires: owl-carousel.min.js)
		 =====================================================*/

		$('.rotate-text').owlCarousel({
			loop: true,
			dots: false,
			nav: false,
			margin: 0,
			items: 1,
			autoplay: true,
			autoplayTimeout: 4000,
			autoplayHoverPause: false,
			animateOut: 'slideOutDown',
			//animateIn: 'flipInX'
			animateIn: 'zoomIn'
		});


		/*==========================================
		  TESTIMONIALS (requires: owl-carousel.min.js)
		=====================================================*/

		$(".testimonials").owlCarousel({
			//animateOut: "slideOutDown",
			animateIn: "flipInX",
			items: 1,
			autoplay: true,
			autoplayTimeout: 5000,
			autoplayHoverPause: true,
			smartSpeed: 450,
			loop: true,
			dots: false,
			nav: true,
			navContainerClass: "testimonials-owl-nav"
		});



		/*==========================================
		  PORTFOLIO FILTER CATEGORY (requires:functions.js, jquery.shuffle.min.js)
		=====================================================*/

		shuffle_init('#portfolio-filter');


		/*==========================================
		   PORTFOLIO HOVERDIR (requires: jquery.hoverdir.js)
		 =====================================================*/

		$('.portfolio-hover > figure').each(function () {
			$(this).hoverdir({
				hoverDelay: 75
			});
		});


		/*==========================================
		   CONTACT FORM VALID (requires: functions.js)
		 =====================================================*/

		contact_form_validate();


		/*==========================================
		   PARALLAX (requires: functions.js,jquery.stellar.min)
		 =====================================================*/

		stellar_init('.content');


		/*==========================================
		   TOOLTIP (requires: bootstrap.min.js)
		=====================================================*/

		$("body").tooltip({
			selector: '[data-toggle=tooltip]'
		});




	}); // end document ready


	$(window).resize(function () {


		/*==========================================
		   ADD NEW STYLE "max-height" (requires: functions.js)
		=====================================================*/
		addMenuHeight();



	}); // end window resize


})(jQuery);
