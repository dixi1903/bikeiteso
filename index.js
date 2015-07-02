/*global $, jQuery, google, angular, geocoder*/

//https://developers.google.com/chart/interactive/docs/gallery/barchart

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
        colors: ["red", "green", "yellow", "blue"]
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
    data.setColumnLabel(1, "Total")

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
        title: "Llegada 9:00 am"
    };
    
    chart = new google.visualization.PieChart(document.getElementById("motivacionchart"));
    
    chart.draw(data, options);
}

function fillCarChart(response) {
    "use strict";
    
    var data, options, chart;
    
    data = response.getDataTable();
    
    window.alert(data.getValue(0, 0));
    
    options = {
        title: "¿Tienes auto?"
    };
 
    chart = new google.visualization.PieChart(document.getElementById("carchart"));
    
    chart.draw(data, options);
}

function fillHorarioChart(response) {
    "use strict";
    
    var table, data, options, chart;
    
    data = response.getDataTable();
    
    table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    
    options = {
        title: "Horario",
        isStacked: true 
    };
 
    chart = new google.visualization.BarChart(document.getElementById("horariochart"));
    chart.draw(data, options);
}

function fillRoutes(response) {
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
            
                totdis = totdis + google.maps.geometry.spherical.computeDistanceBetween(lociteso,  latlng);
                
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

var dblocation = "https://docs.google.com/spreadsheets/d/1ttm8HoES0jBq6SsAvBurAWb8UTi9E5csD-wUQWDHHpE/edit?usp=sharing";

function readData(queryClause) {
    "use strict";
    var query, selectQuery;
    
    window.alert(queryClause);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select I, J, G" + queryClause);
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
    query.setQuery("select R, count(B)" + queryClause + "  group by R");
    query.send(fillMotivChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select P, count(B)" + queryClause + "  group by P");
    query.send(fillMotivChart);
    
    query = new google.visualization.Query(dblocation);
    query.setQuery("select AF, AG where AG is not null");
    query.send(fillHorarioChart);
    
    var data = google.visualization.arrayToDataTable([
        ["Hora", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes"], 
        ["7:00 am", 8, 7, 6, 5, 4],
        ["9:00 am", 20, 22, 24, 14, 14],
        ["11:00 am", 9, 25, 27, 22, 12],
        ["1:00 pm", 18, 13, 16, 15, 8],
        ["3:00 pm", 8, 7, 6, 5, 4]
    ]);
    
    var options = {
        title: "Viajes por horario",
        chartArea: {width: "80%"},
        isStacked: false,
        hAxis: {
          title: "Horarios",
          minValue: 0,
        },
        vAxis: {
          title: 'City'
        }
      };
    
    var chart = new google.visualization.AreaChart(document.getElementById("horario1chart"));
    
    chart.draw(data, options);
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
    
    //readData("");
}

var app = angular.module('App', ['ngRoute']);

app.config(function ($routeProvider) {
    "use strict";
});

$(function() {
    $("#idaRegreso").change(function() {
        if ($(this).prop('checked')) {
            $("#lahora1").text("7:00 am");
            $("#lahora2").text("9:00 am");
            $("#lahora3").text("11:00 am");
            $("#lahora4").text("1:00 pm");
            $("#lahora5").text("3:00 pm");
        } else {
            $("#lahora1").text("1:00 pm");
            $("#lahora2").text("4:00 pm");
            $("#lahora3").text("6:00 pm");
            $("#lahora4").text("8:00 pm");
            $("#lahora5").text("10:00 pm");
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
                str = "3:00 am";
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
        
        column = "S";
        $('.lunes:checked').each(
            constructQuery
        );
        
        column = "T";
        $('.martes:checked').each(
            constructQuery
        );
        
        column = "U";
        $('.miercoles:checked').each(
            constructQuery
        );
        
        column = "V";
        $('.jueves:checked').each(
            constructQuery
        );
        
        column = "W";
        $('.viernes:checked').each(
            constructQuery
        );
    
        readData(strresult);
    });
});

google.maps.event.addDomListener(window, "load", initializeMap);

