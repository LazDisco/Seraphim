import winston from 'winston'; // Winston for logging
import Discord from 'discord.js'; // Discord for embeds
import { genericError } from "../db/JS/database.js"; // Our generic db error
import { db } from "../index.js"; // Our db to read data

export const dbERR = (err) => {
    winston.error(err)
    return msg.channel.send({
        embed: genericError()
    })
}

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
        .catch(dbERR)
}