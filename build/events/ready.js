import winston from 'winston';
import { playerlist } from "../processes/playerlist.js";
import { watchlist } from "../processes/watchlist.js";

module.exports = (client) => {
    winston.info("Bot is ready.\n") // New line to show when things are finally 100% ready.
    client.user.setPresence({
        status: 'idle', // Yellow?
        afk: true, // I have no idea what this does, I just want to see.
        game: {
            name: "Remy's screams!", // I mean, how could I not make this joke?
            type: "LISTENING" // Poor Remy.
        }
    })
    playerlist()
    watchlist()
    // Lets get this shit started
}