const safeGoto = require('./safeGoto');
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
    // Interactive Elements Locator
    // ======================================================

    const elements = page.locator(`
        button,
        a[href],
        input,
        textarea,
        select,
        [role="button"]
    `);

    // ======================================================
    // Build Raw Interactive Element Data
    // ======================================================

    const result = await elements.evaluateAll(nodes => {
        return nodes.map((node, index) => {
            const label =
                node.innerText ||
                node.getAttribute('aria-label') ||
                node.getAttribute('placeholder') ||
                node.value ||
                '';

            return {
                element_id: String(index + 1),

                role:
                    node.getAttribute('role') ||
                    node.tagName.toLowerCase(),

                label,

                type:
                    node.getAttribute('type'),

                visible:
                    node.offsetParent !== null,

                enabled:
                    !node.disabled
            };
        });
    });

    // ======================================================
    // Build Snapshot + Selector Map
    // ======================================================

    const snapshot = [];

    for (const item of result) {
        // Browser Snapshot

        snapshot.push({
            ...item,

            risk_hint:
                classifyRisk(item.label)
        });

        // Selector Map

        selectorMap[item.element_id] = {
            index:
                Number(item.element_id) - 1,

            role:
                item.role,

            label:
                item.label,

            type:
                item.type,

            visible:
                item.visible,

            enabled:
                item.enabled
        };
    }

    // ======================================================
    // Save Selector Map
    // ======================================================

    fs.writeFileSync(
        selector_filePath,
        JSON.stringify(selectorMap, null, 2),
        'utf8'
    );

    // ======================================================
    // Save Browser Snapshot
    // ======================================================

    fs.writeFileSync(
        snapshot_filePath,
        JSON.stringify(snapshot, null, 2),
        'utf8'
    );

    // ======================================================
    // Logging
    // ======================================================

    console.log(
        JSON.stringify(
            snapshot.slice(0, 20),
            null,
            2
        )
    );

    console.log(
        `Found ${snapshot.length} interactive elements`
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