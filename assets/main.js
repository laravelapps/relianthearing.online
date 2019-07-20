(function ($, window, Starkey, undefined) {
    //#region  Namespacing
    var sht = Starkey.Main = Starkey.Main || {};
    var service = Starkey.Services = Starkey.Services || {};
    //#endregion

    var me = {};  // for private members

    //#region  Http Service

    // Returns an object with GET and POST methods that return jQuery ajax objects.
    var http = service.Http = (function () {

        var post = function (url, header, data) {
            /// <summary>Perform a generic AJAX POST</summary>
            /// <param name="url" type="Object"></param>
            /// <param name="header" type="Object"></param>
            /// <param name="data" type="Object"></param>

            return $.ajax({
                type: 'POST',
                dataType: 'json',
                headers: header,
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: data
            });
        };

        var get = function (url, header, data) {
            /// <summary>Perform a generic AJAX GET</summary>
            /// <param name="url" type="Object"></param>
            /// <param name="header" type="Object"></param>
            /// <param name="data" type="Object"></param>

            return $.ajax({
                type: 'GET',
                dataType: 'json',
                headers: header,
                url: url,
                contentType: 'application/json; charset=utf-8',
                data: data
            });
        };

        return {
            POST: post,
            GET: get
        };
    })();
    //#endregion

    //#region  Private Members
    me.GetURLParameter = function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    };

    me.windowWidth = function () {
        return $(window).width();
    };
    me.isPageEditor = function () {
        return $('body:first').hasClass('page-editor');
    };
    me.debounce = function (func, wait, immediate) {
        var timeout, result;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    me.trackGoal = function (goalId) {
        var request = http.POST("/route/to/goal/tracking/action", {}, JSON.stringify({ GoalItemId: goalId }));
        //request.done(function(data) {
        //    // response from the request
        //});

        return request;
    };
    me.updateQueryStringParameter = function (uri, key, value) {
        var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            return uri + separator + key + "=" + value;
        }
    };

    me.setCookie = function (name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    };
    me.getCookie = function (key) {
   		var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
   		return keyValue ? keyValue[2] : null;
	}

	// Check for campaign property
	me.checkCampaign = function () {

	    function setCookie(name, value, days) {
        	var expires = "";
        	if (days) {
            	var date = new Date();
           	 date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
           	 expires = "; expires=" + date.toGMTString();
       	 }
       	 document.cookie = name + "=" + value + expires + "; path=starkey.com";
   		 };

   	 	function getCookie (key) {
   			var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
   			return keyValue ? keyValue[2] : null;
   	 	}

		var campActivity = me.GetURLParameter('utm_campaign');
		var sourceMedium = me.GetURLParameter('utm_medium');
		var sourceSource = me.GetURLParameter('utm_source');
		var sourceContent = me.GetURLParameter('utm_content');


		if (campActivity != null) {
    		setCookie('campact', campActivity, 30);
    		setCookie('campsour', sourceSource, 30);
    		setCookie('campmed', sourceMedium, 30);
    		setCookie('campcont', sourceContent, 30);
    	}

    	if (document.getElementById("contact-form")) {
			if (getCookie('campact') != null) {
			// WebMD Campaigns
				if (getCookie('campmed').toLowerCase() == "cpc"  && getCookie('campact').toLowerCase() == "sta_aw_c_contextual_webmd") {
				    $('input#DynamicsSourceCampaign').val('Starkey_Search');
					$('input#CampaignActivity').val('WebMD_Contextual_Ads');
    				$('input#MapCampaignActivity').val('WebMD_Contextual_Ads');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "webmd_starkeycom_banners") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('WebMD Marketing');
    				$('input#MapCampaignActivity').val('WebMD Marketing');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "webmd_starkeycom_preroll_video") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('WebMD Marketing');
    				$('input#MapCampaignActivity').val('WebMD Marketing');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "webmd_starkeycom_webform") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('WebMD Starkey.com Webform');
    				$('input#MapCampaignActivity').val('WebMD Starkey.com Webform');
    		// WebMD May 2016 Addtions
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "sta_webmd_banners_tinnitus_guide") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('STA_WebMD_Banners_Tinnitus_Guide');
    				$('input#MapCampaignActivity').val('STA_WebMD_Banners_Tinnitus_Guide');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "sta_webmd_banners_hearing_guide") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('STA_WebMD_Banners_Hearing_Guide');
    				$('input#MapCampaignActivity').val('STA_WebMD_Banners_Hearing_Guide');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "sta_webmd_tinnitus") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('STA_WebMD_Tinnitus');
    				$('input#MapCampaignActivity').val('STA_WebMD_Tinnitus');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "sta_webmd_banners") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('WebMD_Marketing');
    				$('input#MapCampaignActivity').val('WebMD_Marketing');
				}	else if (getCookie('campsour').toLowerCase() == "webmd" && getCookie('campact').toLowerCase() == "sta_webmd") {
					$('input#DynamicsSourceCampaign').val('WebMD');
					$('input#CampaignActivity').val('STA_WebMD');
    				$('input#MapCampaignActivity').val('STA_WebMD');


    		// Facebook May 2016 Addtions
				}	else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_retargeting_drs") {
					$('input#DynamicsSourceCampaign').val('Starkey_Facebook');
					$('input#CampaignActivity').val('STA_FB_FB_Halo2_Retargeting_DRS');
    				$('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Retargeting_DRS');
				}	else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_interest_drs") {
					$('input#DynamicsSourceCampaign').val('Starkey_Facebook');
					$('input#CampaignActivity').val('STA_FB_FB_Halo2_Interest_DRS');
    				$('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Interest_DRS');
            // Facebook September 2016 Addtions
                }   else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_personicx-elite") {
                    $('input#DynamicsSourceCampaign').val('Starkey_Facebook');
                    $('input#CampaignActivity').val('STA_FB_FB_Halo2_Personicx-Elite');
                    $('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Personicx-Elite');
                }   else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_personicx-busy") {
                    $('input#DynamicsSourceCampaign').val('Starkey_Facebook');
                    $('input#CampaignActivity').val('STA_FB_FB_Halo2_Personicx-Busy');
                    $('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Personicx-Busy');
            // Facebook December 2016 Addtions
                }   else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_personicx-pillars") {
                    $('input#DynamicsSourceCampaign').val('Starkey_Facebook');
                    $('input#CampaignActivity').val('STA_FB_FB_Halo2_Personicx-Pillars');
                    $('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Personicx-Pillars');
                }   else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_personicx-rural") {
                    $('input#DynamicsSourceCampaign').val('Starkey_Facebook');
                    $('input#CampaignActivity').val('STA_FB_FB_Halo2_Personicx-Rural');
                    $('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Personicx-Rural');
                }   else if (getCookie('campsour').toLowerCase() == "facebook" && getCookie('campact').toLowerCase() == "sta_fb_fb_halo2_personicx-garden") {
                    $('input#DynamicsSourceCampaign').val('Starkey_Facebook');
                    $('input#CampaignActivity').val('STA_FB_FB_Halo2_Personicx-Garden');
                    $('input#MapCampaignActivity').val('STA_FB_FB_Halo2_Personicx-Garden');

			// RockeFuel Campaigns
				}	else if (getCookie('campsour').toLowerCase() == "Rocketfuel" && getCookie('campact').toLowerCase() == "RocketFuel") {
					$('input#DynamicsSourceCampaign').val('Starkey.com');
					$('input#CampaignActivity').val('RocketFuel_Banner_Dec_2015');
    				$('input#MapCampaignActivity').val('RocketFuel_Banner_Dec_2015');
				}	else if (getCookie('campsour').toLowerCase() == "Rocketfuel_Facebook" && getCookie('campact').toLowerCase() == "RocketFuel") {
					$('input#DynamicsSourceCampaign').val('Starkey.com');
					$('input#CampaignActivity').val('RocketFuel_Banner_Dec_2015');
    				$('input#MapCampaignActivity').val('RocketFuel_Banner_Dec_2015');
			// CN Campaigns
    			}	else if (getCookie('campsour').toLowerCase() == "conde_nast" && getCookie('campact').toLowerCase() == "condenast_starkeycom_banners" && getCookie('campcont').toLowerCase() == "300x600") {
					$('input#DynamicsSourceCampaign').val('Conde Nast');
					$('input#CampaignActivity').val('Conde Nast_300x600');
    				$('input#MapCampaignActivity').val('Conde Nast_300x600');
    			}	else if (getCookie('campsour').toLowerCase() == "conde_nast" && getCookie('campact').toLowerCase() == "condenast_starkeycom_banners" && getCookie('campcont').toLowerCase() == "parallax") {
					$('input#DynamicsSourceCampaign').val('Conde Nast');
					$('input#CampaignActivity').val('Conde Nast_Parallax');
    				$('input#MapCampaignActivity').val('Conde Nast_Parallax');
			// CPC Catch All Campaigns
				}   else if (getCookie('campmed').toLowerCase() == "cpc")  {
				    $('input#DynamicsSourceCampaign').val('Starkey_Search');
					$('input#CampaignActivity').val(getCookie('campact'));
    				$('input#MapCampaignActivity').val(getCookie('campact'));
				}
        	}
    	}
    }
    me.productGallery = function () {
        if ($('#gallery').length && !me.isPageEditor()) {
            $('#gallery').flexslider({
                animation: "slide",
                controlNav: false,
                animationLoop: true,
                slideshow: false
            });
        }
    };
    me.navMenus = function () {
        var mainWrapper = $('.main-content>.nav');
        var mainSelector = '.main-nav';
        var utilitySelector = '.secondary-content';
        var menuButton = $('.drop-menu .nav-toggle');
        var showMenuButton = false;
        var windowWidth = me.windowWidth();

        var toggleItem = function (itemId, drop) {
            var navItem = $("li.nav-item[data-id='" + itemId + "']");
            var dropItem = $("li.drop-item[data-id='" + itemId + "']");
            if (drop) {
                navItem.addClass('hide');
                dropItem.removeClass('hide');
            } else {
                navItem.removeClass('hide');
                dropItem.addClass('hide');
            }
        };
        var navDisplay = function (selector, dropAll, dropExcess) {
            var menuWidth = $(selector + '>ul').innerWidth();
            var items = $(selector + '>ul>li.nav-item');
            var totalWidth = 0;
            items.each(function () {
                totalWidth = totalWidth + $(this).outerWidth();
            });

            if (dropExcess && showMenuButton) {
                menuWidth = menuWidth - menuButton.outerWidth();
            }

            for (var i = items.length - 1; i >= 0; i--) {
                var item = $(items[i]);
                var itemId = item.data('id');
                if (itemId === undefined) {
                    continue;
                }

                if (dropExcess) {
                    var itemWidth = item.outerWidth();

                    if (totalWidth >= menuWidth) {
                        toggleItem(itemId, true);
                        totalWidth = totalWidth - itemWidth;
                        if (!showMenuButton) {
                            showMenuButton = true;
                            menuWidth = menuWidth - menuButton.outerWidth();
                        }
                    } else {
                        toggleItem(itemId, false);
                    }

                    continue;
                }

                toggleItem(itemId, dropAll);
                if (dropAll && !showMenuButton) {
                    showMenuButton = true;
                }
            }
        };

        if (windowWidth < 600) {
            // all items to the drop menu
            navDisplay(utilitySelector, true);
            navDisplay(mainSelector, true);
        } else if (windowWidth < 1000) {
            // all utility nav items to drop menu, check the main nav items for visibility
            navDisplay(utilitySelector, true);
            navDisplay(mainSelector, false, true);
        } else {
            // utility nav in header, check the main nav items for their visibility
            navDisplay(utilitySelector, false);
            navDisplay(mainSelector, false, true);
        }

        if (showMenuButton) {
            mainWrapper.addClass('show-menu');
            menuButton.removeClass('hide');
        } else {
            mainWrapper.removeClass('show-menu');
            menuButton.addClass('hide');
            menuButton.removeClass('open');
            $(".nav-items").removeClass('open');
        }

        $('li.drop-item').removeClass('first');
        $('li.drop-item:not(.hide):first').addClass('first');
    };
    me.footerItems = function () {
        var footerLinks = $('#footer-nav a');
        var itemWidth = '100%';
        if (me.windowWidth() >= 1000) {
            itemWidth = (100 / footerLinks.length) + '%';
        }
        footerLinks.css("width", itemWidth);
    };
    me.columns = function () {
        var width = me.windowWidth();
        var numColumns = 2;

        if (width >= 768) {
            numColumns = 3;

            var maxHeight = 300;
            $('.iyh .group > section').each(function () {
                maxHeight = maxHeight > $(this).outerHeight() ? maxHeight : $(this).outerHeight();
            });
            $('.iyh .group section').css("min-height", maxHeight);

        }

        var numUnorderedLists = $(".country-list").length;

        if (numUnorderedLists === 1) {
            $('.country-list li').css("width", ($('.country-list').width() / numColumns - 1));
            for (var i = 1; i <= numColumns; i++) {
                $("ul.country-list li").slice(((i - 1) * ($('.country-list li').length / numColumns)), (($('.country-list li').length / numColumns) * i)).wrapAll("<span/>");
            };
        } else {
            var counter = 0;
            $(".country-list").each(function () {
                counter++;
                var self = $(this);
                var classIdentifier = "UnorderedList_" + counter;
                self.addClass(classIdentifier);

                classIdentifier = "." + classIdentifier;
                $(classIdentifier + " li").css("width", ($(classIdentifier).width() / numColumns - 1));
                classIdentifier = classIdentifier + " li";
                for (var i = 1; i <= numColumns; i++) {
                    $(classIdentifier).slice(((i - 1) * ($(classIdentifier).length / numColumns)), (($(classIdentifier).length / numColumns) * i)).wrapAll("<span/>");
                };
            });
        }
    };

    me.setupVideoColorbox = function () {
        $('.no-touch .youtubeVideo').colorbox({ iframe: true, innerWidth: 880, innerHeight: 560, opacity: 0.6 });
    };

    me.setupColorBox = function () {
        // Color box for embedded videos - not home page or testimonials page
        $('.no-touch body:not([id="home"]) .video-modal').on('click', function () {

            var el;
            // If the vid-container is within the anchor
            if ($(this).hasClass('instructional')) {
                el = $(this).find('.vid-container');
            } else {
                el = $(this).parent().find('.vid-container');
            }

            $(this).colorbox({ inline: true, href: el, innerWidth: 880, innerHeight: 560, opacity: 0.6 });
        });


        // ############## start utag event injection for on video clicks through site ##############
        // ##### think of appending page to the passed in data so you know where the user is coming from :
        // ##### Full path :: $(location).attr('href');
        // ##### Page path :: window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1);
        // ##### Host name :: window.location.hostname.substring(window.location.hostname.lastIndexOf('/') + 1);

        $('.video-modal:has(span.title)').on('click', function () {
            // this is for the product pages
            var actionName = $(this).find('span').text();
            var labelName = '2015 || ' + $(location).attr('href');
            utag.link({ ga_event_category: 'video view', ga_event_action: actionName, ga_event_label: labelName });
        });

        $('.video-modal:has(span:not([class="title"]))').on('click', function () {
            // this is for the instructional videos page
            var actionName = $(this).parent().parent().prevAll().text() + ' || ' + $(this).parent().prev().text() + ' || ' + $(this).text();
            var labelName = '2015 || ' + $(location).attr('href');
            utag.link({ ga_event_category: 'video view', ga_event_action: actionName, ga_event_label: labelName });
        });

        // on click for video box for the home page
        $('.youtubeVideo:has(span.image-caption)').on('click', function () {
            // MDN setting utag on video click
            var actionName = $(this).parent().parent().find('h3').text();
            var labelName = '2015 || ' + $(location).attr('href');
            utag.link({ ga_event_category: 'video view', ga_event_action: actionName, ga_event_label: labelName });
        });

        // on click for video box for testimonials page
        $('.youtubeVideo:has(h3)').on('click', function () {
            // MDN setting utag on video click
            var actionName = $(this).find('h3').text();
            var labelName = '2015 || ' + $(location).attr('href');
            utag.link({ ga_event_category: 'video view', ga_event_action: actionName, ga_event_label: labelName });
        });

        $('.youtubeVideo:has(div.video-desc)').on('click', function () {
            // this is for the sidebar videos
            var actionName = $(this).find('div.video-desc').find('p.cta').text();
            var labelName = '2015 || ' + $(location).attr('href');
            utag.link({ ga_event_category: 'video view', ga_event_action: actionName, ga_event_label: labelName });
        });

        // ############ end utag event injection for video clicks through site

        // Color box for video link in Header Image Testimonials page
        $('.no-touch body:not([id="home"]) .video-header').on('click', function () {

            var el;
            el == $(this).attr('href');;

            $(this).colorbox({ iframe: true, innerWidth: 880, innerHeight: 560, opacity: 0.6 });
        });

        $('.no-touch .modal').colorbox({
            onComplete: function () {
                //Add extra paddings to fit the box better for smaller images
                var imgSize = $('#cboxLoadedContent').find('img').width(),
                    imgSizeH = $('#cboxLoadedContent').find('img').height(),
                    resetSize = imgSize < 500 ? 500 : imgSize,
                    resetSizeH = imgSizeH < 500 ? 500 : imgSizeH,
                    addPaddings = imgSize < 500 ? (500 - imgSize) / 2 : 0;
                $('#cboxLoadedContent').find('.cboxPhoto').css('padding', addPaddings);
                $.colorbox.resize({ width: resetSize, height: resetSize });
                $('#cboxLoadedContent').find('.cboxPhoto').css('width', resetSize);
                $('#cboxLoadedContent').find('.cboxPhoto').css('height', resetSizeH);
            }
        });

        $('.no-touch .use-and-care').colorbox({
            iframe: true,
            width: "642 px",
            height: "427 px"
        });

        $('.no-touch #fha.financing-terms').addClass('modal-window');

        $('.no-touch a.financing-terms').colorbox({
            iframe: true,
            width: "70%",
            height: "60%"
        });
    };
    me.addIn360Viewer = function () {
        $("a.viewer-color").on('click', function (e) {
            e.preventDefault();
            var imgUrl = $(this).attr("href");
            var pagePath = $("div#image-holder-360").attr("data-pathEn");
            imgUrl = imgUrl.split(".jpg")[0];
            var color = $(this).attr("title");
            var imgUrl = $(this).attr("href");
            $("iframe#iframe360").attr("src", "/Sites/Starkey/images/360" + pagePath + "/" + color + "/index.html");
        });
    };
    me.addInCarousel = function () {
        me.productGallery();
        $("a.viewer-color").on('click', function (e) {
            e.preventDefault();
            var color = $(this).attr("title");
            var imgUrl = $(this).attr("href");
            var pagePath = $("div#image-holder-360").attr("data-pathEn");

            $("iframe#iframe360").attr("src", "/Sites/Starkey/images/360" + pagePath + "/" + color + "/index.html");
        });
    };
    me.matchAside = function () {
        var aHeight = $('aside').height();
        var windowWidth = me.windowWidth();

        //     if (!($('body').hasId('fap')) || (windowWidth >= 1000)) {


        //    if  (windowWidth >= 1000) {
        if ($('body').attr('id') != 'fap' || windowWidth >= 1000) {
            $('section').css("min-height", aHeight);
        };

        //        if (windowWidth >= 1000) {
        //        	$('section').css("min-height", aHeight);
        //        };
    };
    me.setupEllipsis = function () {
        $.fn.extend({
            ellipsis: function (a, b) {
                return this.each(function () {
                    var el = $(this);

                    if (el.css('overflow') == 'hidden') {
                        var text = el.html();
                        var multiline = el.hasClass('multiline');
                        var t = $(this.cloneNode(true))
                            .hide()
                            .css('position', 'absolute')
                            .css('overflow', 'visible')
                            .width(multiline ? el.width() : 'auto')
                            .height(multiline ? 'auto' : el.height());

                        el.after(t);

                        var height = function () {
                            return t.height() > el.height();
                        };

                        var width = function () {
                            return t.width() > el.width();
                        };

                        var func = multiline ? height : width;

                        while (text.length > 0 && func()) {
                            text = text.substr(0, text.length - 1);
                            t.html(text + '...');
                        }

                        el.html(t.html());
                        t.remove();
                    }
                });
            }
        });

        $('.ellipsis').ellipsis();
    };
    me.adjustLayout = function () {
        if (me.windowWidth() >= 768) { // Changed from 1000

            var videoTab = me.GetURLParameter('tab');

            function updateTheAccordian(simulateClick) {
                $('#videos #accordion .item.default').toggleClass("active");
                $('#video-content-holder').css("min-height", $('#accordion').height() + 5);
                $('.item.active .panel').css("min-height", $('#accordion').height() + 3);

                // If a URL hash exists and it matches an ID on the page...
                if(videoTab && $('#'+videoTab.toLowerCase()).length != 0) {
                        simulateClick();
                }
            }

            // Update the accordian size, and send in
            // click event as a callback
            updateTheAccordian(function() {
                itemId = videoTab.toLowerCase();
                $('#'+itemId).click();
            });

            $('.imageContainer').find('a').addClass('modal');

            me.addIn360Viewer();
        } else {
            me.addInCarousel();
            $('.imageContainer').find('a').removeClass('modal');
        }
    };
    me.clickHandlers = function () {

        $("#nav").on('click', function () {
            $("#nav").toggleClass("open");
            $(".nav").toggleClass("open");
        });

        $(".nav-toggle").on('click', function () {
            $(".search-toggle").removeClass("open");
            $(".search form").removeClass("open");
            $(".nav-toggle").toggleClass("open");
            $(".nav-items").toggleClass("open");
        });

        // This adds a class to the header which will allow us to shift the background image position to hide the Starkey "notch".
        // 180802 NA: changed trigger class so this won't affect the new nav
        $(".old-toggle").on('click', function () {
            $("body > header").toggleClass("shift");
            $(".navbar-brand").toggle(); // hides the Starkey logo
        });

        $(".search-toggle").on('click', function () {
            $(".nav-toggle").removeClass("open");
            $(".nav-items").removeClass("open");
            $(".search-toggle").toggleClass("open");
            $(".search form").toggleClass("open");
        });

        $(".section-nav #title").on('click', function () {
            $(".section-nav #title").toggleClass("open");
            $(".section-nav .section-nav-container").toggleClass("open");
        });

        $('#accordion div.cta').on('click', function () {
            $(this).toggleClass("open");
            $(this).next('div').toggleClass("open");
        });

        $('#videos #accordion .item').on('click', function () {
            if (me.windowWidth() >= 768) { // Changed from 1000
                $(".item").removeClass("active");
                $(this).toggleClass("active");
                $('.item.active .panel').css("min-height", $('#accordion').height() + 3);
                $('.item.active .panel').css("top", -($('.item.active').position().top - 30));
                $('#video-content-holder').css("height", $('.item.active .panel').height());
            }
        });

        $(".touch .american-owned").on('click', function (e) {
            e.preventDefault();
            $(".touch .american-owned").toggleClass("show");
        });

        $('.contact').on('click', function () {
            var contactAccordion = $('li#contact-form.item');
            if (!contactAccordion.length) {
                return;
            }
            contactAccordion.find('.cta.form').toggleClass("open");
            contactAccordion.find('.panel').toggleClass("open");
            var navLoc = ((contactAccordion.offset().top) - 200);
            $('html,body').animate({ scrollTop: navLoc }, 'slow');
        });

        $('.language .choices').on('click', function () {
            $(this).toggleClass('active');
        });

        $('#submitform').on('submit', function () {
            $('#pro-submit').prop('disabled', true);
        });

        // Brazil Dealer Locator picker - on the pt_BR "find a professional" page
        // Hide and show dealer details based on the option selected from the picklist.
        if (document.documentElement.lang == 'pt-BR') {
            var locationDivs = $('#fap .location-wrap');
            $('.dealer-picker').on('change', function(){
                var selectedOption = $(this).val();
                locationDivs.removeClass('active');
                $('.location-wrap.' + selectedOption).toggleClass('active');
            });
        }

    };


    // MN 20150106 load right column video on video=y query string.
    // MN 20160219 vidid will click on the link with the id=vidid
    me.videoHandlers = function () {
        $(window).on('load', function () {
            if (window.location.search.indexOf("video=y") > -1) {
                var vid = 'a#' + me.GetURLParameter('vidid');
                $(vid).trigger("click")
            }
        });
    }
    me.domManipulation = function () {
        var nav = $('#nav');
        nav.css('display');
        nav.csswatch({
            props: 'display'
        }).on('css-change', function (event, change) {
            $(".open").removeClass("open");
        });

        var section = $('#fha.product-detail section');
        $(section.css('display'));
        section.csswatch({
            props: 'display'
        }).on('css-change', function (event, change) {
            window.location.reload();
        });

        $(".no-touch #fha #product-list li").mouseover(function () {
            if (me.windowWidth() >= 768) {
                $('img.hoverProductImage', this).show();
                $('img.defaultProductImage', this).hide();
            }
        }).mouseout(function () {
            if (me.windowWidth() >= 768) {
                $('img.defaultProductImage', this).show();
                $('img.hoverProductImage', this).hide();
            }
        });

        var FIREFOX = /Firefox/i.test(navigator.userAgent);
        $('.no-touch #fha.prg tbody tr td.header').hover(function () {
            var topValue = (-((($(this).find('span').height() + 20) / 2) - ((($(this).height() + 10)) / 2)));
            if (FIREFOX) {
                //topValue = ($(this).offset().top - $('.no-touch #fha.prg thead').height() + topValue);
            }

            $(this).find('span').css("top", topValue);
        });

        $('div.per-page select').change(function () {
            var baseUrl = document.location.protocol + '//' + document.location.host + document.location.pathname + "?";
            var queryString = '';
            var parms = document.location.search.substring(1).split('&');

            for (var i in parms) {
                var parm = parms[i].split('=');
                if (parm[0].toLowerCase() == 'searchterm') {
                    queryString = 'searchTerm=' + parm[1];
                }
            }
            queryString += '&pageNum=1&pageSize=' + $(this).val();
            document.location.href = baseUrl + queryString;
        });

        /* detect Veterans pages and add additional class to page */
        if (document.location.pathname.indexOf("/hearing-aids-for-veterans") == 0) {
            $('body').addClass('veterans');
        }

	$(".disabled-hyperlink").find("a").removeAttr("href");
	$(".disabled-hyperlink").removeAttr("href");

    };
    me.setupLeadershipModal = function () {
        $('.no-touch .mobile-expand-desktop-modal-trigger').each(function () {
            var primaryContent = $(this).html();
            if (primaryContent.length > 0) {
                $(this).find('.mobile-expand-desktop-modal-content').hide();
                $(this).on('click', function (e) {
                    $(this).colorbox({
                        html: '<span class="modal-content-robust">' + primaryContent + '</span>',
                        width: '80%',
                        scrolling: false,
                        onOpen: function () {
                            $('.modal-content-robust').find('.mobile-expand-desktop-modal-content').show();
                        }
                    });
                });
            }
        });
    };
    me.aboutStarkey = function () {
        // Shows hidden content as accordion in mobile and shows a modal on desktop
        if (!$('.mobile-expand-desktop-modal-trigger').length)
            return;

        $.fn.extend({
            toggleText: function (a, b) {
                if (this.html() == a) {
                    this.html(b);
                } else {
                    this.html(a);
                }
            }
        });

        $('.touch .mobile-expand-desktop-modal-trigger').each(function () {
            if (me.windowWidth() >= 600) {
                var primaryContent = $(this).html();
                if (primaryContent.length > 0) {
                    $(this).find('.mobile-expand-desktop-modal-content').hide();
                    $(this).on('click', function (e) {
                        $(this).colorbox({
                            html: '<span class="modal-content-robust">' + primaryContent + '</span>',
                            width: '80%',
                            onOpen: function () {
                                $('.modal-content-robust').find('.mobile-expand-desktop-modal-content').show();
                            }
                        });
                    });
                }
            } else {
                var cta = $(this).find('.cta'),
                    partialContent = $(this).find('.mobile-expand-desktop-modal-content *');
                $(partialContent).hide();
                $(this).on('click', function (e) {
                    e.preventDefault();
                    $(partialContent).toggle();
                    $(cta).toggleText('View Bio', 'Hide Bio');
                });
            }
        });

        me.setupLeadershipModal();
    };
    me.processVideoThumbnailsLeft = function () {
        var thumbImages = $(".video-aside .video-thumb img");
        if (thumbImages.length) {

            thumbImages.load(function () {
                me.processThumbImage($(this), 130);
            });

            $.each(thumbImages, function (index, image) {
                me.processThumbImage($(image), 130);
            });
        }
    };

    me.processVideoThumbnailsMain = function () {
        var thumbImages = $("ul.video-list .video-thumb img");
        if (thumbImages.length) {

            thumbImages.load(function () {
                me.processThumbImage($(this), 150);
            });

            $.each(thumbImages, function (index, image) {
                me.processThumbImage($(image), 150);
            });
        }
    };

// new processThumbImage -- MN 20151027
	me.processThumbImage = function (img, size) {
	var imgHeight = img.height();
	var imgWidth = img.width();


	if (imgHeight === 0 || imgWidth === 0) { // image has not been loaded yet, skip it
		return;
	}

	//var Aside = img.document.getElementById('thumb-test').parentElement.parentElement.parentElement.parentElement.classList.contains("video-aside");
	var aside = true;
	var pxsize = size + "px";

	if (imgHeight >= imgWidth) { // portrait / square image

		if (imgWidth < size) { // too narrow, make wider
			img.css("width", pxsize);
		} else {
			img.css("max-width", pxsize);
		}

	} else { // landscape image

		if (imgHeight < size) { // too short, make taller
			img.css("height", pxsize);
		} else {
			img.css("max-height", pxsize);
		}

	}
	// centering
	imgHeight = img.height();
	imgWidth = img.width();

	if (imgHeight > size) {
		img.css("margin-top", '-' + ((imgHeight - size) / 2) + 'px');
	}

	if (imgWidth > size) {
		img.css("margin-left", '-' + ((imgWidth - size) / 2) + 'px');
	}
/* new processThumbImage -- MN 20151027

    me.processThumbImage = function (img) {
        var imgHeight = img.height();
        var imgWidth = img.width();

        if (imgHeight === 0 || imgWidth === 0) { // image has not been loaded yet, skip it
            return;
        }

        if (imgHeight >= imgWidth) { // portrait / square image

            if (imgWidth < 150) { // too narrow, make wider
                img.css("width", "150px");
            } else {
                img.css("max-width", "150px");
            }

        } else { // landscape image

            if (imgHeight < 150) { // too short, make taller
                img.css("height", "150px");
            } else {
                img.css("max-height", "150px");
            }

        }


        // centering
        imgHeight = img.height();
        imgWidth = img.width();

        if (imgHeight > 150) {
            img.css("margin-top", '-' + ((imgHeight - 150) / 2) + 'px');
        }

        if (imgWidth > 150) {
            img.css("margin-left", '-' + ((imgWidth - 150) / 2) + 'px');
        }
        */
    };
    //#endregion

    //#region  Public Members
    sht.windowLoad = function () {
        me.navMenus();
        me.adjustLayout();
    };
    sht.documentReady = function () {
        me.setupColorBox(); // NEEDED FOR USE AND CARE
        me.setupVideoColorbox();
        me.matchAside();
        me.setupEllipsis();

        me.clickHandlers();
        me.videoHandlers();// MN 20150106 load right column video on video=y query string.
        me.domManipulation();
        me.columns();
        me.footerItems();
        me.aboutStarkey();
        me.processVideoThumbnailsLeft();
        me.processVideoThumbnailsMain();
        me.checkCampaign();
    };

    sht.resize = me.debounce(function () {
        me.navMenus();
        me.columns();
        me.footerItems();
        me.adjustLayout();
        //me.aboutStarkey();
    }, 200);

    sht.popVideo = function(imageID, VidContID, VidID) {
        var parentID = '#vid-container' + VidID;
        var el = $(imageID).parent().find(parentID);
        $(imageID).colorbox({ inline: true, href: el, opacity: 0.6, onClosed: function(){
            $(VidContID).empty();
        } });

        $(VidContID).empty();

        $(VidContID).append("<video id='" + VidID + "' data-video-id='" + VidID + "' data-account='2566261597001' data-player='i8tIKNh2lm' controls data-embed='default' class='video-js video-display'></video>");

        $.getScript("//players.brightcove.net/2566261597001/i8tIKNh2lm_default/index.min.js", function (data, textStatus, jqxhr) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = 'videojs("' + VidID + '").ready(function () { var myPlayer = this; \n myPlayer.on("loadedmetadata",function(){ \n lang = $("html").attr("lang") == "undefined" ? "en" : $("html").attr("lang"); \n lang = lang.substr(0, $.inArray("-", lang) != -1 ? $.inArray("-", lang) : lang.length); \n for (var i = 0; i < (myPlayer.textTracks().length) ; i++) { \n if (myPlayer.textTracks()[i].language == lang && lang !== "en") { \n myPlayer.textTracks()[i].mode = "showing"; } else { myPlayer.textTracks()[i].mode = "hidden"; }; } myPlayer.play(); }); })';
            $(VidContID).append(script);
        });
    }

    $('.video-link-js').on("click", function(){

        var imageID = $(this).attr("data-imageID"),
            VidContID = $(this).attr("data-vid-container"),
            VidID = $(this).attr("data-videoID"),
            videoWrapID = 'video-wrap' + (Math.floor(Math.random()*90000) + 10000),
            videoElement = $(this).next().find('.vid-container');


        // Create the video element within the vid-container of the link that was clicked.
        $(this).next().find('.vid-container').empty().append("<video id='" + videoWrapID + "' data-video-id='" + VidID + "' data-account='2566261597001' data-player='i8tIKNh2lm' controls data-embed='default' class='video-js video-display'></video>");

        // This needs to be re-worked. It calls the brightcove script everytime a video link is clicked
        $.getScript("//players.brightcove.net/2566261597001/i8tIKNh2lm_default/index.min.js", function (data, textStatus, jqxhr) {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.text = 'videojs("' + videoWrapID + '").ready(function() { ' +
                            'var myPlayer = this;' +
                            'myPlayer.on("loadedmetadata",function(){ ' +
                                'lang = $("html").attr("lang") == "undefined" ? "en" : $("html").attr("lang");' +
                                'lang = lang.substr(0, $.inArray("-", lang) != -1 ? $.inArray("-", lang) : lang.length);' +
                                'for (var i = 0; i < (myPlayer.textTracks().length) ; i++) {' +
                                    'if (myPlayer.textTracks()[i].language == lang && lang !== "en") { ' +
                                        'myPlayer.textTracks()[i].mode = "showing"; '+
                                    '} else { '+
                                        'myPlayer.textTracks()[i].mode = "hidden"; '+
                                    '}; '+
                                '}'+
                                'myPlayer.play(); '+
                            '}); '+
                        '});';
            $(VidContID).append(script);
        });
        // Use colorbox as the modal.
        $(imageID).colorbox({
            inline: true,
            href: videoElement,
            opacity: 0.6,
            onClosed: function(){
                videojs(videoWrapID).dispose();
                $(VidContID).empty();
            }
        });

    });


    //#region  Global Functions
    window.clearMe = function (formfield) {
        if (formfield.defaultValue == formfield.value) {
            formfield.value = "";
        }
    };
    window.returnMe = function (formfield) {
        if (formfield.value == "") {
            formfield.value = formfield.defaultValue;
        }
    };
    //#endregion

    $(window).load(function () {
        window.Starkey.Main.windowLoad();
    });

    $(function () {
        window.Starkey.Main.documentReady();
    });

    $(window).resize(function () {
        window.Starkey.Main.resize();
    });

})(jQuery, window, window.Starkey || (window.Starkey = {}));
