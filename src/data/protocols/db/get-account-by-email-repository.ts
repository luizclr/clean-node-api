import { AccountWithPass } from "~/domain/entities/account";

export interface GetAccountByEmailRepository {
  getByEmail(email: string): Promise<AccountWithPass>;
}
