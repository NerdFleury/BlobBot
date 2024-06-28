import { Client, Message, RoleSelectMenuBuilder } from "discord.js";
import { Collection } from "mongodb";

export async function usernameToUser(
  user: any,
  coll: Collection,
  message: Message
) {
  const query = { discordUser: user };
  const projection = { osuUser: 1 };
  try {
    const res = await coll
      .findOne(query, { projection: projection })
      .then(async (res) => {
        if (Object.is(res?.osuUser, undefined)) {
          return console.error();
        } else {
          return res;
        }
      });
    const data = res;
    return data;
  } catch (error) {
    console.log(error);
    return message.channel.send(`An error has occurred. Blame Pana`);
  }
}

export async function pingIDToUser(
  userID: string,
  coll: Collection,
  message: Message,
  client: Client
) {
  const user = await client.users.fetch(userID.replace(/[<>@]/g, ""));
  const query = { discordUser: user.username };
  const projection = { osuUser: 1 };
  try {
    const res = await coll
      .findOne(query, { projection: projection })
      .then(async (res) => {
        if (Object.is(res?.osuUser, undefined)) {
          return console.error();
        } else {
          return res;
        }
      });
    const data = res;
    return data;
  } catch (error) {
    console.log(error);
    return message.channel.send(`An error has occurred. Blame Pana`);
  }
}
