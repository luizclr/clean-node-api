import { Response } from "express";
import request from "supertest";
import app from "~/main/config/app";

describe("CORS Middleware", () => {
  it("shoud enable CORS", async () => {
    app.get("/test", (_, res: Response) => {
      res.send();
    });

    await request(app)
      .get("/test")
      .expect("access-control-allow-origin", "*")
      .expect("access-control-allow-methods", "*")
      .expect("access-control-allow-headers", "*");
  });
});
