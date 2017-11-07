/* 
 * ----------------------------------------------------------
 * FUBCTIONS - PORTFOLIO SHUFFLE (requires: jquery.shuffle.min.js )
 * ----------------------------------------------------------
 */
function shuffle_init(elem) {

	var $portfolio_grid = $(elem + ' .portfolio-colum'),
		$portfolio_nav = $(elem + ' .portfolio-filter-nav');

	if ($portfolio_grid) {

		$portfolio_grid.shuffle({
			speed: 500,
			itemSelector: 'figure'
		});


		// Get all images inside shuffle
		$portfolio_grid.find('img').each(function () {
			var proxyImage;

			// Image already loaded
			if (this.complete && this.naturalWidth !== undefined) {
				return;
			}

			// If none of the checks above matched, simulate loading on detached element.
			proxyImage = new Image();
			$(proxyImage).on('load', function () {
				$(this).off('load');
				$portfolio_grid.shuffle('update');
			});

			proxyImage.src = this.src;
		});

		// Because this method doesn't seem to be perfect.
		setTimeout(function () {
			$portfolio_grid.shuffle('update');
		}, 500);

		// NAV
		$portfolio_nav.on("click", ".filter", function (e) {
			e.preventDefault();

			$('.portfolio-filter-nav .filter').removeClass('active');
			$(this).addClass('active');
			$portfolio_grid.shuffle('shuffle', $(this).attr('data-group'));
		});


	}


}

/* 
 * ----------------------------------------------------------
 * FUBCTIONS - PARALLAX (requires: jquery.stellar.min)
 * ----------------------------------------------------------
 */

function stellar_init(elem) {



	if (window.innerWidth < 980) {

		return false;
	}

	jQuery(elem).stellar({

		// Set scrolling to be in either one or both directions
		horizontalScrolling: false,
		verticalScrolling: true,

		// Set the global alignment offsets
		horizontalOffset: 0,
		verticalOffset: 0,

		// Refreshes parallax content on window load and resize
		responsive: false,

		// Select which property is used to calculate scroll.
		// Choose 'scroll', 'position', 'margin' or 'transform',
		// or write your own 'scrollProperty' plugin.
		scrollProperty: 'scroll',

		// Select which property is used to position elements.
		// Choose between 'position' or 'transform',
		// or write your own 'positionProperty' plugin.
		positionProperty: 'transform',

		// Enable or disable the two types of parallax
		parallaxBackgrounds: true,
		parallaxElements: true,

		// Hide parallax elements that move outside the viewport
		hideDistantElements: false,

		// Customise how elements are shown and hidden
		hideElement: function ($elem) {
			$elem.hide();
		},
		showElement: function ($elem) {
			$elem.show();
		}

	});

}

/* 
 * ----------------------------------------------------------
 * FUBCTIONS - Contact Validate
 * ----------------------------------------------------------
 */
function contact_form_validate(t) {
	var e = void 0 !== t && t.length > 0 ? t : $("#contact-valid-form");
	e.each(function () {
		var t = $(this);
		t.find(".field-validation").each(function () {
			$(this).change(function () {
				if ($(this).siblings(".alert").remove().fadeOut("slow", function () {
						$(this).remove();
					}), "" !== $(this).val().trim()) {
					var e = contact_field_validation(t, $(this));
					if (e.length > 0 && void 0 !== e[0].message && "" !== e[0].message && "success" !== e[0].message) {
						var i = '<div class="alert"><i class="fa fa-exclamation-triangle"></i> ' + e[0].message + "</div>";
						$(this).after(i), $(this).siblings(".alert").fadeIn("slow");
					}
				}
			})
		}), t.submit(function (e) {
			e.preventDefault(), $(this).find(".form-loader").fadeIn("slow");

			var i = $(this).attr("action");
			if (void 0 == i && "" == i)
				return !1;
			$(this).find(".alert").remove().fadeOut("fast", function () {
				$(this).remove();
			}), $(this).find(".alert-validate-form").fadeOut("fast", function () {
				$(this).empty();
			});
			var a = !1;
			return $(this).find(".field-validation").each(function () {
				var e = contact_field_validation(t, $(this));
				if (e.length > 0 && void 0 !== e[0].message && "" != e[0].message && "success" != e[0].message) {
					var i = '<div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> ' + e[0].message + "</div>";
					$(this).after(i), $(this).siblings(".alert").fadeIn(), a = !0;

				}
			}), 1 == a ? ($(this).find(".form-loader").fadeOut("fast"), !1) : ($.ajax({
				type: "POST",
				url: i,
				data: $(this).serialize(),
				dataType: "json",
				success: function (e) {
					t.find(".form-loader").fadeOut("fast");
					var i = "1" == e.status ? !0 : !1,
						a = '<div class="alert ';
					a += 1 == i ? "success" : "error", a += '"><i class="fa fa-check-circle"></i> ' + e.text + '</div>', t.find(".alert-validate-form").html(a).fadeIn("fast", function () {
						$(this).delay(1e4).fadeOut("fast", function () {
							// $(this).remove();
						});
					}), 1 == i && t.find(".form-control").val("");
				},
				error: function () {
					t.find(".form-loader").fadeOut("fast");
					var e = '<div class="alert alert-danger"><i class="fa fa-exclamation-triangle"></i> An error occured. Please try again later.</div>';
					t.find(".alert-validate-form").html(e).fadeIn("fast");
				}
			}), void 0)
		})
	})
}

function contact_field_validation(t, e) {
	if (void 0 !== t && t.length > 0) {
		var i = void 0 !== e && e.length > 0 ? e : t.find(".validate"),
			a = new Array;
		return i.each(function () {
			var t = $(this).attr("data-validation-type"),
				e = $(this).hasClass("required"),
				i = $(this).val().trim(),
				n = new Array;
			n.field_object = $(this), n.message = "success", 1 != e || "" != i && null !== i && void 0 !== i || (n.message = "This field is required"), "string" == t && "" != i && null !== i && void 0 !== i ? null == i.match(/^[a-z0-9 .\-]+$/i) && (n.message = "Invalid characters found.") : "email" == t && "" != i && null !== i && void 0 !== i ? null == i.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/) && (n.message = "Please enter a valid email address.") : "phone" == t && "" != i && null !== i && void 0 !== i && null == i.match(/^\(?\+?[\d\(\-\s\)]+$/) && (n.message = "Invalid characters found."), a.push(n)
		}), a
	}
}


/* 
 * ----------------------------------------------------------
 * FUNCTIONS - Add Menu Height
 * ----------------------------------------------------------
 */
function addMenuHeight() {

	var nav = jQuery('.menu-box');
	var menuHeight = jQuery('nav').height() - (jQuery('nav .logo-box').height() + jQuery('nav footer.footer').height());
	nav.css({
		'max-height': menuHeight + 'px'
	});

	return false;
}


/* 
 * ----------------------------------------------------------
 * FUNCTIONS - Menu
 * ----------------------------------------------------------
 */
;
(function ($, window, undefined) {

	'use strict';

	// global
	var Modernizr = window.Modernizr,
		$body = $('body');

	$.DLMenu = function (options, element) {
		this.$el = $(element);
		this._init(options);
	};

	// the options
	$.DLMenu.defaults = {
		animationClasses: {
			classin: 'dl-animate-in-2',
			classout: 'dl-animate-out-2'
		},
		onLevelClick: function (el, name) {
			return false;
		},
		onLinkClick: function (el, ev) {
			return false;
		}
	};

	$.DLMenu.prototype = {
		_init: function (options) {

			// options
			this.options = $.extend(true, {}, $.DLMenu.defaults, options);
			// cache some elements and initialize some variables
			this._config();

			var animEndEventNames = {
					'WebkitAnimation': 'webkitAnimationEnd',
					'OAnimation': 'oAnimationEnd',
					'msAnimation': 'MSAnimationEnd',
					'animation': 'animationend'
				},
				transEndEventNames = {
					'WebkitTransition': 'webkitTransitionEnd',
					'MozTransition': 'transitionend',
					'OTransition': 'oTransitionEnd',
					'msTransition': 'MSTransitionEnd',
					'transition': 'transitionend'
				};

			this.animEndEventName = animEndEventNames[Modernizr.prefixed('animation')] + '.dlmenu';
			this.transEndEventName = transEndEventNames[Modernizr.prefixed('transition')] + '.dlmenu',
				this.supportAnimations = Modernizr.cssanimations,
				this.supportTransitions = Modernizr.csstransitions;

			this._initEvents();

		},

		_config: function () {

			this.open = true;
			this.$menuScroll = $('.menu-box');
			this.$buttonMobile = $('.menu-button-mobile');
			this.$menu = this.$el.children('ul.dl-menu');
			this.$menuitems = this.$menu.find('li:not(.dl-back)');
			this.$el.find('ul.sub-menu').prepend('<li class="dl-back"><a href="#"></a></li>');
			this.$back = this.$menu.find('li.dl-back');
			this.$menuli = this.$menu.find('li');
			this.$menuli.each(function () {
				var elem = $(this),
					name = elem.find('a')['0'];
				if (name) {
					elem.find('li.dl-back').find('a').html('<i class="fa fa-fw fa-long-arrow-left"></i> ' + name.innerHTML);
				} else {
					elem.find('li.dl-back').find('a').html('<i class="fa fa-fw fa-long-arrow-left"></i>');
				}
			});

		},

		_initEvents: function () {

			var self = this;

			this.$buttonMobile.on('click.dlmenu', function () {
				if ($(this).hasClass('close')) {
					self.$menuScroll.removeClass('dl-show');
					self.$buttonMobile.removeClass('close');
				} else {
					self.$menuScroll.addClass('dl-show');
					self.$buttonMobile.addClass('close');
				}
				return false;
			});


			$(document).on('click', 'li.submenu > a', function (event) {

				event.stopPropagation();

				var elem = $(this),
					elem2 = elem['0'],
					$item = $(elem2.parentNode),
					$submenu = $item.children('ul.sub-menu');

				if ($submenu.length > 0) {

					self.$menuScroll.addClass('scroll-none');

					var $flyin = $submenu.clone().css('opacity', 0).insertAfter(self.$menu),
						onAnimationEndFn = function () {
							self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classout).addClass('dl-subview');
							$item.addClass('dl-subviewopen').parents('.dl-subviewopen:first').removeClass('dl-subviewopen').addClass('dl-subview');
							$flyin.remove();
						};

					setTimeout(function () {
						$flyin.addClass(self.options.animationClasses.classin);
						self.$menu.addClass(self.options.animationClasses.classout);
						if (self.supportAnimations) {
							self.$menu.on(self.animEndEventName, onAnimationEndFn);
						} else {
							onAnimationEndFn.call();
						}

						self.options.onLevelClick($item, $item.children('a:first').text());

					});

					setTimeout(function () {
						self.$menuScroll.removeClass('scroll-none');

					}, 1000);


					return false;

				} else {
					self.$el.removeClass('dl-show');
					self.options.onLinkClick($item, event);
				}

			});


			this.$back.on('click.dlmenu', function (event) {

				self.$menuScroll.addClass('scroll-none');

				var $this = $(this),
					$submenu = $this.parents('ul.sub-menu:first'),
					$item = $submenu.parent(),

					$flyin = $submenu.clone().insertAfter(self.$menu);

				var onAnimationEndFn = function () {
					self.$menu.off(self.animEndEventName).removeClass(self.options.animationClasses.classin);
					$flyin.remove();
				};

				setTimeout(function () {
					$flyin.addClass(self.options.animationClasses.classout);
					self.$menu.addClass(self.options.animationClasses.classin);
					if (self.supportAnimations) {
						self.$menu.on(self.animEndEventName, onAnimationEndFn);
					} else {
						onAnimationEndFn.call();
					}

					$item.removeClass('dl-subviewopen');

					var $subview = $this.parents('.dl-subview:first');
					if ($subview.is('li')) {
						$subview.addClass('dl-subviewopen');
					}
					$subview.removeClass('dl-subview');

				});

				setTimeout(function () {
					self.$menuScroll.removeClass('scroll-none');

				}, 1000);

				return false;

			});

		},

		// resets the menu to its original state (first level of options)
		_resetMenu: function () {
			this.$menu.removeClass('dl-subview');
			this.$menuitems.removeClass('dl-subview dl-subviewopen');
		}
	};

	var logError = function (message) {
		if (window.console) {
			window.console.error(message);
		}
	};

	$.fn.dlmenu = function (options) {
		if (typeof options === 'string') {
			var args = Array.prototype.slice.call(arguments, 1);
			this.each(function () {
				var instance = $.data(this, 'dlmenu');
				if (!instance) {
					logError("cannot call methods on dlmenu prior to initialization; " +
						"attempted to call method '" + options + "'");
					return;
				}
				if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
					logError("no such method '" + options + "' for dlmenu instance");
					return;
				}
				instance[options].apply(instance, args);
			});
		} else {
			this.each(function () {
				var instance = $.data(this, 'dlmenu');
				if (instance) {
					instance._init();
				} else {
					instance = $.data(this, 'dlmenu', new $.DLMenu(options, this));
				}
			});
		}
		return this;
	};

})(jQuery, window);


/* 
 * ----------------------------------------------------------
 * FUNCTIONS - Page Transitions
 * ----------------------------------------------------------
 */
PageTransitions = (function () {

	var isAnimating = false,
		endCurrPage = true,
		endNextPage = false,
		animEndEventNames = {
			'WebkitAnimation': 'webkitAnimationEnd',
			'OAnimation': 'oAnimationEnd',
			'msAnimation': 'MSAnimationEnd',
			'animation': 'animationend'
		},
		animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
		support = Modernizr.cssanimations;


	function init(options) {

		$main = options.pages,
			menu = options.menu,
			animcursor = options.animcursor,
			nextAnimcursor = options.nextAnimcursor,
			pageStart = getPageActiv(),
			pageActiv = '',

			$main.append('<section id="page-ajax-prev"></section>');

		$pages = $main.children('section'),
			$pages.each(function () {
				var $page = jQuery(this);
				if ($page.attr('class')) {
					pageClass = $page.attr('class');
				} else {
					pageClass = "";
				}
				$page.data('originalClassList', pageClass);
			});

		nextPage(animcursor, pageStart);

		var menuItem = jQuery(menu + ' a[href*="' + pageStart + '"]');
		menuItem = menuItem['0'];
		menuItem = jQuery(menuItem.parentNode);
		menuItem.addClass('active');

		navigationPage();

	}


	function navigationPage() {

		window.onpopstate = function (event) {
			if (location.hash) {
				nextPage(animcursor, location.hash);
			} else {
				ajaxLoadPage(location);
			}
		};

		/* --- CLICK TO PAGE TRANSACTIONS  --- */
		jQuery(document).on("click", ".page-link", function (e) {

			e.preventDefault();
			if (isAnimating) {
				return false;
			}
			var link = jQuery(this);

			var ahref = link.attr('href').split("#");
			var ahrefhash = '#' + ahref[1];

			// validate page
			if (ahrefhash === "#" + pageActiv.attr('id')) {
				return false;
			}

			activeMenuLink(link);

			var myTimer = setTimeout(function () {

				nextPage(getAnimcursor(link), ahrefhash, link);
				history.pushState('', 'New URL: ' + link.attr('href'), link.attr('href'));
				clearTimeout(myTimer);

			}, mobileMenuClose());

		});

		/* --- CLICJ TO PAGE LINK AJAX LOADER  --- */
		jQuery(document).on("click", ".ajax-loader", function (e) {

			e.preventDefault();
			if (isAnimating) {
				return false;
			}
			var link = jQuery(this);

			activeMenuLink(link);

			var myTimer = setTimeout(function () {

				ajaxLoadPage(link);
				history.pushState('', 'New URL: ' + link.attr('href'), link.attr('href'));
				clearTimeout(myTimer);

			}, mobileMenuClose());

		});

	}


	function mobileMenuClose() {

		var timerDelay = 0;

		if (jQuery('.menu-box').hasClass('dl-show')) {

			jQuery('.menu-box').removeClass('dl-show');
			jQuery('.menu-button-mobile').removeClass('close');
			timerDelay = 700;
		}

		return timerDelay;
	}


	function startLazy() {

		var myTimer = setTimeout(function () {

			jQuery("section.section-current img.lazy").lazy({
				bind: "event",
				effect: "fadeIn",
				effectTime: 2000,
				appendScroll: jQuery("section.section-current .content"),
				//fallbackWidth   : 2000,
				//fallbackHeight  : 2000,
				delay: -1
			});
			clearTimeout(myTimer);

		}, 200);
	}


	function ajaxLoadPage(dane) {

		$('.page-ajax-preloader').addClass('activ');
		var page_ajaxId = '#page-ajax-prev';
		var myanimcursor = getAnimcursor(dane);


		var $this = dane,
			$remote = $this.data('remote') || $this.attr('href');

		jQuery.ajax({
			url: $remote,
			async: false,
			beforeSend: false,
			cache: false,
			dataType: 'html',
			context: document.body,
			//            beforeSend: function (xhr) {
			//                xhr.setRequestHeader('X-WPAC-REQUEST', '1');
			//                console.log(xhr);
			//            },
			success: function (html) {


				var $section = $(html).children('section'),
					section_content = $section.children('div.content');

				//var $script = section_content.find('script');
				//section_content.find('script').remove();

				if (!document.querySelector('#page-ajax-prev')) {
					$main.append('<section id="page-ajax-prev"></section>');
				}

				$(page_ajaxId).html(section_content);

				$(page_ajaxId + ' .ajax-page-link').addClass('page-link');


				var myTimer2 = setTimeout(function () {

					$('.page-ajax-preloader').removeClass('activ');

					nextPage(myanimcursor, page_ajaxId);
					clearTimeout(myTimer2);

				}, 500);



			},
			error: function (jqXhr, textStatus, errorThrown) {


				if (!document.querySelector('#page-ajax-prev')) {
					$main.append('<section id="page-ajax-prev"></section>');
				}

				var html = '<h1 class="text-center">Error - page not found!</h1>';
				var protocol = location.origin.split("://");
				if (protocol[0] === 'file') {
					html = '<h1 class="text-center">Error - url adress!</h1><p class="lead text-center">Please use url adress: <kbd>http://</kbd> do not <kbd>file://</kbd> in your browser.</p>';
				}

				$(page_ajaxId).html(html);

				nextPage(myanimcursor, page_ajaxId);

				$('.page-ajax-preloader').removeClass('activ');

				//console.log(jqXhr.responseText);
			}
		});


	}


	function createSectionPageAjaxPrev() {

		if (pageActiv.attr('id') === 'page-ajax-prev') {
			$('#page-ajax').remove();
			$('#page-ajax-prev').attr("id", "page-ajax");
		}
	}

	function contentScrollOn() {

		jQuery('.content').removeClass('scroll-auto');
		jQuery("section.section-current .content").addClass('scroll-auto');

	}


	function updateAnimcursor(animid) {
		animcursor = animid;
		++animcursor;
	}


	function updateNextAnimcursor(animid) {
		nextAnimcursor = false;
		if (animid) {
			nextAnimcursor = true;
		}
		return nextAnimcursor;
	}


	function getAnimcursor(dane) {
		var animid = dane.attr('data-pageanim');
		if (dane.attr("data-pageanim")) {
			return validateAnimcursor(animid);
		} else {
			return getNextAnimcursor();
		}
	}


	function getNextAnimcursor() {
		if (nextAnimcursor) {
			++animcursor;
			animcursor = validateAnimcursor(animcursor);
		}
		return animcursor;
	}


	function validateAnimcursor(animcursor) {
		if (animcursor > 67) {
			animcursor = 1;
		}
		return animcursor;
	}


	function activeMenuLink(item) {


		if (!item) {
			return false;
		}

		var menuItem = $(item);
		menuItem = menuItem['0'];
		menuItem = $(menuItem.parentNode);

		if (menuItem) {
			jQuery(menu + ' li').removeClass('active');
			menuItem.addClass('active');
		}

	}


	function getPageActiv(page) {

		if (location.hash !== "") {
			return location.hash;
		} else if (page) {
			return page;
		} else {
			return '#' + $("section.page-activ").attr('id');
		}
	}

	function validatePage(pageId) {

		if (document.querySelector(pageId)) {

			return true;
		} else {
			return false;
		}
	}

	function nextPage(animation, pageId, menuLink) {

		if (isAnimating) {
			return false;
		}
		isAnimating = true;

		if (!validatePage(pageId)) {
			pageId = '#error404';
		}

		//activeMenuLink( menuLink );

		var $currPage = $(pageActiv);
		var $nextPage = $(pageId).addClass('section-current'),
			outClass = '',
			inClass = '';

		var animationClass = getClassAnimate(animation);
		$currPage.addClass(animationClass.out).on(animEndEventName, function () {
			$currPage.off(animEndEventName);
			endCurrPage = true;
			if (endNextPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});
		$nextPage.addClass(animationClass.in).on(animEndEventName, function () {
			$nextPage.off(animEndEventName);
			endNextPage = true;
			if (endCurrPage) {
				onEndAnimation($currPage, $nextPage);
			}
		});

		if (!support) {
			onEndAnimation($currPage, $nextPage);
		}

	}


	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
		isAnimating = false;
	}


	function resetPage($outpage, $inpage) {

		$outpage.attr('class', $outpage.data('originalClassList') + '');
		$inpage.attr('class', $inpage.data('originalClassList') + ' section-current');
		pageActiv = $inpage;
		createSectionPageAjaxPrev();
		contentScrollOn();
		startLazy();

	}

	function getClassAnimate(idAnimation) {

		switch (idAnimation) {

			case 1:
				outClass = 'pt-page-moveToLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 2:
				outClass = 'pt-page-moveToRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 3:
				outClass = 'pt-page-moveToTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 4:
				outClass = 'pt-page-moveToBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 5:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 6:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 7:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 8:
				outClass = 'pt-page-fade';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 9:
				outClass = 'pt-page-moveToLeftFade';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 10:
				outClass = 'pt-page-moveToRightFade';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 11:
				outClass = 'pt-page-moveToTopFade';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 12:
				outClass = 'pt-page-moveToBottomFade';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 13:
				outClass = 'pt-page-moveToLeftEasing pt-page-ontop';
				inClass = 'pt-page-moveFromRight';
				break;
			case 14:
				outClass = 'pt-page-moveToRightEasing pt-page-ontop';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 15:
				outClass = 'pt-page-moveToTopEasing pt-page-ontop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 16:
				outClass = 'pt-page-moveToBottomEasing pt-page-ontop';
				inClass = 'pt-page-moveFromTop';
				break;
			case 17:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromRight pt-page-ontop';
				break;
			case 18:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromLeft pt-page-ontop';
				break;
			case 19:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromBottom pt-page-ontop';
				break;
			case 20:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-moveFromTop pt-page-ontop';
				break;
			case 21:
				outClass = 'pt-page-scaleDown';
				inClass = 'pt-page-scaleUpDown pt-page-delay300';
				break;
			case 22:
				outClass = 'pt-page-scaleDownUp';
				inClass = 'pt-page-scaleUp pt-page-delay300';
				break;
			case 23:
				outClass = 'pt-page-moveToLeft pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 24:
				outClass = 'pt-page-moveToRight pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 25:
				outClass = 'pt-page-moveToTop pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 26:
				outClass = 'pt-page-moveToBottom pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 27:
				outClass = 'pt-page-scaleDownCenter';
				inClass = 'pt-page-scaleUpCenter pt-page-delay400';
				break;
			case 28:
				outClass = 'pt-page-rotateRightSideFirst';
				inClass = 'pt-page-moveFromRight pt-page-delay200 pt-page-ontop';
				break;
			case 29:
				outClass = 'pt-page-rotateLeftSideFirst';
				inClass = 'pt-page-moveFromLeft pt-page-delay200 pt-page-ontop';
				break;
			case 30:
				outClass = 'pt-page-rotateTopSideFirst';
				inClass = 'pt-page-moveFromTop pt-page-delay200 pt-page-ontop';
				break;
			case 31:
				outClass = 'pt-page-rotateBottomSideFirst';
				inClass = 'pt-page-moveFromBottom pt-page-delay200 pt-page-ontop';
				break;
			case 32:
				outClass = 'pt-page-flipOutRight';
				inClass = 'pt-page-flipInLeft pt-page-delay500';
				break;
			case 33:
				outClass = 'pt-page-flipOutLeft';
				inClass = 'pt-page-flipInRight pt-page-delay500';
				break;
			case 34:
				outClass = 'pt-page-flipOutTop';
				inClass = 'pt-page-flipInBottom pt-page-delay500';
				break;
			case 35:
				outClass = 'pt-page-flipOutBottom';
				inClass = 'pt-page-flipInTop pt-page-delay500';
				break;
			case 36:
				outClass = 'pt-page-rotateFall pt-page-ontop';
				inClass = 'pt-page-scaleUp';
				break;
			case 37:
				outClass = 'pt-page-rotateOutNewspaper';
				inClass = 'pt-page-rotateInNewspaper pt-page-delay500';
				break;
			case 38:
				outClass = 'pt-page-rotatePushLeft';
				inClass = 'pt-page-moveFromRight';
				break;
			case 39:
				outClass = 'pt-page-rotatePushRight';
				inClass = 'pt-page-moveFromLeft';
				break;
			case 40:
				outClass = 'pt-page-rotatePushTop';
				inClass = 'pt-page-moveFromBottom';
				break;
			case 41:
				outClass = 'pt-page-rotatePushBottom';
				inClass = 'pt-page-moveFromTop';
				break;
			case 42:
				outClass = 'pt-page-rotatePushLeft';
				inClass = 'pt-page-rotatePullRight pt-page-delay180';
				break;
			case 43:
				outClass = 'pt-page-rotatePushRight';
				inClass = 'pt-page-rotatePullLeft pt-page-delay180';
				break;
			case 44:
				outClass = 'pt-page-rotatePushTop';
				inClass = 'pt-page-rotatePullBottom pt-page-delay180';
				break;
			case 45:
				outClass = 'pt-page-rotatePushBottom';
				inClass = 'pt-page-rotatePullTop pt-page-delay180';
				break;
			case 46:
				outClass = 'pt-page-rotateFoldLeft';
				inClass = 'pt-page-moveFromRightFade';
				break;
			case 47:
				outClass = 'pt-page-rotateFoldRight';
				inClass = 'pt-page-moveFromLeftFade';
				break;
			case 48:
				outClass = 'pt-page-rotateFoldTop';
				inClass = 'pt-page-moveFromBottomFade';
				break;
			case 49:
				outClass = 'pt-page-rotateFoldBottom';
				inClass = 'pt-page-moveFromTopFade';
				break;
			case 50:
				outClass = 'pt-page-moveToRightFade';
				inClass = 'pt-page-rotateUnfoldLeft';
				break;
			case 51:
				outClass = 'pt-page-moveToLeftFade';
				inClass = 'pt-page-rotateUnfoldRight';
				break;
			case 52:
				outClass = 'pt-page-moveToBottomFade';
				inClass = 'pt-page-rotateUnfoldTop';
				break;
			case 53:
				outClass = 'pt-page-moveToTopFade';
				inClass = 'pt-page-rotateUnfoldBottom';
				break;
			case 54:
				outClass = 'pt-page-rotateRoomLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomLeftIn';
				break;
			case 55:
				outClass = 'pt-page-rotateRoomRightOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomRightIn';
				break;
			case 56:
				outClass = 'pt-page-rotateRoomTopOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomTopIn';
				break;
			case 57:
				outClass = 'pt-page-rotateRoomBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateRoomBottomIn';
				break;
			case 58:
				outClass = 'pt-page-rotateCubeLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeLeftIn';
				break;
			case 59:
				outClass = 'pt-page-rotateCubeRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeRightIn';
				break;
			case 60:
				outClass = 'pt-page-rotateCubeTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeTopIn';
				break;
			case 61:
				outClass = 'pt-page-rotateCubeBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCubeBottomIn';
				break;
			case 62:
				outClass = 'pt-page-rotateCarouselLeftOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselLeftIn';
				break;
			case 63:
				outClass = 'pt-page-rotateCarouselRightOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselRightIn';
				break;
			case 64:
				outClass = 'pt-page-rotateCarouselTopOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselTopIn';
				break;
			case 65:
				outClass = 'pt-page-rotateCarouselBottomOut pt-page-ontop';
				inClass = 'pt-page-rotateCarouselBottomIn';
				break;
			case 66:
				outClass = 'pt-page-rotateSidesOut';
				inClass = 'pt-page-rotateSidesIn pt-page-delay200';
				break;
			case 67:
				outClass = 'pt-page-rotateSlideOut';
				inClass = 'pt-page-rotateSlideIn';
				break;

		}

		return anim = {
			'out': outClass,
			'in': inClass
		};

	}


	return {
		init: init,
		updateAnimcursor: updateAnimcursor,
		updateNextAnimcursor: updateNextAnimcursor
	};

})();
