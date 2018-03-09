import winston from 'winston' // Winston for Logging

module.exports.run = async (msg, args, client, db, ID) => {

    if (!args[0]) return msg.channel.send("ERR: Please provide a tag to remove")
    let toRemove = args[0];

    let one = args.shift(); // Take args[1] and make it its own value
    let two = args.join(' '); // Take everything else (args[2-4]), make it its own value.

    db.removeShipFromWatchList(toRemove)
        .then(() => {
            msg.channel.send(`:white_check_mark: Success. ${toRemove} has been removed.`);
        })
        .catch((err) => {
            msg.channel.send(`:x:\n ERR: Failed to remove from the database. See log for information.`)
            winston.error(err)
        })
}

module.exports.help = {
    name: "list.shipremove"
}