import { Account } from "~/domain/entities/account";

export interface GetAccountsRepository {
  get(): Promise<Account[]>;
}
