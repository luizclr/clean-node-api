import { Router } from "express";
import { StatusCodes } from "http-status-codes";

export default (router: Router): void => {
  router.get("/", (_req, res) =>
    res.status(StatusCodes.OK).json({ version: "1.0.0" })
  );
};
