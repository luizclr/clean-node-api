import express from "express";
import { databaseSetup } from "~/main/config/db";
import setupMiddlewares from "~/main/config/middlewares";
import setupRoutes from "~/main/config/routes";

const app = express();
setupMiddlewares(app);
setupRoutes(app);

databaseSetup();
export default app;
