const WEATHER_CONDITIONS = ['sunny', 'rainy', 'cloudy', 'snowy', 'foggy'];

// WMO Weather interpretation codes mapping
// https://open-meteo.com/en/docs
function mapWeatherCode(code) {
  // Clear sky, mainly clear
  if (code === 0 || code === 1) return 'sunny';
  // Partly cloudy, overcast
  if (code === 2 || code === 3) return 'cloudy';
  // Fog, depositing rime fog
  if (code === 45 || code === 48) return 'foggy';
  // Drizzle, rain, freezing rain, rain showers
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rainy';
  // Snow, snow grains, snow showers
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return 'snowy';
  // Thunderstorm (treat as rainy)
  if (code >= 95 && code <= 99) return 'rainy';
  // Default to cloudy for unknown codes
  return 'cloudy';
}

function getWeatherEmoji(condition) {
  const emojis = {
    sunny: '☀️',
    rainy: '🌧️',
    cloudy: '☁️',
    snowy: '❄️',
    foggy: '🌫️'
  };
  return emojis[condition] || '🌡️';
}

export class Weather {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheDuration = 15 * 60 * 1000; // 15 minutes
    this.location = null;
  }

  async getLocation() {
    if (this.location) {
      return this.location;
    }

    try {
      const response = await fetch('http://ip-api.com/json/');
      if (!response.ok) {
        throw new Error('Location API failed');
      }
      const data = await response.json();

      if (data.status === 'fail') {
        throw new Error(data.message || 'Location lookup failed');
      }

      this.location = {
        lat: data.lat,
        lon: data.lon,
        city: data.city,
        country: data.country
      };

      return this.location;
    } catch (err) {
      console.error('Could not get location:', err.message);
      return null;
    }
  }

  async getWeather() {
    // Return cached data if still valid
    if (this.cache && this.cacheTime) {
      const age = Date.now() - this.cacheTime;
      if (age < this.cacheDuration) {
        return this.cache;
      }
    }

    try {
      const location = await this.getLocation();
      if (!location) {
        return null;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Weather API failed');
      }

      const data = await response.json();
      const current = data.current_weather;

      const condition = mapWeatherCode(current.weathercode);

      this.cache = {
        condition,
        temperature: Math.round(current.temperature),
        windSpeed: current.windspeed,
        weatherCode: current.weathercode,
        emoji: getWeatherEmoji(condition),
        city: location.city,
        country: location.country
      };
      this.cacheTime = Date.now();

      return this.cache;
    } catch (err) {
      console.error('Could not get weather:', err.message);
      // Return cached data if available, even if expired
      return this.cache || null;
    }
  }

  async getCurrentCondition() {
    const weather = await this.getWeather();
    return weather ? weather.condition : null;
  }

  clearCache() {
    this.cache = null;
    this.cacheTime = null;
  }
}

export { WEATHER_CONDITIONS, getWeatherEmoji };
