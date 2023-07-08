export interface Encrypter {
  encrypt(value: string | Record<string, unknown>): Promise<string>;
}
