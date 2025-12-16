const { isAdmin } = require('../../utils/checkAdmin');

describe('checkAdmin', () => {
  let mockMember, mockGuild;

  beforeEach(() => {
    mockGuild = {
      ownerId: 'owner123',
    };

    mockMember = {
      id: 'user123',
      permissions: {
        has: jest.fn(),
      },
    };
  });

  test('should return true if user has ADMINISTRATOR permission', () => {
    mockMember.permissions.has.mockReturnValue(true);

    const result = isAdmin(mockMember, mockGuild);

    expect(result).toBe(true);
    expect(mockMember.permissions.has).toHaveBeenCalledWith('ADMINISTRATOR');
  });

  test('should return true if user is server owner', () => {
    mockMember.id = 'owner123';
    mockMember.permissions.has.mockReturnValue(false);

    const result = isAdmin(mockMember, mockGuild);

    expect(result).toBe(true);
  });

  test('should return false if user is not admin and not owner', () => {
    mockMember.permissions.has.mockReturnValue(false);
    mockMember.id = 'user123';

    const result = isAdmin(mockMember, mockGuild);

    expect(result).toBe(false);
  });

  test('should handle undefined member gracefully', () => {
    const result = isAdmin(undefined, mockGuild);

    expect(result).toBe(false);
  });

  test('should handle undefined guild gracefully', () => {
    mockMember.permissions.has.mockReturnValue(false);

    const result = isAdmin(mockMember, undefined);

    expect(result).toBe(false);
  });
});

