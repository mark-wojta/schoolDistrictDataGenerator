require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Search",
  "esri/tasks/QueryTask",
  "esri/tasks/support/Query",
  "esri/widgets/FeatureTable",
  "esri/widgets/LayerList",
  "esri/core/watchUtils",
  "esri/widgets/Expand",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend"

 ], function(esriConfig, Map, MapView, FeatureLayer, Search, QueryTask, Query, FeatureTable, LayerList, watchUtils,
  Expand, BasemapGallery, Legend) {

  esriConfig.apiKey = "AAPKe04a3b5b2ef2480ca44096e68e2eca61hmQ6jnQTcGgB0fnrzWmmq0qSCnotfwAOnE5nDJTY9FR3INVduag1BSPJR9Jqmxs2";

  const map = new Map({
   basemap: "arcgis-topographic"
  });

  const view = new MapView({
   container: "viewDiv",
   map: map,
   center: [-89.906471, 44.802], // longitude, latitude
   zoom: 6
  }
  );

  //ADD COUNTIES LAYER????
  //schools feature layer (points)
  const schoolsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/final778Project/FeatureServer/0"
  });

  map.add(schoolsLayer);

  //school district feature layer (polygons)
  const schoolDistrictsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/final778Project/FeatureServer/2"
  });

  map.add(schoolDistrictsLayer, 0);

  //school district feature layer (points)
  const librariesLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/final778Project/FeatureServer/1"
  });

  map.add(librariesLayer);

  //creating basemap widget and setting its container to a div
  var basemapGallery = new BasemapGallery({
   view: view,
   container: document.createElement("div")
  });

  //creates an expand instance and sets content properpty to DOM node of basemap gallery widget with an Esri
  //icon font to represent the content inside the expand widget
  var bgExpand = new Expand({
   view: view,
   content: basemapGallery
  });

  // close the expand whenever a basemap is selected
  basemapGallery.watch("activeBasemap", function() {
   var mobileSize = view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall";

   if (mobileSize) {
     bgExpand.collapse();
   }
  });

  // Add the expand instance to the ui
  view.ui.add(bgExpand, "top-left");

  //create layer lists widget to make layers visiblie or invisible
  var layerList = new LayerList({
   view: view,
   // executes for each ListItem in the LayerList
   listItemCreatedFunction: function (event) {

     // The event object contains properties of the
     // layer in the LayerList widget.

     var item = event.item;

     if (item.title === "Final778Project - PublicLibrariesWI") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Wisconsin Public Libraries";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "Final778Project - PublicSchoolsWI") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Wisconsin Public Schools";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "Final778Project - SchoolDistrictsWI") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Wisconsin School Districts";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
   }
  });

  //
  layerListExpand = new Expand({
   expandIconClass: "esri-icon-layer-list",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
   // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
   view: view,
   content: layerList
  });

  view.ui.add(layerListExpand, "top-left");

  //pop up for school district being searched
  var schoolDistrictsSearch = new FeatureLayer({
   url:
     "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/final778Project/FeatureServer/2",
   popupTemplate: {
     // autocasts as new PopupTemplate()
     title: "{DISTRICT} School District </br>Type: {Type}",
     overwriteActions: true
   }
  });

  //change place holder for school districts
  //adding search widget for school districts to map (addresses too?)
  //fix pops up for libraries, schools, and addressess to display name and which school district it SHOULD fall within
  var searchWidget = new Search({
    view: view,
    allPlaceholder: "Enter School District, Public Library, Public School, or Address",
    sources: [
      {
        layer: schoolDistrictsSearch,
        searchFields: ["DISTRICT"],
        displayField: "DISTRICT",
        exactMatch: false,
        outFields: ["DISTRICT", "TYPE"],
        name: "Wisconsin School Districts",
        placeholder: "example: 3708"
      }
  /*            {
        layer: featureLayerSenators,
        searchFields: ["Name", "Party"],
        suggestionTemplate: "{Name}, Party: {Party}",
        exactMatch: false,
        outFields: ["*"],
        placeholder: "example: Casey",
        name: "Senators",
        zoomScale: 500000,
        resultSymbol: {
          type: "picture-marker", // autocasts as new PictureMarkerSymbol()
          url: "https://developers.arcgis.com/javascript/latest/sample-code/widgets-search-multiplesource/live/images/senate.png",
          height: 36
        }
      } */

    ]

  });

  // Add the search widget to the top left corner of the view
  view.ui.add(searchWidget, {
    position: "top-right"
  });

  //create button for panel
  var btn = document.createElement("BUTTON");
  btn.innerHTML = ">";
  btn.id = "panelButton";
  btn.title = 'Expand/Collapse Sidebar';

  // Add the search widget to the top left corner of the view
  view.ui.add(btn, {
    position: "top-left"
  });

  //opening and closing side panel
  const sidebar = document.querySelector('.sidebar');
  const mainContent = document.querySelector('.mapSection');
  document.querySelector('#panelButton').onclick = function () {
    sidebar.classList.toggle('sidebar_small');
    mainContent.classList.toggle('mapSection_large')
  }

  //create data about School districts based on district input in search bar
  searchWidget.on("select-result", function(event){

    console.log("The selected search result: ", event.result.name);

    const queryId = schoolDistrictsLayer.createQuery();
    queryId.where = "DISTRICT = '" + event.result.name + "'";

    schoolDistrictsLayer.queryFeatures(queryId).then(function(response) {
      schoolDistrictsLayers = response.features.map(function(feature) {
      console.log(feature.attributes);
      console.log(feature.attributes["DISTRICT"]);
      console.log(feature.attributes["TYPE"]);

      function districtResults(iDName, dataText, fieldName) {
        document.getElementById(iDName).innerHTML = "";
        let para = document.createElement('p');
        let bold = document.createElement('b');
        var boldString = document.createTextNode(dataText);
        bold.appendChild(boldString);
        para.appendChild(bold);
        var content = document.createTextNode(feature.attributes[fieldName]);
        para.appendChild(content);
        var theDiv = document.getElementById(iDName);
        theDiv.appendChild(para);

      };

      function districtName(iDName, fieldName) {
        document.getElementById(iDName).innerHTML = "";
        let bold = document.createElement('b');
        var content = document.createTextNode(feature.attributes[fieldName]);
        bold.appendChild(content);
        var theDiv = document.getElementById(iDName);
        theDiv.appendChild(bold);

      };

      districtName("schoolDistrict", "DISTRICT");
      districtResults("schoolName", "District Name: ", "DISTRICT");
      districtResults("schoolType", "District Type: ", "TYPE");
      districtResults("sDID", "School District ID: ", "SDID");
      districtResults("aDA", "Average Daily Attendance: ", "ADM");
      districtResults("aDM", "Average Daily Membership: ", "ADA");
      districtResults("explServ", "Expulsions with Services Offered: ", "explServcsOfer");
      districtResults("explNoServ", "Expulsions with no Services Offered: ", "explNoServcsOfer");
      districtResults("confName", "Athletic Conference Name: ", "ATHLETIC_CONFERENCE_NAME");
      districtResults("countyName", "County Name: ", "COUNTY_NAME");
      districtResults("oSS", "Out of School Suspensions: ", "OSS");
      districtResults("aDA", "Average Daily Attendance: ", "ADA");
      districtResults("aDM", "Average Daily Membership: ", "ADM");
      districtResults("studCount", "Student Count: ", "STUDENT_COUNT");

      });
    });

  });

});
