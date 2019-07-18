    //define width and height of svg element
    var svgWidth = 960;
    var svgHeight = 500;
    
    var margin = {
      top: 20,
      right: 40,
      bottom: 60,
      left: 100
    };
    
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    
    // Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
    var svg = d3.select(".chart")
      .append("svg")
      .attr("width", svgWidth)
      .attr("height", svgHeight);
    
    var chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    // Import Data
    d3.csv("data.csv")
      .then(function(newsData) {
    
        // Sort through Data/Cast numbers
        newsData.forEach(function(data) {
          data.income = +data.income;
          data.obesity = +data.obesity;
        });
    
        // Create scale functions
        var xLinearScale = d3.scaleLinear()
          .domain([35000, d3.max(newsData, d => d.income)])
          .range([0, width]);
    
        var yLinearScale = d3.scaleLinear()
          .domain([20, d3.max(newsData, d => d.obesity)])
          .range([height, 0]);
    
        // Create axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);
    
        // Append Axes to the chart
        chartGroup.append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(bottomAxis);
    
        chartGroup.append("g")
          .call(leftAxis);
    
        // Create Circles for Scatter Plot
        var circlesGroup = chartGroup.selectAll("circle")
        .data(newsData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.income))
        .attr("cy", d => yLinearScale(d.obesity))
        .attr("r", "15")
        .attr("fill", "lightblue")
        .attr("opacity", ".5");
    
        // Initialize tool tip
        var toolTip = d3.tip()
          .attr("class", "tooltip")
          .offset([80, -60])
          .html(function(d) {
            return (`${d.abbr}<br>Income: $ ${d.income}<br>Obese: ${d.obesity}%`);
          });
    
        // Create tooltip in chart
        chartGroup.call(toolTip);
        
        // Appending state abbreviation inside the circles
        chartGroup.append("text")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .selectAll("tspan")
            .data(newsData)
            .enter()
            .append("tspan")
                .attr("x", function(data) {
                    return xLinearScale(data.income);
                })
                .attr("y", function(data) {
                    return yLinearScale(data.obesity);
                })
                .text(function(data) {
                    return data.abbr
                });
    
    
        // Create listeners to display-hide the tooltip
        circlesGroup.on("mouseover", function (d) {
                toolTip.show(d, this);
            })
    
            // Hide tooltip on mouseout
        circlesGroup.on("mouseout", function (d, i) {
                toolTip.hide(d);
            });
    
        // Create axes labels
        chartGroup.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 40)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .attr("class", "axisText")
          .text("Obese (%)");
    
        chartGroup.append("text")
          .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
          .attr("class", "axisText")
          .text("Household Income (Median)");
      });