// add absolute positioned empty divs for browsers without multiple bgs
// ## this is now unnecessary
// $(".no-multiplebgs body").prepend('<div class="nobg-header"/>').append('<div class="nobg-footer"/>');

/* fading links */
jQuery.fn.fadeToOriginal = function(settings) {
	settings = jQuery.extend({
		duration: 300
		}, settings);
	$(this).animate({ color: $(this).data('originalColour') },settings.duration, function() {
    	if ($(this).data('originalAttr') == null) {
    		$(this).css('color','');	// wipe the attribute instead of fixing it in the style override, if there never was one
    	}
    	$(this).removeClass('sel');
    });
};
	
jQuery.fn.dwFadingLinks = function(settings) {
  settings = jQuery.extend({
    color: '#ff8c00',
    duration: 300,
    ignoreClass: 'sel'
  }, settings);
  return this.each(function() {
    $(this).data('originalColour', $(this).css('color'));
    $(this).data('originalAttr', $(this).attr('color'));
    $(this).mouseover(function() {
    	if (!($(this).hasClass(settings.ignoreClass))) {
    		$(this).css('cursor','pointer');
        	$(this).animate({ color: settings.color },settings.duration); 
    	}
    	else {
    		$(this).css('cursor','default');
    	}
    });
    $(this).mouseout(function() { 
    	if (!($(this).hasClass(settings.ignoreClass))) {
    		$(this).css('cursor','pointer');
        	$(this).fadeToOriginal(settings);
    	}
    	else {
    		$(this).css('cursor','default');
    	}
    });
  });
};

jQuery.fn.bgTransparency = function(settings) {
  settings = jQuery.extend({
    duration: 300
  }, settings);
  return this.each(function() {
    $(this).mouseover(function() { $(this).animate({ opacity: 0.3 },settings.duration); });
    $(this).mouseout(function() { $(this).animate({ opacity: 0.6 },settings.duration); });
  });
};

jQuery.fn.createMail = function () {
    var atsign = / собачка /;
    var dot = / точка /g;
    this.each(function () {
      var addr = $(this).text().replace(atsign, "@").replace(dot, ".");
      var title = $(this).attr('title');
      $(this).after('<a title="' + title + '" href="mailto:' + addr + '?Subject=' + title + '">' + addr + '</a>')
             .remove();
    });
};

// fixes for ie7 and below
// $("html.lt-ie8 div.orbit-caption p").each((function() { $(this).css('bottom', '-30px').css('background', 'black');}) ); 

function findLast(element, pattern, callback) {
    for (var childi = element.childNodes.length; childi-->0;) {
        var child = element.childNodes[childi];
        if (child.nodeType == 1) {
            findLast(child, pattern, callback);
        } else if (child.nodeType == 3) {
            var lastIndex = child.data.lastIndexOf(pattern);
            if (lastIndex !== -1) {
                callback.call(window, child, child.data.substr(lastIndex, pattern.length));
            }
        }
    }
}
// add end of article block

// ---- DROPCAPS BECAUSE CSS FIRST-LETTER SELECTOR HAS TROUBLE WITH HEIGHTS
$(".bodytext").each(function() {
	$(this).find('p:first').html(function() { 
	    if ($(this).html().trim().substr(0,1) == "<") {
		$(this).find(">:first-child").html(($(this).children(1).html().replace(/[ ]*([A-Za-z\?])(.*)/g, "<span class='dropcap'>$1</span>$2")));

		return $(this).html();
	    }
	    else {
		return($(this).html().replace(/[ ]*([A-Za-z\?])(.*)/g, "<span class='dropcap'>$1</span>$2"));
	    }
	});
	$(this).find('p:last').html(function() { 
	// get last word from text
	      var lastWord = (/.*[\s-](\S+)/.exec($(this).text())[1]);
	      // this instead of $(this) as we're switching out of jQuery mode
	      findLast(this, lastWord, function(node, match) {
	        var lastWordSpan = document.createElement('span');
	        lastWordSpan.className= 'article-end';
	        var lastWordNode = node.splitText(node.data.lastIndexOf(match));
	        lastWordSpan.appendChild(lastWordNode);
	        // create a span for the end block
	        var endBlockSpan = document.createElement('span');
	        endBlockSpan.className = 'article-end-block';
	        lastWordSpan.appendChild(endBlockSpan);
	        node.parentNode.insertBefore(lastWordSpan, node.nextSibling);
	      });
	    });  
});

// NAV FADING LINKS //
$('#main-nav div a').dwFadingLinks({
  color: '#A01714', // tetragon red
  duration: 300
});


// ---- SERVICES PAGE ----- /
$("article.services .dropdown").hide();
$("article.services .services-list h2").css('cursor','pointer')
	.dwFadingLinks({
	    color: '#A01714', // tetragon red
	    duration: 300
	})
	.click(
        function() {
        	$(this).next().slideToggle();
        }
	);

	// activate fading links
  $('.pic-grid li').bgTransparency({
    duration: 300
  });
  // set up modals
  $('.pic-grid li').click(function() {
	  $('#pic-grid-slides').trigger('orbit.goto', $(this).index());
	  $('#pic-grid-modal').reveal({
	     animation: 'fade',                   //fade, fadeAndPop, none
	     animationspeed: 300,                       //how fast animtions are
	     closeonbackgroundclick: true,              //if you click background will modal close?
	     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
	  });
  });
  $('.start-ebook-slides').click(function() {
	  $('#ebook-slides').trigger('orbit.goto', 0);
	  $('#ebook-modal').reveal({
	     animation: 'fade',                   //fade, fadeAndPop, none
	     animationspeed: 300,                       //how fast animtions are
	     closeonbackgroundclick: true,              //if you click background will modal close?
	     dismissmodalclass: 'close-reveal-modal'    //the class of a button or element that will close an open modal
	  });
  });
  // start the slides
  $('#pic-grid-slides').orbit({
  	 animation: 'horizontal-push',                  // fade, horizontal-slide, vertical-slide, horizontal-push
     animationSpeed: 800,                // how fast animtions are
     timer: false, 			 // true or false to have the timer
     // advanceSpeed: 4000, 		 // if timer is enabled, time between transitions 
     // pauseOnHover: false, 		 // if you hover pauses the slider
     // startClockOnMouseOut: false, 	 // if clock should start on MouseOut
     // startClockOnMouseOutAfter: 1000, 	 // how long after MouseOut should the timer start again
     directionalNav: true, 		 // manual advancing directional navs
     captions: true, 			 // do you want captions?
     captionAnimation: 'slideOpen', 		 // fade, slideOpen, none
     captionAnimationSpeed: 800, 	 // if so how quickly should they animate in
     bullets: false,			 // true or false to activate the bullet navigation
     bulletThumbs: false,		 // thumbnails for the bullets
     bulletThumbLocation: '',		 // location from this file where thumbs will be
//     afterSlideChange: function(){}, 	 // empty function 
     fluid: true                         // or set a aspect ratio for content slides (ex: '4x3')   
     });
  $('#ebook-slides').orbit({
  	 animation: 'horizontal-push',                  // fade, horizontal-slide, vertical-slide, horizontal-push
     animationSpeed: 800,                // how fast animtions are
     timer: false, 			 // true or false to have the timer
     directionalNav: true, 		 // manual advancing directional navs
     captions: true, 			 // do you want captions?
     captionAnimation: 'slideOpen', 		 // fade, slideOpen, none
     captionAnimationSpeed: 800, 	 // if so how quickly should they animate in
     bullets: false,			 // true or false to activate the bullet navigation
     bulletThumbs: false,		 // thumbnails for the bullets
     bulletThumbLocation: '',		 // location from this file where thumbs will be
     fluid: true                         // or set a aspect ratio for content slides (ex: '4x3')   
     });

// ------ CLIENTS PAGE -------- //

function setWorking(state) {
	// to track bits that are clickable so we don't queue up rubbish
	$("body").data('working', state);
}
function isWorking() {
	return $("body").data('working');
}
// numbered pagination
jQuery.fn.swapToTabPage = function(settings) {
	  settings = jQuery.extend({
		    duration: 400,
		    affectGlobalWorking: true,
		    fade: true
	}, settings);
  	var outPage = $(this).parent().find("dd[class$=_sel]").data("page");
	$(this).parent().find("dd[class$=_sel]").attr('class',
		(($(this).parent().find("dd[class$=_sel]").attr('class').replace(/(.*)(nav-page-[0-9]+)_sel(.*)/,"$1$2$3"))));
    var mainId = $(this).parent().attr("id").match(/[^-]+-(.+)/)[1];
    var curElem = $(this);	// to access $(this) in the callback later
    $(this).attr('class',($(this).attr('class').replace(/(.*)(nav-page-[0-9]+)(.*)/,"$1$2_sel$3")));
    // fadeOut current, fadeIn the next
    if (settings.fade) {
        $("#" + mainId + " .page-"+ outPage).fadeOut(settings.duration, function() {
        	$("#" + mainId + " .page-" + curElem.data("page")).fadeIn(settings.duration, function() {
        		if (settings.affectGlobalWorking) {
            		setWorking(false);
        		}
        	});
        });
    }
    else {
        $("#" + mainId + " .page-"+ outPage).hide();
        $("#" + mainId + " .page-" + curElem.data("page")).show();
    }
}
jQuery.fn.numberedTabHandler = function(settings) {
  settings = jQuery.extend({
    duration: 400
  }, settings);
  return this.each(function() {
    $(this).click(function() {
    	if (!isWorking() && (!$(this).attr('class').match(/(.*)(nav-page-[0-9]+)_sel(.*)/))) {
    		setWorking(true);
//////////////////////////////////////////
        	$(this).swapToTabPage(settings);
        }
    });
  });
  return false;
};

// show the first full client page, 1st numbered page
jQuery.fn.activatePage = function(settings) {
	settings = jQuery.extend({
		duration: 400
    }, settings);
	if (!isWorking() && !$(this).hasClass('sel')) {
		setWorking(true);
		$("dl.clients-list dd.sel").fadeToOriginal(); // fade old selected main nav back to normal text
		$(this).addClass('sel');
		// fade everything else out first, and in the callback fade in
		var curElem = $(this);
		// fade out existing elements:
		
		// this belongs in fadeOut
		// unset "active-nav, act synchronously with the page
		$(".active-nav").fadeOut(settings.duration, function() {
			$(this).removeClass("active-nav");
			// swap all tab pages back to 1 for later
			$("dl.client-nav dd:first-child").each(function() {
				$(this).swapToTabPage( { affectGlobalWorking: false, fade: false } );	// don't turn off waiting state
			});
		});
		// if there's no active-page, just fade in; there's nothing to fade out
		if ($(".active-page").length == 0) {
			curElem.fadeBackIn(settings);
		}
		else {
    		$(".active-page").fadeOut(settings.duration, function() {
    			// fade in at callback
    			$(this).removeClass("active-page");	// unset "active-page"
    			curElem.fadeBackIn(settings);
    		});
    	}
	}
};
jQuery.fn.fadeBackIn = function(settings) {
    $("#" + $(this).data("client") + " .page-1").show();	// show instantly, since parent container is hidden
    $("#nav-" + $(this).data("client")).fadeIn(settings.duration);	// show nav buttons
    var curElem = $(this); 
    $("#" + $(this).data("client")).fadeIn(settings.duration, function() {	// fade in parent container
    	// callback (technically either could fade in first, but should be the same for our purposes)
    	$("#" + curElem.data("client")).addClass("active-page");
    	$("#nav-" + curElem.data("client")).addClass("active-nav");
    	setWorking(false);
    });
    $(this).parent().find('.sel').removeClass("sel");
    $(this).addClass("sel");
    $(this).css('cursor','');
}
jQuery.fn.pageHandler = function() {
	return this.each(function() {
        $(this).click(function() {
           	$(this).activatePage();
        });
	});
}

// hide everything (with JS so non-JS browsers can see everything)
$("dl.clients-list dd").each(function() {
	$("#" + $(this).data("client")).hide();
	$("#nav-" + $(this).data("client")).hide();	// page numbers
});
$("section [class^=page-]").hide();


// set the working state to allow clicks
setWorking(false);

//load the handlers for the main client nav
$("dl.clients-list dd")
	.css('cursor','pointer')	// only enabled for JS
	.dwFadingLinks({
	    color: '#A01714', // tetragon red
	    duration: 300,
	    ignoreClass: 'sel'
	})
	.pageHandler();
$('dl.client-nav dd').numberedTabHandler();
// on page load, load in the 1st page
$("dl.clients-list dd:first").each(function() {
	$(this).activatePage();
});

///////////////////////////////////////////////////////
// HOME / ABOUT PAGE

$('#home-slides').orbit({
  animation: 'horizontal-push',                  // fade, horizontal-slide, vertical-slide, horizontal-push
  animationSpeed: 1000,                // how fast animtions are
  timer: false, 			 // true or false to have the timer
  advanceSpeed: 8000, 		 // if timer is enabled, time between transitions 
  pauseOnHover: true, 		 // if you hover pauses the slider
  directionalNav: true, 		 // manual advancing directional navs
  captions: false, 			 // do you want captions?
  bullets: false,			 // true or false to activate the bullet navigation
  bulletThumbs: false,		 // thumbnails for the bullets
  bulletThumbLocation: '',		 // location from this file where thumbs will be
  fluid: true                         // or set a aspect ratio for content slides (ex: '4x3')   
});

/////////// FOUC /////////////
// remove the fouc class from html
$('html.fouc').removeClass('fouc');
$('span.enc-mail').createMail();

// SOCIAL MEDIA (after FOUC) //////////////
$('#social-media').sharrre({
 share: {
  googlePlus: true,
  facebook: true,
  twitter: true,
  digg: true
 },
 enableTracking: true,
 buttons: {
  googlePlus: {size: 'tall'},
  facebook: {layout: 'box_count'},
  twitter: {count: 'vertical', via: '_tetragon'},
  digg: {type: 'DiggMedium'}
 },
 hover: function(api, options){
  $(api.element).find('.buttons').show();
 },
 hide: function(api, options){
  $(api.element).find('.buttons').hide();
 },
 urlCurl: '/s'
});