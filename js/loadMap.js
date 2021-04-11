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
  "esri/widgets/Legend", //do I need this?
  "esri/widgets/Popup",
  "esri/PopupTemplate",
  "dojo/dom-class",
  "esri/widgets/Home"

 ], function(esriConfig, Map, MapView, FeatureLayer, Search, QueryTask, Query, FeatureTable, LayerList, watchUtils,
  Expand, BasemapGallery, Legend, Popup, PopupTemplate, domClass, Home) {

  esriConfig.apiKey = "AAPKe04a3b5b2ef2480ca44096e68e2eca61hmQ6jnQTcGgB0fnrzWmmq0qSCnotfwAOnE5nDJTY9FR3INVduag1BSPJR9Jqmxs2";

  const map = new Map({
   basemap: "arcgis-topographic"
  });

  const featureContainer = document.getElementById("features");
  const instructions = document.getElementById("instructions");
  const view = new MapView({
   container: "viewDiv",
   map: map,
   center: [-89.906471, 44.802], // longitude, latitude
   zoom: 6
  }
  );

  var homeBtn = new Home({
    view: view
  });

  // Add the home button to the top left corner of the view
  view.ui.add(homeBtn, "top-left");

/*
  // Display the loading indicator when the view is updating
  watchUtils.whenTrue(view, "updating", function(evt) {
    if () {
      $(".smallLoading").show();
    }
    else if () {
      $(".loading").show();
    }
  });

  // Hide the loading indicator when the view stops updating
  watchUtils.whenFalse(view, "updating", function(evt) {
    if () {
      $(".smallLoading").hide();
    }
    else if () {
      $(".loading").hide();
    }
  });
*/

  //ADD COUNTIES LAYER????

  // Define a pop-up for schools
  const popupSchools = {
    "title": "School",
    "content": [{
      "type": "fields",
      "fieldInfos": [
        {
          "fieldName": "SCHOOL",
          "label": "Name:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "DISTRICT",
          "label": "District:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "SCHOOLTYPE",
          "label": "Type:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "AGENCYTYPE",
          "label": "Agency Type:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "SCH_STYLE",
          "label": "Style:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "GRADE_RANGE",
          "label": "Grade Range:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "LOCALE",
          "label": "Locale:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "SCHOOL_URL",
          "label": "Website:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "FULL_ADDR",
          "label": "Address:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        }
      ]
    }]
  }

  //create schools icon
  const schoolsRenderer = {
    "type": "simple",
    "symbol": {
      "type": "picture-marker",
      "url": "img/schools.png",
      "width": "12px",
      "height": "12px"
    }
  }

  //schools feature layer (points)
  const schoolsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Final778Project_gdb/FeatureServer/0",
    renderer: schoolsRenderer,
    outFields: ["SCHOOL","DISTRICT","SCHOOLTYPE","AGENCYTYPE","SCH_STYLE","GRADE_RANGE","LOCALE","SCHOOL_URL","FULL_ADDR"],
    popupTemplate: popupSchools
  });

  map.add(schoolsLayer);

  //clusters schools
  schoolsLayer.featureReduction = {
    type: "cluster",
    clusterRadius: "100px",
    popupTemplate: {
      // cluster_count is an aggregate field indicating the number
      // of features summarized by the cluster
      content: "This cluster represents {cluster_count} schools."
    },
    // You should adjust the clusterMinSize to properly fit labels
    clusterMinSize: "20px",
    clusterMaxSize: "45px"
  }

  // Define a pop-up for Trailheads
  const popupDistricts = {
    "title": "<b>{DISTRICT} School District</b>"
  }

  // create districts polygons look
  const districtsRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      size: 6,
      color: "#FFFF00",
      outline: {
        color: [0, 0, 0, 0.5],
        width: "0.5px"
      }
    }
  };

  //school district feature layer (polygons)
  const schoolDistrictsLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Final778Project_gdb/FeatureServer/1",
    renderer: districtsRenderer,
    opacity: 0.3,
    outFields: ["DISTRICT"],
    popupTemplate: popupDistricts
  });

  map.add(schoolDistrictsLayer, 0);

  // Define a pop-up for Trailheads
  const popupCounty = {
    "title": "<b>{COUNTY_NAM} County</b>"
  }

  // create districts polygons look
  const countyRenderer = {
    type: "simple",
    symbol: {
      type: "simple-fill",
      size: 6,
      color: "#9A7B4F",
      outline: {
        color: [0, 0, 0, 0.5],
        width: "0.5px"
      }
    }
  };

  //school district feature layer (polygons)
  const countiesLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Final778Project_gdb/FeatureServer/2",
    renderer: countyRenderer,
    opacity: 0.3,
    outFields: ["COUNTY_NAM"],
    popupTemplate: popupCounty
  });
  //hides libaries layer on page load
  countiesLayer.visible = false;
  map.add(countiesLayer, 0);

  // Define popup for Libraries
  const popupLibraries = {
    "title": "Library",
    "content": [{
      "type": "fields",
      "fieldInfos": [
        {
          "fieldName": "LIBRARY",
          "label": "Name:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "LIBID",
          "label": "ID:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "AGENCYTYPE",
          "label": "Agency Type:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "FULL_ADDR",
          "label": "Address:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "PHONE",
          "label": "Phone Number:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "FAX",
          "label": "Fax:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "LIB_SYSTEM",
          "label": "System:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "DIRECTOR",
          "label": "Director:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "DIRECT_EML",
          "label": "Director's Email:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "WEBSITE",
          "label": "Website:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "LIB_TYPE",
          "label": "Type:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "LOCALE_LAB",
          "label": "Locale:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        },
        {
          "fieldName": "PARENT_LIB",
          "label": "Parent Library:",
          "isEditable": true,
          "tooltip": "",
          "visible": true,
          "format": null,
          "stringFieldOption": "text-box"
        }
      ]
    }]
  }

  //create libraries icon
  const librariesRenderer = {
    "type": "simple",
    "symbol": {
      "type": "picture-marker",
      "url": "img/libraries1.png",
      "width": "12px",
      "height": "12px"
    }
  }

  //libraries feature layer (points)
  const librariesLayer = new FeatureLayer({
    url: "https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/Final778Project_gdb/FeatureServer/3",
    renderer: librariesRenderer,
    opacity: 0.8,
    outFields: ["LIBRARY","LIBID","AGENCYTYPE","FULL_ADDR","PHONE","FAX","LIB_SYSTEM","DIRECTOR","DIRECT_EML","WEBSITE","LIB_TYPE","LOCALE_LAB","PARENT_LIB"],
    popupTemplate: popupLibraries
  });
  //hides libaries layer on page load
  librariesLayer.visible = false;
  map.add(librariesLayer);

  //clusters libraries
  librariesLayer.featureReduction = {
    type: "cluster",
    clusterRadius: "100px",
    popupTemplate: {
      // cluster_count is an aggregate field indicating the number
      // of features summarized by the cluster
      content: "This cluster represents {cluster_count} libraries."
    },
    // You should adjust the clusterMinSize to properly fit labels
    clusterMinSize: "20px",
    clusterMaxSize: "45px"
  }

  //creating basemap widget and setting its container to a div
  var basemapGallery = new BasemapGallery({
   view: view,
   container: document.createElement("div")
  });

  //creates an expand instance and sets content properpty to DOM node of basemap gallery widget with an Esri
  //icon font to represent the content inside the expand widget
  var bgExpand = new Expand({
   view: view,
   content: basemapGallery,
   expandTooltip: "Change Basemap"
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

     if (item.title === "Final778Project gdb - PublicLibraryWI") {
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
     if (item.title === "Final778Project gdb - PublicSchoolsWI") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Wisconsin Schools";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "Final778Project gdb - CountyWI") {
       // open the list item in the LayerList
       item.open = true;
       // change the title to something more descriptive
       item.title = "Wisconsin Counties";
       //add legend
       item.panel = {
         content: "legend",
         open: true
       };
     }
     if (item.title === "Final778Project gdb - SchoolDistrictsWI") {
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
   expandIconClass: "esri-icon-layers",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
   // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
   view: view,
   content: layerList,
   expandTooltip: "Layer Visibility/Layer Legend"
  });

  view.ui.add(layerListExpand, "top-left");

  //change place holder for school districts
  //adding search widget for school districts to map (addresses too?)
  //fix pops up for libraries, schools, and addressess to display name and which school district it SHOULD fall within
  var searchWidget = new Search({
    view: view,
    allPlaceholder: "Search all features",
    sources: [
      {
        layer: schoolDistrictsLayer,
        searchFields: ["DISTRICT"],
        displayField: "DISTRICT",
        exactMatch: false,
        outFields: ["DISTRICT"],
        name: "Wisconsin School Districts",
        placeholder: "ex: Mishicot"
      },
      {
        layer: schoolsLayer,
        searchFields: ["SCHOOL"],
        displayField: "SCHOOL",
        exactMatch: false,
        outFields: ["SCHOOL"],
        name: "Wisconsin Schools",
        placeholder: "ex: Winter High"
      },
      {
        layer: countiesLayer,
        searchFields: ["COUNTY_NAM"],
        displayField: "COUNTY_NAM",
        exactMatch: false,
        outFields: ["COUNTY_NAM"],
        name: "Wisconsin Counties",
        placeholder: "ex: Rock"
      },
      {
        layer: librariesLayer,
        searchFields: ["LIBRARY"],
        displayField: "LIBRARY",
        exactMatch: false,
        outFields: ["LIBRARY"],
        name: "Wisconsin Public Libraries",
        placeholder: "ex: Athens Branch"
      }
    ]
  });

  // Add the search widget to the top left corner of the view
  view.ui.add(searchWidget, {
    position: "top-right"
  });

  //create button for panel
  var btn = document.createElement("BUTTON");
  btn.innerHTML = "<img class='bottom' src='img/expand1.png' /><img class='top' src='img/expand.png' />";
  btn.id = "panelButton";
  btn.title = 'Expand Map';

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

  // get screen point from view's click event
  view.on("click", function (event) {

    var screenPoint = {
      x: event.x,
      y: event.y
    };

    // Search for graphics at the clicked location
    view.hitTest(screenPoint).then(function (response) {
      if (response.results.length) {
       var graphic = response.results.filter(function (result) {
        // check if the graphic belongs to the layer of interest
        return result.graphic.layer === schoolDistrictsLayer;
       })[0].graphic;
       // do something with the result graphic
       console.log(graphic.attributes);

       const queryId = schoolDistrictsLayer.createQuery();
       queryId.where = "DISTRICT = '" + graphic.attributes.DISTRICT + "'";

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
         districtResults("sDID", "School District ID: ", "DISTRICT_CODE");
         districtResults("aDA", "Average Daily Attendance: ", "ADM");
         districtResults("aDM", "Average Daily Membership: ", "ADA");
         districtResults("explServ", "Expulsions with Services Offered: ", "explServcsOfer");
         districtResults("explNoServ", "Expulsions with no Services Offered: ", "explNoServcsOfer");
         districtResults("confName", "Athletic Conference Name: ", "ATHLETIC_CONFERENCE_NAME");
         districtResults("countyName", "County Name: ", "COUNTY_NAME");
         districtResults("oSS", "Out of School Suspensions: ", "OSS");
         districtResults("aDA", "Average Daily Attendance: ", "ADA");
         districtResults("aDM", "Average Daily Membership: ", "ADM");
         districtResults("studCount", "Enrollment Count: ", "STUDENT_COUNT");
         districtResults("confCode", "Athletic Conference Code: ", "ATHLETIC_CONFERENCE_CODE");
         districtResults("sDE", "Email: ", "Email");
         districtResults("sDMA", "Mailing Address: ", "Mailing_Address");
         districtResults("sDPN", "Phone Number: ", "Phone");
         districtResults("sDPNE", "Phone Number Extension: ", "Extension");
         districtResults("sDFN", "Fax Number: ", "Fax");
         districtResults("sDW", "Website: ", "Website");
         districtResults("pSD", "Percent of Students with Disabilities: ", "Percent_Students_with_Disabilit");
         districtResults("dSA", "Student Achievement Score(out of 100): ", "District_Student_Achievement_Sc");
         districtResults("dEAS", "ELA Achievement Score(out of 50): ", "District_ELA_Achievement_Score");
         districtResults("dMAS", "Mathematics Achievement Score(out of 50): ", "District_Mathematics_Achievemen");
         districtResults("dSGS", "Student Growth Score(out of 100): ", "District_Student_Growth_Score");
         districtResults("dEGS", "ELA Growth Score(out of 50): ", "District_ELA_Growth_Score");
         districtResults("dMGS", "Mathematics Growth Score(out of 50): ", "District_Mathematics_Growth_Sco");

         });
       });
      }
    });
  });

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
      districtResults("sDID", "School District ID: ", "DISTRICT_CODE");
      districtResults("aDA", "Average Daily Attendance: ", "ADM");
      districtResults("aDM", "Average Daily Membership: ", "ADA");
      districtResults("explServ", "Expulsions with Services Offered: ", "explServcsOfer");
      districtResults("explNoServ", "Expulsions with no Services Offered: ", "explNoServcsOfer");
      districtResults("confName", "Athletic Conference Name: ", "ATHLETIC_CONFERENCE_NAME");
      districtResults("countyName", "County Name: ", "COUNTY_NAME");
      districtResults("oSS", "Out of School Suspensions: ", "OSS");
      districtResults("aDA", "Average Daily Attendance: ", "ADA");
      districtResults("aDM", "Average Daily Membership: ", "ADM");
      districtResults("studCount", "Enrollment Count: ", "STUDENT_COUNT");
      districtResults("confCode", "Athletic Conference Code: ", "ATHLETIC_CONFERENCE_CODE");
      districtResults("sDE", "Email: ", "Email");
      districtResults("sDMA", "Mailing Address: ", "Mailing_Address");
      districtResults("sDPN", "Phone Number: ", "Phone");
      districtResults("sDPNE", "Phone Number Extension: ", "Extension");
      districtResults("sDFN", "Fax Number: ", "Fax");
      districtResults("sDW", "Website: ", "Website");
      districtResults("pSD", "Percent of Students with Disabilities: ", "Percent_Students_with_Disabilit");
      districtResults("dSA", "Student Achievement Score(out of 100): ", "District_Student_Achievement_Sc");
      districtResults("dEAS", "ELA Achievement Score(out of 50): ", "District_ELA_Achievement_Score");
      districtResults("dMAS", "Mathematics Achievement Score(out of 50): ", "District_Mathematics_Achievemen");
      districtResults("dSGS", "Student Growth Score(out of 100): ", "District_Student_Growth_Score");
      districtResults("dEGS", "ELA Growth Score(out of 50): ", "District_ELA_Growth_Score");
      districtResults("dMGS", "Mathematics Growth Score(out of 50): ", "District_Mathematics_Growth_Sco");

      });
    });
  });

});

$(".btn-minimize1").click(function(){
  $(this).toggleClass('btn-plus1');
  $(".widget-content1").slideToggle();
});

$(".btn-minimize2").click(function(){
  $(this).toggleClass('btn-plus2');
  $(".widget-content2").slideToggle();
});

$(".btn-minimize3").click(function(){
  $(this).toggleClass('btn-plus3');
  $(".widget-content3").slideToggle();
});

$(".btn-minimize4").click(function(){
  $(this).toggleClass('btn-plus4');
  $(".widget-content4").slideToggle();
});
