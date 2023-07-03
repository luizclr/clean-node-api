export class UserAlreadyExistError extends Error {
  constructor() {
    super("User Already Exist");
    this.name = "UserAlreadyExistError";
  }
}
