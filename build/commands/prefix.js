import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {
    let sender = msg.member;
    if (!sender.hasPermission('MANAGE_GUILD')) return msg.reply("ERR: User doesn't have valid permissions to use this command")
    // Make sure that they have the right permissions before using the command.

    let newPrefix = args[0]; // What the new prefix is going to be

    if (newPrefix.length >= 3) { // Make sue it's not more than 2 characters
        return msg.reply("ERR: Prefix cannot be set to greater than 2 characters and cannot use non-standard special characters.")
    }

    msg.channel.send(`Info: Prefix has been changed to \`${newPrefix}\``) // Tell them what it is now

    db.setGuildPrefix(ID, newPrefix) // Update the DB with the right information
        .then(() => winston.info(`Prefix: ${id} has changed their prefix to ${newPrefix}`))
        .catch(winston.error)
}

module.exports.help = {
    name: "prefix"
}