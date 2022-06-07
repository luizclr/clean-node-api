module.exports = {
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: ['<rootDir>/tests/**/*.ts'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  coverageProvider: "v8",
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
};
