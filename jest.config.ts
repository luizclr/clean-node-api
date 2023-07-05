import type { Config as JestConfig } from "@jest/types";

const config: JestConfig.InitialOptions = {
  roots: ["<rootDir>/tests"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/main/**"],
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
