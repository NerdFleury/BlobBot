"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
    ],
});
client.on("ready", function () {
    var _a;
    console.log("Bot is ready");
    (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("Watching over Blobsu server");
});
client.login(process.env.DISCORD_TOKEN);
