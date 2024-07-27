// api/oauth.js

const axios = require('axios');

module.exports = async (req, res) => {
    const clientId = process.env.CLIENT_ID;  // Stelle sicher, dass diese Umgebungsvariable in Vercel gesetzt ist
    const clientSecret = process.env.CLIENT_SECRET;
    const authToken = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post('https://apis.indeed.com/oauth/v2/tokens', 'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authToken}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
};
