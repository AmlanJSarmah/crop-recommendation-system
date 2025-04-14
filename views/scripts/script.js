// GLOBAL VARIABLES
let currentMarker = null;

const OPEN_WEATHER_API_KEY = "405bb47a02d34c19a04227ec7cc312c9";

let featureVariables = {
  temp: null,
  wind: null,
  humidity: null,
  rainfall: null,
  pH: null,
  N: null,
  P: null,
  K: null,
};

let currentState = null;

const map = L.map("map", {
  center: [0, 0],
  zoom: 5,
  dragging: true,
  zoomControl: false,
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
    .then((data) => {
      currentState = data;
      return getWeather(lat, lng);
    })
    .then((data) => {
      featureVariables["temp"] = data.main.temp;
      featureVariables["wind"] = data.wind.speed;
      featureVariables["humidity"] = data.main.humidity;
      console.log(featureVariables);
      return getNPK(currentState);
    })
    .then((data) => {
      featureVariables["K"] = data.K;
      featureVariables["N"] = data.N;
      featureVariables["P"] = data.P;
      featureVariables["pH"] = data.pH;
      featureVariables["rainfall"] = data.rainfall;
      setFeatureVariables();
      return getCrops();
    })
    .then((crops) => {
      displayCrops(crops.Crops);
    })
    .catch((err) => {
      console.error("Error getting environment data");
      console.error(err);
      // Set all keys to null
      const keys = Object.keys(featureVariables);
      for (let i = 0; i < keys.length; i++) {
        featureVariables[keys[i]] = null;
      }
      // set the data to be empty
      setFeatureVariables();
      document.querySelector(".container-target").classList.add("hidden");
      map.removeLayer(currentMarker);
      alert("Error : No data for selected region");
    });
});

// UTILS
const getState = async (latitude, longitude) => {
  const res = await fetch(
    `https://us1.api-bdc.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  );
  const data = await res.json();
  return data.principalSubdivision;
};

const getWeather = async (latitude, longitude) => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPEN_WEATHER_API_KEY}&units=metric`
  );
  const data = await res.json();
  return data;
};

const getNPK = async (stateName) => {
  const res = await fetch("http://127.0.0.1:8080/state", {
    method: "POST",
    body: JSON.stringify({
      stateName: stateName,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await res.json();
  return result;
};
const getCrops = async () => {
  const res = await fetch("http://127.0.0.1:5000/predict", {
    method: "POST",
    body: JSON.stringify({
      N: featureVariables["N"],
      P: featureVariables["P"],
      K: featureVariables["K"],
      temperature: featureVariables["temp"],
      humidity: featureVariables["humidity"],
      ph: featureVariables["pH"],
      rainfall: featureVariables["rainfall"],
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  });
  const result = await res.json();
  return result;
};

const drawMap = (coords) => {
  // Set coordinates
  map.setView(coords);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Load India's state boundaries GeoJSON
  fetch("../assets/india-osm.geojson")
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

const setFeatureVariables = () => {
  const tempElement = document.getElementById("temp");
  const windElement = document.getElementById("wind");
  const humidityElement = document.getElementById("humidity");
  const rainfallElement = document.getElementById("rainfall");
  const pHElement = document.getElementById("pH");

  tempElement.innerHTML = `🌡️ Temperature : ${
    featureVariables["temp"] ? featureVariables["temp"] + " deg C" : ""
  }`;
  rainfallElement.innerHTML = `🌧️ Rainfall : ${
    featureVariables["rainfall"]
      ? featureVariables["rainfall"] * 10 + " mm"
      : ""
  }`;
  pHElement.innerHTML = `🧪 pH in soil : ${
    featureVariables["pH"] ? featureVariables["pH"] : ""
  }`;
  windElement.innerHTML = `💨 Wind : ${
    featureVariables["wind"] ? featureVariables["wind"] + " miles/hr" : ""
  }`;
  humidityElement.innerHTML = `♨️ Humidity : ${
    featureVariables["humidity"] ? featureVariables["humidity"] + "%" : ""
  }`;
};

const displayCrops = (crops) => {
  const container = document.querySelector(".container-target");
  container.classList.remove("hidden");

  for (let i = 0; i < crops.length; i++) {
    document.getElementById(`crop${i + 1}`).innerHTML = crops[i];
  }
};

// MAIN
// passed as a callback to navigator's getCurrentPosition if success
const main = (position) => {
  const coords = [position.coords.latitude, position.coords.longitude];
  // Draw Map
  drawMap(coords);
  // Get feature variables and recommended crops
  getState(...coords)
    .then((data) => {
      currentState = data;
      return getWeather(...coords);
    })
    .then((data) => {
      featureVariables["temp"] = data.main.temp;
      featureVariables["wind"] = data.wind.speed;
      featureVariables["humidity"] = data.main.humidity;
      return getNPK(currentState);
    })
    .then((data) => {
      featureVariables["K"] = data.K;
      featureVariables["N"] = data.N;
      featureVariables["P"] = data.P;
      featureVariables["pH"] = data.pH;
      featureVariables["rainfall"] = data.rainfall;
      setFeatureVariables();
      return getCrops();
    })
    .then((crops) => {
      displayCrops(crops.Crops);
    })
    .catch((err) => {
      console.error("Error getting environment data");
      console.error(err);
      document.querySelector(".container-target").classList.add("hidden");
      alert("Error : No data for selected region");
    });
};

// passed as a callback to navigator's getCurrentPosition if error
const handleLocationError = (error) => {
  alert("Cannot Retrieve Location");
  console.error(error);
};

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(main, handleLocationError);
else alert("Broweser doesn't support geolocation");
