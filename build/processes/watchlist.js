import winston from 'winston'; // Winston for logging
import Discord from 'discord.js' // Discord.js
import moment from 'moment' // To format our unix timestamp

import { db, disco, client } from "../index.js";
// Import db, client and disco

async function getPlayers() { // Importing this function didn't work for some reason
    let players = await disco.players(); // Instead just re-writing it. Only small, doesn't matter.
    return players;
}

// WARNING: formatWatchlist() is not clean code. Like... Really.
// See playerlist.js for the actual code that this is taken from
// There it is all commented and structured.

async function formatWatchlist(obj, guildIDS) {
    let shipsToWatch = await db.getShipForWatchlist(guildIDS);
    let factionsToWatch = await db.getFactionForWatchlist(guildIDS);
    JSON.stringify(shipsToWatch)
    JSON.stringify(factionsToWatch)

     var list = obj.players.map(player => {
        return player
    })

    let playerSort = obj.players.map(player => {
        let desiredPlayers = list.find(element => {
            if (shipsToWatch.some(r => player.name.includes(r))) return element
        })


        if (desiredPlayers) return {
            name: player.name,
            system: player.system,
            region: player.region
        }
    })
    let factionSort = obj.players.map(player => {
        let desiredFactions = list.find(element => {
            if (factionsToWatch.some(r => player.name.includes(r))) return element
        })


        if (desiredFactions) return {
            name: player.name,
            system: player.system,
            region: player.region
        }
    })
    playerSort = playerSort.filter(element => element !== undefined)
    factionSort = factionSort.filter(element => element !== undefined)
    let individualsLength = playerSort.length;
    let factionsLength = factionSort.length;
    playerSort = playerSort.sort((a, b) => {
        if (a.region === b.region) { // Sort by the region
            if (a.system === b.system) { // If during that sort two systems are the same
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; // Sort them by name after that.
            } else {
                return (a.system < b.system) ? -1 : 1; // Otherwise sort them by sysyem
            }
        } else {
            return (a.region < b.region) ? -1 : 1; // Then sort them by region
        }
    })

    factionSort = factionSort.sort((a, b) => {
        if (a.region === b.region) { // Sort by the region
            if (a.system === b.system) { // If during that sort two systems are the same
                return (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0; // Sort them by name after that.
            } else {
                return (a.system < b.system) ? -1 : 1; // Otherwise sort them by sysyem
            }
        } else {
            return (a.region < b.region) ? -1 : 1; // Then sort them by region
        }
    })

    let players = playerSort.reduce((accumulator, player) => { // We only want the player names for this side
        return accumulator + `${player.name}\n`
    }, '')

    let systems = playerSort.reduce((accumulator, player) => { // We only want the player systems for this side
        return accumulator + `${player.system}\n`
    }, '')

    let regions = playerSort.reduce((accumulator, player) => { // We only want the player regions for this side
        return accumulator + `${player.region}\n`
    }, '')

    let factionPlayers = factionSort.reduce((accumulator, player) => { // We only want the player names for this side
        return accumulator + `${player.name}\n`
    }, '')

    let factionSystems = factionSort.reduce((accumulator, player) => { // We only want the player systems for this side
        return accumulator + `${player.system}\n`
    }, '')

    let factionRegions = factionSort.reduce((accumulator, player) => { // We only want the player regions for this side
        return accumulator + `${player.region}\n`
    }, '')

    var time = new Date()
    const dateFormat = "DD/MM/YY HH:mm"; // format the date how normal people do. (not American)

    let embed = new Discord.RichEmbed() // New embed
        .setTitle(`This server's tracking list - Last Updated ${moment(time).format(dateFormat)}`) // Unlike .setTimestamp, we need to convert this manually.
        .setDescription(`Tracked Individuals: ${individualsLength} | Tracked Faction Ships: ${factionsLength}`)
        .setColor('#663399') // Royal Purple - Brigand colour
        .setTimestamp(time) // What time is it?
        .addField("Player list:", "Player:\n" + players, true) // All the player names
        .addField("System list:", "System:\n" + systems, true) // Mapped against their systems
        .addField("Region list:", "Region:\n" + regions, true) // Mapped against the system's regions
        .addField("\u200B", "\n\n\n**Faction Tracker:**\n\u200B", false)
        .addField("Player list:", "Player:\n" + factionPlayers, true) // All the player names
        .addField("System list:", "System:\n" + factionSystems, true) // Mapped against their systems
        .addField("Region list:", "Region:\n" + factionRegions, true) // Mapped against the system's regions

    return embed
}

export function watchlist() {

    setInterval(updateList, 60 * 1000)
    updateList()

    async function updateList() {
        let playerlist = await getPlayers(); // Make sure we get the current players before proceading.

        client.guilds.map(async (guild) => { // Search through all the guilds
            const guildIDS = guild.id; // Our server ID

            const res = guild.channels.find(res => {
                if (res.name == "watchlist" && res.type == "text") {
                    return res // We found a text channel matching the server's choice in name? Great.
                }
            })

            if (res) { // If we found the channel we are looking for
                let watchlistMessage = await res.fetchMessages({
                    limit: 1 // Make sure there is only one message in the channel
                }) // Know what would be nice? A way to filter messages authors.
                watchlistMessage = watchlistMessage.array() // Turn that message into an array
                if (watchlistMessage.length > 0 && watchlistMessage[0].editable) { // Is the message editable?
                    watchlistMessage = watchlistMessage[0] // Turn the array into a single value
                    watchlistMessage.edit({ // Since we can edit the message lets do that
                        embed: await formatWatchlist(await playerlist, guildIDS) // Edit it with the most recent information
                    }) // Edit the message
                } else {
                    try {
                        res.send({ // Send message to the channel
                            embed: await formatWatchlist(await playerlist, guildIDS) // Send the updated information
                        }).catch(error => {
                            winston.error(error) // Catch the error and log it
                        })
                    } catch (error) { // generic error name
                        winston.error(error) // Log any errors to winston
                    }
                }
            }
        })
    }
}

