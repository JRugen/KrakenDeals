const fs = require('fs').promises;
const path = require('path');

const PREFERENCES_FILE = path.join(__dirname, '../data/preferences.json');
const DEFAULT_PREFERENCES = {
  allowKeyshops: true,
  currency: 'GBP',
};

async function loadPreferences() {
  try {
    const data = await fs.readFile(PREFERENCES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

async function savePreferences(preferences) {
  const dir = path.dirname(PREFERENCES_FILE);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(PREFERENCES_FILE, JSON.stringify(preferences, null, 2), 'utf8');
}

async function getServerPreferences(guildId) {
  const allPreferences = await loadPreferences();
  return allPreferences[guildId] || { ...DEFAULT_PREFERENCES };
}

async function setServerPreferences(guildId, newPreferences) {
  const allPreferences = await loadPreferences();
  allPreferences[guildId] = {
    ...DEFAULT_PREFERENCES,
    ...(allPreferences[guildId] || {}),
    ...newPreferences,
  };
  await savePreferences(allPreferences);
  return allPreferences[guildId];
}


async function updateServerPreference(guildId, key, value) {
  return await setServerPreferences(guildId, { [key]: value });
}

module.exports = {
  getServerPreferences,
  setServerPreferences,
  updateServerPreference,
  DEFAULT_PREFERENCES,
};

