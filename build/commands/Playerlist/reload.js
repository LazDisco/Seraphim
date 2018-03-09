import { playerlist } from "../../processes/playerlist.js";
import { watchlist } from "../../processes/watchlist.js";

module.exports.run = async (msg, args, client, db, ID) => {
    
    playerlist() // Force restart playerlist
    watchlist() // Force restart watchlist
    msg.channel.send("API lists and connection has been refreshed.") // Confirm we didn't break at the function.
}

module.exports.help = {
    name: "reload"
}