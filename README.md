# Browser Agent

A small Playwright-based browser automation project that inspects a webpage, captures interactive elements, builds a snapshot of the page, and classifies potential UI risks.

## What this project does

The current workflow:

- opens a website in Firefox
- collects interactive elements such as buttons, links, inputs, and selects
- saves a selector map and a browser snapshot as JSON files
- classifies common actions as low-risk or higher-risk based on their labels
- runs a simple click and screenshot test against the discovered elements

## Project structure

- `snapshoting.js` - main script that launches the browser, captures elements, and writes the outputs
- `executor.js` - executes simple actions such as click and screenshot
- `classifyRisk.js` - assigns a risk label to UI elements
- `safegoto.js` - wraps navigation with logging and error handling
- `auth.js` - validates the configured API key
- `audit.js` - appends audit events to JSON logs
- `json/` - generated output files such as `browser_snapshot.json`, `selector_map.json`, and `audit_log.json`

## Requirements

- Node.js
- Playwright
- dotenv

Install the dependencies:

```bash
npm install playwright dotenv
```

## Configuration

Create a `.env` file in this folder and define an API key:

```env
AGENT_API_KEY=your_api_key_here
```

The script validates this value before starting the browser session.

## Usage

Run the main script:

```bash
node snapshoting.js
```

This will:

1. open `https://tokopedia.com`
2. collect interactive elements from the page
3. save the results in the `json/` folder
4. test a click action and capture a screenshot

## Output files

After a successful run, the following files are generated in `json/`:

- `browser_snapshot.json` - structured data for discovered interactive elements
- `selector_map.json` - mapping from element IDs to their positions and metadata
- `audit_log.json` - runtime events and errors

## Notes

- The script currently targets `tokopedia.com` by default.
- The browser is launched in non-headless mode, so a visible browser window will appear while the script runs.
- The generated screenshot is saved as `tokopedia.png` in the project root.
