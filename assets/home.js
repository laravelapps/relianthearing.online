(function ($, window, Starkey, undefined) {

    var sht = Starkey.Home = Starkey.Home || {};
    var me = {};

    var bc = window.brightcove || {};
    bc.createExperiences = bc.createExperiences = bc.createExperiences || function () { };

    me.windowWidth = function () {
        return $(window).width();
    };
    me.isPageEditor = function () {
        return $('body:first').hasClass('page-editor');
    };

    me.altUrl = '';
    /* me.scrollToAnchor = function(navId) {
        var navLoc = $('body').hasClass('alt') ? ($(navId).offset().top - 240) : ($(navId).offset().top - 20);
        $('html,body').animate({ scrollTop: navLoc }, 'slow');
    };
    me.resetPagePosition = function () {
        if (Modernizr.mq('(min-width: 768px)')) {
            me.scrollToAnchor('.choice-tabs');
        }
    }; */
    me.setupFlexSlider = function () {
        if (!me.isPageEditor()) {
            var animationSpeedVar = (window.navigator.userAgent.indexOf('MSIE 8.0;') > 0) ? 0 : 600;
            $('.starkey-hero-slide').flexslider({
                animation: "fade",
                animationSpeed: animationSpeedVar,
                touch: true,
                slideshow: true,
                slideshowSpeed: 7000
            });
        }
    };
    /* me.scrollHandler = function() {
        var choices = $('#choices').find('.choice-tabs');
        var scrollCircle = $('#scroll-circle');
        $(window).scroll(function() {
            if ($(this).scrollTop() > 464) {
                choices.addClass("stop");
                if (scrollCircle.length) {
                    scrollCircle.animate({ top: "85%" });

                    if (($(this).scrollTop() + $(this).height()) == $(document).height()) {
                        scrollCircle.stop().fadeOut('fast');
                    } else {
                        scrollCircle.stop().show();
                    }
                }
            } else {
                choices.removeClass("stop");
                if (scrollCircle.length) {
                    scrollCircle.stop().animate({ top: "480px" }).show();
                }
            }
        });
    }; */
    me.initializeVideoModals = function () {
        // Color box for embedded videos
        $('.no-touch #home .video-modal').on('click', function() {
            var $el = $(this).parent().find('.vid-container');
            $(this).colorbox({ inline: true, href: $el, width: 860, height: 533 });
        });
    };
    me.clickHandlers = function() {
        $("#choices span").on('click', function() {
            $("#choices span").removeClass("active");
            $(this).addClass("active");
        });
        $('.main-container').on('click', 'section h2', function () {
            if (me.windowWidth() < 768) {
                var myId = $(this).attr("class");
                $("section#" + myId).toggleClass("open");
                if (myId == 'your-options') {
                    me.productGallery('block');
                }
            }
        });
        me.initializeVideoModals();
        $('span.wear, span.dont-wear').on('click', function() {
            var urlFragment = "/";
            if ($(this).hasClass('wear')) {
                urlFragment = '/' + me.altUrl;
                $('body').addClass('alt');
            } else {
                $('body').removeClass('alt');
            }

            if ($('#scCrossPiece').length) {
                window.location = urlFragment;
                return;
            }

            $('#hearing-loss').load(urlFragment + ' #hearing-loss article', function (response, status, xhr) {
                setTimeout(me.initFacts, 100);
                /* setTimeout(me.resetPagePosition, 250);
                setTimeout(initParallax, 250); */
                setTimeout(me.initializeVideoModals, 250);
                bc.createExperiences();
            });
            $('#the-effects').load(urlFragment + ' #the-effects article');
            $('#hearing-test').load(urlFragment + ' #hearing-test article');
            $('#your-options').load(urlFragment + ' #your-options article', function() {
                setTimeout(me.productGallery, 250);
            });
            $('#hearing-aid-styles').load(urlFragment + ' #hearing-aid-styles', function() {
                setTimeout(me.productGallery, 250);
            });
            $('#dont-wait').load(urlFragment + ' #dont-wait article', function() {
                setTimeout(me.initializeVideoModals, 150);
                bc.createExperiences();
            });
        });
    };
    me.initFacts = function () {

        if (me.isPageEditor()) {
            return;
        }

        $('#fact-nav').flexslider({
            animation: "fade",
            controlNav: true,
            slideshow: false,
            itemWidth: 140,
            itemMargin: 0,
            minItems: 4,
            move: 0,
            asNavFor: '#fact-holder'
        });

        $('#fact-holder').flexslider({
            animation: "fade",
            controlNav: false,
            animationLoop: true,
            slideshow: true,
            pauseOnAction: false,
            slideshowSpeed: 8000,
            animationSpeed: 500,
            sync: "#fact-nav"
        });
    };
    me.initFlexslider = function() {
        if (me.isPageEditor()) {
            return;
        }

        $('#gallery-nav').flexslider({
            animation: "fade",
            controlNav: true,
            animationLoop: true,
            slideshow: false,
            itemWidth: 140,
            itemMargin: 0,
            minItems: 9,
            move: 0,
            asNavFor: '#gallery'
        });
        $('#gallery').flexslider({
            initDelay: 250,
            animation: "slide",
            controlNav: false,
            animationLoop: true,
            slideshow: false,
            sync: "#gallery-nav"
        });
    };
    me.watchGallery = function () {
        // var state = $('#your-options .content');
        var state = $('#your-options #gallery-nav');
        $(state.css('display'));
        state.csswatch({
            props: 'display'
        }).on('css-change', function (event, change) {
            return me.productGallery(change.display);
        });
    };
    me.productGallery = function (display) {
        switch (display) {
        case 'block':
            if ($('#gallery').hasClass('flexslider') && ($('#gallery-nav').data('flexslider') !== undefined) && ($('#gallery').data('flexslider') !== undefined)) {
                $('#gallery-nav').data('flexslider').resize();
                $('#gallery').data('flexslider').resize();
            } else {
                me.initFlexslider();
            }
            break;

        default:
            me.initFlexslider();
            break;
        }
    };
    me.setupGallery = function () {
        if ($('html').hasClass('lt-ie9')) {
            me.productGallery();
        }
        var navId = $(window.location.hash);
        if (navId.length > 1) {
            me.scrollToAnchor(navId);
        }
    };

    me.initHomeSlide = function () {

        $('ul#slideContainer li.carouselTypeA').each(function (i) {
            $(this).attr('id', 'slide' + i++);
        });


    };

    sht.windowLoad = function () {
        me.setupFlexSlider();

        //if (Modernizr.mq('(min-width: 768px)')) {
            me.productGallery();
        //} else {
        //    me.watchGallery();
        //}
    };

    sht.documentReady = function () {
        me.altUrl = window.altUrl || '';
        /* me.scrollHandler(); */
        me.clickHandlers();
        me.initFacts();
        me.setupGallery();


    };

})(jQuery, window, window.Starkey || (window.Starkey = {}));

$(window).load(function () {
    window.Starkey.Home.windowLoad();
});

$(function () {
    window.Starkey.Home.documentReady();
});
