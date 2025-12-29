# Chromie

[![npm version](https://img.shields.io/npm/v/chromie.svg)](https://www.npmjs.com/package/chromie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A 24-hour music player CLI that plays different playlists based on the time of day. Perfect for ambient music, lo-fi beats, or creating the right atmosphere for every hour.

## Why Chromie?

- **Time-aware playlists** - Morning coffee music at 8am, focus beats at 2pm, chill vibes at 10pm
- **Zero configuration** - Just drop files in folders and play
- **Runs anywhere** - Works on Windows, macOS, and Linux
- **Lightweight** - Simple CLI, no GUI overhead

## Installation

```bash
npm install -g chromie
```

Or run directly with npx:

```bash
npx chromie
```

## Quick Start

```bash
# 1. Open the music folder (creates it automatically)
chromie --open

# 2. Drop your music files into the hour folders (00-23)

# 3. Start playing
chromie
```

That's it! Chromie stores music in `~/chromie-music/` by default.

## Where are my music files?

```bash
# Open the music folder in your file explorer
chromie --open

# Or just print the path
chromie --path
```

## Directory Structure

Your music folder contains 24 directories, one for each hour:

```
~/chromie-music/
├── 00/    # Midnight      (12:00 AM - 12:59 AM)
├── 01/    # Late night    (1:00 AM - 1:59 AM)
├── ...
├── 06/    # Early morning
├── 07/    # Morning
├── 08/    # Morning
├── ...
├── 12/    # Noon
├── 13/    # Afternoon
├── ...
├── 18/    # Evening
├── ...
├── 22/    # Late night
└── 23/    # Late night    (11:00 PM - 11:59 PM)
```

Add your audio files to the corresponding hour folders. Chromie will automatically play from the folder matching the current time.

## Usage

```bash
# Start playing (uses current hour)
chromie

# Open music folder in file explorer
chromie --open

# Print music folder path
chromie --path

# List songs for current hour
chromie --list

# Use a custom music directory
chromie --dir ~/my-music

# Force a specific hour (for testing)
chromie --hour 14

# Show version
chromie --version

# Show help
chromie --help
```

## Supported Audio Formats

| Format | Extension | Notes |
|--------|-----------|-------|
| MP3 | `.mp3` | Universal support |
| WAV | `.wav` | Universal support |
| FLAC | `.flac` | Requires mplayer/mpv |
| OGG | `.ogg` | Requires mplayer/mpv |
| M4A | `.m4a` | macOS native, others need mplayer |
| AAC | `.aac` | macOS native, others need mplayer |
| WMA | `.wma` | Windows native |

## How It Works

1. Chromie checks the current hour (0-23)
2. Plays all songs from the matching folder in alphabetical order
3. Loops the playlist continuously
4. When the hour changes, switches to the new hour's folder
5. If a folder is empty, displays a message and checks every 30 seconds

## Requirements

- **Node.js** 18 or higher
- **Audio player** (one of the following):
  - **Windows**: PowerShell (built-in) or mplayer
  - **macOS**: afplay (built-in)
  - **Linux**: mplayer, mpg123, mpv, or cvlc

### Installing an audio player on Linux

```bash
# Debian/Ubuntu
sudo apt install mplayer

# Fedora
sudo dnf install mplayer

# Arch
sudo pacman -S mplayer
```

## Use Cases

- **Work from home** - Different energy levels throughout the day
- **Coffee shops** - Ambient background music that changes with the vibe
- **Sleep/wake routines** - Calm music at night, energizing in the morning
- **Retail/hospitality** - Automated background music scheduling
- **Personal productivity** - Focus music during work hours, relaxation after

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
