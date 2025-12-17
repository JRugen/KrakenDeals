# KrakenDeals Discord Bot

<div align="center">

![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

**Find the best game deals directly in Discord**

[![Add to Discord](https://img.shields.io/badge/Add%20to%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/api/oauth2/authorize?client_id=1450419869194649723&permissions=274877906944&scope=bot%20applications.commands)

</div>

---

## What is KrakenDeals?

**KrakenDeals** is a Discord bot that brings powerful game deal-finding capabilities directly into your Discord server. Search for any Steam game, compare prices across multiple retailers, and find the best deals—all without leaving Discord.

With easy to use slash commands and autocomplete search, your community can quickly discover the lowest prices, view historical pricing data, check Steam Deck compatibility, and see Steam reviews all in nicely formatted Discord embeds.

---

## What is KrakenKeys?

**KrakenKeys** is a comprehensive game deal aggregator platform that helps gamers find the best prices across multiple retailers and keyshops. It aggregates deals from various sources, tracks historical pricing data, and provides detailed information about game compatibility, reviews, and more.

KrakenKeys continuously monitors prices from trusted retailers, ensuring you always have access to the most up-to-date deal information.

---

## Why Use KrakenDeals?

- 🔍 **Instant Search** - Autocomplete game search makes finding deals effortless
- 💰 **Price Comparison** - See lowest prices, base prices, and multiple provider options at a glance
- 📊 **Rich Information** - Historical lows, Steam Deck compatibility, Steam reviews, and more
- ⚙️ **Customizable** - Per-server configuration for currency and keyshop preferences
- 🎨 **Beautiful Display** - Clean, readable embeds with game artwork
- 🔗 **Direct Links** - Click through to purchase deals directly
- 🚀 **Fast & Reliable** - Powered by the KrakenKeys API for accurate, real-time data

---

## Commands

### `/help`
Show all available commands and how to use them. Displays a helpful embed with command descriptions and examples.

### `/price <game> [currency]`
Search for prices on a specific game with autocomplete.

**Parameters:**
- `game` (required) - Game name (autocomplete enabled - start typing to see suggestions)
- `currency` (optional) - Override server currency (GBP, USD, EUR). Defaults to your server's configured currency.

**Example:**
```
/price game:Satisfactory currency:GBP
```

**What you'll see:**
- Lowest price and base price
- Top 5 cheapest prices with direct purchase links
- Historical lowest price
- Steam Deck compatibility rating
- Steam review scores
- Game artwork and links

### `/config`
Configure server preferences (admin only). Opens a configuration modal where you can:
- **Allow/Disallow Keyshops** - Control whether keyshop deals appear in results
- **Set Default Currency** - Choose GBP, USD, or EUR as your server's default

---

## How to Add to Your Server

### Quick Install

1. **Click the "Add to Discord" button** at the top of this page
   - Or use this link: `https://discord.com/api/oauth2/authorize?client_id=1450419869194649723&permissions=274877906944&scope=bot%20applications.commands`

2. **Select your server** from the dropdown

3. **Authorize the bot** - Grant the necessary permissions

4. **Start using commands!** Type `/` in your server to see available commands (type `/kraken` and you will see all our commands)



### Permissions Required

The bot needs the following permissions:
- Send Messages
- Read Message History
- Use Slash Commands / Creating Commands

---

## Report Issues & Request Features

We welcome feedback and contributions!

- 🐛 **Found a bug?** [Open an issue](https://github.com/jrugen/KrakenDeals/issues) with details about what happened
- 💡 **Have a feature request?** [Create a feature request](https://github.com/jrugen/KrakenDeals/issues) describing what you'd like to see
- ❓ **Need help?** Check the [Troubleshooting](#troubleshooting) section below or open an issue

---

<div align="center">

---

## 👨‍💻 For Developers

*The following sections are for developers who want to contribute to or run their own instance of KrakenDeals*

---

</div>

## Local Development Setup

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- A Discord application (get one at [Discord Developer Portal](https://discord.com/developers/applications))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jrugen/KrakenDeals.git
   cd KrakenDeals
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your configuration:
   ```env
   DISCORD_BOT_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   KRAKENKEYS_API_URL=https://krakenkeys.com/api/v1/discord
   # Optional: DISCORD_GUILD_ID=your_server_id (for guild-specific command deployment)
   ```

4. **Deploy commands to Discord**
   ```bash
   # For instant testing (guild-specific)
   npm run deploy:guild
   
   # Or for global deployment (takes up to 1 hour)
   npm run deploy
   ```

5. **Start the bot**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

---

## Project Structure

```
KrakenDeals/
├── commands/              # Slash command handlers
│   ├── config.js         # Server configuration command
│   ├── ping.js           # Ping command
│   └── price.js          # Game price search command
├── config/               # Configuration modules
│   └── preferences.js    # Server preferences management
├── services/             # External service integrations
│   └── api.js            # KrakenKeys API client
├── utils/                # Utility functions
│   ├── buildConfigModal.js  # Configuration modal builder
│   └── checkAdmin.js     # Admin permission checker
├── data/                 # Data storage (auto-created)
│   └── preferences.json  # Server preferences (gitignored)
├── __tests__/            # Test files
│   ├── commands/         # Command tests
│   ├── config/           # Config tests
│   └── utils/            # Utility tests
├── deploy-commands.js    # Command deployment script
├── deploy-commands-guild.js  # Guild-specific deployment
├── clear-commands.js     # Clear global commands
├── jest.config.js       # Jest test configuration
├── index.js              # Main bot file
└── package.json          # Dependencies and scripts
```

---

## Testing

This project uses [Jest](https://jestjs.io/) for testing. Tests are located in the `__tests__` directory.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

Tests are organized to match the project structure:
- `__tests__/commands/` - Command handler tests
- `__tests__/config/` - Configuration module tests
- `__tests__/utils/` - Utility function tests

---

## Development Guide

### Adding New Commands

1. Create a new file in `commands/`:
   ```javascript
   const { SlashCommandBuilder } = require('discord.js');
   
   module.exports = {
     data: new SlashCommandBuilder()
       .setName('mycommand')
       .setDescription('My command description'),
     
     async execute(interaction) {
       await interaction.reply('Hello!');
     },
   };
   ```

2. Deploy commands:
   ```bash
   npm run deploy:guild
   ```

### Adding Autocomplete

Commands can include autocomplete functionality:

```javascript
async autocomplete(interaction) {
  const focusedValue = interaction.options.getFocused();
  // Return array of choices
  await interaction.respond([
    { name: 'Option 1', value: 'value1' },
    { name: 'Option 2', value: 'value2' },
  ]);
}
```

### Server Preferences

Each Discord server can have its own configuration stored in `data/preferences.json`:
- **Currency** - Default currency for price displays (GBP, USD, EUR)
- **Keyshops** - Whether to include keyshop deals in results

Preferences are automatically applied to all commands.

---

## API Integration

The bot integrates with the KrakenKeys API to fetch game data and prices.

### API Endpoints Used

- `GET /discord/search-games?query=<game_name>` - Search for games (autocomplete)
- `POST /discord/game-price` - Get price information for a game

### API Request Format

```json
{
  "game_name": "Satisfactory",
  "server_id": "discord_guild_id",
  "currency": "GBP",
  "keyshops_enabled": true,
  "igdb_id": 123456
}
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DISCORD_BOT_TOKEN` | Your Discord bot token | Yes |
| `DISCORD_CLIENT_ID` | Your Discord application ID | Yes |
| `KRAKENKEYS_API_URL` | KrakenKeys API base URL | No (defaults to production) |
| `DISCORD_GUILD_ID` | Server ID for guild-specific command deployment | No (for testing) |

---

## Contributing

Contributions are welcome! This is an open-source project, and we appreciate any help.

### How to Contribute

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/SweetFeature`)
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run tests** to ensure everything passes (`npm test`)
6. **Commit your changes** (`git commit -m 'Add some SweetFeature'`)
7. **Push to the branch** (`git push origin feature/SweetFeature`)
8. **Open a Pull Request**

---

## Troubleshooting

### Commands Not Appearing

- **Global commands** can take up to 1 hour to appear
- Use `npm run deploy:guild` for instant testing
- Restart Discord to refresh command cache
- Ensure `DISCORD_CLIENT_ID` is set correctly

### Bot Not Responding

- Check that the bot is online (green indicator in Discord)
- Verify `DISCORD_BOT_TOKEN` is correct in `.env`
- Ensure Message Content Intent is enabled in Discord Developer Portal
- Check console logs for error messages

### Duplicate Commands

If you see duplicate commands, you've deployed both globally and to a guild:
```bash
npm run clear:global
```

### API Errors

- Verify `KRAKENKEYS_API_URL` is correct
- Review console logs for detailed error messages

### Module Not Found Errors

- Run `npm install` to ensure all dependencies are installed
- Check that Node.js version is v18 or higher

---

## License

This project is licensed under the ISC License.

---

## Support & Links

- **Website**: [KrakenKeys.com](https://krakenkeys.com)
- **GitHub Issues**: [Report Issues](https://github.com/jrugen/KrakenDeals/issues)
- **Email**: contact@krakenkeys.com

---

## Acknowledgments

- Built with [discord.js](https://discord.js.org/)
- Powered by [KrakenKeys](https://krakenkeys.com)
- Game data from [IGDB](https://www.igdb.com/)

---

<div align="center">

Made with ❤️ for the gaming community

[⭐ Star this repo](https://github.com/jrugen/KrakenDeals) | [🐛 Report Bug](https://github.com/jrugen/KrakenDeals/issues) | [💡 Request Feature](https://github.com/jrugen/KrakenDeals/issues)

</div>
