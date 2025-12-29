# Chromie

[![npm version](https://img.shields.io/npm/v/chromie.svg)](https://www.npmjs.com/package/chromie)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A 24-hour **weather-aware** music player CLI. Plays different playlists based on the time of day AND current weather conditions.

## Why Chromie?

- **Time + Weather aware** - Cozy piano when it rains, upbeat tracks on sunny days
- **Zero configuration** - Auto-detects your location and weather
- **Just drop files in folders** - No complex setup needed
- **Runs anywhere** - Works on Windows, macOS, and Linux

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

# 2. Drop your music files into the folders:
#    - Base folder: songs that always play
#    - sunny/rainy/cloudy/snowy/foggy: weather-specific songs

# 3. Start playing
chromie
```

## How Weather Works

Chromie automatically detects your location and fetches weather data. It then plays:
- **Base songs** from the hour folder (always play)
- **Weather songs** from the matching weather subfolder (mixed in)

```
Current Hour: 08 (8:00 AM)  │  Weather: ☀️ sunny (22°C)
Location: Paris, France

Songs: 5 base + 3 sunny = 8 total

▶ Now Playing: morning-vibes.mp3 (1/8)
```

## Directory Structure

```
~/chromie-music/
├── 08/                        # 8 AM hour folder
│   ├── morning-coffee.mp3     # Base songs (always play at 8am)
│   ├── wake-up-tune.mp3
│   ├── sunny/                 # Only plays when sunny
│   │   └── bright-morning.mp3
│   ├── rainy/                 # Only plays when rainy
│   │   └── cozy-rain.mp3
│   ├── cloudy/
│   ├── snowy/
│   └── foggy/
├── 09/
├── ...
└── 23/
```

## Usage

```bash
# Start playing (auto-detects hour + weather)
chromie

# Check current weather
chromie --weather

# Open music folder in file explorer
chromie --open

# Print music folder path
chromie --path

# List songs for current hour + weather
chromie --list

# Use a custom music directory
chromie --dir ~/my-music

# Force a specific hour (for testing)
chromie --hour 14

# Show help
chromie --help
```

## Weather Conditions

Chromie supports 5 weather conditions:

| Condition | Folder | When it plays |
|-----------|--------|---------------|
| ☀️ Sunny | `sunny/` | Clear sky, mainly clear |
| 🌧️ Rainy | `rainy/` | Drizzle, rain, thunderstorm |
| ☁️ Cloudy | `cloudy/` | Partly cloudy, overcast |
| ❄️ Snowy | `snowy/` | Snow, snow grains, blizzard |
| 🌫️ Foggy | `foggy/` | Fog, mist |

Weather is checked every 15 minutes. When the weather changes, the playlist updates after the current song finishes.

## Supported Audio Formats

- MP3, WAV, FLAC, OGG, M4A, AAC, WMA

## How It Works

1. **Startup**: Chromie fetches your location (via IP) and current weather
2. **Playback**: Plays songs from current hour folder + matching weather subfolder
3. **Hour change**: Switches to new hour's playlist
4. **Weather change**: Adds/removes weather-specific songs (checked every 15 min)
5. **No internet**: Falls back to base songs only (no crash)

## Requirements

- **Node.js** 18 or higher
- **Audio player**:
  - Windows: PowerShell (built-in)
  - macOS: afplay (built-in)
  - Linux: mplayer, mpg123, or similar

## Privacy

- Location is determined by IP address using [ip-api.com](http://ip-api.com)
- Weather data from [Open-Meteo](https://open-meteo.com) (no API key needed)
- No data is stored or transmitted beyond these API calls

## Use Cases

- **Work from home** - Focus beats when sunny, ambient when cloudy
- **Coffee shops** - Weather-matched atmosphere
- **Sleep routines** - Rain sounds on rainy nights
- **Retail spaces** - Automatic mood-matching music

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT
