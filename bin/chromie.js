#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import os from 'os';
import { exec } from 'child_process';
import { Scanner, Player, Scheduler, Display } from '../src/index.js';

const program = new Command();

// Default music directory in user's home folder
const defaultMusicDir = path.join(os.homedir(), 'chromie-music');

program
  .name('chromie')
  .description('A 24-hour music player - different playlists for every hour of the day')
  .version('1.0.0');

program
  .option('-d, --dir <path>', 'music directory path', defaultMusicDir)
  .option('-h, --hour <number>', 'force specific hour (0-23)', parseInt)
  .option('-i, --init', 'create 24 hour directories')
  .option('-l, --list', 'list songs for current hour')
  .option('-o, --open', 'open music folder in file explorer')
  .option('-p, --path', 'print music folder path');

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

  // Print path only
  if (options.path) {
    console.log(musicDir);
    process.exit(0);
  }

  // Open folder in file explorer
  if (options.open) {
    // Initialize directories if they don't exist
    await scanner.initDirectories();
    console.log(`Opening: ${musicDir}`);
    openFolder(musicDir);
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

  if (options.list) {
    const songs = await scanner.getSongsForHour(currentHour);
    display.showList(currentHour, songs);
    process.exit(0);
  }

  // Auto-init on first run
  await scanner.initDirectories();

  display.showHeader(currentHour);
  display.showMusicDir(musicDir);

  const player = new Player(scanner, display);
  const scheduler = new Scheduler(player, display);

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
    scheduler.startWithHour(options.hour);
  } else {
    scheduler.start();
  }

  await player.start(currentHour);
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
