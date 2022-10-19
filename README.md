# Ashbychart

Implementing Interactive Ashby charts in Highchart.Js

## Introduction
An Ashby plot, named for Michael Ashby of Cambridge University, is a scatter plot which displays two or more properties of many materials or classes of materials. These plots are useful to compare the ratio between different properties. For the example of the stiff/light part discussed above would have Young's modulus on one axis and density on the other axis, with one data point on the graph for each candidate material. 

## Documentation
The repository contains the following files:
* `index.html` - The main file which contains the code for the interactive Ashby chart.
* `script.js` - The javascript file which contains the code for the interactive Ashby chart.
* `hull.js` -  The javascript file which contains the code for the convex hull generation.
* `style.css` - The css file which contains the code for the interactive Ashby chart.
* `ashby.json` - The json file which contains the format of data for the interactive Ashby chart.
* `README.md` - The file which contains the documentation for the interactive Ashby chart.


### Usage
- First all datasets are loaded.
- By default, tooltip is set to off
- It can be enabled/disabled with the help of the buttons provided
- If you wish to see the interior of the material, click on it's area and if it's subsections exist, the chart will go the level of that particular material
- To return to the main graph, click on any whitespace of the graph

### Usage as a Library- 
- To import and use this as a library, simply import the hull.js file, it contains all functions.
- To use the functions, simply call them with the required parameters.
- The script ```script.js``` contains data manipulation and tree formation functions.
<br>
Doc Link: https://docs.google.com/document/d/1CAJH9NWZAC2goQGTwULM6Nc4bDnjJxgNXhQ9lVKRZC0/edit#heading=h.5vljv2wyg7np
The project is statically hosted on: https://abhiraj-mengade.github.io/Ashbychart/
