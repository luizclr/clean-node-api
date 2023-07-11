import fs from "fs";
import path from "path";

import { Express, Router } from "express";

export default (app: Express): void => {
  const router = Router();
  app.use("/api", router);
  fs.readdirSync(path.join(__dirname, "..", "routes")).map(async (file) => {
    if (!file.includes(".map")) {
      (await import(`../routes/${file}`)).default(router);
    }
  });
};
