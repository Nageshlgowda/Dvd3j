

const csvFileURL = 'data/Airbnb Cleaned Europe Dataset.csv';

// Fetch the CSV file
fetch(csvFileURL)
.then(response => {
if (!response.ok) {
    throw new Error('Network response was not ok');
}
return response.text();
})
.then(csvData => {
// Display CSV data in the "csvData" pre element
document.getElementById("csvData1").textContent = csvData;

// Parse the CSV data and visualize it using D3.js
const data = d3.csvParse(csvData);

// Print the first line of the CSV data
const lines = csvData.split('\n');
if (lines.length > 0) {
                document.getElementById("csvData1").textContent = lines[0];
            } else {
                document.getElementById("csvData1").textContent = "CSV file is empty.";
            }



visualizeData2(csvData, "scatterPlot");

bar(data, "bar")

})

.catch(error => {
console.error('Error:', error);
});

    




////////////////////////////scatter plot
    function visualizeData2(csvData, svgId) {
    // Parse the CSV data
    var data = d3.csvParse(csvData);

    // Your D3.js code for visualization goes here
    // Example: Creating a scatter plot of Price vs. Cleanliness Rating

    // Define SVG dimensions and margins
    var margin = { top: 20, right: 30, bottom: 40, left: 50 };
    var width = 1000 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    // Create an SVG element
    var svg = d3.select("#" + svgId)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define x and y scales
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d['Cleanliness Rating']; })])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return +d.Price; })])
        .range([height, 0]);




    // Create circles for scatter plot
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return xScale(+d['Cleanliness Rating']); })
        .attr("cy", function(d) { return yScale(+d.Price); })
        .attr("r", 5) // Radius of circles
        .attr("fill", "steelblue");

    // Create x and y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Add axis labels
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom)
        .text("Cleanliness Rating");

    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .text("Price");
}



//////////////////////////////////////////////
function bar(data, svgId) {
// Create a SVG container
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 20, right: 50, bottom: 50, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select(`#${svgId}`)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define x and y scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.City))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => +d.Price)])
        .nice()
        .range([height, 0]);

    // Create bars
    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.City))
        .attr("y", d => yScale(+d.Price))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(+d.Price))
        .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left)
        .attr("x", -height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Price");

}

