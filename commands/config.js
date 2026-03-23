const {SlashCommandBuilder} = require('discord.js');
const { isAdmin } = require('../utils/checkAdmin');
const { buildConfigModal } = require('../utils/buildConfigModal');
const { getServerPreferences } = require('../config/preferences');

module.exports = {
    data: new SlashCommandBuilder().setName('config').setDescription('Configure server preferences for KrakenDeals'),
    async execute(interaction){
        // Get server ID - try guild object first, then fallback to guildId
        const guildId = interaction.guild?.id || interaction.guildId;
        
        if (!guildId) {
            await interaction.reply({
                content: "❌ This command can only be used in a server. Please make sure the bot is properly added to the server.",
                ephemeral: true
            });
            return;
        }

        if(!isAdmin(interaction.member, interaction.guild)){
            await interaction.reply({content: "You need to be an administrator to use this command.", ephemeral: true});
            return;
        }
        const prefs = await getServerPreferences(guildId);
        const modal = buildConfigModal(prefs);
        await interaction.showModal(modal);
    }
}