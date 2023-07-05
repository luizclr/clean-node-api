export class AccountAlreadyExistError extends Error {
  constructor() {
    super("Account Already Exist");
    this.name = "AccountAlreadyExistError";
  }
}
