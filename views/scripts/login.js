const textArea = document.getElementById("stateName");
const submitButton = document.getElementById("getStateName");

const getCoordinatesFromCity = async (cityName) => {
  const data = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      cityName
    )}&country=India&format=json`
  );
  const dataJson = await data.json();
  if (dataJson.length > 0) {
    const { lat, lon } = dataJson[0];
    return [parseFloat(lat), parseFloat(lon)];
  } else return null;
};

submitButton.addEventListener("click", () => {
  if (textArea.value.trim() === "") {
    localStorage.setItem("state", null);
    window.location.href = "main.html";
    return;
  }
  getCoordinatesFromCity(textArea.value).then((data) => {
    localStorage.setItem("state", data);
    window.location.href = "main.html";
  });
});
