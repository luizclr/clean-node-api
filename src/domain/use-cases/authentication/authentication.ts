import { AuthResponse } from "~/domain/use-cases/authentication/types";

export interface Authentication {
  auth(email: string, password: string): Promise<AuthResponse>;
}
