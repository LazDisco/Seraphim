import winston from 'winston'; // Winston for logging
import Discord from 'discord.js'; // Discord for embeds
import { db } from "../index.js"; // Our db to read data

export async function statusReport(ID) {
    return db.getGuildData(ID)
        .then((result) => {
            var format = result.map(function (element) {
                return {
                    'Lewd': element.lewd,
                    'Discovery': element.discovery
                };
            });
            return format;
        })
        .catch((err) => winston.error(err))
}

export async function genericError()
    {
        var embed = new Discord.RichEmbed() // New embed
            .setDescription(`Something went wrong. See log file for details.`)
            .setColor('#FF0000')
        return embed
    }