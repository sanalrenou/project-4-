//load map 
var map;
var markers = [];
var initMap = function() {
    // Create a styles array to use with the map.
    var styles = [{
        featureType: 'water',
        stylers: [{
            color: '#19a0d8'
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.stroke',
        stylers: [{
            color: '#ffffff'
        }, {
            weight: 6
        }]
    }, {
        featureType: 'administrative',
        elementType: 'labels.text.fill',
        stylers: [{
            color: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -40
        }]
    }, {
        featureType: 'transit.station',
        stylers: [{
            weight: 9
        }, {
            hue: '#e85113'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'labels.icon',
        stylers: [{
            visibility: 'off'
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
            lightness: 100
        }]
    }, {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
            lightness: -100
        }]
    }, {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [{
            visibility: 'on'
        }, {
            color: '#f0e4d3'
        }]
    }, {
        featureType: 'road.highway',
        elementType: 'geometry.fill',
        stylers: [{
            color: '#efe9e4'
        }, {
            lightness: -25
        }]
    }];

    // displays the required area on the map
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 28.613939,
            lng: 77.209021
        },
        zoom: 12,
        styles: styles

    });
    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < places.length; i++) {
        // Get the position from the places array.
        var position = places[i].location;
        var title = places[i].name;
    }

    var largeInfowindow = new google.maps.InfoWindow();
    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < places.length; i++) {
        // Get the position from the location array.
        var position = places[i].location;
        var title = places[i].name;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Store the marker as a property of the place
        places[i].marker = marker;

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            var mark = this;
            populateInfoWindow(this, largeInfowindow);
            toggleBounce(this);
            setTimeout(function() {
                mark.setAnimation(null);
            }, 1000);
        });;
    }


    document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + marker.position + '</div>');
        infowindow.open(map, marker);


        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    }
}

// This function will loop through the markers array and display them all.
function showListings() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

function visiblemarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}


function visible() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

var loaddata = function(place) {


    var venue_id = place.venue_id;
    var client_id = "LGHIIR3H5N4LB4X5GLRZOWCVWTP5DPAFBA4NZH02GG2BKWJE";
    var client_secret = "KY3VVWMVCCPZLDKVVYUSWJIZ0JXNZIHVCXX3S5PCRERYMEYP";
    var FoursquareUrl = "https://api.foursquare.com/v2/venues/" + venue_id + "?client_id=" + client_id + "&client_secret=" + client_secret + "&v=20130815";

    $.ajax({
        url: FoursquareUrl,
        dataType: "json",
        async: true
    }).success(function(data) {
        console.log(data);

        place.name = data.response.venue.name;
        place.rating = data.response.venue.rating;

        if (place.rating !== undefined) {
            place.rating = data.response.venue.rating;
        } else {
            place.rating = 'Not Avaliable';
        }
        console.log(place.name);
        console.log(place.rating);
        var image_prefix = data.response.venue.bestPhoto.prefix;
        var image_suffix = data.response.venue.bestPhoto.suffix;

        console.log(image_prefix + "320x200" + image_suffix);
        var imag = image_prefix + "320x200" + image_suffix;
		var lastinfowindow = null;
        var infowindow = new google.maps.InfoWindow();

        infowindow.setContent('<div>' + '<h5>' + place.name + '</h5>' + ' <p>' + place.rating + '</p>' + "<img src=" + imag + ">" + '</div>');
		if(lastinfowindow === infowindow){
			infowindow.close();
			lastinfowindow = null;
		}else{
			infowindow.open(map, place.marker);
			lastinfowindow = infowindow;
		}

        
    }).fail(function(error) {
        infoWindow.setContent('<div>' + '<h3> FourSquare API could not be accessed at this time.</h3>' + '</div>');
        infoWindow.open(map);
    });

};


function googleError() {
    alert(' Google Maps API ERROR. Please try again later');
}



var viewModel = function() {
    var self = this;
    this.markersArray = ko.observableArray([]);
    this.query = ko.observable();

    // filters the places array when searched in a query input
    this.searchResults = ko.computed(function() {
        q = self.query();
        if (!q) {
            visible();
            return places;
        } else {
            hideListings();
            return ko.utils.arrayFilter(places, function(place) {
                if (place.name.toLowerCase().indexOf(q) >= 0) {

                    place.marker.setMap(map);
                    return place;

                }
            });
        }
    });

    // when name of the location clicked displays infowindow
    this.viewPlace = function(place) {
        new google.maps.event.trigger(place.marker, 'click');
        loaddata(place);
    };




};




var vm = new viewModel();
ko.applyBindings(vm);
