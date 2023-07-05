import fs from "fs";
import path from "path";

import { Express } from "express";

export default (app: Express): void => {
  fs.readdirSync(path.join(__dirname, "..", "routes")).map(async (file) => {
    const route = (await import(`~/main/routes/${file}`)).default;
    route(app);
  });
};
