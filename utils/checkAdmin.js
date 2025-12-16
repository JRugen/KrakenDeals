/**
 * Check if a user has administrator permissions
 * @param {GuildMember} member - The guild member to check
 * @param {Guild} guild - The guild
 * @returns {boolean} True if user is admin or server owner
 */
function isAdmin(member, guild) {
  return member?.permissions.has('ADMINISTRATOR') || member?.id === guild?.ownerId;
}

module.exports = { isAdmin };

