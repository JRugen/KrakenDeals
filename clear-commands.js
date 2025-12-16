require('dotenv').config();
const { REST, Routes } = require('discord.js');

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log('Clearing global commands...');
    
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: [] },
    );

    console.log('Successfully cleared all global commands.');
    console.log('Now only guild commands will appear.');
  } catch (error) {
    console.error('Error clearing commands:', error);
  }
})();

