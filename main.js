/*
  PROG 5075 - Assignment 3 
  Main.js 
  Carey Hill
  March 2023
  -- main javascript file for  map 
*/

//node libraries 
import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import 'ol-layerswitcher/dist/ol-layerswitcher.css';
import 'ol/ol.css';
import LayerSwitcher from 'ol-layerswitcher';
import Stamen from 'ol/source/Stamen'
import Overlay from 'ol/Overlay';
import ImageLayer from 'ol/layer/Image';
import ImageStatic from 'ol/source/ImageStatic';


//base map view and layer 
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
      visible: true
    }),],
  view: new View({
    center: [-13732523.627658, 6178404.996291],
    zoom: 12
  })
});

//empty array for layers 
const basemapLayers = [];
//get layers into array 
map.getLayers().forEach(function(layer) {
  if (layer instanceof TileLayer) {
    basemapLayers.push(layer);
  }
});
//create layer switcher
const layerSwitcher = new LayerSwitcher({
  tipLabel: 'Layers' // Optional label for the layer switcher button
});
//add switcher to map 
map.addControl(layerSwitcher);

// Loop through each layer in the map
map.getLayers().forEach(function(layer) {
  // Add a click event listener to each layer
  layer.on('click', function() {
    // Toggle the visibility of the clicked layer
    if (layer.getVisible()) {
      layer.setVisible(false);
    } else {
      layer.setVisible(true);
    }
  });
});

//create terrain layer
const stamenLayer = new TileLayer({
  source: new Stamen({
    layer: 'terrain'
  }),
  title: 'Stamen Terrain',
  type: 'base',
  visible: false
});

map.addLayer(stamenLayer);

//create toner layer
const stamenLayer2 = new TileLayer({
  source: new Stamen({
    layer: 'toner'
  }),
  title: 'Stamen Toner',
  type: 'base',
  visible: false
});

map.addLayer(stamenLayer2);

//create point data 
const geoJsonData = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-13734201.926253,6175403.332232]
      },
      properties: {
        name: 'Holland Point Park'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-13738756.231285, 6177521.790316]
      },
      properties: {
        name: 'Saxe Point Park'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-13732920.351405, 6175449.334655]
      },
      properties: {
        name: 'Beacon Hill Park'
      }
    }
  ]
};

//create vector layer and style for point data 
const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: new GeoJSON().readFeatures(geoJsonData)
  }),
  title:"Park Locations",
  visible:true,
  style: new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({
        color: '#9999D7'
      }),
      stroke: new Stroke({
        color: '',
        width: 2
      })
    })
  })
});

map.addLayer(vectorLayer);

//create line data 
const lineGeoJsonData = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [[-13732920.351405, 6175449.334655], [-13734201.926253, 6175403.332232], [-13738756.231285, 6177521.790316]]
  }
};

//create new geojson layer
const lineVectorSource = new VectorSource({
  features: new GeoJSON().readFeatures(lineGeoJsonData)
});

//create vector layer and style for line data
const lineVectorLayer = new VectorLayer({
  source: lineVectorSource,
  title: 'Conjoining Line',
  visible: true,
  style: new Style({
    stroke: new Stroke({
      color: 'green',
      width: 3
    })
  })
});

map.addLayer(lineVectorLayer);

//add geojson to map layers
basemapLayers.push(geoJsonLayer);

//function to switch layer based on target -- from https://github.com/walkermatt/ol-layerswitcher
layerSwitcher.on('change:visible', function(event) {
  if (event.target === geoJsonLayer && !geoJsonLayer.getVisible()) {
    // The GeoJSON layer was clicked and is not visible, so set it to be visible
    geoJsonLayer.setVisible(true);
  } else if (event.target === geoJsonLayer && geoJsonLayer.getVisible()) {
    // The GeoJSON layer was clicked and is visible, so set it to be not visible
    geoJsonLayer.setVisible(false);
  }
});

//title box 
const overlay = new Overlay({
  element: document.getElementById('textbox-overlay'),
  position: [-13716794.279476,6167550.923819],
  positioning: 'bottom-left'
});

map.addOverlay(overlay);

//cogs image -- doesnt appear correctly 
const overlayimg = new new ImageLayer({
  source: new ImageStatic({
    url: 'https://images.app.goo.gl/93uYCpWJ9oMYqDLK7',
    imageExtent: [-13730001.205725, 13721134.510444, 6168442.702827, 6164136.751788] // Replace with the actual extent of the image
  })
});

// Add the image layer to the map
map.addLayer(overlayimg);

//mouse position -- from https://openlayers.org/en/latest/examples/mouse-position.html
const mousePositionControl = new MousePosition({
  coordinateFormat: createStringXY(4),
  projection: 'EPSG:4326',
  // comment the following two lines to have the mouse position
  // be placed within the map.
});

const projectionSelect = document.getElementById('projection');
projectionSelect.addEventListener('change', function (event) {
  mousePositionControl.setProjection(event.target.value);
});

const precisionInput = document.getElementById('precision');
precisionInput.addEventListener('change', function (event) {
  const format = createStringXY(event.target.valueAsNumber);
  mousePositionControl.setCoordinateFormat(format);
});
