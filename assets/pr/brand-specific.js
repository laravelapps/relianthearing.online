$(document).ready(function(){
    // needs to be brand specific becuase of the id in the Chat Now URL

    // An object to hold the values for the chat now window so it can be maintained in one location so multiple chat pop ups can exist on one page
	var chatNowWindow = {
        URL: "https://a5.websitealive.com/1529/visitor/window/?code_id=167&dl=" + escape(document.location.href),
        name: "wsa_1529_676",
        specs: "height=200,width=200"
	};

	// Chat Now in the main nav.
    $('li.chat a').on('click', function (e) {
        e.preventDefault();
        window.open(chatNowWindow.URL, chatNowWindow.name, chatNowWindow.specs);
        utag.link({
            "event_name": "chat",
            "event_category": "chat",
            "event_label": "chat",
            "ga_event_category": "chat",
            "ga_event_action": "chat",
            "ga_event_label": "chat"
        });
    });

    // get a url parameter
    function getURLParameter(name) {
      return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
    }

    // collect only the parameters we want - schedule an appointment
    // urlParam property must match the id of the intended input field
    var urlParam = {
        appointment_disposition: getURLParameter('appointment_disposition'),
        campaign_activity: getURLParameter('campaign_activity'),
        campaign_response_type: getURLParameter('campaign_response_type'),
        owner: getURLParameter('owner'),
        source_campaign: getURLParameter('source_campaign')
    };

    var StarkeyParams = StarkeyParams || {};
    StarkeyParams.getQueryParams = {
        init: function(theFormClass) {
            this.bind(theFormClass);
        },
        bind: function(formClass) {
            // populate the Schedule an Appointment form fields based on URL query params
            for (var propertyName in urlParam) {
                // Iterate over urlParam properties
                if (urlParam.hasOwnProperty(propertyName) && urlParam[propertyName] !=null) {
                    // If the property exists and isn't empty
                    // create a dynamic jquery selector
                    var formInputField = formClass + ' #' + propertyName;

                    // set the value of the input field to the queryParam value
                    $(formInputField).attr('value', urlParam[propertyName]);
                }
            }
        }
    };

    StarkeyParams.getQueryParams.init('.js_scheduleAppointmentForm');

    /* Briteverify real time email validation */ /*
    -- Form must have js_validateFormFields
    -- Email input must have js_emailvalidate
    */
    // When the user leaves an input field, trim any leading and trailing spaces
    $('.js_validateFormFields input').on('blur', removeInputSpaces);

    // When the user leaves the email input field, run the real time email validation
    $('.js_validateFormFields .js_emailvalidateInput').on('blur', realTimeEmailValidate);


    // initialize emailAddressValid as false
    var emailAddressValid = 0;

    function realTimeEmailValidate(){
        var $this = $(this);

        $this.removeClass('error-emailvalidate');
        $('.invalid-email').removeClass('error-invalid');
        // If email field is empty...
        if($this.val() == '') {
            // if it is not required...
            if(!$this.hasClass('requiredField')) {
                // let it be valid
                emailAddressValid = 1;
            }
            // exit so validation does not run
            return;
        } else {
            // validate the email address
            var realTimeEmail = {
                emailAddress: $this.val(),
                apikey: 'chris_gould' // username from the Email Service goes in request url
            }
            $(document)
                .ajaxStart(function () {
                    // dont allow form to submit while ajax is processing request
                    $('.js_validateFormFields input[type=submit]').prop("disabled", true);
                })
                .ajaxStop(function () {
                    $('.js_validateFormFields input[type=submit]').prop("disabled", false);
            });
            $.ajax({
                url: 'https://bpi.briteverify.com/emails.json?address=' + realTimeEmail.emailAddress + '&username=' + realTimeEmail.apikey,
                dataType: "jsonp",
                success: function(data) {
                    if (data.status == 'invalid') {
                        // bad email address
                        // add a class to the input field
                        emailAddressValid = 0;
                        $this.addClass('error-emailvalidate');
                        $this.siblings().css('color', 'red');
                        $('.invalid-email').addClass('error-invalid');
                    } else {
                        //valid email adddress
                        $this.siblings().css('color', '#000');
                        emailAddressValid = 1;
                    }
                }
            });
        }
    }; // End Briteverify Real Time Email Validation

    // ~~ Custom Phone Validation ~~
    function phonePattern() {
        $(this).removeClass('error-field');
        // at least 7 digits, up to 20 inclusive, numbers only
        var phoneRegEx = /^\d{7,20}$/;
        if(!phoneRegEx.test($(this).val())) {
            $(this).addClass('error-field');
        }

    }
    $('.validateIntlPhone').on('blur',phonePattern);
    $('.validateIntlPhone').on('keypress',function(e) {
        // only allow numbers to be typed
        if (!(e.keyCode >= 48 && e.keyCode <= 57)) {
            e.preventDefault();
        }
    });
    // ~~ End Custom Phone Validation ~~

    // run the inputFieldsKeyup function on all required fields in the form
    $('.scheduleAppointmentForm .requiredField').each(inputFieldsKeyup);

    $('.scheduleAppointmentForm').submit(function(event){
        appointmentPref();
        $('.scheduleAppointmentForm .requiredField').each(function(){
            $(this).removeClass('error-field');
            if($(this).val() ==  ''){
                $('.error-message').addClass('active');
                $(this).addClass('error-field');
                event.preventDefault();
            }
            // handle required checkboxes separately
            if($(this).attr('type') == "checkbox"){
                if(!$(this).prop('checked')) {
                    $('.error-message').addClass('active');
                    $(this).addClass('error-field');
                    event.preventDefault();
                }
            }
        });
        // If email is not required and is empty, let it be valid
        var theEmailField = $('.js_validateFormFields .js_emailvalidateInput');
        if(theEmailField.val() == '' && !theEmailField.hasClass('requiredField')) {
            emailAddressValid = 1;
        }
        // Validate email, required or not
        if(emailAddressValid == 0){
            event.preventDefault();
        }
    });

    function inputFieldsKeyup(){
        $(this).on('keyup input', function(evnt){
            // do not check input fields if tab or shift key are pressed.
            if(evnt.keyCode != 9 && evnt.keyCode != 16){
                if($(this).val() != ''){
                    $(this).removeClass('error-field');
                } else {
                    $(this).addClass('error-field');
                }
            }
            // Checking phone number field for length.
            if($(this).attr('id') == 'phone_number' && $(this).val().length != 14) {
                $(this).addClass('error-field');
            }
        });
    }

    // Add an active class and remove the active class from siblings
    $('.appt-pref .btn-list li').on('click', theActiveClass);

    function appointmentPref(){
        // if no day or time is picked
        // add error class to appointment container
        $('.appt-pref').removeClass('error-field');
        var errorFlag = false;
        $('.appt-pref ul').each(function() {
            if($(this).find('li.active').length == 0 && !$(this).hasClass('not-required')) {
                $(this.closest('.appt-pref')).addClass('error-field');
                errorFlag = true;
            }
        });
        if(errorFlag) {
            event.preventDefault();
        }
    }

    function removeInputSpaces(){
        return $(this).val($.trim($(this).val()));
    }
    function theActiveClass(){
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        // Fill the Contact Notes box if it exists
        if($('.scheduleAppointmentForm .js_contactnotes').length) {
            $('.scheduleAppointmentForm .js_contactnotes').val(getAppointmentInfo);
        } else {
            // We still need to run this to set the preferred day and time,
            // even if the contact notes box does not exist.
            getAppointmentInfo();
        }
    }
    function getAppointmentInfo(){
        var commentsSection = 'Preferred appointment time: ';
        var dayName,
            dayTime,
            dayNum,
            dayTimeNum;
        $('.appt-pref .btn-list li.active').each(function(){
            if($(this).attr('data-dayname')){
                dayName = $(this).attr('data-dayname');
                dayNum = $(this).attr('data-daynum');
                // set this value in the right hidden input field
                if($("input[data-preferred='preferred_day']").length) { // All non-US
                    $("input[data-preferred='preferred_day']").attr('value', dayNum);
                } else { // US only
                    $('input#preferred_day').attr('value', dayNum);
                }

            }
            if($(this).attr('data-daytime')){
                dayTime = $(this).attr('data-daytime');
                dayTimeNum = $(this).attr('data-daytimeNum');
                // set this value in the right hidden input field
                if($("input[data-preferred='preferred_time']").length) { // All non-US
                    $("input[data-preferred='preferred_time']").attr('value', dayTimeNum);
                } else { // US only
                    $('input#preferred_time').attr('value', dayTimeNum);
                }
            }
            commentsSection = 'Preferred appointment time: ' + dayName +' '+ dayTime;
        });
        return commentsSection;
    }

    $('.js-sap-opt-option').change(function() {
        $(".js-sap-opt-option-final").val($(this).val());
    });

    // detect scroll
    function onScroll(){
      var scrollPos = $(document).scrollTop();
      var windowWidth = $(window).width();
      // $(".three-tier .bottom-tier").css("opacity", 1 - scrollPos / 250);

      if (windowWidth > 991 && scrollPos > 40) {
        $(".three-tier").addClass("scrolling");
      } else {
        $(".three-tier").removeClass("scrolling");
      }
    }

    // fire function on load to catch nav position issues
    onScroll();

    $(document).on("scroll", onScroll);

    // Remove toggle from fat footer nav if larger than mobile view
    if ($(window).width() > 767) {
        $(".fat-footer .col-sm-3 h4 a").removeAttr("data-toggle");
        $(".fat-footer .col-sm-3 ul").removeClass("collapse");
    }
});

// Timeline History
// js Reveal
var timelineYearContainer = {
    reset: true,
    rotate: {x:12,y:32},
    viewOffset: {top:64}
};

// This will set the height of a parent container that contains absolutely positioned content.
// The absolutely positioned content will be placed on the page based on the heights of all other content.
// Namespace the Timeline code
var TimeLineStructure = TimeLineStructure || {};
TimeLineStructure.setHeights = {
    init: function(parentContainer,leftColumn,rightColumn) {
        this.bind(parentContainer,leftColumn,rightColumn);
    },
    bind: function(parentEl,rightCol,leftCol) {
        var rightColumnHeight,
            leftColumnHeight,
            curTopLeft,
            curTopRight;

        $(parentEl).each(function(){
            curTopLeft = 0; // reset to 0 for every tl-time-container
            curTopRight = 0; // reset to 0 for every tl-time-container
            rightColumnHeight = 0;
            leftColumnHeight = 0;

            // eek this could be 1 function
            $(this).find(rightCol).each(function(){
                rightColumnHeight = rightColumnHeight + $(this).height();
                $(this).css('top', curTopRight);
                var currentElHeight = $(this).height();

                // Add 20 so there is more space between content
                curTopRight = curTopRight + currentElHeight + 20;
            });
            $(this).find(leftCol).each(function(){
                leftColumnHeight = leftColumnHeight + $(this).height();
                $(this).css('top', curTopLeft);
                var currentElHeight = $(this).height();

                // Add 20 so there is more space between content
                curTopLeft = curTopLeft + currentElHeight + 20;
            });
            if(rightColumnHeight > leftColumnHeight){
                $(this).css('height',rightColumnHeight);
            } else {
                $(this).css('height',leftColumnHeight);
            }
        });
    }
};

// Cache selectors
var theWindow = $(window),
    timelineLastId,
    timelineTopMenu = $(".tl-fixed-nav"),
    topMenuHeight = timelineTopMenu.outerHeight() + 1,
    // All list items
    timelineMenuItems = timelineTopMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = timelineMenuItems.map(function() {
        var item = $($(this).attr("href"));
        if (item.length) {
            return item;
        }
    });

// Bind click handler to menu items
// so we can get a fancy scroll animation
timelineMenuItems.click(function(e) {
    var href = $(this).attr("href"),
        offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
    $('html, body').stop().animate({
        scrollTop: offsetTop
    }, 850);
    e.preventDefault();
});

// Only load this scroll event on the timeline page.
// EnableScroll has been set to true on the timeline page.
if (window.TimelineEnableScroll) {
    // Bind to scroll
    $(window).scroll(function(){
       // Get container scroll position
       var fromTop = $(this).scrollTop()+topMenuHeight;

       // Get id of current scroll item
       var cur = scrollItems.map(function(){
         if ($(this).offset().top < fromTop)
           return this;
       });
       // Get the id of the current element
       cur = cur[cur.length-1];
       var id = cur && cur.length ? cur[0].id : "";

       if (timelineLastId !== id) {
           timelineLastId = id;
           // Set/remove active class
           timelineMenuItems
             .parent().removeClass("active")
             .end().filter("[href=\\#"+id+"]").parent().addClass("active");
       }
    });

    //Function to fix the decades menu at a certain distance from the top
    var setMenuPosition = function() {
        var scrollTop     = theWindow.scrollTop(),
            tlContainer   = $('#tl-timeline'),
            elementOffset = tlContainer.offset().top,
            distance      = (elementOffset - scrollTop),
            topValue      = 176;
            if (distance <= topValue) {
                timelineTopMenu.addClass('tl-fixed');
            }
            if (distance > topValue) {
                timelineTopMenu.removeClass('tl-fixed');
            }
    }

    // Use window on load becuase of timing with loading the images on the page.... looking at you safari.
    $(window).on('load', function(){
        // Pass the parent container class, right column class, and left column class
        // Call this function with the desired breakpoint
        TimeLineStructure.checkWindowWidth.init(767);
        // Apply ScrollReveal after content has loaded
        sr.reveal(".tl-time-frame .tl-year-container", timelineYearContainer);
        sr.reveal(".tl-time-frame .year-circle", timelineYearContainer);
        sr.reveal(".tl-break-inner", timelineYearContainer);
        sr.reveal(".tl-logo-slideshow", timelineYearContainer);

        //Make the timeline visible (opaque) after load
        $('.tl-container').addClass('tl-visible');
    });

    //Reset the fixed nav menu's position depending
    //on the timeline container's vertical position,
    //both when the page loads and when the window
    //is scrolled
    theWindow.on('load scroll', function() {
        setMenuPosition();
    });

    //Logo Slideshow
    function tlSlideshow(){
      var active = $('#tl-logo-slideshow .active');
      var next = (active.next().length > 0) ? active.next() : $('#tl-logo-slideshow img:first');
      next.css('z-index',2);
      active.fadeOut(800,function(){
          active.css('z-index',1).show().removeClass('active');
          next.css('z-index',3).addClass('active');
      });
    }
    $(document).ready(function() {
        setInterval('tlSlideshow()',4000);
    });

    //Remove the loading bar on page load
    $(document).ready(function() {
        $('.tl-loading').fadeOut(800);
    });
}
TimeLineStructure.checkWindowWidth = {
    // Pass a breakpoint width to this function and then run that
    init: function(timelineBreakPoint) {
        $(window).bind('resize', function(){
            if($(window).width() > timelineBreakPoint){
                TimeLineStructure.setHeights.init('.tl-time-container','.tl-wide-col','.tl-skinny-col');
            }
        }).resize();
    }
};
