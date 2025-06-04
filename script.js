const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const svg = d3.select("#scatterplot"),
      width = +svg.attr("width") || 1000,
      height = +svg.attr("height") || 600,
      padding = 60;

d3.json(url).then(data => {
  data.forEach(d => {
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, ...d.Time.split(":").map(Number)));
  });

  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([padding, width - padding]);

  const yScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.Time))
    .range([padding, height - padding]);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", \`translate(0,\${height - padding})\`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", \`translate(\${padding}, 0)\`)
    .call(yAxis);

  const tooltip = d3.select("#tooltip");

  svg.selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(d.Time))
    .attr("r", 6)
    .attr("fill", d => d.Doping ? "red" : "green")
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => d.Time.toISOString())
    .on("mouseover", (event, d) => {
      tooltip.style("visibility", "visible")
             .style("top", \`\${event.pageY - 40}px\`)
             .style("left", \`\${event.pageX + 10}px\`)
             .attr("data-year", d.Year)
             .html(\`\${d.Name}: \${d.Nationality}<br/>
                    Year: \${d.Year}, Time: \${d3.timeFormat("%M:%S")(d.Time)}<br/>
                    \${d.Doping}\`);
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
});
