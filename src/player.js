import playSound from 'play-sound';
import { execSync } from 'child_process';
import os from 'os';

// Detect available audio player
function detectPlayer() {
  const platform = os.platform();

  // Try to find mpv first (best cross-platform support)
  const mpvPaths = [
    'mpv',
    process.env.HOME + '/scoop/apps/mpv/current/mpv.exe',
    process.env.USERPROFILE + '/scoop/apps/mpv/current/mpv.exe',
    'C:/Users/' + os.userInfo().username + '/scoop/apps/mpv/current/mpv.exe',
  ];

  for (const mpvPath of mpvPaths) {
    try {
      execSync(`"${mpvPath}" --version`, { stdio: 'ignore' });
      return { player: mpvPath, args: ['--no-video', '--really-quiet'] };
    } catch {}
  }

  // Platform-specific fallbacks
  if (platform === 'darwin') {
    return { player: 'afplay' };
  }

  if (platform === 'win32') {
    // Try mplayer as fallback
    try {
      execSync('mplayer -h', { stdio: 'ignore' });
      return { player: 'mplayer', args: ['-really-quiet'] };
    } catch {}
  }

  // Linux fallbacks
  const linuxPlayers = ['mplayer', 'mpg123', 'ffplay', 'cvlc'];
  for (const p of linuxPlayers) {
    try {
      execSync(`which ${p}`, { stdio: 'ignore' });
      return { player: p };
    } catch {}
  }

  return {}; // Let play-sound try defaults
}

const playerConfig = detectPlayer();
const player = playSound(playerConfig.player ? { player: playerConfig.player } : {});
const playerArgs = playerConfig.args || [];

export class Player {
  constructor(scanner, display) {
    this.scanner = scanner;
    this.display = display;
    this.currentHour = null;
    this.currentWeather = null;
    this.isRunning = false;
    this.currentProcess = null;
    this.hourChanged = false;
    this.weatherChanged = false;
    this.pendingHour = null;
    this.pendingWeather = null;
  }

  setWeather(weather) {
    this.currentWeather = weather;
  }

  async start(hour, weather = null) {
    this.currentHour = hour;
    this.currentWeather = weather;
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

  queueWeatherChange(newWeather) {
    this.weatherChanged = true;
    this.pendingWeather = newWeather;
  }

  async playLoop() {
    while (this.isRunning) {
      // Handle hour change
      if (this.hourChanged) {
        this.currentHour = this.pendingHour;
        this.hourChanged = false;
        this.pendingHour = null;
        this.display.showHeader(this.currentHour, this.currentWeather);
      }

      // Handle weather change
      if (this.weatherChanged) {
        this.currentWeather = this.pendingWeather;
        this.weatherChanged = false;
        this.pendingWeather = null;
        // Don't show header again, weather change message already shown
      }

      const weatherCondition = this.currentWeather?.condition || null;
      const songs = await this.scanner.getSongsForHour(this.currentHour, weatherCondition);

      if (songs.length === 0) {
        this.display.showEmpty(this.currentHour, this.currentWeather);
        await this.sleep(30000);
        continue;
      }

      // Show song counts with weather breakdown
      const counts = await this.scanner.getSongCounts(this.currentHour, weatherCondition);
      this.display.showSongCountWithWeather(counts, this.currentWeather);

      for (let i = 0; i < songs.length; i++) {
        if (!this.isRunning) break;

        // Break on hour or weather change to reload playlist
        if (this.hourChanged || this.weatherChanged) {
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
      const opts = playerArgs.length > 0 ? { [playerConfig.player]: playerArgs } : {};
      this.currentProcess = player.play(songPath, opts, (err) => {
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
