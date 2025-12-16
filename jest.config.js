module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/data/',
  ],
  testMatch: [
    '**/__tests__/**/*.test.js',
  ],
  collectCoverageFrom: [
    'commands/**/*.js',
    'config/**/*.js',
    'utils/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**',
  ],
};

