import { Client, GatewayIntentBits, ActivityType } from "discord.js";
import { getrecentrxscore, getrecentscore } from "./commands/recentscore";
import { config } from "./config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { pingIDToUser, usernameToUser } from "./util/osuDiscordUser";
import { setUser } from "./commands/setuser";
import { GlobalLeaderboard } from "./commands/leaderboard";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

function isRealValue(obj: any) {
  return obj && obj !== "null" && obj !== "undefined";
}

const mongoURI = `mongodb+srv://BlobBot:${config.MONGO_PASSWORD}@clusterdemo.rpspo.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDemo`;

const mongoClient = new MongoClient(mongoURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const db = mongoClient.db("Players");
const coll = db.collection("data");

client.on("ready", () => {
  console.log("Bot is ready");
  client.user?.setActivity("over Blobsu server", {
    type: ActivityType.Watching,
  });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(">setuser")) {
    setUser({ message, coll });
  }

  if (
    message.content.startsWith(">leaderboard") ||
    message.content.startsWith(">lb")
  ) {
    try {
      const leader = await GlobalLeaderboard();
      message.channel.send({ embeds: [leader!] });
    } catch {
      return message.channel.send(`An error has occurred. Blame Pana`);
    }
  }

  if (message.content.startsWith(">rs")) {
    const msgArr = message.content.split(" ");
    if (msgArr.length == 1) {
      try {
        const res = await usernameToUser(
          message.author.username,
          coll,
          message
        );
        const embed = await getrecentscore({
          value: res!.osuUser,
          dataType: "id",
        });
        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        return message.channel.send(`An error has occurred. Blame Pana`);
      }
    } else if (msgArr.length == 2) {
      if (!msgArr[1].startsWith("<@")) {
        try {
          const embed = await getrecentscore({
            value: msgArr[1],
            dataType: "name",
          });
          message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.log(error);
          return message.channel.send(`An error has occurred. Blame Pana`);
        }
      } else {
        try {
          const res = await pingIDToUser(msgArr[1], coll, message, client);
          const embed = await getrecentscore({
            value: res!.osuUser,
            dataType: "id",
          });
          message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.log(error);
          return message.channel.send(`An error has occurred. Blame Pana`);
        }
      }
    }
  }

  // Needs to be reformatted so that the function is parameterized

  if (message.content.startsWith(">rx")) {
    const msgArr = message.content.split(" ");
    if (msgArr.length == 1) {
      try {
        const res = await usernameToUser(
          message.author.username,
          coll,
          message
        );
        const embed = await getrecentrxscore({
          value: res!.osuUser,
          dataType: "id",
        });
        message.channel.send({ embeds: [embed] });
      } catch (error) {
        console.log(error);
        return message.channel.send(`An error has occurred. Blame Pana`);
      }
    } else if (msgArr.length == 2) {
      if (!msgArr[1].startsWith("<@")) {
        try {
          const embed = await getrecentrxscore({
            value: msgArr[1],
            dataType: "name",
          });
          message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.log(error);
          return message.channel.send(`An error has occurred. Blame Pana`);
        }
      } else {
        try {
          const res = await pingIDToUser(msgArr[1], coll, message, client);
          const embed = await getrecentrxscore({
            value: res!.osuUser,
            dataType: "id",
          });
          message.channel.send({ embeds: [embed] });
        } catch (error) {
          console.log(error);
          return message.channel.send(`An error has occurred. Blame Pana`);
        }
      }
    }
  }
});

client.login(config.DISCORD_TOKEN);
