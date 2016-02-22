/*global d3, sharedObject */
    "use strict";

    

    var margin ={top:20, right:30, bottom:30, left:40},
    width = 450-margin.left - margin.right,
    height = 250-margin.top-margin.bottom;


    // scale to ordinal because x axis is not numerical
    var x = d3.scale.ordinal().rangeRoundBands([0, width-margin.left], .1);

    //scale to numerical value by height
    var y = d3.scale.linear().range([height, 0]);


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

                  var dataglobal;

    //http://codepen.io/superpikar/pen/kcJDf.js
    function loadd3(url){
        console.log("url d3.js: "+url);

        chart.selectAll('rect').remove();
        // chart = d3.select("#barchart")  
        //           .append("svg")  //append svg element inside #chart
        //           .attr("width", width+margin.right)//)    //set width
        //           .attr("height", height+margin.top); 

        d3.json(url, function(error, data){
            dataglobal = data;
          x.domain(data.map(function(d){ return d.id}));
          y.domain([0, d3.max(data, function(d){return d.kwh_lwbp})]);
             

          var bar = chart.selectAll("svg")
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

            // update selection
            // bars
            //     .style("width", function (d) {return scale(d) + "%";})
            //     .text(function (d) {return d;});
            
            // exit selection
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
                .text("Kwh");
        });
    }
 
    function type(d) {
        d.id = +d.id; // coerce to number
        return d;
    } 

    var countresize = 0;
    function updatesvgsize(){
        if(countresize %2 == 0){
            width=950-margin.left - margin.right, 
            height=500-margin.top-margin.bottom;

        }
        else{
            width=450-margin.left - margin.right, 
            height=250-margin.top-margin.bottom;
        }


        countresize = countresize + 1;  


        x = d3.scale.ordinal().rangeRoundBands([0, width-margin.left], .1);

          //scale to numerical value by height
        y = d3.scale.linear().range([height, 0]);

        chart.attr("width", width).attr("height", height);

            var u2 =  chart.selectAll("svg")
                .data(dataglobal);

             u2.enter().append("svg");
             u2.exit().remove();
             u2.attr("transform", function(d, i){
                  return "translate("+x(d.id)+", 0)";
                });

          var u = d3.selectAll('rect').data(dataglobal);

          x.domain(dataglobal.map(function(d){ return d.id}));
          y.domain([0, d3.max(dataglobal, function(d){return d.kwh_lwbp})]);

          // Add bars
          u.enter().append('rect');

          // Remove bars
          u.exit().remove();

          // Update bar position, width & height
          u.attr('x', function(d, i) {return x.rangeBand()+margin.left;})
            .attr('width', x.rangeBand())
            .attr('y', function(d) {return y(d.kwh_lwbp);})
            .attr('height', function(d) {return height - y(d.kwh_lwbp); });

     
    }