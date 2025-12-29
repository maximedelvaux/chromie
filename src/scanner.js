import fs from 'fs';
import path from 'path';

const SUPPORTED_FORMATS = ['.mp3', '.wav', '.flac', '.ogg', '.m4a', '.aac', '.wma'];

export class Scanner {
  constructor(musicDir) {
    this.musicDir = musicDir;
  }

  getHourDirectory(hour) {
    const hourStr = hour.toString().padStart(2, '0');
    return path.join(this.musicDir, hourStr);
  }

  async getSongsForHour(hour) {
    const hourDir = this.getHourDirectory(hour);

    if (!fs.existsSync(hourDir)) {
      return [];
    }

    try {
      const files = await fs.promises.readdir(hourDir);
      const songs = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return SUPPORTED_FORMATS.includes(ext);
        })
        .sort((a, b) => a.localeCompare(b))
        .map(file => path.join(hourDir, file));

      return songs;
    } catch (err) {
      console.error(`Error reading directory ${hourDir}:`, err.message);
      return [];
    }
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
    }
  }

  directoryExists(hour) {
    return fs.existsSync(this.getHourDirectory(hour));
  }
}
