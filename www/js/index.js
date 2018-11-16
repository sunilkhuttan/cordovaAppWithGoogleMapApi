var allAddress = []

function initAutocomplete() {
        var markers = [];
    var map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {lat: -37.8136, lng: 144.9631},
      zoom: 8,
      mapTypeId: 'roadmap'
    });
    var infowindow = new google.maps.InfoWindow();

    var geocoder = new google.maps.Geocoder();
    var addressDiv = document.getElementById('address');

    google.maps.event.addListener(map, 'click', function(event) {
      clearMarkers();
      placeMarker(event.latLng);
      //alert(event.latLng);
      var lati = event.latLng.lat();
      var longi = event.latLng.lng();
      allAddress.push({lat: event.latLng.lat(), long: event.latLng.lng()});
      var currentAdd = "";
      geocoder.geocode({
        'latLng': event.latLng
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            //currentAdd
            addressDiv.innerHTML = results[0].formatted_address;
            addressDiv.style.display = "block";
            //alert(results[0].formatted_address);
            allAddress.push({address : results[0]});
          }
        }
      });
    });

    // google.maps.event.addListener(map, 'zoom_changed', function(event) {
    //   infowindow.setContent('Zoom: ' + map.getZoom());
    //   var zoom = event.Geocoder;
    // });

    // map.addListener('zoom_changed', function() {
    //   infowindow.setContent('Zoom: ' + map.getZoom());
    // });
    
    function placeMarker(location) {
        var marker = new google.maps.Marker({
            position: location, 
            map: map
        });

        markers.push(marker);
    }

    function clearMarkers() {
      setMapOnAll(null);
    }

    function setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }
    
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }

      });
      map.fitBounds(bounds);
    });



  }

  function getLocationsData() {
    console.log(allAddress);
    // fs.writeFile("./locationsData.json", JSON.stringify(allAddress), (err) => {
    //   if (err) {
    //       console.error(err);
    //       return;
    //   };
    //   console.log("File has been created");
    // });
  }