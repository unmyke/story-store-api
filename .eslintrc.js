const srcConfig = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
  },
  settings: {
    'import/parsers': {
      '@babel/eslint-parser': ['.js'],
    },
  },
  plugins: ['@babel', 'import', 'prettier'],
  extends: ['eslint:recommended', 'plugin:import/recommended', 'prettier'],
  rules: {
    '@babel/new-cap': 'error',
    '@babel/no-invalid-this': 'error',
    '@babel/no-unused-expressions': 'error',
    '@babel/semi': 'error',
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',
    'import/order': ['error', { 'newlines-between': 'always' }],
  },
};

const jestConfig = {
  files: ['*.test.js', '*.spec.js'],
  env: {
    ...srcConfig.env,
    'jest/globals': true,
  },
  extends: ['plugin:jest/all', ...srcConfig.extends],
  plugins: ['jest', ...srcConfig.plugins],
  rules: {
    ...srcConfig.rules,
    'jest/no-hooks': 'off',
    'jest/prefer-expect-assertions': 'off',
    'jest/max-nested-describe': 'off',
  },
};

module.exports = { ...srcConfig, overrides: [jestConfig] };
