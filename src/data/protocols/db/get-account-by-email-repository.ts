import { AccountWithPass } from "~/domain/entities/account";

export interface GetAccountByEmailRepository {
  get(email: string): Promise<AccountWithPass>;
}
