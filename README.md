# Yahoo Dictionary Chrome Plugin

A lightweight Chrome extension that adds Yahoo Dictionary lookup directly to your right-click context menu.

## Features

- 🔍 **Right-click Dictionary Lookup** - Highlight any word and select "Look up in Yahoo Dictionary" 
- 🔊 **Pronunciation** - Hear how to pronounce any word using Web Speech API
- ⚡ **Fast & Lightweight** - No external dependencies
- 🔒 **Privacy-Focused** - All processing done locally, lookup history stored locally

## Installation

### From Source (Manual)

1. Ensure all files are in the `dictionary-plugin` folder
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in top right)
4. Click **Load unpacked**
5. Select the `dictionary-plugin` folder
6. The extension icon should appear in your Chrome toolbar

### Setting Up Icons

The extension requires 3 PNG icon files in the `icons/` folder:
- `icon-16.png` (16x16 pixels)
- `icon-48.png` (48x48 pixels)
- `icon-128.png` (128x128 pixels)

**Quick Icon Setup:**
- A simple setup script is included (`generate-icons.py`) that creates minimal placeholder icons
- Or use any image editor to create simple square icons with a "D" letter for Dictionary
- Or download from an icon site like flaticon.com and save as PNG

## Usage

1. Highlight any word on any webpage
2. Right-click to open the context menu
3. Choose from:
   - **Look up "[word]" in Yahoo Dictionary** - Opens Yahoo Dictionary in a new tab
   - **Pronounce "[word]"** - Opens a page with audio pronunciation

## How It Works

### Dictionary Lookup
- Opens `https://dictionary.yahoo.com/dictionary/[word]` in a new tab
- The Yahoo Dictionary website loads with full definitions, examples, and related words

### Pronunciation
- Uses the Web Speech API (native browser text-to-speech) to pronounce the selected word
- Opens a dedicated page with a "Play Pronunciation" button
- Can repeat pronunciation as many times as needed

## Architecture

```
dictionary-plugin/
├── manifest.json                 # Extension manifest (V3)
├── background-service-worker.js  # Handles context menu & lookups
├── icons/
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
└── README.md
```

## Permissions Explained

| Permission | Purpose |
|-----------|---------|
| `contextMenus` | Adds items to right-click context menu |
| `activeTab` | Accesses current tab information |
| `<all_urls>` | Enables extension to work on all websites |
| `storage` | Stores lookup history locally |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension icon doesn't appear | Make sure PNG icons (16, 48, 128) are in the `icons/` folder |
| Context menu doesn't show | Reload the extension at `chrome://extensions/` |
| Pronunciation doesn't work | Ensure Web Speech API is enabled in Chrome (default setting) |
| Permission denied error | Try restarting Chrome completely |

## Testing Checklist

- [ ] Load unpacked: Navigate to `chrome://extensions` → Enable Developer Mode → Load unpacked folder
- [ ] Icon appears in toolbar with correct display
- [ ] Right-click on highlighted word shows both menu options
- [ ] Dictionary lookup opens Yahoo Dictionary in new tab with correct word
- [ ] Pronunciation button works and audio plays
- [ ] Can repeat pronunciation multiple times
- [ ] Works on multiple websites (Gmail, Twitter, Reddit, etc.)
- [ ] Page reload doesn't break extension functionality

## Debugging

**Inspect Background Service Worker:**
1. Go to `chrome://extensions`
2. Enable Developer Mode
3. Click "Inspect views: service worker" on the extension

**Check Console Errors:**
- Right-click extension icon → Inspect popup (if there's a popup)
- Or use the service worker inspector

## Future Enhancements

- [ ] Lookup history sidebar
- [ ] Support for multiple dictionaries (Oxford, Merriam-Webster)
- [ ] Word definition tooltip on hover
- [ ] Offline dictionary database
- [ ] Dark mode for pronunciation page
- [ ] Multiple language support
- [ ] Text-to-speech voice selection
- [ ] Save favorite words

## License

MIT - Free to use and modify

## Support

For issues or improvements, feel free to modify the code or add new features!
