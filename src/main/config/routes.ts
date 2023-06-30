import { Express } from "express";
import fs from "fs";
import path from "path";

export default (app: Express): void => {
  fs.readdirSync(path.join(__dirname, "..", "routes")).map(async (file) => {
    const route = (await import(`~/main/routes/${file}`)).default;
    route(app);
  });
};
