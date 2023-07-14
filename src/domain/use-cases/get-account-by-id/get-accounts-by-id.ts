import { Account } from "~/domain/entities/account";

export interface GetAccountById {
  getById(id: string): Promise<Account>;
}
