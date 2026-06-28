require('dotenv').config();

function validateApiKey(apiKey) {

    if (!apiKey) {
        throw new Error('Missing API Key');
    }

    if (apiKey !== process.env.AGENT_API_KEY) {
        throw new Error('Invalid API Key');
    }

    return true;
}
module.exports = {
    validateApiKey
};