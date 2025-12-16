const axios = require('axios');

/**
 * Get steam deals from KrakenKeys API
 * @param {Object} preferences - Server preferences (e.g., { allowKeyshops: false })
 * @param {Object} options - Additional API options (limit, offset, etc.)
 * @returns {Promise<Object>} API response
 */
async function getSteamDeals(preferences = {}, options = {}) {
  const apiUrl = process.env.KRAKENKEYS_API_URL || 'https://api.krakenkeys.com';

  const params = {
    ...options,
  };

  if (preferences.allowKeyshops === false) {
    params.keyshops = true;
  }
  if (preferences.currency) {
    params.currency = preferences.currency;
  }
  
  try {
    const response = await axios.get(`${apiUrl}/deals/steam`, {
      params,
      headers: {
        'Authorization': process.env.KRAKENKEYS_API_KEY ? `Bearer ${process.env.KRAKENKEYS_API_KEY}` : undefined,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    }
    throw error;
  }
}

module.exports = {
  getSteamDeals,
};

