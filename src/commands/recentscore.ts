import { EmbedBuilder } from "discord.js";
import { config } from "../config";

export async function getrecentscore(id: number) {
  const response = await fetch(`${config.GET_RECENT}/?scope=recent&id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

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

  const formattedScore = data.scores[0].score.toLocaleString("en-US");
  const embedrs = new EmbedBuilder()
    .setColor(0x008080)
    .setTitle(
      `${data.scores[0].beatmap.title} [${data.scores[0].beatmap.diff.toFixed(
        2
      )}★]`
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
      value: `*Score:*     ${formattedScore}\n*Combo:*   ${
        data.scores[0].max_combo
      }/${
        data.scores[0].beatmap.max_combo
      }x\n*Ranking:*   :regional_indicator_${data.scores[0].grade.toLowerCase()}:\n*Accuracy:*  ${data.scores[0].acc.toFixed(
        2
      )}%\n*Hits:*     (${data.scores[0].n300}/${data.scores[0].n100}/${
        data.scores[0].n50
      }/${data.scores[0].nmiss})\n\n*PP:*      ${
        data.scores[0].pp
      }\n*if FC:*      {Needs to be worked on}`,
    })
    .setFooter({
      text: `Standard beatmap by ${data.scores[0].beatmap.creator} played @ ${formattedTime} on ${formattedDate}`,
    });

  return embedrs;
}
