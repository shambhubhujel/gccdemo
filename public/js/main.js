(function ($) {
  'use strict';

  /*-------------------------------------------
    01. jQuery MeanMenu
  --------------------------------------------- */

  $('.mobile-menu nav').meanmenu({
    meanMenuContainer: '.mobile-menu-area',
    meanScreenWidth: '991',
    meanRevealPosition: 'right',
  });
  /*-------------------------------------------
    02. wow js active
  --------------------------------------------- */
  new WOW().init();

  /*-------------------------------------------
    03. Project  Masonry
  --------------------------------------------- */

  $('.htc__project__container').imagesLoaded(function () {
    // filter items on button click
    $('.project__menu').on('click', 'button', function () {
      var filterValue = $(this).attr('data-filter');
      $grid.isotope({ filter: filterValue });
    });
    // init Isotope
    var $grid = $('.htc__latest__project__wrap').isotope({
      itemSelector: '.single__project',
      percentPosition: true,
      transitionDuration: '0.7s',
      layoutMode: 'fitRows',
      masonry: {
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.single__project',
      },
    });
  });

  $('.project__menu button').on('click', function (event) {
    $(this).siblings('.is-checked').removeClass('is-checked');
    $(this).addClass('is-checked');
    event.preventDefault();
  });

  /*-------------------------------------------
    04. Sticky Header
  --------------------------------------------- */

  $(window).on('scroll', function () {
    var scroll = $(window).scrollTop();
    if (scroll < 245) {
      $('#sticky-header-with-topbar').removeClass('scroll-header');
    } else {
      $('#sticky-header-with-topbar').addClass('scroll-header');
    }
  });

  /*--------------------------
    05. ScrollUp
  ---------------------------- */

  $.scrollUp({
    scrollText: '<i class="zmdi zmdi-chevron-up"></i>',
    easingType: 'linear',
    scrollSpeed: 900,
    animation: 'fade',
  });

  /*---------------------------------------------
    06. Testimonial Slick Carousel
  ------------------------------------------------*/
  function start_slick() {
    $('.testimonial__activation').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      draggable: true,
      // fade: true,
      dots: true,
    });
  }

  window.setTimeout(start_slick, 500);

  /*------------------------------------------
    07. Testimonial Slick Carousel
  -------------------------------------------*/
  $('.testimonial__activation--2').slick({
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
    draggable: true,
    // fade: true,
    dots: true,
  });

  /*-----------------------------
    08. CounterUp
  -----------------------------*/
  $('.count').counterUp({
    delay: 60,
    time: 3000,
  });

  /*-----------------------------------------------
    15. Home Slider
  -------------------------------------------------*/

  if ($('.slider__activation__wrap').length) {
    $('.slider__activation__wrap').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      autoplay: true,
      navText: [
        '<i class="zmdi zmdi-chevron-left"></i>',
        '<i class="zmdi zmdi-chevron-right"></i>',
      ],
      autoplayTimeout: 8000,
      items: 1,
      dots: false,
      lazyLoad: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
      },
    });
  }

  /*-----------------------------------
    16. ScrollReveal Js Init
  -------------------------------------- */

  window.srf = ScrollReveal({ duration: 800, reset: false });
  window.srs = ScrollReveal({ duration: 800, reset: false }, { delay: 1000 });
  srf.reveal('.foo');
  srs.reveal('.bar');

  /*--------------------------------
    17. Magnific Popup
  ----------------------------------*/

  $('.video-popup').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,
    zoom: {
      enabled: true,
    },
  });

  $('.image-popup').magnificPopup({
    type: 'image',
    mainClass: 'mfp-fade',
    removalDelay: 100,
    gallery: {
      enabled: true,
    },
  });

  /*-----------------------------------------------
    16. Blog Slider
  -------------------------------------------------*/

  if ($('.blog__activation').length) {
    $('.blog__activation').owlCarousel({
      loop: true,
      margin: 0,
      nav: true,
      autoplay: false,
      navText: [
        '<i class="zmdi zmdi-chevron-left"></i>',
        '<i class="zmdi zmdi-chevron-right"></i>',
      ],
      autoplayTimeout: 1000,
      items: 1,
      dots: true,
      lazyLoad: true,
      responsive: {
        0: {
          items: 1,
        },
        600: {
          items: 1,
        },
      },
    });
  }
})(jQuery);
