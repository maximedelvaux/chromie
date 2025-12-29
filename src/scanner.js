import fs from 'fs';
import path from 'path';
import { WEATHER_CONDITIONS } from './weather.js';

const SUPPORTED_FORMATS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];

export class Scanner {
  constructor(musicDir) {
    this.musicDir = musicDir;
  }

  getHourDirectory(hour) {
    const hourStr = hour.toString().padStart(2, '0');
    return path.join(this.musicDir, hourStr);
  }

  getWeatherDirectory(hour, weather) {
    return path.join(this.getHourDirectory(hour), weather);
  }

  async getSongsFromDirectory(dir) {
    if (!fs.existsSync(dir)) {
      return [];
    }

    try {
      const files = await fs.promises.readdir(dir);
      return files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return SUPPORTED_FORMATS.includes(ext);
        })
        .map(file => path.join(dir, file));
    } catch (err) {
      return [];
    }
  }

  async getSongsForHour(hour, weather = null, options = {}) {
    const hourDir = this.getHourDirectory(hour);
    const { onlyWeather = false } = options;

    // Get base songs from hour directory (unless onlyWeather mode)
    const baseSongs = onlyWeather ? [] : await this.getSongsFromDirectory(hourDir);

    // Get weather-specific songs if weather is provided
    let weatherSongs = [];
    if (weather && WEATHER_CONDITIONS.includes(weather)) {
      const weatherDir = this.getWeatherDirectory(hour, weather);
      weatherSongs = await this.getSongsFromDirectory(weatherDir);
    }

    // Merge and sort all songs
    const allSongs = [...baseSongs, ...weatherSongs];
    allSongs.sort((a, b) => {
      const nameA = path.basename(a).toLowerCase();
      const nameB = path.basename(b).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    return allSongs;
  }

  async getSongCounts(hour, weather = null) {
    const hourDir = this.getHourDirectory(hour);
    const baseSongs = await this.getSongsFromDirectory(hourDir);

    let weatherSongs = [];
    if (weather && WEATHER_CONDITIONS.includes(weather)) {
      const weatherDir = this.getWeatherDirectory(hour, weather);
      weatherSongs = await this.getSongsFromDirectory(weatherDir);
    }

    return {
      base: baseSongs.length,
      weather: weatherSongs.length,
      total: baseSongs.length + weatherSongs.length
    };
  }

  async initDirectories() {
    if (!fs.existsSync(this.musicDir)) {
      await fs.promises.mkdir(this.musicDir, { recursive: true });
    }

    for (let hour = 0; hour < 24; hour++) {
      const hourDir = this.getHourDirectory(hour);
      if (!fs.existsSync(hourDir)) {
        await fs.promises.mkdir(hourDir, { recursive: true });
      }

      // Create weather subdirectories
      for (const weather of WEATHER_CONDITIONS) {
        const weatherDir = this.getWeatherDirectory(hour, weather);
        if (!fs.existsSync(weatherDir)) {
          await fs.promises.mkdir(weatherDir, { recursive: true });
        }
      }
    }
  }

  directoryExists(hour) {
    return fs.existsSync(this.getHourDirectory(hour));
  }
}
