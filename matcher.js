const classifyRisk = require('./classifyRisk');

function buildBrowserSnapshot(
    semanticElements,
    executionElements
) {

    const browserSnapshot = [];

    for (const semantic of semanticElements) {

        //--------------------------------------------------
        // Find matching execution element
        //--------------------------------------------------

        const execution =
            executionElements.find(element => {

                return (

                    normalize(element.role) ===
                    normalize(semantic.role)

                    &&

                    normalize(element.label) ===
                    normalize(semantic.label)

                );

            });

        //--------------------------------------------------
        // Skip unmatched elements
        //--------------------------------------------------

        if (!execution)
            continue;

        //--------------------------------------------------
        // Merge semantic + execution metadata
        //--------------------------------------------------

        browserSnapshot.push({

            element_id:
                execution.element_id,

            role:
                semantic.role,

            label:
                semantic.label,

            type:
                execution.type,

            visible:
                execution.visible,

            enabled:
                execution.enabled,

            risk_hint:
                classifyRisk(
                    semantic.label
                )

        });

    }

    return browserSnapshot;

}

/**
 * Normalize strings before comparing.
 */
function normalize(text = '') {

    return text
        .trim()
        .toLowerCase();

}

module.exports = buildBrowserSnapshot;