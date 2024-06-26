import { EmbedBuilder } from "discord.js";
import { config } from "../config";
import { calculatePp } from "../util/calculatepp";

function getMods(bitmask: number): string[] {
  const activeMods: string[] = [];

  for (const [modName, modValue] of Object.entries(MODS)) {
    if ((bitmask & modValue) !== 0) {
      activeMods.push(modName);
    }
  }

  return activeMods;
}

const MODS = {
  NM: 0,
  NF: 1 << 0,
  EZ: 1 << 1,
  TD: 1 << 2, // old: 'NOVIDEO'
  HD: 1 << 3,
  HR: 1 << 4,
  SD: 1 << 5,
  DT: 1 << 6,
  RX: 1 << 7,
  HT: 1 << 8,
  NC: 1 << 9,
  FL: 1 << 10,
  AT: 1 << 11,
  SO: 1 << 12,
  AP: 1 << 13,
  PF: 1 << 14,
  "4K": 1 << 15,
  "5K": 1 << 16,
  "6K": 1 << 17,
  "7K": 1 << 18,
  "8K": 1 << 19,
  FADEIN: 1 << 20,
  RANDOM: 1 << 21,
  CINEMA: 1 << 22,
  TARGET: 1 << 23,
  KEY9: 1 << 24,
  KEYCOOP: 1 << 25,
  KEY1: 1 << 26,
  KEY3: 1 << 27,
  KEY2: 1 << 28,
  SCOREV2: 1 << 29,
  MR: 1 << 30,
};

export async function getrecentscore(id: number) {
  const response = await fetch(`${config.GET_RECENT}/?scope=recent&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  const calculate_pp = await calculatePp({
    beatmap_id: data.scores[0].beatmap.id,
    nkatu: data.scores[0].nkatu,
    ngeki: data.scores[0].ngeki,
    n100: data.scores[0].n100,
    n50: data.scores[0].n50,
    misses: data.scores[0].nmiss,
    mods: data.scores[0].mods,
    mode: data.scores[0].mode,
    combo: data.scores[0].beatmap.max_combo,
  });

  const ppdata = await calculate_pp;

  console.log(ppdata);

  if (data.scores.length == 0) {
    const embedrs = new EmbedBuilder()
      .setColor(0x008080)
      .setDescription(
        `No recent scores found for user ${data.player.name} on blobsu.`
      );
    return embedrs;
  }

  const dateString = data.scores[0].play_time;

  const date = new Date(dateString);

  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;

  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  const formattedDate = `${month}/${day}/${year}`;

  const rankConversions = {
    XH: "<:XH_:1254833993799438470>",
    X: "<:X_:1254833991740162088>",
    SH: "<:SH_:1254833968801644576>",
    S: "<:S_:1254833966603702312>",
    A: "<:A_:1254833995686875187>",
    B: "<:B_:1254833997977096293>",
    C: "<:C_:1254834005472182303>",
    D: "<:D_:1254834007867260998>",
    F: "<:F_:1254834013831696424>",
  };

  const modsUsed = getMods(data.scores[0].mods).join("");

  const formattedScore = data.scores[0].score.toLocaleString("en-US");
  const embedrs = new EmbedBuilder()
    .setColor(0x008080)
    .setTitle(
      `${data.scores[0].beatmap.title} [${
        data.scores[0].beatmap.version
      }] [${ppdata.difficulty.stars.toFixed(2)}★]`
    )
    .setURL(
      `https://osu.ppy.sh/beatmapsets/${data.scores[0].beatmap.set_id}#osu/${data.scores[0].beatmap.id}`
    )
    .setAuthor({
      name: `Recent Blobsu Standard Play for ${data.player.name}`,
      iconURL:
        "https://cdn.discordapp.com/attachments/1255451784550285323/1255451948254101564/Untitled-1.png?ex=667d2e3d&is=667bdcbd&hm=288a84334511bfc4fde8f3b5e68d9b9a3156165b39094730e93ac7f759fe41c8&",
    })
    .setThumbnail(
      `https://assets.ppy.sh/beatmaps/${data.scores[0].beatmap.set_id}/covers/list.jpg`
    )
    .addFields({
      name: "Stats:",
      value: `\`Score:\`     ${formattedScore}\n\`Combo:\`     ${
        data.scores[0].max_combo
      }/${
        data.scores[0].beatmap.max_combo
      }x\n\`Mods:\`      +${modsUsed}\n\`Ranking:\`   ${
        rankConversions[data.scores[0].grade]
      }\n\`Accuracy:\`   ${data.scores[0].acc.toFixed(2)}%\n\`Hits:\`      (${
        data.scores[0].n300
      }/${data.scores[0].n100}/${data.scores[0].n50}/${
        data.scores[0].nmiss
      })\n\n\`PP:\`        ${data.scores[0].pp.toFixed(
        2
      )} PP\n\`if FC:\`      ${ppdata.performance.pp.toFixed(2)} PP`,
    })
    .setFooter({
      text: `Standard beatmap by ${data.scores[0].beatmap.creator} played @ ${formattedTime} on ${formattedDate}`,
    });

  return embedrs;
}
