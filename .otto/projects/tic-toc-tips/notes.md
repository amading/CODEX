# Project Notes

## Tagalog Guide

Ang `tic-toc-tips` ay ginawa na ngayong Tik Tok Tik Tok beat tapping game. Layunin ng player na pindutin ang gumagalaw na bilog kapag nasa gitnang tap zone.

## Paano Laruin

1. I-click ang `Start Game`.
2. Hintayin na pumasok ang bilog sa `TAP ZONE`.
3. I-click ang bilog o pindutin ang `Space`.
4. Mas mataas ang combo, mas mataas ang score.
5. Kapag lumampas ang beat, mawawala ang combo.

## Manual Edit Guide

| File | Section | Purpose | What You Can Change |
| --- | --- | --- | --- |
| `index.html` | `.beat-board` | Game area | Board labels and guide text |
| `styles.css` | `:root` | Theme colors | Pink, cyan, background colors |
| `styles.css` | `.beat-dot` | Moving target | Size, color, glow |
| `script.js` | game state variables | Game settings | Time limit, speed, score rules |
| `script.js` | `tapBeat()` | Hit detection | Tap zone size and scoring |
| `script.js` | `moveBeat()` | Movement | Beat speed and reset behavior |

## Run

Open `index.html` in a browser.

## Check

Run:

```powershell
node --check script.js
```
