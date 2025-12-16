const priceCommand = require('../../commands/price');
const axios = require('axios');

// Mock axios
jest.mock('axios');
jest.mock('../../config/preferences', () => ({
  getServerPreferences: jest.fn().mockResolvedValue({
    currency: 'GBP',
    allowKeyshops: true,
  }),
}));

describe('Price Command', () => {
  let mockInteraction;
  let consoleErrorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    mockInteraction = {
      options: {
        getString: jest.fn(),
        getFocused: jest.fn(),
      },
      guild: {
        id: 'test-guild-id',
      },
      deferReply: jest.fn().mockResolvedValue(),
      editReply: jest.fn().mockResolvedValue(),
      respond: jest.fn().mockResolvedValue(),
    };
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  test('should have correct command data', () => {
    expect(priceCommand.data.name).toBe('price');
    expect(priceCommand.data.description).toBe('Search for prices on a specific game');
  });

  describe('autocomplete', () => {
    test('should return empty array for short queries', async () => {
      mockInteraction.options.getFocused.mockReturnValue('a');

      await priceCommand.autocomplete(mockInteraction);

      expect(mockInteraction.respond).toHaveBeenCalledWith([]);
    });

    test('should return game suggestions for valid query', async () => {
      mockInteraction.options.getFocused.mockReturnValue('satisfactory');
      
      const mockGames = [
        { igdb_id: 123, name: 'Satisfactory' },
        { igdb_id: 456, name: 'Satisfactory 2' },
      ];

      axios.get.mockResolvedValue({
        data: { games: mockGames },
      });

      await priceCommand.autocomplete(mockInteraction);

      expect(axios.get).toHaveBeenCalled();
      expect(mockInteraction.respond).toHaveBeenCalled();
      
      const respondCall = mockInteraction.respond.mock.calls[0][0];
      expect(respondCall.length).toBeGreaterThan(0);
      expect(respondCall[0]).toHaveProperty('name');
      expect(respondCall[0]).toHaveProperty('value');
    });

    test('should limit results to 25 games', async () => {
      mockInteraction.options.getFocused.mockReturnValue('test');
      
      const manyGames = Array.from({ length: 30 }, (_, i) => ({
        igdb_id: i,
        name: `Game ${i}`,
      }));

      axios.get.mockResolvedValue({
        data: { games: manyGames },
      });

      await priceCommand.autocomplete(mockInteraction);

      const respondCall = mockInteraction.respond.mock.calls[0][0];
      expect(respondCall.length).toBe(25);
    });
  });

  describe('execute', () => {
    test('should fetch and display price information', async () => {
      mockInteraction.options.getString.mockReturnValue('123|Satisfactory');

      const mockPriceData = {
        data: {
          lowest_price: 22.34,
          base_price: 33.5,
          price_count: 7,
          currency: 'GBP',
          game_url: 'https://example.com/game',
          image_url: 'https://example.com/image.jpg',
          cheapest_prices: [
            { provider_name: 'Test Store', price: 22.34, direct_link: 'https://example.com' },
          ],
        },
      };

      axios.post.mockResolvedValue({ data: mockPriceData });

      await priceCommand.execute(mockInteraction);

      expect(axios.post).toHaveBeenCalled();
      expect(mockInteraction.deferReply).toHaveBeenCalled();
      expect(mockInteraction.editReply).toHaveBeenCalled();
    });

    test('should handle API errors gracefully', async () => {
      mockInteraction.options.getString.mockReturnValue('123|Satisfactory');
      axios.post.mockRejectedValue(new Error('API Error'));

      await priceCommand.execute(mockInteraction);

      expect(mockInteraction.editReply).toHaveBeenCalled();
      const errorCall = mockInteraction.editReply.mock.calls[0][0];
      expect(errorCall).toContain('Error');
    });
  });
});

