// GLOBAL VARIABLES
let currentMarker = null;

const map = L.map("map", {
  center: [0, 0],
  zoom: 5,
  dragging: true,
  zoomControl: true,
  scrollWheelZoom: true,
});

// EVENTS
map.on("click", (e) => {
  // Check latitude and longitude and establishes a marker
  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }
  currentMarker = L.marker(e.latlng).addTo(map);

  // GETs state data
  getState(lat, lng)
    .then((stateData) => {
      console.log(stateData);
      return stateData.principalSubdivision;
    })
    .then((stateName) => {
      console.log(stateName);
    })
    .catch((err) => {
      console.error("Error fetching state data");
    });
});

// UTILS
const getState = async (latitude, longitude) => {
  const res = await fetch(
    `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  const data = await res.json();
  return data;
};

const drawMap = (coords) => {
  // Set coordinates
  map.setView(coords);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Load India's state boundaries GeoJSON
  fetch("./india-osm.geojson")
    .then((response) => response.json())
    .then((data) => {
      L.geoJSON(data, {
        style: function () {
          return { color: "#ff7800", weight: 2, fillOpacity: 0.2 };
        },
      }).addTo(map);
    });

  // Adds a marker
  currentMarker = L.marker(coords).addTo(map);
};

// MAIN
// passed as a callback to navigator's getCurrentPosition if success
const main = (position) => {
  const coords = [position.coords.latitude, position.coords.longitude];
  drawMap(coords);
  getState(...coords)
    .then((stateData) => {
      console.log(stateData);
      return stateData.principalSubdivision;
    })
    .then((stateName) => {
      console.log(stateName);
    })
    .catch((err) => {
      console.error("Error fetching state data");
    });
};

// passed as a callback to navigator's getCurrentPosition if error
const handleLocationError = () => {
  alert("Error getting coordinates...");
  console.error("Error getting coordinates");
};

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(main, handleLocationError);
else alert("Broweser doesn't support geolocation");
