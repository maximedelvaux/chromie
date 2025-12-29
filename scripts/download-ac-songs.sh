#!/bin/bash

# Download Animal Crossing: New Horizons hourly themes
# Source: Internet Archive - Animal Crossing Series Hourly Themes

BASE_URL="https://dn721801.ca.archive.org/0/items/animal-crossing-series-hourly-themes/Animal%20Crossing%20Series%20Hourly%20Themes"
MUSIC_DIR="${1:-$HOME/chromie-music}"

echo "Downloading Animal Crossing: New Horizons hourly themes..."
echo "Destination: $MUSIC_DIR"
echo ""

# Create directories if they don't exist
for hour in $(seq -w 0 23); do
    mkdir -p "$MUSIC_DIR/$hour"
done

# Map 24-hour format to AM/PM format for the URL
download_song() {
    local hour_24=$1
    local hour_12
    local period

    # Convert 24-hour to 12-hour format
    if [ "$hour_24" -eq 0 ]; then
        hour_12="12"
        period="am"
    elif [ "$hour_24" -lt 12 ]; then
        hour_12="$hour_24"
        period="am"
    elif [ "$hour_24" -eq 12 ]; then
        hour_12="12"
        period="pm"
    else
        hour_12=$((hour_24 - 12))
        period="pm"
    fi

    local filename="new-horizons-${hour_12}${period}.ogg"
    local url="${BASE_URL}/${filename}"
    local dest_dir=$(printf "%02d" $hour_24)
    local dest_path="$MUSIC_DIR/$dest_dir/$filename"

    if [ -f "$dest_path" ]; then
        echo "[$dest_dir] Already exists: $filename"
    else
        echo "[$dest_dir] Downloading: $filename"
        curl -s -L -o "$dest_path" "$url"

        if [ $? -eq 0 ] && [ -s "$dest_path" ]; then
            echo "[$dest_dir] ✓ Downloaded: $filename"
        else
            echo "[$dest_dir] ✗ Failed: $filename"
            rm -f "$dest_path" 2>/dev/null
        fi
    fi
}

# Download all 24 hours
for hour in $(seq 0 23); do
    download_song $hour
done

echo ""
echo "Done! Run 'chromie' to start playing."
