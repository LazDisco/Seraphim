import sendArray from '../processes/sendArray.js' // We need this to convert our db information
import format from 'string-format' // We also need this for that same reason
import winston from 'winston'; // Turns out I wasn't getting any errors because I forgot to import winston.

const playerTemplate = require('../settings/defaults.json').playerTemplate
const factionTemplate = require('../settings/defaults.json').factionTemplate

module.exports.run = async (msg, args, client, db, ID) => {

    if(!args[0]) return msg.reply("Please provide a list to view. Try \`list players\` or \`list factions\`.")

    const formatPlayer = (res) => {
        const {
            shipName: name, 
            watchlistReason: reason 
        } = res

        return format(playerTemplate, name, reason);
    }

    const formatFaction = (res) => {
        const {
            factionName: factionN, 
            factionTag: tag 
        } = res

        return format(factionTemplate, factionN, tag);
    }

    if (args[0] == "players") {
        db.pullIndividualsWatchlist(msg.guild.id)
        .then((res) =>{
            sendArray(res.map(formatPlayer), msg.channel);
        })
        .catch((err) => {
            winston.error(err)
            msg.channel.send(`:x: Failed. See log for details.`)
        })
    }
    if (args[0] == "factions") {
        db.pullFactionWatchlist(ID)
            .then((res) => {
                sendArray(res.map(formatFaction), msg.channel);
            })
            .catch((err) => {
                winston.error(err)
                msg.channel.send(`:x: Failed. See log for details.`)
            })
    }
}

module.exports.help = {
    name: "list"
}