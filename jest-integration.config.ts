import type { Config as JestConfig } from "@jest/types";
import config from "./jest.config";

const integrationConfig: JestConfig.InitialOptions = {
  ...config,
  testMatch: ["**/*.test.ts"],
};

export default integrationConfig;
