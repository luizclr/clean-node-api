import { Response } from "express";
import request from "supertest";

import app from "~/main/config/app";

describe("Content  Type Middleware", () => {
  it("shoud return default content type as JSON", async () => {
    app.get("/test-json", (_, res: Response) => {
      res.send("");
    });

    await request(app).get("/test-json").expect("content-type", /json/);
  });

  it("shoud return other content when forced", async () => {
    app.get("/test-xml", (_, res: Response) => {
      res.type("xml");
      res.send("");
    });

    await request(app).get("/test-xml").expect("content-type", /xml/);
  });
});
