import { Response } from "express";
import request from "supertest";
import app from "~/main/config/app";

describe("SignUp routes", () => {
  it("should return an account on success", async () => {
    app.get("/test", (_, res: Response) => {
      res.send();
    });

    await request(app)
      .post("/signup")
      .send({
        name: "Will Smith",
        email: "will.smith@email.com",
        password: "123",
        passwordConfirmation: "123",
      })
      .expect(200);
  });
});
