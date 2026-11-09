
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const statusText = document.getElementById("status");
const weatherDiv = document.getElementById("weather");

async function getWeather() {
  const city = cityInput.value.trim();

  if (!city) {
    statusText.textContent = "Please enter a city name!";
    weatherDiv.innerHTML = "";
    return;
  }

  statusText.textContent = "Loading weather...";
  weatherDiv.innerHTML = "";
  searchBtn.disabled = true;

  try {
    // Get city coordinates
    const geoURL = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

    const geoResponse = await fetch(geoURL);

    if (!geoResponse.ok) {
      throw new Error("Unable to find location.");
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Try another city.");
    }

    const location = geoData.results[0];

    // Fetch weather using coordinates
    const weatherURL =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=auto`;

    const response = await fetch(weatherURL);

    if (!response.ok) {
      throw new Error("Weather data unavailable.");
    }

    const data = await response.json();
    const current = data.current;

    statusText.textContent = "Weather loaded successfully!";

    weatherDiv.innerHTML = `
      <h2>${location.name}, ${location.country}</h2>
      <h1>${current.temperature_2m}°C</h1>
      <p>Humidity: ${current.relative_humidity_2m}%</p>
      <p>Wind Speed: ${current.wind_speed_10m} km/h</p>
    `;

  } catch (error) {
    statusText.textContent = "Error: " + error.message;
    weatherDiv.innerHTML = "";
  } finally {
    searchBtn.disabled = false;
  }
}

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeather();
  }
});
