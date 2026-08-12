# Torrey Pines Science Olympiad

The website for Torrey Pines High School's Science Olympiad club — a student
run club in San Diego, California.

## Running it

There is no build step. Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Files

| File | What's in it |
|---|---|
| `index.html` | Markup |
| `styles.css` | All styling — palette, type, components, responsive rules |
| `main.js` | All behaviour — scroll-driven falcon, reveals, accordions, counters |
| `Torrey-Pines-High-School-Logo.png` | The school athletics mark |
| `cropped-faviconTP.png` | TP monogram, used in the hero badge |
| `falconnew-removebg-preview.png` | Falcon used in the hero animation |
| `DESIGN.md` | The design system: palette, type roles, motion, materials |
| `PRODUCT.md` | Product truth — what's verified, what's still a placeholder |

## Still to fill in

These are marked `<!-- TODO: replace -->` in `index.html`:

- The application form URL (posted when applications open)
- The state tournament date, once announced
- The calendar year for the season dates

## Content

Facts on the page come from the club's existing site and were confirmed by the
team. The site deliberately publishes no medal counts, placements, or officer
names, because those have not been verified — see `PRODUCT.md`.
