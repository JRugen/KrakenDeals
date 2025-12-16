const {
  getServerPreferences,
  setServerPreferences,
  updateServerPreference,
  DEFAULT_PREFERENCES,
} = require('../../config/preferences');

// Mock fs.promises module
const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();
const mockMkdir = jest.fn();

jest.mock('fs', () => ({
  promises: {
    readFile: (...args) => mockReadFile(...args),
    writeFile: (...args) => mockWriteFile(...args),
    mkdir: (...args) => mockMkdir(...args),
  },
}));

describe('Preferences', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServerPreferences', () => {
    test('should return default preferences for new server', async () => {
      mockReadFile.mockRejectedValue({ code: 'ENOENT' });

      const prefs = await getServerPreferences('new-guild-id');

      expect(prefs).toEqual(DEFAULT_PREFERENCES);
    });

    test('should return saved preferences for existing server', async () => {
      const savedPrefs = {
        'existing-guild-id': {
          allowKeyshops: false,
          currency: 'USD',
        },
      };
      mockReadFile.mockResolvedValue(JSON.stringify(savedPrefs));

      const prefs = await getServerPreferences('existing-guild-id');

      expect(prefs).toEqual({
        allowKeyshops: false,
        currency: 'USD',
      });
    });

    test('should return saved preferences as-is', async () => {
      const savedPrefs = {
        'partial-guild-id': {
          currency: 'EUR',
        },
      };
      mockReadFile.mockResolvedValue(JSON.stringify(savedPrefs));

      const prefs = await getServerPreferences('partial-guild-id');

      expect(prefs.currency).toBe('EUR');
      // Note: getServerPreferences returns saved prefs directly, not merged with defaults
      expect(prefs.allowKeyshops).toBeUndefined();
    });
  });

  describe('setServerPreferences', () => {
    test('should save preferences for a server', async () => {
      mockReadFile.mockResolvedValue('{}');
      mockWriteFile.mockResolvedValue();
      mockMkdir.mockResolvedValue();

      const newPrefs = { allowKeyshops: false, currency: 'USD' };
      const result = await setServerPreferences('guild-id', newPrefs);

      expect(result).toEqual({
        ...DEFAULT_PREFERENCES,
        ...newPrefs,
      });
      expect(mockWriteFile).toHaveBeenCalled();
    });
  });

  describe('updateServerPreference', () => {
    test('should update a single preference', async () => {
      const existingPrefs = {
        'guild-id': {
          allowKeyshops: true,
          currency: 'GBP',
        },
      };
      mockReadFile.mockResolvedValue(JSON.stringify(existingPrefs));
      mockWriteFile.mockResolvedValue();
      mockMkdir.mockResolvedValue();

      const result = await updateServerPreference('guild-id', 'currency', 'EUR');

      expect(result.currency).toBe('EUR');
      expect(result.allowKeyshops).toBe(true);
    });
  });
});

