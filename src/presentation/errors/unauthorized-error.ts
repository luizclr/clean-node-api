export class UnauthorizedError extends Error {
  constructor(message = "Permission denied") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
