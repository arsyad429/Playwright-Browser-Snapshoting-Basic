async function executeAction(
    page,
    selectorMap,
    action
) {

    switch(action.type) {

        case 'click':

            await page.locator(
                `
                button,
                a[href],
                input,
                textarea,
                select,
                [role="button"]
                `
            )
            .nth(
                selectorMap[
                    action.element_id
                ].index
            )
            .click();

            break;
            
        case 'screenshot':

            await page.screenshot({
                path: action.path,
                fullPage: true
            });

            break;

        default:
            throw new Error(
                'Unsupported action'
            );
    }

}
module.exports = executeAction;