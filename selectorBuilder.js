/**
 * ==========================================================
 * Selector Builder
 * ==========================================================
 *
 * Responsibility:
 * Build all information required by the Browser Executor.
 *
 * This module DOES NOT:
 * - classify risk
 * - build the browser snapshot
 * - save files
 * - execute actions
 *
 * It only extracts interactive elements from the DOM and
 * builds a selector map that the executor can later use.
 * ==========================================================
 */

async function buildSelectorMap(page) {

    // ------------------------------------------------------
    // Locate all interactive elements on the page.
    // ------------------------------------------------------

    const elements = page.locator(`
        button,
        a[href],
        input,
        textarea,
        select,
        [role="button"]
    `);

    // ------------------------------------------------------
    // Extract raw metadata from every interactive element.
    // ------------------------------------------------------

    const executionElements = await elements.evaluateAll(nodes => {

        return nodes.map((node, index) => {

            const label =
                node.innerText ||
                node.getAttribute('aria-label') ||
                node.getAttribute('placeholder') ||
                node.value ||
                '';

            return {

                // Internal ID
                element_id:
                    String(index + 1),

                // HTML tag
                tag:
                    node.tagName.toLowerCase(),

                // Semantic role (if provided)
                role:
                    node.getAttribute('role') ||
                    node.tagName.toLowerCase(),

                // Human-readable label
                label,

                // HTML input/button type
                type:
                    node.getAttribute('type'),

                // Whether the element is visible
                visible:
                    node.offsetParent !== null,

                // Whether the element can be interacted with
                enabled:
                    !node.disabled

            };

        });

    });

    // ------------------------------------------------------
    // Build selector map.
    //
    // The Browser Executor uses this object to translate
    // element_id -> Playwright locator.
    // ------------------------------------------------------

    const selectorMap = {};

    for (const element of executionElements) {

        selectorMap[element.element_id] = {

            // Current locator strategy
            index:
                Number(element.element_id) - 1,

            tag:
                element.tag,

            role:
                element.role,

            label:
                element.label,

            type:
                element.type,

            visible:
                element.visible,

            enabled:
                element.enabled

        };

    }

    // ------------------------------------------------------
    // Return both structures.
    // ------------------------------------------------------

    return {

        selectorMap,

        executionElements

    };

}

module.exports = buildSelectorMap;