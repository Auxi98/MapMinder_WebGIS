const vectorLayer = new ol.layer.Vector({
  source: new ol.source.Vector(),
  title: 'Markers'
  
});
// vectorLayer.setZIndex(1);

/**
 * Elements that make up the popup.
 */
const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

/**
 * Create an overlay to anchor the popup to the map.
 */
const overlay = new ol.Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

/**
 * Add a click handler to hide the popup.
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

function initializeMap() {
    console.log('initializeMap called'); 
  var view = new ol.View({
    center: [0, 0],
    zoom: 2
  });

  var OSMBaseMap = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  var layerArray = [OSMBaseMap, vectorLayer];


  map = new ol.Map({
    target: 'map',
    layers: layerArray,
    view: view,    
    overlays: [overlay],
  
  });

  console.log('map created:', map); 

  // Make sure that the vector layer is visible.
  vectorLayer.setVisible(true);
  

}

// Assigning the function to a global variable
window.initializeMap = initializeMap;






function addMarkerToMap(data) {
   
  const locationData = {
    latitude: data.locationData.latitude,
    longitude: data.locationData.longitude
  };

  const feature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([locationData.longitude, locationData.latitude])),
    
  });

  feature.setProperties({
    email: data.email,
    image: data.ImageURL,
    notes: data.notes,
    latitude: data.locationData.latitude,
    longitude: data.locationData.longitude
   
  });
  

  if (data.markerImage) {
    console.log('markerImage marker done');
    feature.setStyle(new ol.style.Style({
      image: new ol.style.Icon({
        src: data.locationData.markerImage,
        scale: 0.2
        
      })
    }));
  } else {
    console.log('markerColor marker done');
    feature.setStyle(new ol.style.Style({      
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({ color: data.locationData.markerColor }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
      })
    }));
  }


  
  vectorLayer.getSource().addFeature(feature);
  console.log('marker created:', feature); 


  



  map.on('click', function(evt) {    
    console.log('onclick event activated');
    // Get the marker that was clicked on.
    map.forEachFeatureAtPixel(
      evt.pixel,
      function(feature, layer) {
       
        // console.log(feature.getKeys());
        const coordinate = evt.coordinate;
        

        content.innerHTML = `
       <p>Date: ${data.date}</p>
       <p>Notes: ${data.notes}</p>
       <img src='${data.ImageURL}' alt="Image" style="max-width: 100%; max-height: 100%;">
     `;
        overlay.setPosition(coordinate);


      });

      })
  
}
    


function fetchDataFromFirebase() {
    console.log('data is fetched'); 

      fetch('https://map-minder-default-rtdb.asia-southeast1.firebasedatabase.app/feed.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          var ids = Object.keys(data)
  
          for (i = 0; i < ids.length; i++) {
            addMarkerToMap(data[ids[i]]);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

  }


