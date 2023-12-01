module.exports = {
  testEnvironment: 'miniflare',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'esbuild-jest',
    '^.+\\.js$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [ "node_modules/(?!(yaml/browser))" ],
}
