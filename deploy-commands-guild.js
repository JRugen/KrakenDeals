require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    if (!process.env.DISCORD_GUILD_ID) {
      console.error('❌ DISCORD_GUILD_ID not set in .env file');
      process.exit(1);
    }

    console.log(`Started refreshing ${commands.length} application (/) commands for guild ${process.env.DISCORD_GUILD_ID}.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
      { body: commands },
    );
    console.log('Commands should appear immediately in your server!');
  } catch (error) {
    console.error('Error deploying commands:', error);
  }
})();

