	$(window).load(function() {

	    'use strict';
	    $(".preloader").delay(1200).fadeOut("slow");
     	//$(".preloader").addClass('hide');

	});


	/* ==============================================
	Custom Javascript
	=============================================== */
	$(document).ready(function() {

	    'use strict';

	    // On Scroll Header Style One
		$(window).scroll(function() {
	        if ($(this).scrollTop() > 50) {
	            $('.header-fullpage').addClass('fixed');
	        } else {
	            $('.header-fullpage').removeClass('fixed');
	        }
	    });

		$('#search_home, .overlay-close').on( "click", function($e) {
			$e.preventDefault();
			$(".overlay").toggleClass("open");     
		});


	    // Dropdown Menu For Mobile
		$('.dropdown-menu a.dropdown-toggle-mob').on('click', function(e) {
	      if (!$(this).next().hasClass('show')) {
	        $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
	      }
	      var $subMenu = $(this).next(".dropdown-menu");
	      $subMenu.toggleClass('show');

	      $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function(e) {
	        $('.dropdown-submenu .show').removeClass("show");
	      });

	      return false;
	    });

		$(document).on('click', '.header-search, .search-form-wrap a, .search-icon a', function(e){
	        e.preventDefault();
	        $('.search-form-wrap').slideToggle(300);
	        $('.open-search'). toggleClass('active-min');
	    });

	    $('.collapse').on('shown.bs.collapse', function(){
			$(this).parent().find(".fa-plus").removeClass("fa-plus").addClass("fa-minus");
			}).on('hidden.bs.collapse', function(){
			$(this).parent().find(".fa-minus").removeClass("fa-minus").addClass("fa-plus");
		});

		$('.skillbar').appear();
			$('.skillbar').on('appear', function () {			
			$(this).find('.skillbar-bar').animate({
				width: $(this).attr('data-percent')
			}, 3000);			
		});

		// Piecharts
	    jQuery('#pie-charts').waypoint(function(direction) {
	        jQuery('.chart').easyPieChart({
	            barColor: "#59585b",
	            onStep: function(from, to, percent) {
	                jQuery(this.el).find('.percent').text(Math.round(percent));
	            }
	        });
	    }, {
	        offset: function() {
	            return jQuery.waypoints('viewportHeight') - jQuery(this).height() + 200;
	        }
	    });

	    $(".fancybox").fancybox({
			helpers: {
				overlay: {
					locked: false, // try changing to true and scrolling around the page
					title: {
						type: 'outside'
					},
					thumbs: {
						width: 50,
						height: 50
					}
				}
			}
		});

		$(function() {
			var header = $("header.style-one, .pos-relative"),
				yOffset = 0,
				triggerPoint = 45;
			$(window).scroll(function() {
				yOffset = $(window).scrollTop();
	
				if (yOffset >= triggerPoint) {
					header.addClass("navbar-fixed-top animated fadeInDown");
				} else {
					header.removeClass("navbar-fixed-top animated fadeInDown");
				}
	
			});
		});
		
		/* Tooltip */
		$('.team-social ul li a, .demo-button a, .portfolio-buttons a, .social-icons ul li a').tooltip({
			placement: 'top',
			animation:true,
			delay: { show: 200, hide: 100 }
		});
		
		// /* Conter */
		$('.counter').counterUp({
            delay: 10,
            time: 1000
        });
		
		/* hide #back-top first */
	    $("#back-top").hide();
	    // fade in #back-top
	    $(function() {
	        $(window).scroll(function() {
	            if ($(this).scrollTop() > 100) {
	                $('#back-top').fadeIn();
	            } else {
	                $('#back-top').fadeOut();
	            }
	        });
	        // scroll body to 0px on click
	        $('#back-top a').click(function() {
	            $('body,html').animate({
	                scrollTop: 0
	            }, 800);
	            return false;
	        });
	    });
		

		$("#cases-related").owlCarousel({
	        items: 3,
	        margin: 15,
	        loop: true,
	        nav: false,
	        slideBy: 1,
	        dots: false,
	        center: false,
	        autoplay: true,
	        autoheight: true,
	        navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
	        responsive: {
	            320: {
	                items: 1,
	            },
	            480: {
	                items: 2,
	            },
	            600: {
	                items: 2,
	            },
	            1000: {
	                items: 2,
	                loop: true,
	            },
				1200: {
	                items: 2,
	                loop: true,
	            }
	        }
	    });
		
		// // Portfolio Single Slider
		$("#portfolio-single").owlCarousel({
	        items: 1,
	        margin: 0,
	        loop: true,
	        nav: true,
	        slideBy: 1,
	        dots: false,
	        center: false,
	        autoplay: false,
	        autoheight: true,
	        navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
	        responsive: {
	            320: {
	                items: 1,
	            },
	            480: {
	                items: 1,
	            },
	            600: {
	                items: 1,
	            },
	            1000: {
	                items: 1,
	                loop: true,
	            },
				1200: {
	                items: 1,
	                loop: true,
	            }
	        }
	    });
		
		// // Our Portfolio Slider
		$("#home-portfolio").owlCarousel({
	        items: 5,
	        margin: 0,
	        loop: true,
	        nav: true,
	        slideBy: 1,
	        dots: false,
	        center: false,
	        autoplay: false,
	        autoheight: true,
	        navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
	        responsive: {
	            320: {
	                items: 1,
	            },
	            480: {
	                items: 2,
	            },
	            600: {
	                items: 2,
	            },
	            1000: {
	                items: 4,
	                loop: true,
	            },
				1200: {
	                items: 5,
	                loop: true,
	            }
	        }
	    });
		
		$("#team-slider").owlCarousel({
	        items: 1,
	        margin: 30,
	        loop: true,
	        nav: false,
	        slideBy: 1,
	        dots: true,
	        center: false,
	        autoplay: false,
	        autoheight: true,
	        navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
	   //      responsive: {
	   //          320: {
	   //              items: 1,
	   //          },
	   //          480: {
	   //              items: 2,
	   //          },
	   //          600: {
	   //              items: 2,
	   //          },
	   //          1000: {
	   //              items: 3,
	   //              loop: true,
	   //          },
				// 1200: {
	   //              items: 3,
	   //              loop: true,
	   //          }
	   //      }
	    });
		
		// // Testimonial Slider
		$("#home-testimonial").owlCarousel({
	        items: 1,
	        margin: 0,
	        loop: true,
	        nav: true,
	        slideBy: 1,
	        dots: false,
	        center: false,
	        autoplay: false,
	        autoheight: true,
	        navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
	        responsive: {
	            320: {
	                items: 1,
					nav: true,
	            },
	            480: {
	                items: 1,
					nav: true,
	            },
	            600: {
	                items: 1,
					nav: true,
	            },
	            1000: {
	                items: 1,
	                loop: true,
					nav: true,
	            },
				1200: {
	                items: 1,
	                loop: true,
					nav: true,
	            }
	        }
	    });

	    $("#sidebar-testimonial").owlCarousel({
	        items: 1,
	        margin: 0,
	        loop: true,
	        nav: false,
	        slideBy: 1,
	        dots: false,
	        center: false,
	        autoplay: true,
	        autoheight: true,
	        navText: ['&#xf104;', '&#xf105']
	    });
		
		
		// // Open Video
	    jQuery('.play-video').on('click', function(e) {
	        var videoContainer = jQuery('.video-box');
	        videoContainer.prepend('<iframe src="http://player.vimeo.com/video/7449107" width="500" height="281" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
	        videoContainer.fadeIn(300);
	        e.preventDefault();
	    });
	    // Close Video
	    jQuery('.close-video').on('click', function(e) {
	        jQuery('.video-box').fadeOut(400, function() {
	            jQuery("iframe", this).remove().fadeOut(300);
	        });
	    });
		
		// // Contact Form
		jQuery("#contact_form").validate({
	        meta: "validate",
	        submitHandler: function(form) {

	            var s_name = $("#name").val();
	            var s_lastname = $("#lastname").val();
	            var s_email = $("#email").val();
	            var s_phone = $("#phone").val();
	            var s_suject = $("#subject").val();
	            var s_comment = $("#comment").val();
	            $.post("contact.php", {
	                    name: s_name,
	                    lastname: s_lastname,
	                    email: s_email,
	                    phone: s_phone,
	                    subject: s_suject,
	                    comment: s_comment
	                },
	                function(result) {
	                    $('#sucessmessage').append(result);
	                });
	            $('#contact_form').hide();
	            return false;
	        },
	        /* */
	        rules: {
	            name: "required",

	            lastname: "required",
	            // simple rule, converted to {required:true}
	            email: { // compound rule
	                required: true,
	                email: true
	            },
	            phone: {
	                required: true,
	            },
	            comment: {
	                required: true
	            },
	            subject: {
	                required: true
	            }
	        },
	        messages: {
	            name: "Please enter your name.",
	            lastname: "Please enter your last name.",
	            email: {
	                required: "Please enter email.",
	                email: "Please enter valid email"
	            },
	            phone: "Please enter a phone.",
	            subject: "Please enter a subject.",
	            comment: "Please enter a comment."
	        },
	    }); /*========================================*/
		
		$(".btn-settings").on("click", function() {
			$(this).parent().toggleClass("active");
		});
		$(".color-list div").on("click", function() {
			if ($(this).hasClass("active")) return;
			$("link.color-scheme-link").remove(), $(this).addClass("active").siblings().removeClass("active");
			var e = $(this).attr("data-src"),
				i = $('<link class="color-scheme-link" rel="stylesheet" />');
			i.attr("href", e).appendTo("head")
		}), $(".reset").on("click", function() {
			if ($(".color-list div").removeClass("active"), $(this).hasClass("active")) return !1;
			$("link.color-scheme-link").remove();
			var e = $(this).attr("data-src"),
				i = $('<link class="color-scheme-link" rel="stylesheet" />');
			i.attr("href", e).appendTo("head")
		}), $(".reset span").on("click", function() {
			var e = $(this).attr("class");
			$("body").attr("class", e)
		})
		
	});
	
	