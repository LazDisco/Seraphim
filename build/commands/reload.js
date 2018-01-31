import { playerlist } from "../processes/playerlist.js";
import { watchlist } from "../processes/watchlist.js";

module.exports.run = async (msg, args, client, db, ID) => {
    playerlist()
    watchlist()
    msg.channel.send("API lists and connection has been refreshed.")
}

module.exports.help = {
    name: "reload"
}