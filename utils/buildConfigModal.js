const { ModalBuilder, LabelBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

/**
 * Builds the configuration modal with current preferences
 * @param {Object} prefs - Current server preferences
 * @returns {ModalBuilder} The configured modal
 */
function buildConfigModal(prefs) {
  const modal = new ModalBuilder()
    .setCustomId('configModal')
    .setTitle('KrakenDeals Server Configuration');

  const keyshopSelect = new StringSelectMenuBuilder()
    .setCustomId('allowKeyshopsSelect')
    .setPlaceholder('Select to allow or disallow keyshops')
    .setRequired(true)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Allow Keyshops')
        .setDescription('Allow deals from keyshops')
        .setValue('true')
        .setDefault(prefs.allowKeyshops === true),
      new StringSelectMenuOptionBuilder()
        .setLabel('Disallow Keyshops')
        .setDescription('Disallow deals from keyshops')
        .setValue('false')
        .setDefault(prefs.allowKeyshops === false),
    );

    const keyshopLabel = new LabelBuilder()
    .setLabel('Allow Keyshops')
    .setDescription('Choose whether to allow or disallow keyshops in deal results')
    .setStringSelectMenuComponent(keyshopSelect);

    const currency = new StringSelectMenuBuilder()
    .setCustomId('currencySelect')
    .setPlaceholder('Select your preferred currency')
    .setRequired(true)
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('GBP')
        .setDescription('British Pound Sterling')
        .setValue('GBP')
        .setDefault((prefs.currency || 'GBP') === 'GBP'),
      new StringSelectMenuOptionBuilder()
        .setLabel('USD')
        .setDescription('United States Dollar')
        .setValue('USD')
        .setDefault((prefs.currency || 'GBP') === 'USD'),
      new StringSelectMenuOptionBuilder()
        .setLabel('EUR')
        .setDescription('Euro')
        .setValue('EUR')
        .setDefault((prefs.currency || 'GBP') === 'EUR'),
    );

  const currencyLabel = new LabelBuilder()
    .setLabel('Preferred Currency')
    .setDescription('Select your preferred currency for deal prices')
    .setStringSelectMenuComponent(currency);

  modal.addLabelComponents(keyshopLabel);
  modal.addLabelComponents(currencyLabel);

  return modal;
}

module.exports = { buildConfigModal };

