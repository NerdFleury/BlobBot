import { Message } from "discord.js";
import { config } from "../config";
import { Collection } from "mongodb";

export async function setUser({
  message,
  coll,
}: {
  message: Message;
  coll: Collection;
}) {
  const messageArray = message.content.split(" ");

  if (messageArray.length < 2) {
    message.channel.send("Please provide a valid username to link to");
    return;
  }

  const response = await fetch(
    `${config.GET_PLAYER_V1_API}?scope=info&name=${messageArray[1]}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (data.status !== "success") {
    message.channel.send(
      `User \`${messageArray[1]}\` does not exist on blobsu`
    );
    return;
  }

  const query = { discordUser: message.author };

  const data2 = {
    $set: {
      discordUser: message.author.username,
      osuUser: data.player.info.id,
    },
  };

  const options = { upsert: true };

  try {
    await coll.updateOne(query, data2, options).then(() => {
      message.channel.send(
        `Your name is now configured to \`${messageArray[1]}\` `
      );
    });
  } catch (error) {
    console.log(error);
    message.channel.send(`An error has occurred. Blame Pana`);
  }
}
