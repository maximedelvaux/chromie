export class Scheduler {
  constructor(player, display, weatherService = null) {
    this.player = player;
    this.display = display;
    this.weatherService = weatherService;
    this.currentHour = null;
    this.currentWeather = null;
    this.checkInterval = null;
    this.weatherInterval = null;
  }

  async start() {
    this.currentHour = new Date().getHours();

    // Get initial weather
    if (this.weatherService) {
      this.currentWeather = await this.weatherService.getWeather();
      this.player.setWeather(this.currentWeather);
    }

    // Check hour every minute
    this.checkInterval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== this.currentHour) {
        this.handleHourTransition(newHour);
      }
    }, 60000);

    // Check weather every 15 minutes
    if (this.weatherService) {
      this.weatherInterval = setInterval(async () => {
        await this.checkWeather();
      }, 15 * 60 * 1000);
    }
  }

  async startWithHour(hour) {
    this.currentHour = hour;

    // Get initial weather
    if (this.weatherService) {
      this.currentWeather = await this.weatherService.getWeather();
      this.player.setWeather(this.currentWeather);
    }

    // Check hour every minute
    this.checkInterval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== this.currentHour) {
        this.handleHourTransition(newHour);
      }
    }, 60000);

    // Check weather every 15 minutes
    if (this.weatherService) {
      this.weatherInterval = setInterval(async () => {
        await this.checkWeather();
      }, 15 * 60 * 1000);
    }
  }

  async checkWeather() {
    if (!this.weatherService) return;

    const newWeather = await this.weatherService.getWeather();
    if (!newWeather) return;

    // Check if weather condition changed
    if (!this.currentWeather || this.currentWeather.condition !== newWeather.condition) {
      this.handleWeatherTransition(newWeather);
    }
  }

  handleHourTransition(newHour) {
    this.display.showHourChange(this.currentHour, newHour);
    this.currentHour = newHour;
    this.player.queueHourChange(newHour);
  }

  handleWeatherTransition(newWeather) {
    this.display.showWeatherChange(this.currentWeather, newWeather);
    this.currentWeather = newWeather;
    this.player.queueWeatherChange(newWeather);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    if (this.weatherInterval) {
      clearInterval(this.weatherInterval);
      this.weatherInterval = null;
    }
  }

  getCurrentHour() {
    return this.currentHour;
  }

  getCurrentWeather() {
    return this.currentWeather;
  }
}
