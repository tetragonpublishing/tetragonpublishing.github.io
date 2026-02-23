/* ==========================================================================
   Tetragon Publishing — contact.js
   Vanilla JS. No frameworks.
   ========================================================================== */
(function() {
  'use strict';

  // Google Maps
  function initialize() {
    var latlng = new google.maps.LatLng(51.54039047516868, -0.14271204359829426);
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
      zoom: 14,
      center: latlng,
      disableDefaultUI: true,
      scaleControl: true,
      zoomControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      mapId: 'DEMO_MAP_ID'
    });
    var markerImg = document.createElement('img');
    markerImg.src = '/assets/img/marker.png';
    new google.maps.marker.AdvancedMarkerElement({
      position: latlng,
      map: map,
      content: markerImg,
      title: 'Tetragon'
    });
  }

  // Expose callback for Google Maps async load
  window._initMap = initialize;

  // Load Google Maps script
  function loadMapScript() {
    var script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBmNn6HldGUbESi0i0ubVWWJ3bbrGuT2Wc&callback=_initMap&libraries=marker&loading=async';
    document.body.appendChild(script);
  }

  // Contact form
  var form = document.getElementById('contact-form');
  if (!form) return;

  var submitBtn = document.getElementById('contact_submit');
  var loader = document.getElementById('contact_loader');
  var result = document.getElementById('contact_res');

  // Enable all inputs and clear fields
  form.querySelectorAll('input, textarea').forEach(function(el) {
    el.removeAttribute('disabled');
  });
  ['contact_name', 'contact_enquiry', 'contact_email', 'contact_company'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.value = '';
  });

  if (result) result.style.display = 'none';
  if (submitBtn) submitBtn.style.display = '';

  if (submitBtn) {
    submitBtn.addEventListener('click', function(e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.style.display = 'none';
      if (loader) loader.style.display = '';

      fetch('https://dev.tetragonpublishing.com/m', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams(new FormData(form)).toString()
      })
      .then(function(response) { return response.json(); })
      .then(function(data) {
        if (!data.success) {
          alert(data.errors);
          submitBtn.style.display = '';
        } else {
          form.style.display = 'none';
          if (result) {
            result.style.display = 'block';
            result.innerHTML = '<p><span class="dropcap">T</span>hanks for your enquiry. We\'ll do our best to get back to you within a day.</p>';
          }
        }
        if (loader) loader.style.display = 'none';
      })
      .catch(function() {
        alert('An error occurred. Please try again.');
        submitBtn.style.display = '';
        if (loader) loader.style.display = 'none';
      });
    });
  }

  // Load the map
  loadMapScript();
})();
