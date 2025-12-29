import chalk from 'chalk';

export class Display {
  constructor() {
    this.currentSongLine = '';
  }

  showHeader(hour) {
    const hourStr = hour.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    console.log('');
    console.log(chalk.cyan.bold('  ╔═══════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('  ║') + chalk.white.bold('            C H R O M I E              ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('  ║') + chalk.gray('        24-Hour Music Player           ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('  ╚═══════════════════════════════════════╝'));
    console.log('');
    console.log(chalk.white('  Current Hour: ') + chalk.yellow.bold(`${hourStr}`) + chalk.gray(` (${hour12}:00 ${period} - ${hour12}:59 ${period})`));
    console.log('');
  }

  showMusicDir(musicDir) {
    console.log(chalk.white('  Music Directory: ') + chalk.green(musicDir));
  }

  showSongCount(count) {
    console.log(chalk.white('  Songs found: ') + chalk.cyan(count.toString()));
    console.log('');
  }

  showNowPlaying(songPath, index, total) {
    const songName = songPath.split(/[/\\]/).pop();
    const progress = `(${index + 1}/${total})`;
    console.log(chalk.green('  ▶ Now Playing: ') + chalk.white(songName) + chalk.gray(` ${progress}`));
  }

  showEmpty(hour) {
    const hourStr = hour.toString().padStart(2, '0');
    console.log(chalk.yellow(`  No songs found in hour ${hourStr} directory.`));
    console.log(chalk.gray('  Waiting for songs... (checking every 30 seconds)'));
  }

  showHourChange(oldHour, newHour) {
    console.log('');
    console.log(chalk.magenta(`  Hour changed: ${oldHour.toString().padStart(2, '0')} → ${newHour.toString().padStart(2, '0')}`));
  }

  showError(message) {
    console.log(chalk.red('  Error: ') + message);
  }

  showInfo(message) {
    console.log(chalk.gray('  ' + message));
  }

  showInitComplete(musicDir) {
    console.log(chalk.green('  ✓ Created 24 hour directories in: ') + chalk.white(musicDir));
    console.log(chalk.gray('  Add your music files to the corresponding hour folders (00-23)'));
  }

  showList(hour, songs) {
    const hourStr = hour.toString().padStart(2, '0');
    console.log('');
    console.log(chalk.cyan(`  Songs for hour ${hourStr}:`));

    if (songs.length === 0) {
      console.log(chalk.gray('  (no songs)'));
    } else {
      songs.forEach((song, i) => {
        const name = song.split(/[/\\]/).pop();
        console.log(chalk.white(`  ${(i + 1).toString().padStart(3)}. ${name}`));
      });
    }
    console.log('');
  }

  showShutdown() {
    console.log('');
    console.log(chalk.gray('  Stopping playback...'));
    console.log(chalk.cyan('  Goodbye!'));
    console.log('');
  }
}
