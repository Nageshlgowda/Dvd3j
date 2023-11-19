

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

        // Parse the CSV data and visualize it using the scatter plot
        visualizeScatter(csvData, "scatterPlot");

        // Parse the CSV data and visualize it using the bar chart
        visualizeBar(data, "bar")

    })

    // Handle errors during the fetching or visualization process
    .catch(error => {
        console.error('Error:', error);
    });


//plot bar chart
function visualizeBar(data, svgId) {
    // Create a SVG container
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 20, right: 50, bottom: 50, left: 60 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Select the SVG container by its ID and create an SVG element within it
    const svg = d3.select(`#${svgId}`)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by City and Price, then count occurrences
    const counts = {};
    data.forEach(entry => {
        const city = entry.City;
        const price = +entry.Price;
        const key = `${city}-${city}`;
        counts[key] = (counts[key] || 0) + 1;
    });

    // Convert counts to an array for D3
    const countsArray = Object.entries(counts).map(([key, count]) => {
        const [city, price] = key.split('-');
        return { city, price: +price, count };
    });

    // Sort the array in descending order based on count
    countsArray.sort((a, b) => b.count - a.count);


    // Define x  scales
    const xScale = d3.scaleBand()
        .domain(countsArray.map(d => d.city))
        .range([0, width])
        .padding(0.1);

    // Define  y scales
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(countsArray, d => d.count)])
        .nice()
        .range([height, 0]);


    //set width of the bar
    const barWidth = 50;

    // Create bars
    svg.selectAll(".bar")
        .data(countsArray)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.city))
        .attr("y", d => yScale(d.count))
        .attr("width", barWidth)
        .attr("height", d => height - yScale(d.count))
        .attr("fill", "steelblue");

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
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
        .style("font-size", "12px")
        .text("Number of Airbnb in each city");

}



function visualizeScatter(csvData, svgId) {
    // Parse the CSV data
    const data = d3.csvParse(csvData);

    // Set up SVG dimensions
    const svgWidth = 800;
    const svgHeight = 500;
    const margin = { top: 20, right: 120, bottom: 50, left: 50 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create an SVG container
    const svg = d3.select(`#${svgId}`)
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Group data by City
    const cities = d3.nest()
        .key(d => d.City)
        .entries(data);

    // Define x scale
    const xScale = d3.scaleBand()
        .domain(cities.map(d => d.key))
        .range([0, width])
        .padding(0.1);

    // Define y scale
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d.Satisfaction), d3.max(data, d => +d.Satisfaction)])
        .nice()
        .range([height, 0]);

    // Define color scale
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create circles for the scatter plot
    svg.selectAll(".circle-group")
        .data(cities)
        .enter()
        .append("g")
        .attr("class", "circle-group")
        .attr("transform", d => `translate(${xScale(d.key) + xScale.bandwidth() / 2}, 0)`)
        .selectAll("circle")
        .data(d => d.values)
        .enter()
        .append("circle")
        .attr("cx", 0)
        .attr("cy", d => yScale(+d.Satisfaction))
        .attr("r", 5) // Radius of the circles
        .attr("fill", d => colorScale(d.City)); // Assign color based on City

    // Add legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width + 10}, 0)`); // Adjusted the translation

    legend.selectAll("rect")
        .data(cities)
        .enter()
        .append("rect")
        .attr("y", (d, i) => i * 20)
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => colorScale(d.key));

    legend.selectAll("text")
        .data(cities)
        .enter()
        .append("text")
        .attr("y", (d, i) => i * 20 + 12)
        .attr("x", 25)
        .text(d => d.key);


    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");

    // Add y-axis
    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Add x-axis label
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 20)
        .style("text-anchor", "middle")
        .text("City");

    // Add y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Satisfaction");
}


