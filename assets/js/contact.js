  <!-- jQuery validation -->
  $("#contact-form").validationEngine({promptPosition : "topRight", scroll: false});
  <!-- !jQuery validation -->

  <!-- Google Maps -->
function initialize() {
  var tetragonLatlng = new google.maps.LatLng(51.54039047516868, -0.14271204359829426);   
// var tetragonLatlng = new google.maps.LatLng(51.528455, -0.138439);
  // var tetragonLatlng = new google.maps.LatLng(51.53730, -0.13004); 
  //var tetragonLatlng = new google.maps.LatLng(51.535019, -0.139323); 
  var map = new google.maps.Map(document.getElementById("map_canvas"), {
    zoom: 14,
    center: tetragonLatlng,
    disableDefaultUI: true, // quickly hide all controls
    scaleControl: true,
    zoomControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  var tetragonMarker = new google.maps.Marker({
   position: tetragonLatlng,
   map: map,
   icon: '/assets/img/marker.png',
   title: 'Tetragon'
  });
}
function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBmNn6HldGUbESi0i0ubVWWJ3bbrGuT2Wc&sensor=true&callback=initialize";
  document.body.appendChild(script);
}
<!-- Google Maps -->

// CONTACT FORM
$(document).ready(function(){
	    // init
	  $('input, textarea').removeAttr('disabled');
	  $('#contact_name, #contact_enquiry, #contact_email, #contact_company').val('');
	  $('#contact_res').hide();
	  $('#contact_submit').show();
	  
	  $('#res a').click(function(){
	    $('input, textarea').removeAttr('disabled');
	    $('#contact_name, #contact_enquiry, #contact_email, #contact_company').val('');
	    $('#contact_res').hide();
	    $('#contact_submit').show();
	    return false;
	  });
	  
	  // form validation
	  $("#contact_submit").click(function() {
	    if ($('#contact-form').validationEngine('validate')) {
          $('#contact_submit').hide();
	      $('#contact_loader').show();
	      $.ajax({
		  type: "POST",
		  url: "https://dev.tetragonpublishing.com/m",
		  data: $('#contact-form').serialize(),
		  headers: {'X-Requested-With': 'XMLHttpRequest'},
		  success: function(data) {
		    	  if (!data.success) {
		    		  alert(data.errors);
		    		  // only show submit if they need to try again
		              $('#contact_submit').show();
		    	  }
		    	  else {
		    		  $('#contact-form').hide();
		    		  $('#contact_res').show();
		    		  $('#contact_res').html('<p><span class="dropcap">T</span>hanks for your enquiry. We\'ll do our best to get back to you within a day.</p>');
		    	  }
	              $('#contact_loader').hide();
		      }
	      });
	    }
	    return false;
	  });
	  loadScript();
  });
//!CONTACT FORM
