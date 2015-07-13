/*global $, jQuery, google, angular, geocoder*/

//https://developers.google.com/chart/interactive/docs/gallery/barchart

var map, markers, directionsDisplay, colDia1, colDia2, colDia3, colDia4, colDia5;

colDia1 = "S";
colDia2 = "T";
colDia3 = "U";
colDia4 = "V";
colDia5 = "W";

markers = [];

function createMarkerButton(marker, person) {
    var table, row, cell0, cell1, cell2, cell3, cell4, cell5;

    table = document.getElementById("resultados");
    row = table.insertRow();
    cell0 = row.insertCell(0);
    cell1 = row.insertCell(1);
    cell2 = row.insertCell(2);
    cell3 = row.insertCell(3);
    cell4 = row.insertCell(4);
    cell5 = row.insertCell(5);

    cell0.innerHTML = person[0];
    cell1.innerHTML = person[1];
    cell2.innerHTML = person[2];
    cell3.innerHTML = person[3];
    cell4.innerHTML = person[4];
    cell5.innerHTML = person[5];
                                     
    google.maps.event.addDomListener(row, "click", function () {
        google.maps.event.trigger(marker, "click");
    });
}

function createMarker(origin, person) {
    
    var marker, infoWnd;
    
    infoWnd = new google.maps.InfoWindow();
    
    marker = new google.maps.Marker({
        title: person[0],
        position: origin,
        map: map,
        animation: google.maps.Animation.DROP
    });

    google.maps.event.addListener(marker, "click", function () {
        infoWnd.setContent("<strong>" + person[0] + "</strong><br>" +
                            person[1] + "<br>" +
                            person[2] + "<br>" +
                            person[3] + "<br>" +
                            person[4] + "<br>" +
                            person[5] + "<br>");
        infoWnd.open(map, marker);
    });
            
    return marker;
}

function generateRoute(origin, destination) {
    "use strict";
    
    var directionsService, directionsDisplay, request;
    
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
 
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
        title: "Genero"
    };
    
    chart = new google.visualization.PieChart(document.getElementById("generochart"));
    
    chart.draw(data, options);
}

function fillCarreraChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    data.setColumnLabel(1, "Total");
    
    options = {
        title: "Carrera",
        bar: {groupWidth: "95%"}
    };
    
    chart = new google.visualization.BarChart(document.getElementById("carerachart"));
    
    chart.draw(data, options);
}

function fillSemestreChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    data.setColumnLabel(1, "Total");

    options = {
        title: "Semestre",
        colors: ["red", "yellow", "blue"],
        vAxis: {format: '0'},
        hAxis: {format: '0'}
    };
    
    chart = new google.visualization.BarChart(document.getElementById("semestrechart"));
    
    chart.draw(data, options);
}

function fillMunChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
        title: "Municipio"
    };
    
    chart = new google.visualization.PieChart(document.getElementById("municipiochart"));
    
    chart.draw(data, options);
}

function fillAlt1Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    data.setColumnLabel(1, "Total");

    options = {
        title: "Primera altenativa de transporte"
    };
    
    chart = new google.visualization.BarChart(document.getElementById("atl1chart"));
    
    chart.draw(data, options);
}

function fillAlt2Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    data.setColumnLabel(1, "Total");

    options = {
        title: "Segunda altenativa de transporte"
    };
    
    chart = new google.visualization.BarChart(document.getElementById("atl2chart"));
    
    chart.draw(data, options);
}

function fillAlt3Chart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    data.setColumnLabel(1, "Total");

    options = {
        title: "Tercera altenativa de transporte"
    };
    
    chart = new google.visualization.BarChart(document.getElementById("atl3chart"));
    
    chart.draw(data, options);
}

function fillMotivChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();

    options = {
        title: "Motivación",
        isStacked: "True"
    };
    
    chart = new google.visualization.BarChart(document.getElementById("motivacionchart"));
    
    chart.draw(data, options);
}

function fillCarChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    
    options = {
        title: "¿Tienes auto?"
    };
 
    chart = new google.visualization.PieChart(document.getElementById("carchart"));
    
    chart.draw(data, options);
}

function fillHorarioIdaChart(response) {
    "use strict";
    
    var table, data, options, chart;
    
    data = response.getDataTable();
    
    options = {
        title: "Ida al ITESO",
        isStacked: true
    };
 
    chart = new google.visualization.BarChart(document.getElementById("horarioIdachart"));
    chart.draw(data, options);
}

function fillHorarioRegresoChart(response) {
    "use strict";
    
    var table, data, options, chart;
    
    data = response.getDataTable();
    
    options = {
        title: "Regreso del ITESO",
        isStacked: true
    };
 
    chart = new google.visualization.BarChart(document.getElementById("horarioRegresochart"));
    chart.draw(data, options);
}

function fillRoutes(response) {
    "use strict";
    var data, bikestotal, i, personinfo, name, street, colonia, lociteso,  zip, municipio, phone, direccion1, direccion2, geocoder, lociteso, num, totdis, avrdis;
    
    initializeMap();
    $("#resultados tr").remove();
    
    if (response.isError()) {
        window.alert(response.getMessage());
    }
    
    data = response.getDataTable();
    bikestotal = data.getNumberOfRows();
    geocoder = new google.maps.Geocoder();
    totdis = 0;
    
    $("#bikesTotal").text("Numero: " + bikestotal);

    lociteso = new google.maps.LatLng(20.6089747, -103.4145574);
    
    for (i = 0; i < bikestotal; i++) {
            
        name = data.getValue(i, 0);
        street = data.getValue(i, 1);
        colonia = data.getValue(i, 2);
        zip = data.getValue(i, 3);
        municipio = data.getValue(i, 4);
        phone = data.getValue(i, 5);
        direccion1 = "+" + data.getValue(i, 3) + "+" + data.getValue(i, 4) + "+" + data.getValue(i, 1);
        direccion2 = "+" + data.getValue(i, 4) + "+" + data.getValue(i, 1);

        personinfo = [name, street, colonia, zip, municipio, phone, direccion1, direccion2];

        (function (person) { geocoder.geocode({address: person[6]}, function (results, status) {
            var lat, lng, latlng, found, marker;

            if (status === google.maps.GeocoderStatus.OK) {

                lat = results[0].geometry.location.lat();
                lng = results[0].geometry.location.lng();

                if ((lat > 20.0 && lat < 21.0) && (lng > -104.0 && lng < -103.0)) {
                    latlng = new google.maps.LatLng(lat, lng);
                    found = true;
                } else {
                    found = false;
                }


            } else {
                window.alert("Geocode was not successful for the following reason: " + status);
            }

            if (found) {

                totdis = totdis + google.maps.geometry.spherical.computeDistanceBetween(lociteso,  latlng);
                generateRoute(lociteso,  latlng);
                marker = createMarker(latlng, person);
                markers.push(marker);
                createMarkerButton(marker, person);
                
                $("#distTotal").text("Distancia total: " + totdis + " km");

            } else {

                geocoder.geocode({ address: person[7]}, function (results, status) {
                    var lat, lng, latlng, found;

                    if (status === google.maps.GeocoderStatus.OK) {

                        lat = results[0].geometry.location.lat();
                        lng = results[0].geometry.location.lng();

                        if ((lat > 20.0 && lat < 21.0) && (lng > -104.0 && lng < -103.0)) {
                            latlng = new google.maps.LatLng(lat, lng);
                            found = true;
                        } else {
                            found = false;
                        }

                    } else {
                        window.alert("Geocode was not successful for the following reason: " + status);
                    }

                    if (found) {

                        totdis = totdis + google.maps.geometry.spherical.computeDistanceBetween(lociteso,  latlng);
                        generateRoute(lociteso,  latlng);
                        marker = createMarker(latlng, person);
                        markers.push(marker);
                        createMarkerButton(marker, person);
                    }
                });
            }
            });  })(personinfo);
        
    }
}

var dblocation = "https://docs.google.com/spreadsheets/d/1ttm8HoES0jBq6SsAvBurAWb8UTi9E5csD-wUQWDHHpE/edit?usp=sharing";

function readData(queryClause) {
    "use strict";
    var query, selectQuery;
    
    if (queryClause === "") {
        queryClause = " where B is not null";
    }
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select B, G, H, I, J, K" + queryClause);
    query.send(fillRoutes);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select C, count(B)" + queryClause + " group by C");
    query.send(fillGenChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select E, count(B)" + queryClause + "  group by E");
    query.send(fillCarreraChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select F, count(B)" + queryClause + "  group by F");
    query.send(fillSemestreChart);
        
    query = new google.visualization.Query(dblocation);
    query.setQuery("select J, count(B)" + queryClause + "  group by J");
    query.send(fillMunChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select M, count(B)" + queryClause + "  group by M");
    query.send(fillAlt1Chart);

    query = new google.visualization.Query(dblocation);
    query.setQuery("select N, count(B)" + queryClause + "  group by N");
    query.send(fillAlt2Chart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select O, count(B)" + queryClause + "  group by O");
    query.send(fillAlt3Chart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select P, count(B)" + queryClause + "  group by P");
    query.send(fillCarChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select sum(AF), sum(AG), sum(AH), sum(AI), sum(AJ), sum(AK), sum(AL), sum(AM) where B is not null");
    query.send(fillMotivChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select AN, AO, AP, AQ, AR, AS, AT, AU, AV limit 5");
    query.send(fillHorarioIdaChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select AN, AW, AX, AY, AZ, BA, BB, BC, BD limit 5");
    query.send(fillHorarioRegresoChart);
}

function initializeMap() {
    "use strict";
    
    var mapCanvas, mapOptions, geocoder, latlng, addresses, i,
        count, locations, markers;
    mapCanvas = document.getElementById("map-canvas");
    mapOptions = {
        center: new google.maps.LatLng(20, -103),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    
}

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    "use strict";
});

$(function () {
    $("#idaRegreso").change(function () {
        if ($(this).prop('checked')) {
            colDia1 = "S";
            colDia2 = "T";
            colDia3 = "U";
            colDia4 = "V";
            colDia5 = "W";
        } else {
            colDia1 = "X";
            colDia2 = "Y";
            colDia3 = "Z";
            colDia4 = "AA";
            colDia5 = "AB";
        }
    });
});

$(document).ready(function () {
    "use strict";
    
    $('.acb').click(function () {
        if ($(this).is(':checked')) {
            $(".cb").prop("checked", true);
        } else {
            $(".cb").prop("checked", false);
        }
    });

    $('.alunes').click(function () {
        if ($(this).is(':checked')) {
            $(".lunes").prop("checked", true);
        } else {
            $(".lunes").prop("checked", false);
        }
    });
    
    $('.amartes').click(function () {
        if ($(this).is(':checked')) {
            $(".martes").prop("checked", true);
        } else {
            $(".martes").prop("checked", false);
        }
    });

    $('.amiercoles').click(function () {
        if ($(this).is(':checked')) {
            $(".miercoles").prop("checked", true);
        } else {
            $(".miercoles").prop("checked", false);
        }
    });
    
    $('.ajueves').click(function () {
        if ($(this).is(':checked')) {
            $(".jueves").prop("checked", true);
        } else {
            $(".jueves").prop("checked", false);
        }
    });
    
    $('.aviernes').click(function () {
        if ($(this).is(':checked')) {
            $(".viernes").prop("checked", true);
        } else {
            $(".viernes").prop("checked", false);
        }
    });
    
    $('#lhora1').click(function () {
        if ($(this).is(':checked')) {
            $(".hora1").prop("checked", true);
        } else {
            $(".hora1").prop("checked", false);
        }
    });
   
    $('#lhora2').click(function () {
        if ($(this).is(':checked')) {
            $(".hora2").prop("checked", true);
        } else {
            $(".hora2").prop("checked", false);
        }
    });
    
    $('#lhora3').click(function () {
        if ($(this).is(':checked')) {
            $(".hora3").prop("checked", true);
        } else {
            $(".hora3").prop("checked", false);
        }
    });
    
    $('#lhora4').click(function () {
        if ($(this).is(':checked')) {
            $(".hora4").prop("checked", true);
        } else {
            $(".hora4").prop("checked", false);
        }
    });
    
    $('#lhora5').click(function () {
        if ($(this).is(':checked')) {
            $(".hora5").prop("checked", true);
        } else {
            $(".hora5").prop("checked", false);
        }
    });
    
    $('#lhora6').click(function () {
        if ($(this).is(':checked')) {
            $(".hora6").prop("checked", true);
        } else {
            $(".hora6").prop("checked", false);
        }
    });
    
    $('#lhora7').click(function () {
        if ($(this).is(':checked')) {
            $(".hora7").prop("checked", true);
        } else {
            $(".hora7").prop("checked", false);
        }
    });
    
    $('#lhora8').click(function () {
        if ($(this).is(':checked')) {
            $(".hora8").prop("checked", true);
        } else {
            $(".hora8").prop("checked", false);
        }
    });
    
    
    $("#buscar").click(function () {
        var strresult, column;
        
        function valuetoTimeStr(value) {
            var str;
            
            switch (value) {
            case "1":
                str = "7:00 am";
                break;

            case "2":
                str = "9:00 am";
                break;

            case "3":
                str = "11:00 am";
                break;

            case "4":
                str = "1:00 pm";
                break;

            case "5":
                str = "3:00 pm";
                break;
                    
            case "6":
                str = "6:00 pm";
                break;
                    
            case "7":
                str = "8:00 am";
                break;
                    
            case "8":
                str = "10:00 am";
                break;
            }
            
            return str;
        }
        
        function constructQuery() {
            var  time;
            
            time = valuetoTimeStr($(this).val());
 
            if (strresult || strresult !== "") {
                strresult = strresult + " or " + column + " = '" + time + "'";
            } else {
                strresult = " where " + column + " = '" + time + "'";
            }
        }
        
        strresult = "";
        
        column = colDia1;
        $('.lunes:checked').each(
            constructQuery
        );
        
        column = colDia2;
        $('.martes:checked').each(
            constructQuery
        );
        
        column = colDia3;
        $('.miercoles:checked').each(
            constructQuery
        );
        
        column = colDia4;
        $('.jueves:checked').each(
            constructQuery
        );
        
        column = colDia5;
        $('.viernes:checked').each(
            constructQuery
        );
    
        readData(strresult);
    });
});

google.maps.event.addDomListener(window, "load", initializeMap);

