import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("accounts").del();

  // Inserts seed entries
  await knex("accounts").insert([
    {
      id: "72145cf5-26e4-4845-9fad-d43f83df3c9a",
      name: "User 1",
      email: "user1@email.com",
      password: "hashed_password",
    },
    {
      id: "0191761a-501c-4934-94f2-339255e77144",
      name: "User 2",
      email: "user2@email.com",
      password: "hashed_password",
    },
    {
      id: "41bada5d-eef0-46b2-8db7-d75d8118f925",
      name: "User 3",
      email: "user3@email.com",
      password: "hashed_password",
    },
  ]);
}
