import { Account } from "~/domain/entities/account";

export interface GetAccounts {
  get(): Promise<Account[]>;
}
