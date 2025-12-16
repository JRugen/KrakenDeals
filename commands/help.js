const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show all available commands and how to use them'),
  
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x800080)
      .setTitle('KrakenDeals Commands')
      .setDescription('Here are all the available commands:')
      .addFields(
        {
          name: '/price <game> [currency]',
          value: 'Search for prices on a specific game\n' +
                 '• `game` - Game name (autocomplete enabled - start typing to see suggestions)\n' +
                 '• `currency` - Optional: Override server currency (GBP, USD, EUR)\n\n' +
                 '**Example:** `/price game:Satisfactory currency:GBP`',
          inline: false,
        },
        {
          name: '/config',
          value: 'Configure server preferences (admin only)\n' +
                 'Opens a configuration modal where you can:\n' +
                 '• Allow/Disallow keyshops in results\n' +
                 '• Set default currency (GBP, USD, EUR)',
          inline: false,
        },
        {
          name: '/help',
          value: 'Show this help message',
          inline: false,
        }
      )
      .addFields(
        {
          name: '🐛 Found a Bug?',
          value: '[Report it on GitHub](https://github.com/jrugen/KrakenDeals/issues)',
          inline: true,
        },
        {
          name: '💡 Have a Suggestion?',
          value: '[Request a Feature](https://github.com/jrugen/KrakenDeals/issues)',
          inline: true,
        }
      )
      .setFooter({ text: 'Tip: Type /kraken to see all commands' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

