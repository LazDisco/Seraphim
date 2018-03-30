import winston from 'winston';
import { playerlist } from "../processes/playerlist.js";
import { watchlist } from "../processes/watchlist.js";

module.exports = (client) => {
    winston.info("Bot is ready.\n") // New line to show when things are finally 100% ready.
    client.user.setPresence({
        game: {
            name: "the Discovery Angels",
            type: "LISTENING"
        }
    })
    playerlist()
    watchlist()
    // Lets get this shit started
}