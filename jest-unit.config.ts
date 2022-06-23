import type { Config as JestConfig } from "@jest/types";
import config from "./jest.config";

const unitConfig: JestConfig.InitialOptions = {
  ...config,
  testMatch: ["**/*.spec.ts"],
};

export default unitConfig;
