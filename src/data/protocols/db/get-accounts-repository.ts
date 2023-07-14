import { Account } from "~/domain/entities/account";

export interface GetAccountsRepository {
  getAll(): Promise<Account[]>;
}
