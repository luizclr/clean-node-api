import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import app from "~/main/config/app";

app.get("/", (_, res: Response) => {
  res.status(StatusCodes.OK).send({ version: "1.0.0" });
});

const PORT = 8080;

app.listen(PORT, () => console.log(`app running on port ${PORT}...`));
