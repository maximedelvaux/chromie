import chalk from 'chalk';

export class Display {
  constructor() {
    this.currentSongLine = '';
  }

  showHeader(hour, weather = null) {
    const hourStr = hour.toString().padStart(2, '0');
    const period = hour < 12 ? 'AM' : 'PM';
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

    console.log('');
    console.log(chalk.cyan.bold('  ╔═══════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('  ║') + chalk.white.bold('                  C H R O M I E                    ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('  ║') + chalk.gray('            24-Hour Music Player                   ') + chalk.cyan.bold('║'));
    console.log(chalk.cyan.bold('  ╚═══════════════════════════════════════════════════╝'));
    console.log('');

    let hourLine = chalk.white('  Current Hour: ') + chalk.yellow.bold(`${hourStr}`) + chalk.gray(` (${hour12}:00 ${period})`);

    if (weather) {
      const weatherStr = `${weather.emoji} ${weather.condition} (${weather.temperature}°C)`;
      hourLine += chalk.white('  │  Weather: ') + chalk.cyan(weatherStr);
    }

    console.log(hourLine);

    if (weather && weather.city) {
      console.log(chalk.gray(`  Location: ${weather.city}, ${weather.country}`));
    }

    console.log('');
  }

  showMusicDir(musicDir) {
    console.log(chalk.white('  Music Directory: ') + chalk.green(musicDir));
  }

  showSongCount(count) {
    console.log(chalk.white('  Songs found: ') + chalk.cyan(count.toString()));
    console.log('');
  }

  showSongCountWithWeather(counts, weather) {
    if (weather && counts.weather > 0) {
      const weatherLabel = weather.condition || 'weather';
      console.log(
        chalk.white('  Songs: ') +
        chalk.cyan(`${counts.base} base`) +
        chalk.gray(' + ') +
        chalk.cyan(`${counts.weather} ${weatherLabel}`) +
        chalk.gray(' = ') +
        chalk.cyan.bold(`${counts.total} total`)
      );
    } else {
      console.log(chalk.white('  Songs found: ') + chalk.cyan(counts.total.toString()));
    }
    console.log('');
  }

  showNowPlaying(songPath, index, total) {
    const songName = songPath.split(/[/\\]/).pop();
    const progress = `(${index + 1}/${total})`;
    console.log(chalk.green('  ▶ Now Playing: ') + chalk.white(songName) + chalk.gray(` ${progress}`));
  }

  showEmpty(hour, weather = null) {
    const hourStr = hour.toString().padStart(2, '0');
    let msg = `  No songs found in hour ${hourStr}`;
    if (weather) {
      msg += ` (${weather.condition})`;
    }
    msg += ' directory.';
    console.log(chalk.yellow(msg));
    console.log(chalk.gray('  Waiting for songs... (checking every 30 seconds)'));
  }

  showHourChange(oldHour, newHour) {
    console.log('');
    console.log(chalk.magenta(`  Hour changed: ${oldHour.toString().padStart(2, '0')} → ${newHour.toString().padStart(2, '0')}`));
  }

  showWeatherChange(oldWeather, newWeather) {
    console.log('');
    const oldStr = oldWeather ? `${oldWeather.emoji} ${oldWeather.condition}` : 'unknown';
    const newStr = `${newWeather.emoji} ${newWeather.condition}`;
    console.log(chalk.blue(`  Weather changed: ${oldStr} → ${newStr}`));
  }

  showWeatherInfo(weather) {
    console.log('');
    console.log(chalk.cyan.bold('  Current Weather'));
    console.log(chalk.white(`  ${weather.emoji} ${weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}`));
    console.log(chalk.white(`  Temperature: ${weather.temperature}°C`));
    console.log(chalk.white(`  Location: ${weather.city}, ${weather.country}`));
    console.log('');
  }

  showWeatherError() {
    console.log(chalk.yellow('  Could not fetch weather data. Playing base songs only.'));
  }

  showError(message) {
    console.log(chalk.red('  Error: ') + message);
  }

  showInfo(message) {
    console.log(chalk.gray('  ' + message));
  }

  showInitComplete(musicDir) {
    console.log(chalk.green('  ✓ Created 24 hour directories with weather subfolders in:'));
    console.log(chalk.white(`    ${musicDir}`));
    console.log('');
    console.log(chalk.gray('  Each hour folder now contains:'));
    console.log(chalk.gray('    • Base folder for songs that always play'));
    console.log(chalk.gray('    • sunny/  - songs for sunny weather'));
    console.log(chalk.gray('    • rainy/  - songs for rainy weather'));
    console.log(chalk.gray('    • cloudy/ - songs for cloudy weather'));
    console.log(chalk.gray('    • snowy/  - songs for snowy weather'));
    console.log(chalk.gray('    • foggy/  - songs for foggy weather'));
  }

  showList(hour, songs, weather = null) {
    const hourStr = hour.toString().padStart(2, '0');
    console.log('');

    let title = `  Songs for hour ${hourStr}`;
    if (weather) {
      title += ` (${weather.emoji} ${weather.condition})`;
    }
    console.log(chalk.cyan(title + ':'));

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
