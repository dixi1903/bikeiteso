/*global $, jQuery, google, angular, geocoder*/

//https://developers.google.com/chart/interactive/docs/gallery/barchart

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

function setLocationsinMap() {
    "use strict";
    var mapCanvas, mapOptions, map, location, marker;
    
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
    
        
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fixlocation, showError);
    }
}


var map;

function generateRoute(origin, destination) {
    "use strict";
    
    var directionsService, directionsDisplay, request;
    
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
 
    request = {
        origin: origin,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.WALKING
    };
    
    directionsDisplay.setMap(map);
    directionsService.route(request, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}


function fillGenChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Genero'
    };
    
    chart = new google.visualization.PieChart(document.getElementById('generochart'));
    
    chart.draw(data, options);
}

function fillCarreraChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
        title: 'Carrera',
        bar: {groupWidth: "95%"}    
    };
    
    chart = new google.visualization.BarChart(document.getElementById("carerachart"));
    
    chart.draw(data, options);
}

function fillSemestreChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    window.alert(data.getValue(0, 0) + " " + data.getValue(0, 1));
    options = {
          title: 'Semestre'
    };
    
    chart = new google.visualization.BarChart(document.getElementById('semestrechart'));
    
    chart.draw(data, options);
}

function fillMunChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Municipio'
    };
    
    chart = new google.visualization.PieChart(document.getElementById('municipiochart'));
    
    chart.draw(data, options);
}

function fillAlt1Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Primera altenativa de transporte'
    };
    
    chart = new google.visualization.BarChart(document.getElementById('atl1chart'));
    
    chart.draw(data, options);
}

function fillAlt2Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Segunda altenativa de transporte'
    };
    
    chart = new google.visualization.BarChart(document.getElementById('atl2chart'));
    
    chart.draw(data, options);
}

function fillAlt3Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Tercera altenativa de transporte'
    };
    
    chart = new google.visualization.BarChart(document.getElementById('atl3chart'));
    
    chart.draw(data, options);
}


function fillMotivChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
          title: 'Llegada 9:00 am'
    };
    
    chart = new google.visualization.PieChart(document.getElementById('motivacionchart'));
    
    chart.draw(data, options);
}

function fillCarChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    
    options = {
          title: '¿Tienes auto?'
    };
 
    chart = new google.visualization.PieChart(document.getElementById('carchart'));
    
    chart.draw(data, options);
}

function handleQueryResponse(response) {
    "use strict";
    var data, count, i, direccion, geocoder, lociteso, num, totdis, avrdis;
    
    if (response.isError()) {
        window.alert(response.getMessage());
    }
    
    data = response.getDataTable();
    count = data.getNumberOfRows();
    geocoder = new google.maps.Geocoder();
    totdis = 0;

    geocoder.geocode({ address: "+ITESO,+Tlaquepaque"}, function (results, status) {
        var lat, lng;

        if (status === google.maps.GeocoderStatus.OK) {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
            lociteso = new google.maps.LatLng(lat, lng);
        } else {
            window.alert("Geocode was not successful for the following reason: " + status);
        }
  
        for (i = 0; i < count; i++) {
            
            direccion = "+" + data.getValue(i, 0) + "+" + data.getValue(i, 1) + "+" + data.getValue(i, 2);

            geocoder.geocode({ address: direccion}, function (results, status) {
                var lat, lng, latlng;

                if (status === google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    lng = results[0].geometry.location.lng();
                    latlng = new google.maps.LatLng(lat, lng);
                } else {
                    window.alert("Geocode was not successful for the following reason: " + status);
                }
            
                totdis = totdis + google.maps.geometry.spherical.computeDistanceBetween (lociteso,  latlng);
                
                if (i > 0) {
                    generateRoute(lociteso,  latlng);
                }
            });
        }
        
        //window.alert("Total: " + count);
        //window.alert("Distancia total: " + totdis/1000 + " km");
        //window.alert("Distancia promedio: " + (totdis/1000)/count + " km");
    });
}

function readData() {
    "use strict";
    var query, selectQuery;
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select H, AB, AD'); 
    query.send(handleQueryResponse);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select C, count(B) group by C');
    query.send(fillGenChart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select E, count(B) group by E');
    query.send(fillCarreraChart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select F, count(B) group by F');
    query.send(fillSemestreChart);
        
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select AB, count(B) group by AB');
    query.send(fillMunChart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select J, count(B) group by J');
    query.send(fillAlt1Chart);

    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select K, count(B) group by K');
    query.send(fillAlt2Chart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select L, count(B) group by L');
    query.send(fillAlt3Chart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select Q, count(B) group by Q');
    query.send(fillMotivChart);
    
    query = new google.visualization.Query('https://docs.google.com/spreadsheets/d/1hv-FF22PjBIO2_pcc8ks8VmI98chnMOmHvzkpw7CKQE/edit?usp=sharing');
    query.setQuery('select M, count(B) group by M');
    query.send(fillCarChart);

}

function initializeMap() {
    "use strict";
    
    var mapCanvas, mapOptions, geocoder, latlng, addresses, i,
        count, locations, markers;
    mapCanvas = document.getElementById('map-canvas');
    mapOptions = {
        center: new google.maps.LatLng(20, -103),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    
    readData();
}


var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    "use strict";
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
});


google.maps.event.addDomListener(window, 'load', initializeMap);

