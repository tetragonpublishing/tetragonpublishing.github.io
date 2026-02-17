// Google Maps
function initialize() {
  var latlng = new google.maps.LatLng(51.54039047516868, -0.14271204359829426);
  var map = new google.maps.Map(document.getElementById('map_canvas'), {
    zoom: 14,
    center: latlng,
    disableDefaultUI: true,
    scaleControl: true,
    zoomControl: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
  new google.maps.Marker({
    position: latlng,
    map: map,
    icon: '/assets/img/marker.png',
    title: 'Tetragon'
  });
}

function loadScript() {
  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBmNn6HldGUbESi0i0ubVWWJ3bbrGuT2Wc&sensor=true&callback=initialize';
  document.body.appendChild(script);
}

// Contact form
$(document).ready(function() {
  $('input, textarea').removeAttr('disabled');
  $('#contact_name, #contact_enquiry, #contact_email, #contact_company').val('');
  $('#contact_res').hide();
  $('#contact_submit').show();

  $('#contact_submit').click(function() {
    if ($('#contact-form')[0].checkValidity()) {
      $('#contact_submit').hide();
      $('#contact_loader').show();
      $.ajax({
        type: 'POST',
        url: 'https://dev.tetragonpublishing.com/m',
        data: $('#contact-form').serialize(),
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        success: function(data) {
          if (!data.success) {
            alert(data.errors);
            $('#contact_submit').show();
          } else {
            $('#contact-form').hide();
            $('#contact_res').show();
            $('#contact_res').html('<p><span class="dropcap">T</span>hanks for your enquiry. We\'ll do our best to get back to you within a day.</p>');
          }
          $('#contact_loader').hide();
        }
      });
    } else {
      $('#contact-form')[0].reportValidity();
    }
    return false;
  });

  loadScript();
});
