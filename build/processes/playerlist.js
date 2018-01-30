import winston from 'winston'; // Winston for logging
import Discord from 'discord.js' // Discord.js
import moment from 'moment' // To format our unix timestamp

import { disco } from '../index.js'; // disco for API
import { db } from "../index.js"; // Our db to read data
import { client } from "../index.js" // import client?????

async function getPlayers() {
    let players = await disco.players();
    return players;
}

export async function getFactions() {
    let factions = await disco.factions();
    return factions;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
// Just going to pin this because of how many times I call back to it.

async function formatPlayerlist(obj) {

    let playersOnline = obj.players.length;

    const playerSort = obj.players.sort((a, b) => {
        if (a.region === b.region) {
            if (a.system === b.system) {
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0;
            } else {
                return (a.system < b.system) ? -1 : 1;
            }
        } else {
            return (a.region < b.region) ? -1 : 1;
        }
    })

    let players = playerSort.reduce((accumulator, player) => {
        return accumulator + `${player.name}\n`
    }, '')

    let systems = playerSort.reduce((accumulator, player) => {
        return accumulator + `${player.system}\n`
    }, '')

    let regions = playerSort.reduce((accumulator, player) => {
        return accumulator + `${player.region}\n`
    }, '')

    var time = new Date()
    const dateFormat = "DD-MM-YY HH:mm"; // format the date how normal people do. (not American)

    var playerlistStatus = `
The playerlist is currently below maximum capacity. If the count gets too high, the list will shut down the regions section until it is back within the correct range. If It is still too high, the playerlist will go down until things return to a normal level.`

    if (systems.length >= 1024) {
        systems = "\u200B" // this will make sure it doesn't break due to Discord's limits.
    }
    if (regions.length >= 1024) {
        regions = "\u200B"
    }
    if (players.length >= 1024) { // total shut down
        players = "\u200B"
        systems = "\u200B"
        regions = "\u200B"
    }
    if (regions == "\u200B" || systems == "\u200B") {
        playerlistStatus = `
The playerlist is currently above max capicity, and thus one or more sections have been shut down.`
    } // Debug message, SO REDDY WILL STOP MESSAGING ME TELLING ME IT'S DOWN!!! (jk luv you Reddy <3)

    let embed = new Discord.RichEmbed() // New embed
        .setTitle(`Playerlist - Last Updated ${moment(time).format(dateFormat)}`) // Unlike .setTimestamp, we need to convert this manually.
        .setDescription(`Current Playercount: ${playersOnline}`)
        .setColor('#663399') // Royal Purple - Brigand colour
        .setTimestamp(time) // What time is it?
        .addField("Player list:", "Player:\n" + players, true) // All the player names
        .addField("System list:", "System:\n" + systems, true) // Mapped against their systems
        .addField("Region list:", "Region:\n" + regions, true) // Mapped against the system's regions
        .addField("Playerlist status:", playerlistStatus, true)
    return embed
}

// The above data is all just the functions for calculating the playerlist's data.
// Here is where we actually set it up and get it to run
export function playerlist() {

    setInterval(updatePlayerlist, 60 * 1000)
    updatePlayerlist()

    async function updatePlayerlist() {
        let playerlist = await getPlayers();

        client.guilds.map(async (guild) => { // Search through all the guilds
            db.r.table('guilds').get(guild.id).getField('playerlistChannel').run(async function(err, result) {
                const guildIDS = guild.id; // Our server ID

                const res = guild.channels.find(res => {
                    if (res.name == result && res.type == "text") {
                        return res // We found a text channel matching the server's choice in name? Great.
                    }
                })

                if (res) { // If we found the channel we are looking for
                    let playerlistMessage = await res.fetchMessages({
                        limit: 1 // Make sure there is only one message in the channel
                    }) // Know what would be nice? A way to filter messages authors.
                    playerlistMessage = playerlistMessage.array() // Turn that message into an array
                    if (playerlistMessage.length > 0 && playerlistMessage[0].editable) { // Is the message editable?
                        playerlistMessage = playerlistMessage[0] // Turn the array into a single value
                        playerlistMessage.edit({ // Since we can edit the message lets do that
                            embed: await formatPlayerlist(await playerlist) // Edit it with the most recent information
                        }) // Edit the message
                    } else {
                        try {
                            res.send({ // Send message to the channel
                                embed: await formatPlayerlist(await playerlist) // Send the updated information
                            }).catch(error => {
                                winston.error(error) // Catch the error and log it
                            })
                        } catch (error) { // generic error name
                            winston.error(error) // Log any errors to winston
                        }
                    }
                }
            })
        })
    }
}