import { config } from "../config";
import { EmbedBuilder } from "discord.js";

interface leaderboard {
  player_id: number;
  name: string;
  country: string;
  tscore: number;
  rscore: number;
  pp: number;
  plays: number;
  playtime: number;
  acc: number;
  max_combo: number;
  xh_count: number;
  x_count: number;
  sh_count: number;
  s_count: number;
  a_count: number;
  clan_id: number | null;
  clan_name: string | null;
  clan_tag: string | null;
}

interface data {
  status: string;
  leaderboard: leaderboard[];
}

function iteratePP({
  element,
  leaderboard,
}: {
  element: string;
  leaderboard: leaderboard[];
}) {
  let string = ``;
  for (let x of leaderboard) {
    string = string + `\`${x[element]}\`\n`;
  }
  return string;
}

function iterate({
  element,
  leaderboard,
}: {
  element: string;
  leaderboard: leaderboard[];
}) {
  let string = ``;
  for (let x of leaderboard) {
    string = string + `\`${x[element]}\`\n`;
  }
  return string;
}

function getKeyByValue(
  object: Record<string, any>,
  value: any
): string | undefined {
  return Object.entries(object).find(([key, val]) => val === value)?.[0];
}

function basicCounting(leaderboard: leaderboard[]) {
  let string = ``;
  let count = 0;
  for (let x in leaderboard) {
    if (count == 0) {
      count++;
      string = string + `:first_place:\n`;
    } else if (count == 1) {
      count++;
      string = string + `:second_place:\n`;
    } else if (count == 2) {
      count++;
      string = string + `:third_place:\n`;
    } else {
      count++;
      string = string + `\`#${count}\`\n`;
    }
  }
  return string;
}

export async function GlobalLeaderboard() {
  try {
    const response = await fetch(
      `${process.env.LEADERBOARD}?sort=pp&mode=0&limit=25&offset=0`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: data = await response.json();
    const leaderboard = data.leaderboard;
    const iter = leaderboard[0];

    const embedleaderboard = new EmbedBuilder()
      .setColor(0x008080)
      .setTitle("Global leaderboards for blobsu")
      .addFields(
        { name: `\`Rank\``, value: basicCounting(leaderboard), inline: true },
        {
          name: `\`Player\``,
          value: iterate({ element: "name", leaderboard }),
          inline: true,
        },
        {
          name: `\`PP\``,
          value: iteratePP({ element: "pp", leaderboard }),
          inline: true,
        }
      );

    return embedleaderboard;
  } catch (error) {
    console.log(error);
    return;
  }
}
