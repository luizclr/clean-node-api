import { LogControllerDecorator } from "~/main/decorators/log-decorator/log-controller";
import { Controller } from "~/presentation/protocols/controller";

export type makeSutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
};
