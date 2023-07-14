import { Router } from "express";

import { routeAdapter } from "~/main/adapters/express/express-route-adapter";
import { makeGetAccountsController } from "~/main/factories/controllers/accounts/accounts-factory";

export default (router: Router): void => {
  router.get("/accounts", routeAdapter(makeGetAccountsController()));
};
