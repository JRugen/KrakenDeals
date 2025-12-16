const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const { getServerPreferences } = require('../config/preferences');

/**
 * Search for games via API
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of game suggestions
 */
async function searchGames(query) {
  const apiUrl = process.env.KRAKENKEYS_API_URL || 'https://krakenkeys.com/api/v1/discord';
  
  try {
    const response = await axios.get(`${apiUrl}/search-games`, {
      params: { query }
    });
    
    return response.data.games || [];
  } catch (error) {
    console.error('Error searching games:', error.message);
    return [];
  }
}

/**
 * Get game price information from API
 * @param {Object} params - Request parameters
 * @returns {Promise<Object>} API response
 */
async function getGamePrice(params) {
  const apiUrl = process.env.KRAKENKEYS_API_URL || 'https://krakenkeys.com/api/v1/discord';
  
  try {
    const response = await axios.post(`${apiUrl}/game-price`, params, {
      headers: {
        'Authorization': process.env.KRAKENKEYS_API_KEY ? `Bearer ${process.env.KRAKENKEYS_API_KEY}` : undefined,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching game price:', error.message);
    if (error.response) {
      console.error('API Response:', error.response.data);
      throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
    }
    throw error;
  }
}

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
function getCurrencySymbol(currency) {
  const symbols = {
    'GBP': '£',
    'USD': '$',
    'EUR': '€',
  };
  return symbols[currency] || currency;
}

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency code
 * @returns {string} Formatted price
 */
function formatPrice(price, currency) {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${price.toFixed(2)}`;
}

/**
 * Format Steam Deck tier with emoji
 * @param {string} tier - Steam Deck tier
 * @returns {string} Formatted tier with emoji
 */
function formatSteamDeckTier(tier) {
  if (!tier) return '❓ Unknown';
  
  const tierLower = tier.toLowerCase();
  const tiers = {
    'verified': '✅ Verified',
    'playable': '⚠️ Playable',
    'unsupported': '❌ Unsupported',
    'unknown': '❓ Unknown',
    'platinum': '✅ Platinum',
    'gold': '🟡 Gold',
    'silver': '⚪ Silver',
    'bronze': '🟤 Bronze',
  };
  
  return tiers[tierLower] || `🎮 ${tier.charAt(0).toUpperCase() + tier.slice(1)}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('price')
    .setDescription('Search for prices on a specific game')
    .addStringOption(option =>
      option.setName('game')
        .setDescription('The name of the game to search for')
        .setRequired(true)
        .setAutocomplete(true))
    .addStringOption(option =>
      option.setName('currency')
        .setDescription('Currency for prices (defaults to server setting)')
        .setRequired(false)
        .addChoices(
          { name: 'GBP', value: 'GBP' },
          { name: 'USD', value: 'USD' },
          { name: 'EUR', value: 'EUR' }
        )),
  
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    
    if (!focusedValue || focusedValue.length < 2) {
      await interaction.respond([]);
      return;
    }

    const games = await searchGames(focusedValue);

    const choices = games.slice(0, 25).map(game => {
      const gameId = game.igdb_id;
      const gameName = game.name;
      const value = `${gameId}|${gameName}`.substring(0, 100);
      return {
        name: gameName,
        value: value,
      };
    });

    await interaction.respond(choices);
  },
  
  async execute(interaction) {
    const gameValue = interaction.options.getString('game');
    const currencyOverride = interaction.options.getString('currency');
    const [igdbId, gameName] = gameValue.split('|');
    
    const serverId = interaction.guild.id;
    const prefs = await getServerPreferences(serverId);
    const currency = currencyOverride || prefs.currency || 'GBP';
    const keyshopsEnabled = prefs.allowKeyshops !== false;
    
    await interaction.deferReply();
    
    try {
      // Fetch game price data
      const priceData = await getGamePrice({
        game_name: gameName,
        server_id: serverId,
        currency: currency,
        keyshops: keyshopsEnabled,
        igdb_id: parseInt(igdbId),
      });
      
      const data = priceData.data;
      if (!data) {
        await interaction.editReply('❌ No price data found for this game.');
        return;
      }
      
      let discountText = '';
      if (data.base_price && data.lowest_price) {
        const discount = Math.round(((data.base_price - data.lowest_price) / data.base_price) * 100);
        discountText = ` (${discount}% off)`;
      }
      
      const embed = new EmbedBuilder()
        .setTitle(gameName)
        .setColor(0x800080)
        .setURL(data.game_url);

      if (data.image_url) {
        const imageUrl = data.image_url.startsWith('//') 
          ? `https:${data.image_url}` 
          : data.image_url;
        embed.setThumbnail(imageUrl);
      }



      // Simple price display
      let description = `**Lowest Price:** ${formatPrice(data.lowest_price, data.currency)}${discountText}\n`;
      description += `**Base Price:** ${formatPrice(data.base_price, data.currency)}`;
      
      embed.setDescription(description);

      // Cheapest prices section
      if (data.cheapest_prices && data.cheapest_prices.length > 0) {
        const topPrices = data.cheapest_prices.slice(0, 5);
        const pricesList = topPrices.map((price, index) => {
          return `[${price.provider_name}](${price.direct_link}) - ${formatPrice(price.price, data.currency)}`;
        }).join('\n');
        
        // Add price count info after the prices list
        const remainingPrices = data.price_count - topPrices.length;
        let pricesFieldValue = pricesList;
        if (remainingPrices > 0) {
          pricesFieldValue += `\n\n*${remainingPrices} more price${remainingPrices !== 1 ? 's' : ''} available here: [${gameName}](${data.game_url})*`;
        }
        
        embed.addFields({ 
          name: 'Cheapest Prices', 
          value: pricesFieldValue,
          inline: false 
        });
      } else {
        // If no cheapest prices, show price count here
        embed.addFields({
          name: 'Prices',
          value: `**${data.price_count}** price${data.price_count !== 1 ? 's' : ''} available`,
          inline: false
        });
      }

      // Secondary information as a vertical list
      const secondaryInfo = [];
      
      if (data.historical_low) {
        const histLow = data.historical_low;
        const histDate = new Date(histLow.lowest_date).toLocaleDateString('en-GB', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
        const status = histLow.is_active ? '✅' : '❌';
        secondaryInfo.push(`📉 **Historical Low:** ${formatPrice(histLow.lowest_price, data.currency)} on ${histDate} (${histLow.provider_name})`);
      }
      
      if (data.steam_deck) {
        const tier = data.steam_deck.tier;
        const score = data.steam_deck.score ? ` (${(data.steam_deck.score * 100).toFixed(0)}%)` : '';
        secondaryInfo.push(`🎮 **Steam Deck:** ${formatSteamDeckTier(tier)}${score}`);
      }
      
      if (data.steam_review) {
        const reviewScore = data.steam_review.score;
        let reviewEmoji = '🟢';
        if (reviewScore < 70) reviewEmoji = '🔴';
        else if (reviewScore < 80) reviewEmoji = '🟡';
        
        secondaryInfo.push(`⭐ **Steam Reviews:** ${reviewEmoji} ${reviewScore.toFixed(1)}% [View on Steam](${data.steam_review.url})`);
      }

      if (secondaryInfo.length > 0) {
        embed.addFields({ 
          name: 'Additional Information', 
          value: secondaryInfo.join('\n'),
          inline: false 
        });
      }
      
      embed.setFooter({ text: `Currency: ${data.currency} • Keyshops ${keyshopsEnabled ? 'Enabled' : 'Disabled'}` });
      embed.setTimestamp();
      
      await interaction.editReply({ embeds: [embed] });
      
    } catch (error) {
      console.error('Error in price command:', error);
      await interaction.editReply(
        `❌ **Error fetching price information**\n` +
        `Could not retrieve price data for **${gameName}**.\n` +
        `\`${error.message}\``
      );
    }
  },
};

