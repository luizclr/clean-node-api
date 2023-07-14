import { Router } from "express";

import { routeAdapter } from "~/main/adapters/express/express-route-adapter";
import { makeGetAccountsController } from "~/main/factories/controllers/accounts/accounts-factory";
import { makeGetAccountByIdController } from "~/main/factories/controllers/accounts/get-account-by-id-factory";

export default (router: Router): void => {
  router.get("/accounts", routeAdapter(makeGetAccountsController()));
  router.get("/accounts/:id", routeAdapter(makeGetAccountByIdController()));
};
