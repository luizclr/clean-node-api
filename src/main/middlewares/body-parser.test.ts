import { Request, Response } from "express";
import request from "supertest";
import app from "../config/app";

describe("Body Parser Middleware", () => {
  it("shoud parse body as JSON", async () => {
    app.post("/test", (req: Request, res: Response) => {
      res.send(req.body);
    });

    await request(app)
      .post("/test")
      .send({ name: "Luiz" })
      .expect({ name: "Luiz" });
  });
});
