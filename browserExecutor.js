const safeGoto = require('./safegoto');
const executeAction = require('./executor');
const classifyRisk = require('./classifyRisk');
const { validateApiKey } = require('./auth');
const playwright = require('playwright');
const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'json');
const selector_filePath = path.join(folderPath, 'selector_map.json');
const snapshot_filePath = path.join(folderPath, 'browser_snapshot.json');

const selectorMap = {};

const inputWebsite = 'tokopedia';
const url = `https://${inputWebsite}.com`;

validateApiKey(process.env.AGENT_API_KEY);

(async () => {
    // ======================================================
    // Browser Configuration
    // ======================================================

    const browser = await playwright.firefox.launch({
        headless: false
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    await safeGoto(page, url);
    await page.waitForTimeout(10000);

    // ======================================================
    // Build Selector Map
    // ======================================================
    const buildSelectorMap = require('./selectorBuilder');

    const {
        selectorMap,
        executionElements
    } = await buildSelectorMap(page);

    // ======================================================
    // Save Selector Map
    // ======================================================

    fs.writeFileSync(
        selector_filePath,
        JSON.stringify(selectorMap, null, 2),
        'utf8'
    );

    // ======================================================
    // Build Browser Snapshot
    // ======================================================

    const buildSemanticElements = require('./snapshotBuilder');

    const browserSnapshot = await buildSemanticElements(page);

    console.log(
        JSON.stringify(
            browserSnapshot,
            null,
            2
        )
    );

    // ======================================================
    // Save Browser Snapshot
    // ======================================================

    fs.writeFileSync(
        snapshot_filePath,
        JSON.stringify(browserSnapshot, null, 2),
        'utf8'
    );

    // ======================================================
    // Logging
    // ======================================================

    console.log(
        JSON.stringify(
            browserSnapshot.slice(0, 20),
            null,
            2
        )
    );

    console.log(
        `Found ${browserSnapshot.length} interactive elements`
    );

    console.log(
        'Snapshot saved to browser_snapshot.json'
    );

    console.log(
        'Selector map saved to selector_map.json'
    );

    // ======================================================
    // Executor Tests
    // ======================================================

    console.log('Testing executor...');

    await executeAction(
        page,
        selectorMap,
        {
            type: 'click',
            element_id: '8'
        }
    );

    await executeAction(
        page,
        selectorMap,
        {
            type: 'screenshot',
            path: 'tokopedia.png'
        }
    );

    await page.waitForTimeout(5000);

    await browser.close();
})();