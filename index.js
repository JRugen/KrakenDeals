require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const { getServerPreferences, updateServerPreference } = require('./config/preferences');
const { getSteamDeals } = require('./services/api');
const { buildConfigModal } = require('./utils/buildConfigModal');
const { isAdmin } = require('./utils/checkAdmin');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

/* Load command files */
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  /* Handle autocomplete interactions */
  if (interaction.isAutocomplete()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found for autocomplete.`);
      return;
    }
    try {
      await command.autocomplete(interaction);
    } catch (error) {
      console.error(`Error handling autocomplete for ${interaction.commandName}:`, error);
    }
    return;
  }

  /* Handle slash commands */
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    console.log("Received command:", interaction.commandName);
    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          flags: MessageFlags.Ephemeral,
        });
      }
    }
    return;
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'openConfigModal') {
      /* Placeholder - button interactions here */
    }
  }

  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'configModal') {
      if (!isAdmin(interaction.member, interaction.guild)) {
        await interaction.reply({ content: '❌ You need administrator permissions to configure the bot.', ephemeral: true });
        return;
      }

      const guildId = interaction.guild.id;
      const keyshopValues = interaction.fields.getStringSelectValues('allowKeyshopsSelect');
      const currencyValues = interaction.fields.getStringSelectValues('currencySelect');
      
      const boolValue = keyshopValues[0] === 'true';
      const currencyValue = currencyValues[0];

      await updateServerPreference(guildId, 'allowKeyshops', boolValue);
      await updateServerPreference(guildId, 'currency', currencyValue);
      
      await interaction.reply({ 
        content: `✅ **Configuration Updated!**\n• Keyshops: ${boolValue ? 'allowed' : 'disallowed'}\n• Currency: ${currencyValue}`, 
        ephemeral: true 
      });
      return;
    }
  }
});


client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  /* Placeholder - message commands here */
});

client.login(process.env.DISCORD_BOT_TOKEN);

