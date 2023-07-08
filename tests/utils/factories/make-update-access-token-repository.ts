import { UpdateAccessTokenRepository } from "~/data/protocols/db/update-access-token-repository";

export const makeUpdateAccessTokenRepositoryStub =
  (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
      implements UpdateAccessTokenRepository
    {
      async updateToken(_id: string, _token: string): Promise<void> {
        return;
      }
    }

    return new UpdateAccessTokenRepositoryStub();
  };
