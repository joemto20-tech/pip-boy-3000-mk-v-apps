# HAMCo LED

### Info

**Author:** joemt

### Description

HAMCo LED adds a Pip-Boy app menu for controlling the onboard RGB LEDs. Choose a
fixed color, adjust brightness, or select one of sixteen animated effects.

Included effects:

- Solid
- Disco
- Slow Fade
- Pulse
- Warning Flash
- Random Spark
- Police Lights
- Heartbeat
- Candle Flicker
- Lightning Storm
- Radiation Glitch
- SOS Beacon
- Plasma Shift
- Rapid Strobe
- Power Surge
- Pip-Boy Boot

Settings are saved to `USER/HAMCO_LED.json`. The persistent helper loader is
installed to `USER/HAMCO_LED/` so the selected state can be restored separately.
The animation engine turns the LEDs off during sleep and resumes the saved effect
on wake. Choosing the firmware default restores normal Pip-Boy LED behavior.

### Controls

- Use the rotary wheel to move through colors and effects.
- Use the brightness control to pick 25%, 50%, 75%, or 100%.
- Press the torch button to exit the current menu.
- Select `Reset Default + Exit` to restore firmware LED behavior.

### License(s)

This app is licensed under the MIT License.

`SPDX-License-Identifier: MIT`
