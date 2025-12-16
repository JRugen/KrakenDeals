const {SlashCommandBuilder} = require('discord.js');
const { isAdmin } = require('../utils/checkAdmin');
const { buildConfigModal } = require('../utils/buildConfigModal');
const { getServerPreferences } = require('../config/preferences');

module.exports = {
    data: new SlashCommandBuilder().setName('config').setDescription('Configure server preferences for KrakenDeals'),
    async execute(interaction){
        if(!isAdmin(interaction.member, interaction.guild)){
            await interaction.reply({content: "You need to be an administrator to use this command.", ephemeral: true});
            return;
        }
        const guildId = interaction.guild.id;
        const prefs = await getServerPreferences(guildId);
        const modal = buildConfigModal(prefs);
        await interaction.showModal(modal);
    }
}