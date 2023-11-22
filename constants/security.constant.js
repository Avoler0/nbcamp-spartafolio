import 'dotenv/config';

export const PASSWORD_HASH_SALT_ROUNDS = Number.parseInt(
  process.env.PASSWORD_HASH_SALT_ROUNDS,
  10,
);
