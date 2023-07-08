import { Router } from "express";

import { routeAdapter } from "~/main/adapters/express/express-route-adapter";
import { makeSignUpController } from "~/main/factories/signup";

export default (router: Router): void => {
  router.post("/signup", routeAdapter(makeSignUpController()));
};
