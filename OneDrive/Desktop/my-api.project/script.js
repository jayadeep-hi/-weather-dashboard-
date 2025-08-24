// Weather Dashboard JavaScript
class WeatherApp {
  constructor() {
    this.apiKey = 'b9deb7780bc65494f01fbd8e8aa54751';
    this.cityInput = document.getElementById('cityInput');
    this.searchBtn = document.getElementById('searchBtn');
    this.weatherDiv = document.getElementById('weather');
    
    this.init();
  }

  init() {
    // Add event listeners
    this.searchBtn.addEventListener('click', () => this.searchWeather());
    this.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchWeather();
    });

    // Load default city (London)
    this.loadWeather('London');
  }

  async searchWeather() {
    const city = this.cityInput.value.trim();
    if (city) {
      this.loadWeather(city);
    }
  }

  async loadWeather(city) {
    this.showLoading();
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      this.displayWeather(data);
    } catch (error) {
      console.error('Error:', error);
      this.showError(error.message === 'City not found' ? 'City not found. Please try again.' : 'Failed to load weather data.');
    }
  }

  showLoading() {
    this.weatherDiv.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading weather data...</p>
      </div>
    `;
  }

  showError(message) {
    this.weatherDiv.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
      </div>
    `;
  }

  displayWeather(data) {
    const weatherIcon = this.getWeatherIcon(data.weather[0].main);
    const temp = Math.round(data.main.temp);
    const feelsLike = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = Math.round(data.wind.speed * 3.6); // Convert m/s to km/h
    const pressure = data.main.pressure;

    this.weatherDiv.innerHTML = `
      <div class="weather-info">
        <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
        
        <div class="weather-main">
          <div class="temperature">${temp}°C</div>
          <div class="weather-icon">${weatherIcon}</div>
        </div>
        
        <p class="weather-description">${data.weather[0].description}</p>
        
        <div class="weather-details">
          <div class="detail-item">
            <i class="fas fa-thermometer-half"></i>
            <div class="detail-label">Feels Like</div>
            <div class="detail-value">${feelsLike}°C</div>
          </div>
          
          <div class="detail-item">
            <i class="fas fa-tint"></i>
            <div class="detail-label">Humidity</div>
            <div class="detail-value">${humidity}%</div>
          </div>
          
          <div class="detail-item">
            <i class="fas fa-wind"></i>
            <div class="detail-label">Wind Speed</div>
            <div class="detail-value">${windSpeed} km/h</div>
          </div>
          
          <div class="detail-item">
            <i class="fas fa-compress-alt"></i>
            <div class="detail-label">Pressure</div>
            <div class="detail-value">${pressure} hPa</div>
          </div>
        </div>
      </div>
    `;
  }

  getWeatherIcon(weatherMain) {
    const iconMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Smoke': '🌫️',
      'Haze': '🌫️',
      'Dust': '🌫️',
      'Fog': '🌫️',
      'Sand': '🌫️',
      'Ash': '🌫️',
      'Squall': '💨',
      'Tornado': '🌪️'
    };
    
    return iconMap[weatherMain] || '🌤️';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});
