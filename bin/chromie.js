#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { Scanner, Player, Scheduler, Display, Weather } from '../src/index.js';

const program = new Command();

// Default music directory in user's home folder
const defaultMusicDir = path.join(os.homedir(), 'chromie-music');

program
  .name('chromie')
  .description('A 24-hour weather-aware music player')
  .version('1.1.0');

program
  .option('-d, --dir <path>', 'music directory path', defaultMusicDir)
  .option('-h, --hour <number>', 'force specific hour (0-23)', parseInt)
  .option('-i, --init', 'create 24 hour directories with weather subfolders')
  .option('-l, --list', 'list songs for current hour and weather')
  .option('-o, --open', 'open music folder in file explorer')
  .option('-p, --path', 'print music folder path')
  .option('-w, --weather', 'show current weather info');

program.parse();

const options = program.opts();

function openFolder(folderPath) {
  const platform = process.platform;
  let command;

  if (platform === 'win32') {
    command = `explorer "${folderPath}"`;
  } else if (platform === 'darwin') {
    command = `open "${folderPath}"`;
  } else {
    command = `xdg-open "${folderPath}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.error('Could not open folder:', err.message);
    }
  });
}

async function main() {
  const musicDir = path.resolve(options.dir);
  const display = new Display();
  const scanner = new Scanner(musicDir);
  const weatherService = new Weather();

  // Print path only
  if (options.path) {
    console.log(musicDir);
    process.exit(0);
  }

  // Open folder in file explorer
  if (options.open) {
    await scanner.initDirectories();
    console.log(`Opening: ${musicDir}`);
    openFolder(musicDir);
    process.exit(0);
  }

  // Show weather info
  if (options.weather) {
    console.log('  Fetching weather data...');
    const weather = await weatherService.getWeather();
    if (weather) {
      display.showWeatherInfo(weather);
    } else {
      display.showWeatherError();
    }
    process.exit(0);
  }

  if (options.init) {
    await scanner.initDirectories();
    display.showInitComplete(musicDir);
    process.exit(0);
  }

  const currentHour = options.hour !== undefined ? options.hour : new Date().getHours();

  if (options.hour !== undefined && (options.hour < 0 || options.hour > 23)) {
    display.showError('Hour must be between 0 and 23');
    process.exit(1);
  }

  // List songs with weather context
  if (options.list) {
    const weather = await weatherService.getWeather();
    const songs = await scanner.getSongsForHour(currentHour, weather?.condition);
    display.showList(currentHour, songs, weather);
    process.exit(0);
  }

  // Auto-init on first run
  await scanner.initDirectories();

  // Fetch initial weather
  console.log('  Fetching weather data...');
  const initialWeather = await weatherService.getWeather();

  if (!initialWeather) {
    display.showWeatherError();
  }

  display.showHeader(currentHour, initialWeather);
  display.showMusicDir(musicDir);

  const player = new Player(scanner, display);
  const scheduler = new Scheduler(player, display, weatherService);

  process.on('SIGINT', () => {
    display.showShutdown();
    scheduler.stop();
    player.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    display.showShutdown();
    scheduler.stop();
    player.stop();
    process.exit(0);
  });

  if (options.hour !== undefined) {
    await scheduler.startWithHour(options.hour);
  } else {
    await scheduler.start();
  }

  await player.start(currentHour, initialWeather);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
