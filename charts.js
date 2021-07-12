function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray2 = samples.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray2);
    //  5. Create a variable that holds the first sample in the array.
    var result2 = resultArray2[0];
    console.log(result2);
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result2.otu_ids.map(id => "OTU " + id);
    console.log(ids);
    var labels = result2.otu_labels;
    console.log(labels);
    var values = result2.sample_values;
    console.log(values);
    
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata2 = data.metadata;
    // Create a variable that holds the first sample in the array.
    var resultArray3 = metadata2.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    var result3 = resultArray3[0];
    console.log(result3);    
    // 3. Create a variable that holds the washing frequency.
    var wash = result3.wfreq
    console.log(wash)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks_all = values.sort((a,b) => a - b).reverse();
    var yticks = yticks_all.slice(0,10).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: yticks,
      y: ids,
      text: labels,
      type: "bar",
      orientation: "h"
    }];
    
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: result2.otu_ids,
      y: values,
      text: labels,
      mode: "markers",
      marker: {
        color: result2.otu_ids,
        size: values
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wash,
      type: "indicator",
      mode: "gauge+number",
      title: "Belly Button Washing Frequency",
      gauge: {
        axis: { range: [null,10] },
        bar: { color: "darkblue"},
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "green" }, 
          { range: [8, 10], color: "darkgreen" }         
        ]
      }

    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500,
      height: 400,
      margin: { t: 25, r: 25, l: 25, b: 25 },
      paper_bgcolor: "white",
      font: { color: "darkblue", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
