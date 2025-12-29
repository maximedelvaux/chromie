import playSound from 'play-sound';

const player = playSound({});

export class Player {
  constructor(scanner, display) {
    this.scanner = scanner;
    this.display = display;
    this.currentHour = null;
    this.isRunning = false;
    this.currentProcess = null;
    this.hourChanged = false;
    this.pendingHour = null;
  }

  async start(hour) {
    this.currentHour = hour;
    this.isRunning = true;
    await this.playLoop();
  }

  stop() {
    this.isRunning = false;
    if (this.currentProcess) {
      this.currentProcess.kill();
      this.currentProcess = null;
    }
  }

  queueHourChange(newHour) {
    this.hourChanged = true;
    this.pendingHour = newHour;
  }

  async playLoop() {
    while (this.isRunning) {
      if (this.hourChanged) {
        this.currentHour = this.pendingHour;
        this.hourChanged = false;
        this.pendingHour = null;
        this.display.showHeader(this.currentHour);
      }

      const songs = await this.scanner.getSongsForHour(this.currentHour);

      if (songs.length === 0) {
        this.display.showEmpty(this.currentHour);
        await this.sleep(30000);
        continue;
      }

      this.display.showSongCount(songs.length);

      for (let i = 0; i < songs.length; i++) {
        if (!this.isRunning) break;

        if (this.hourChanged) {
          break;
        }

        const song = songs[i];
        this.display.showNowPlaying(song, i, songs.length);

        try {
          await this.playSong(song);
        } catch (err) {
          this.display.showError(`Failed to play: ${song.split(/[/\\]/).pop()}`);
          this.display.showInfo(err.message);
        }
      }
    }
  }

  playSong(songPath) {
    return new Promise((resolve, reject) => {
      this.currentProcess = player.play(songPath, (err) => {
        this.currentProcess = null;
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
