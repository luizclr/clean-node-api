import type { Config as JestConfig } from "@jest/types";

const config: JestConfig.InitialOptions = {
  roots: ["<rootDir>/tests"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coveragePathIgnorePatterns: ["<rootDir>/src/index.ts"],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
};

export default config;
