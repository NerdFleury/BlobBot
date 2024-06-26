import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  REST,
  Routes,
} from "discord.js";
import { getrecentscore } from "./commands/recentscore";
import { config } from "./config";
import { MongoClient, ServerApiVersion } from "mongodb";
import { setUser } from "./commands/setuser";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

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
  client.user?.setActivity("Watching over Blobsu server");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(">setuser")) {
    setUser({ message, coll });
  }

  if (message.content === ">rs") {
    const query = { discordUser: message.author.username };
    const projection = { osuUser: 1 };
    try {
      await coll
        .findOne(query, { projection: projection })
        .then(async (res) => {
          const embed = await getrecentscore(res!.osuUser);
          message.channel.send({ embeds: [embed] });
        });
    } catch (error) {
      console.log(error);
      message.channel.send(`An error has occurred. Blame Pana`);
      return;
    }
  }
});

client.login(config.DISCORD_TOKEN);
