import { Account } from "~/domain/entities/account";

export interface GetAccounts {
  getAll(): Promise<Account[]>;
}
