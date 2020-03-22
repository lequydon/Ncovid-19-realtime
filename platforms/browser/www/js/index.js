/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
//main code
$(document).ready(function(){
    $.ajax({
        url:'https://corona.lmao.ninja/countries',
        type: "get",
        success: function (data) { 
            create(data);
        }
    })
    function create(data) {
        // console.log(data);
        $("#map").kendoMap({
            center: [50.000, 0],
            zoom: 2,
            layers: [{
                style: {
                    fill: {
                        color: "#7cc3eb"
                    },
                    stroke: {
                        color: "#FFFFFF"
                    }
                },
                type: "shape",
                dataSource: {
                    type: "geojson",
                    transport: {
                        read: {
                            dataType: "json",
                            url: "https://raw.githubusercontent.com/telerik/kendoui-northwind-dashboard/master/html/Content/dataviz/map/countries-users.geo.json"
                        }
                    }
                }
            }],
            shapeCreated: onShapeCreated,
            click: onClick,
            shapeFeatureCreated: onShapeFeatureCreated,
            shapeClick: onShapeClick
        });
        var flag=0;
        function onShapeCreated(e){
            for(i in data){
                if(e.shape.dataItem.properties.name=="United States of America")
                e.shape.dataItem.properties.name="USA"
                if(e.shape.dataItem.properties.name=="United Kingdom")
                e.shape.dataItem.properties.name="UK"
                if(data[i].country==e.shape.dataItem.properties.name){
                    if(data[i].cases>0 && data[i].cases<1000)
                    {
                        var shape = e.shape;
                        shape.options.set("fill.color", "#0588d2");
                    }
                    if(data[i].cases>=1000)
                    {
                        var shape = e.shape;
                        shape.options.set("fill.color", "#006ca9");
                    }
                    
                }
            }
            
        }
        function onShapeClick(e){
            flag=1;
            for(i in data){
                if(e.shape.dataItem.properties.name=="United States of America")
                e.shape.dataItem.properties.name="USA"
                if(e.shape.dataItem.properties.name=="United Kingdom")
                e.shape.dataItem.properties.name="UK"
                if(data[i].country==e.shape.dataItem.properties.name){
                    $("#country").text(data[i].country);
                    $("#casesText").text(data[i].cases);
                    $("#deaths_text").text(data[i].deaths);
                    $("#recovered_text").text(data[i].recovered);
                    $("#todayCases_text").text(data[i].todayCases);
                    $("#todayDeaths_text").text(data[i].todayDeaths);
                    $("#critical_text").text(data[i].critical);
                }
            }
            
        };
        function onClick(e){
            console.log(flag);
            if(flag==0){
                $.ajax({
                    url:'https://corona.lmao.ninja/all',
                    type: "get",
                    success: function (data) { 
                        $("#casesText").text(data.cases);
                        $("#deaths_text").text(data.deaths);
                        $("#recovered_text").text(data.recovered);
                    }
                })
            }else
            flag=0;
            
        };
        function onClick(e){

        }
        function onShapeFeatureCreated(e) {
            for(i in data ){
                
                if(e.properties.name=="United States of America")
                e.properties.name="USA"
                if(e.properties.name=="United Kingdom")
                e.properties.name="UK"
                if(data[i].country==e.properties.name){
                    
                    e.group.options.tooltip = {
                        content: "<h4>"+data[i].country+"</h4><div>Ca nhiễm(cases):"+data[i].cases+"</div><div>Tử vong(deaths):"+data[i].deaths+"</div><div>Chữa khỏi(recovered):"+data[i].recovered+"</div>",
                        position: "cursor",
                        offset: 10,
                        width: 160
                    };
                if(data[i].country=="Vietnam"){
                    $(".vietNamDetail #casesText").text(data[i].cases);
                    $(".vietNamDetail #deaths_text").text(data[i].deaths);
                    $(".vietNamDetail #recovered_text").text(data[i].recovered);
                    $(".vietNamDetail #todayCases_text").text(data[i].todayCases);
                    $(".vietNamDetail #todayDeaths_text").text(data[i].todayDeaths);
                    $(".vietNamDetail #critical_text").text(data[i].critical);
                }
                    // break;
                }
            }
            
        } 
        $("#chartContry").kendoChart({
            theme: "flat",
            title: {
                position: "bottom"
            },
            legend: {
                visible: false
            },
            chartArea: {
                background: ""
            },
            seriesDefaults: {
                type: "donut",
                startAngle: 150
            },
            series: [{
                data: [{
                    category: data[0].country,
                    value: data[0].cases
                }, {
                    category: data[1].country,
                    value: data[1].cases
                }, {
                    category: data[2].country,
                    value: data[2].cases
                }]
            }],
            tooltip: {
                visible: true,
                template: "#= category #: #=kendo.toString(value)#"
            }
        });
    } 
    
    $.ajax({
        url:'https://corona.lmao.ninja/all',
        type: "get",
        success: function (data) { 
            $("#casesText").text(data.cases);
            $("#deaths_text").text(data.deaths);
            $("#recovered_text").text(data.recovered);
        }
    })
})