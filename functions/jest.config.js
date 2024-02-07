// @ts-check

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  verbose: true,
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  testEnvironment: 'node',
};

module.exports = config;
