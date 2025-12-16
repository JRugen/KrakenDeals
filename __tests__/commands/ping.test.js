const pingCommand = require('../../commands/ping');

describe('Ping Command', () => {
  let mockInteraction;

  beforeEach(() => {
    mockInteraction = {
      reply: jest.fn().mockResolvedValue(),
    };
  });

  test('should have correct command data', () => {
    expect(pingCommand.data.name).toBe('ping');
    expect(pingCommand.data.description).toBe('Replies with Pong!');
  });

  test('should reply with pong message', async () => {
    await pingCommand.execute(mockInteraction);

    expect(mockInteraction.reply).toHaveBeenCalledWith('Pong Dude !');
  });
});

