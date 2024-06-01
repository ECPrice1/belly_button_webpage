
// define url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json"

//Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
});

// Build the metadata panel
function buildMetadata(sample) 
{
  d3.json(url).then((data) => 
  {
    // get the metadata field
    let metaData = data.metadata

    // Filter the metadata for the object with the desired sample number
    let info = metaData.filter(attribute => attribute.id == sample)

    // Use d3 to select the panel with id of `#sample-metadata`
    let metaDatapanel = d3.select("#sample-metadata")

    // Use `.html("") to clear any existing metadata
    metaDatapanel.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    info.forEach((attribute) => 
    {
      Object.entries(attribute).forEach(([key, value]) => 
      {
        metaDatapanel.append("p").text(`${key}: ${value}`)
        console.log(key, value);
      });
    });
  })
}

// function to build both charts
function buildCharts(sample) 
{
  d3.json(url).then((data) => 
  {
    // Get the samples field
    let samples = data.samples

    // Filter the samples for the object with the desired sample number
    let info = samples.filter(attribute => attribute.id === sample)[0]
    
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids
    let otu_labels = info.otu_labels
    let sample_values = info.sample_values
    
    // Build a Bubble Chart
    let trace2 = 
    {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers' ,
      marker: 
      {
        size: sample_values,
        color: otu_ids
      }
    }
    let bubbleChart = [trace2]
      let bubbleTitle = 
      {
        title: "Bacteria Cultures Per Sample"
      }
    
    // Render the Bubble Chart
    Plotly.newPlot("bubble" , bubbleChart, bubbleTitle)

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
      otu_ids = otu_ids.map(id => "OTU " + String(id))

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let sortValues = sample_values.sort((a,b) => b.sample_values - a.sample_values);
    let sliceValues = sortValues.slice(0,10)
    sliceValues.reverse()
    
    // sort and slice
    let trace1 = 
    {
      x: sliceValues,
      y: otu_ids,
      text: otu_labels,
      type: "bar" ,
      orientation: "h"
    }
    let barChart = [trace1]
    let barLayout = 
    {
      title: "Top 10 Bacteria Cultures Found",
      margin: 
      {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    }
    // Render the Bar Chart
      Plotly.newPlot("bar" , barChart, barLayout)
  });
}

// Function to run on page load
function init() 
{
  d3.json(url).then((data) => 
  {
   // Get the names field
   names = data.names

    // Use d3 to select the dropdown with id of `#selDataset`
    let nameDropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for( i = 0 ; i < names.length; i++) {
      nameDropdown.append("option").text(names[i]).property("value", names[i]);
        }

    // Get the first sample from the list
    let Sample1 = d3.select("#selDataset").property("value");

    // Build charts and metadata panel with the first sample
        buildCharts(Sample1)
        buildMetadata(Sample1)
  });
}

// Function for event listener
function newSelection(newSample) 
{
  // Build charts and metadata panel each time a new sample is selected
buildCharts(newSample)
buildMetadata(newSample)
}

// Initialize the dashboard
init();