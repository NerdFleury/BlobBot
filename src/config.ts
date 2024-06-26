import dotenv from "dotenv";

dotenv.config();

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  MONGO_USER,
  MONGO_PASSWORD,
  GET_PLAYER_V1_API,
  GET_RECENT,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !DISCORD_CLIENT_ID ||
  !MONGO_PASSWORD ||
  !MONGO_USER ||
  !GET_PLAYER_V1_API ||
  !GET_RECENT
) {
  throw new Error("Missing environment variables");
}

export const config = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  MONGO_USER,
  MONGO_PASSWORD,
  GET_PLAYER_V1_API,
  GET_RECENT,
};
