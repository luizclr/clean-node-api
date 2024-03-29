import { Router } from "express";

import { routeAdapter } from "~/main/adapters/express/express-route-adapter";
import { makeLoginController } from "~/main/factories/controllers/auth/login-factory";
import { makeSignUpController } from "~/main/factories/controllers/auth/signup-factory";

export default (router: Router): void => {
  router.post("/signup", routeAdapter(makeSignUpController()));
  router.get("/login", routeAdapter(makeLoginController()));
};
