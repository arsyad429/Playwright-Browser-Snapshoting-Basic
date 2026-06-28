const auditLog = require('./audit');

async function safeGoto(page, url) {

    try {

        await page.goto(
            url,
            {
                waitUntil: 'load',
                timeout: 30000
            }
        );

        auditLog(
            'PAGE_LOADED',
            { url }
        );

    }
    catch(error) {

        auditLog(
            'CONNECTOR_ERROR',
            {
                url,
                message:
                    error.message
            }
        );

        throw error;
    }
}
module.exports = safeGoto;