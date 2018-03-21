import winston from 'winston'; // Winston for logging
import Discord from 'discord.js'; // Discord for embeds
import { db } from "../index.js"; // Our db to read data

export async function statusReport(ID) {
    return db.getGuildData(ID)
        .then((result) => {
            var format = result.map(function (element) {
                return {
                    'lewd': element.Lewd,
                    'discovery': element.Discovery
                };
            });
            return format;
        })
        .catch((err) => winston.error(err))
}