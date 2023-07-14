import { Account } from "~/domain/entities/account";

export interface GetAccountByIdRepository {
  getById(id: string): Promise<Account>;
}
