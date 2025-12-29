#!/bin/bash

# Download Stardew Valley OST songs - UNIQUE songs per hour per weather
# Source: Internet Archive - Stardew Valley OST

BASE_URL="https://archive.org/download/stardew-valley-ost"
MUSIC_DIR="${1:-$HOME/chromie-music}"

echo "Downloading Stardew Valley OST (unique per hour)..."
echo "Destination: $MUSIC_DIR"
echo ""

# Function to download a song to a SPECIFIC hour and weather folder
download_to_hour() {
    local filename="$1"
    local weather="$2"
    local hour="$3"  # Two-digit hour (00-23)

    # URL encode: spaces, parentheses, and apostrophes
    local encoded_filename=$(echo "$filename" | sed "s/ /%20/g; s/(/%28/g; s/)/%29/g; s/'/%27/g")
    local url="${BASE_URL}/${encoded_filename}"
    # Sanitize destination filename: replace apostrophes with nothing (Windows-safe)
    local safe_filename=$(echo "$filename" | sed "s/'//g")
    local dest_dir="$MUSIC_DIR/$hour/$weather"
    local dest_path="$dest_dir/$safe_filename"

    # Skip if already exists
    if [ -f "$dest_path" ] && [ $(stat -f%z "$dest_path" 2>/dev/null || stat -c%s "$dest_path" 2>/dev/null) -gt 1000 ]; then
        echo "[$hour/$weather] Already exists: $filename"
        return
    fi

    mkdir -p "$dest_dir"
    echo "[$hour/$weather] Downloading: $filename"

    curl -s -L -o "$dest_path" "$url"

    if [ $? -eq 0 ] && [ -s "$dest_path" ] && [ $(stat -f%z "$dest_path" 2>/dev/null || stat -c%s "$dest_path" 2>/dev/null) -gt 1000 ]; then
        echo "[$hour/$weather] ✓ Downloaded"
    else
        echo "[$hour/$weather] ✗ Failed"
        rm -f "$dest_path" 2>/dev/null
    fi
}

echo ""
echo "=== SUNNY SONGS (distributed by time of day) ==="
# Morning sunny (06-11): Spring themes
download_to_hour "05 Spring (It's a Big World Outside).mp3" "sunny" "06"
download_to_hour "06 Spring (The Valley Comes Alive).mp3" "sunny" "07"
download_to_hour "07 Spring (Wild Horseradish Jam).mp3" "sunny" "08"
download_to_hour "09 Flower Dance.mp3" "sunny" "09"
download_to_hour "10 Fun Festival.mp3" "sunny" "10"
download_to_hour "18 Luau Festival.mp3" "sunny" "11"

# Afternoon sunny (12-17): Summer themes
download_to_hour "13 Summer (Nature's Crescendo).mp3" "sunny" "12"
download_to_hour "14 Summer (The Sun Can Bend An Orange Sky).mp3" "sunny" "13"
download_to_hour "15 Summer (Tropicala).mp3" "sunny" "14"
download_to_hour "17 The Stardrop Saloon.mp3" "sunny" "15"
download_to_hour "24 Stardew Valley Fair Theme.mp3" "sunny" "16"
download_to_hour "34 Playful.mp3" "sunny" "17"

# Evening sunny (18-21): Warm/golden
download_to_hour "38 Land Of Green And Gold (Leah's Theme).mp3" "sunny" "18"
download_to_hour "31 A Golden Star Is Born.mp3" "sunny" "19"
download_to_hour "35 Buttercup Melody.mp3" "sunny" "20"
download_to_hour "01 Stardew Valley Overture.mp3" "sunny" "21"

# Night sunny (22-05): Calm night
download_to_hour "36 Pleasant Memory (Penny's Theme).mp3" "sunny" "22"
download_to_hour "40 Starwatcher (Maru's Theme).mp3" "sunny" "23"
download_to_hour "37 Piano Solo (Elliot's Theme).mp3" "sunny" "00"
download_to_hour "04 Settling In.mp3" "sunny" "01"
download_to_hour "02 Cloud Country.mp3" "sunny" "02"
download_to_hour "03 Grandpa's Theme.mp3" "sunny" "03"
download_to_hour "11 Distant Banjo.mp3" "sunny" "04"
download_to_hour "08 Pelican Town.mp3" "sunny" "05"

echo ""
echo "=== RAINY SONGS (calm & introspective) ==="
# Distribute rainy songs across hours
download_to_hour "02 Cloud Country.mp3" "rainy" "00"
download_to_hour "04 Settling In.mp3" "rainy" "01"
download_to_hour "11 Distant Banjo.mp3" "rainy" "02"
download_to_hour "23 The Library and Museum.mp3" "rainy" "03"
download_to_hour "39 A Stillness In The Rain (Abigail's Melody).mp3" "rainy" "04"
download_to_hour "37 Piano Solo (Elliot's Theme).mp3" "rainy" "05"
download_to_hour "36 Pleasant Memory (Penny's Theme).mp3" "rainy" "06"
download_to_hour "03 Grandpa's Theme.mp3" "rainy" "07"
download_to_hour "02 Cloud Country.mp3" "rainy" "08"
download_to_hour "39 A Stillness In The Rain (Abigail's Melody).mp3" "rainy" "09"
download_to_hour "04 Settling In.mp3" "rainy" "10"
download_to_hour "23 The Library and Museum.mp3" "rainy" "11"
download_to_hour "37 Piano Solo (Elliot's Theme).mp3" "rainy" "12"
download_to_hour "11 Distant Banjo.mp3" "rainy" "13"
download_to_hour "36 Pleasant Memory (Penny's Theme).mp3" "rainy" "14"
download_to_hour "02 Cloud Country.mp3" "rainy" "15"
download_to_hour "39 A Stillness In The Rain (Abigail's Melody).mp3" "rainy" "16"
download_to_hour "03 Grandpa's Theme.mp3" "rainy" "17"
download_to_hour "04 Settling In.mp3" "rainy" "18"
download_to_hour "23 The Library and Museum.mp3" "rainy" "19"
download_to_hour "37 Piano Solo (Elliot's Theme).mp3" "rainy" "20"
download_to_hour "11 Distant Banjo.mp3" "rainy" "21"
download_to_hour "39 A Stillness In The Rain (Abigail's Melody).mp3" "rainy" "22"
download_to_hour "36 Pleasant Memory (Penny's Theme).mp3" "rainy" "23"

echo ""
echo "=== CLOUDY SONGS (Fall & mellow) ==="
# Distribute cloudy/fall songs
download_to_hour "20 Fall (The Smell of Mushroom).mp3" "cloudy" "00"
download_to_hour "21 Fall (Ghost Synth).mp3" "cloudy" "01"
download_to_hour "22 Fall (Raven's Descent).mp3" "cloudy" "02"
download_to_hour "08 Pelican Town.mp3" "cloudy" "03"
download_to_hour "32 Country Shop.mp3" "cloudy" "04"
download_to_hour "20 Fall (The Smell of Mushroom).mp3" "cloudy" "05"
download_to_hour "08 Pelican Town.mp3" "cloudy" "06"
download_to_hour "32 Country Shop.mp3" "cloudy" "07"
download_to_hour "21 Fall (Ghost Synth).mp3" "cloudy" "08"
download_to_hour "22 Fall (Raven's Descent).mp3" "cloudy" "09"
download_to_hour "20 Fall (The Smell of Mushroom).mp3" "cloudy" "10"
download_to_hour "08 Pelican Town.mp3" "cloudy" "11"
download_to_hour "32 Country Shop.mp3" "cloudy" "12"
download_to_hour "21 Fall (Ghost Synth).mp3" "cloudy" "13"
download_to_hour "22 Fall (Raven's Descent).mp3" "cloudy" "14"
download_to_hour "20 Fall (The Smell of Mushroom).mp3" "cloudy" "15"
download_to_hour "08 Pelican Town.mp3" "cloudy" "16"
download_to_hour "32 Country Shop.mp3" "cloudy" "17"
download_to_hour "21 Fall (Ghost Synth).mp3" "cloudy" "18"
download_to_hour "22 Fall (Raven's Descent).mp3" "cloudy" "19"
download_to_hour "20 Fall (The Smell of Mushroom).mp3" "cloudy" "20"
download_to_hour "08 Pelican Town.mp3" "cloudy" "21"
download_to_hour "21 Fall (Ghost Synth).mp3" "cloudy" "22"
download_to_hour "22 Fall (Raven's Descent).mp3" "cloudy" "23"

echo ""
echo "=== SNOWY SONGS (Winter themes) ==="
# Distribute winter songs
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "00"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "01"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "02"
download_to_hour "30 Winter Festival.mp3" "snowy" "03"
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "04"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "05"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "06"
download_to_hour "30 Winter Festival.mp3" "snowy" "07"
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "08"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "09"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "10"
download_to_hour "30 Winter Festival.mp3" "snowy" "11"
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "12"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "13"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "14"
download_to_hour "30 Winter Festival.mp3" "snowy" "15"
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "16"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "17"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "18"
download_to_hour "30 Winter Festival.mp3" "snowy" "19"
download_to_hour "27 Winter (Nocturne of Ice).mp3" "snowy" "20"
download_to_hour "28 Winter (The Wind Can Be Still).mp3" "snowy" "21"
download_to_hour "29 Winter (Ancient).mp3" "snowy" "22"
download_to_hour "30 Winter Festival.mp3" "snowy" "23"

echo ""
echo "=== FOGGY SONGS (Mysterious & night) ==="
# Distribute mysterious/foggy songs
download_to_hour "12 A Glimpse Of The Other World (Wizard's Theme).mp3" "foggy" "00"
download_to_hour "19 Dance Of The Moonlight Jellies.mp3" "foggy" "01"
download_to_hour "26 Spirit's Eve Festival.mp3" "foggy" "02"
download_to_hour "33 Calico Desert.mp3" "foggy" "03"
download_to_hour "16 The Adventure Guild.mp3" "foggy" "04"
download_to_hour "12 A Glimpse Of The Other World (Wizard's Theme).mp3" "foggy" "05"
download_to_hour "33 Calico Desert.mp3" "foggy" "06"
download_to_hour "16 The Adventure Guild.mp3" "foggy" "07"
download_to_hour "19 Dance Of The Moonlight Jellies.mp3" "foggy" "08"
download_to_hour "26 Spirit's Eve Festival.mp3" "foggy" "09"
download_to_hour "12 A Glimpse Of The Other World (Wizard's Theme).mp3" "foggy" "10"
download_to_hour "33 Calico Desert.mp3" "foggy" "11"
download_to_hour "16 The Adventure Guild.mp3" "foggy" "12"
download_to_hour "19 Dance Of The Moonlight Jellies.mp3" "foggy" "13"
download_to_hour "26 Spirit's Eve Festival.mp3" "foggy" "14"
download_to_hour "12 A Glimpse Of The Other World (Wizard's Theme).mp3" "foggy" "15"
download_to_hour "33 Calico Desert.mp3" "foggy" "16"
download_to_hour "16 The Adventure Guild.mp3" "foggy" "17"
download_to_hour "19 Dance Of The Moonlight Jellies.mp3" "foggy" "18"
download_to_hour "26 Spirit's Eve Festival.mp3" "foggy" "19"
download_to_hour "12 A Glimpse Of The Other World (Wizard's Theme).mp3" "foggy" "20"
download_to_hour "19 Dance Of The Moonlight Jellies.mp3" "foggy" "21"
download_to_hour "26 Spirit's Eve Festival.mp3" "foggy" "22"
download_to_hour "33 Calico Desert.mp3" "foggy" "23"

echo ""
echo "Done! Each hour now has UNIQUE weather-specific songs."
echo ""
echo "Example: Hour 12 sunny vs Hour 14 sunny have different songs!"
echo "Run 'chromie' to start playing!"
