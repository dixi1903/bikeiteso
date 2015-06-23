/*global $, jQuery, google, angular, geocoder*/

function showError(error) {
    "use strict";
    switch (error.code) {
    case error.PERMISSION_DENIED:
        window.alert("User denied the request for Geolocation.");
        break;
    case error.POSITION_UNAVAILABLE:
        window.alert("Location information is unavailable.");
        break;
    case error.TIMEOUT:
        window.alert("The request to get user location timed out.");
        break;
    case error.UNKNOWN_ERROR:
        window.alert("An unknown error occurred.");
        break;
    }
      
}

function initializeMap() {
    "use strict";
    var mapCanvas, mapOptions, map, location, marker;
    
    //addresses = ["+44620,+Guadalajara", "+44260,+Guadalajara"];
    
    function fixlocation(position) {
        location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        mapCanvas = document.getElementById('map-canvas');
        mapOptions = {
            center: location,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        
        map = new google.maps.Map(mapCanvas, mapOptions);
        marker = new google.maps.Marker({position: location, map: map, title: "You are here!"});
    }
    
   /* function fixlocations(position) {
        var i, b, lat, lng, address;
        
        locations = [];
        
        for (i = 0, b = addresses.length; i < b; i++) {
            
            address = addresses[i];
            
            geocoder.geocode({ 'address': address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    locations[i] = new google.maps.LatLng(lat, lng);
                } else {
                    window.alert("Geocode was not successful for the following reason: " + status);
                }
            });
        }
    }*/
        
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fixlocation, showError);
    }
}



var map;

function generateRoute (origin, destination) {
    "use strict";
    
    var directionsService, directionsDisplay, request;
    
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
 
    request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    directionsDisplay.setMap(map);
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

function setLocationsinMap() {
    "use strict";
    
    var mapCanvas, mapOptions, geocoder, latlng, addresses, i, count, locations, markers;
    mapCanvas = document.getElementById('map-canvas');
    mapOptions = {
        center: new google.maps.LatLng(20, -103),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    addresses = ["+ITESO,+Tlaquepaque", "+44620,+Guadalajara", "+44950,+Guadalajara"];
    locations = [];
    geocoder = new google.maps.Geocoder();
    
    count = addresses.length;
    for (i = 0; i < count; i++) {
        geocoder.geocode({ address: addresses[i]}, function (results, status) {
            var lat, lng;

            if (status === google.maps.GeocoderStatus.OK) {
                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();
                latlng = new google.maps.LatLng(lat, lng);
                locations[i] = latlng;
            } else {
                window.alert("Geocode was not successful for the following reason: " + status);
            }
            
            if (i > 0) {
               generateRoute( new google.maps.LatLng(20, -103),  latlng);
            }    
                
            
            new google.maps.Marker({position: latlng, map: map, title: "You are here!"});
        });
    }
    
    
    
    /*count = addresses.length;
    for (i = 1; i < count; i++) {
        generateRoute (locations[i], locations[0]);
    }*/
}





//var address = "+44620,+Guadalajara";

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {

});

var SensorControllers = app.controller("SensorControllers", function ($scope) {
    "use strict";
    $scope.Temperatura = 11.56;
    $scope.Altitud = 1550;
    $scope.Humedad = 54;
    $scope.Presion = 811.3;
    $scope.Position = "20°39′58″N 103°21′07″O";
    
    //WatchPosition
    navigator.geolocation.watchPosition(function (pos) {
        initializeMap();
        $scope.$apply(function () {
            $scope.Position = pos.coords.latitude + "," + pos.coords.longitude;
        }, showError);
    });
    
    //myQOBject.PositionChanged.
    
});


google.maps.event.addDomListener(window, 'load', setLocationsinMap);

