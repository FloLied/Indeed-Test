// api/search.js

const axios = require('axios');

module.exports = async (req, res) => {
    const { query, accessToken } = req.query;

    try {
        const response = await axios.get(`https://apis.indeed.com/v2/search?q=${query}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(error.response ? error.response.status : 500).json({ error: error.message });
    }
};
