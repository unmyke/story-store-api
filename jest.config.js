module.exports = {
  testMatch: ['**/*.(test|spec).js'],
  testEnvironment: 'node',
  collectCoverageFrom: ['(lib|services)/**/*.{js,jsx}'],
  coveragePathIgnorePatterns: ['lib/configs', '.webpack', '.serverless'],
};
