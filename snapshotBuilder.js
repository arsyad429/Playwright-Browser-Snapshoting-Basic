const classifyRisk = require('./classifyRisk');
const YAML = require('yaml');
/**
 * ==========================================================
 * Browser Snapshot Builder
 * ==========================================================
 *
 * Responsibility:
 * Convert Playwright's ARIA Snapshot into a collection of
 * semantic elements.
 *
 * This module DOES NOT:
 * - know about Playwright locators
 * - know about selector maps
 * - assign element IDs
 * - classify risks
 * - save JSON files
 *
 * Output:
 * [
 *   {
 *      role,
 *      label,
 *      children
 *   }
 * ]
 *
 * These semantic elements will later be matched with
 * execution elements inside matcher.js.
 * ==========================================================
 */

async function buildSemanticElements(page) {

    // ------------------------------------------------------
    // Capture the Accessibility (ARIA) Tree
    // ------------------------------------------------------
    const semanticElements = [];

    const yamlText = await page.locator('body').ariaSnapshot();

    const tree = YAML.parse(yamlText);

    console.dir(tree, { depth: null });

    // ------------------------------------------------------
    // Parse ARIA Tree
    // ------------------------------------------------------

    parseAriaNode(
        tree,
        semanticElements
    );

    return semanticElements;
}

/**
 * ==========================================================
 * Recursively walk the ARIA tree.
 *
 * Every interactive or meaningful node becomes one
 * semantic element.
 * ==========================================================
 */

function parseAriaNode(node, output) {

    if (!node)
        return;

    //----------------------------------------------------
    // Arrays
    //----------------------------------------------------

    if (Array.isArray(node)) {

        for (const item of node) {

            parseAriaNode(item, output);

        }

        return;
    }

    //----------------------------------------------------
    // Strings
    //----------------------------------------------------

    if (typeof node === 'string') {

        extractElement(node, output);

        return;
    }

    //----------------------------------------------------
    // Objects
    //----------------------------------------------------

    if (typeof node === 'object') {

        for (const [key, value] of Object.entries(node)) {

            extractElement(key, output);

            parseAriaNode(value, output);

        }

    }

}

function extractElement(text, output) {

    //----------------------------------------------------
    // Match:
    //
    // button "Masuk"
    // searchbox "Cari"
    // heading "Kategori"
    //
    //----------------------------------------------------

    const match =
        text.match(/^([a-zA-Z]+)(?:\s+"([^"]*)")?/);

    if (!match)
        return;

    const role = match[1];

    const label = match[2] || '';

    output.push({

        role,

        label,

        risk_hint:
            classifyRisk(label)

    });

}

module.exports = buildSemanticElements;