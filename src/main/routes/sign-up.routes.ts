import { Router } from "express";

export default (router: Router): void => {
  router.post("/signup", (_, res) => {
    res.send();
  });
};
