/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  // Jest snapshots are incompatible with prettier 3
  prettierPath: require.resolve('prettier-2'),
}

module.exports = config
