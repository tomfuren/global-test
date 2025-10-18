/* eslint-env node */
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: ['eslint:recommended', 'google'],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'double', { allowTemplateLiterals: true }],
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {
    require: 'readonly',
    module: 'readonly',
    exports: 'readonly',
    __dirname: 'readonly',
    __filename: 'readonly',
    process: 'readonly',
  },
}
