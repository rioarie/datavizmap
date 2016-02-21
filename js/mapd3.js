/*global d3, sharedObject */
    "use strict";

    var margin ={top:20, right:30, bottom:30, left:40},
    width=450-margin.left - margin.right, 
    height=250-margin.top-margin.bottom;



    // var xAxis = d3.svg.axis()
    //     .scale(x)
    //     .orient("bottom")
    //     .tickSize(-height);

    // var yAxis = d3.svg.axis()
    //     .scale(y)
    //     .orient("left")
    //     .ticks(5)
    //     .tickSize(-width);

    // scale to ordinal because x axis is not numerical
    var x = d3.scale.ordinal().rangeRoundBands([0, width-margin.left], .1);

    //scale to numerical value by height
    var y = d3.scale.linear().range([height, 0]);


    // var zoom = d3.behavior.zoom()
    // .x(x)
    // .y(y)
    // .scaleExtent([1, 32])
    // .on("zoom", zoomed);


    var chart = d3.select("#barchart")  
                  .append("svg")  //append svg element inside #chart
                  .attr("width", width+margin.right)//)    //set width
                  .attr("height", height+margin.top); 

    var xAxis = d3.svg.axis()
                  .scale(x)
                  .orient("bottom");  //orient bottom because x-axis will appear below the bars

    var yAxis = d3.svg.axis()
                  .scale(y)
                  .orient("left");

    //http://codepen.io/superpikar/pen/kcJDf.js
    //d3.json("http://159.8.109.244:4040/power-api/all/2015/12", function(error, data){
    function setd3data(data){
      x.domain(data.map(function(d){ return d.id}));
      y.domain([0, d3.max(data, function(d){return d.kwh_lwbp})]);
      
      var bar = chart.selectAll("g")
                        .data(data)
                      .enter()
                        .append("g")
                        .attr("transform", function(d, i){
                          return "translate("+x(d.id)+", 0)";
                        });


      
      bar.append("rect")
          .attr("y", function(d) { 
            return y(d.kwh_lwbp); 
          })
          .attr("x", function(d,i){
            return x.rangeBand()+margin.left;
          })
          .attr("height", function(d) { 
            return height - y(d.kwh_lwbp); 
          })
          .attr("width", x.rangeBand());  //set width base on range on ordinal data

      // bar.append("text")
      //     .attr("x", x.rangeBand()+margin.left )
      //     .attr("y", function(d) { return y(d.frequency) -10; })
      //     .attr("dy", ".75em")
      //     .text(function(d) { return d.frequency; });
      
      chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate("+margin.left+","+ height+")")        
            .call(xAxis);
      
      chart.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate("+margin.left+",0)")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");
    };

    function type(d) {
        d.id = +d.id; // coerce to number
        return d;
    }

    // function zoomed() {
    //   svg.select(".x.axis").call(xAxis);
    //   svg.select(".y.axis").call(yAxis);
    // }