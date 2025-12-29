export class Scheduler {
  constructor(player, display) {
    this.player = player;
    this.display = display;
    this.currentHour = null;
    this.checkInterval = null;
  }

  start() {
    this.currentHour = new Date().getHours();

    this.checkInterval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== this.currentHour) {
        this.handleHourTransition(newHour);
      }
    }, 60000);
  }

  startWithHour(hour) {
    this.currentHour = hour;

    this.checkInterval = setInterval(() => {
      const newHour = new Date().getHours();
      if (newHour !== this.currentHour) {
        this.handleHourTransition(newHour);
      }
    }, 60000);
  }

  handleHourTransition(newHour) {
    this.display.showHourChange(this.currentHour, newHour);
    this.currentHour = newHour;
    this.player.queueHourChange(newHour);
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  getCurrentHour() {
    return this.currentHour;
  }
}
