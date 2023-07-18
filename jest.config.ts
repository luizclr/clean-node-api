import type { Config as JestConfig } from "@jest/types";

const config: JestConfig.InitialOptions = {
  roots: ["<rootDir>/tests", "<rootDir>/src"],
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/main/index.ts",
    "!<rootDir>/src/main/config/**",
    "!<rootDir>/src/domain/**",
    "!<rootDir>/src/**/protocols/**",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup-envs.js"],
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/src/$1",
    "#/(.*)": "<rootDir>/tests/$1",
  },
};

export default config;
