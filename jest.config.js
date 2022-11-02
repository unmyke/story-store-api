module.exports = {
  testMatch: ['**/*.(test|spec).js'],
  testEnvironment: 'node',
  collectCoverageFrom: [
    '(lib|services)/**/*.{js,jsx}',
    '!**/index.js',
    '!**/handlers.js',
  ],
  coveragePathIgnorePatterns: [
    'lib/create-webpack-config',
    '.webpack',
    '.serverless',
  ],
};
