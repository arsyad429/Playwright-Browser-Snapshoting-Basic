const fs = require('fs');
const path = require('path');
const folderPath = path.join(__dirname, 'json');
const audit_filePath = path.join(folderPath, 'audit_log.json');

function auditLog(eventType, payload) {

    const record = {
        timestamp: new Date().toISOString(),
        eventType,
        payload
    };

    let logs = [];

    try {
        logs = JSON.parse(
            fs.readFileSync(
                audit_filePath,
                'utf8'
            )
        );
    }
    catch {
        logs = [];
    }

    logs.push(record);

    fs.writeFileSync(
        audit_filePath,
        JSON.stringify(logs, null, 2)
    );
}
module.exports = auditLog;