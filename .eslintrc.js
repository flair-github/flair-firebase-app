module.exports = {
  extends: [
    '@react-native-community',
    "plugin:tailwindcss/recommended",
  ],
  ignorePatterns: ['**/*.js'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'no-unused-vars': 'off',
    'no-lone-blocks': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-bitwise': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'semi': ['error', 'never'],
    'no-extra-semi': 'off',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    es2017: true,
    es2020: true,
  },
  globals: {
    JSX: true,
    NodeJS: true,
    MediaStream: true,
    MediaStreamConstraints: true,
    HTMLVideoElement: true,
  },
};
