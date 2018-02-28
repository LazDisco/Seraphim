import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("You are not Laz.")
    if (!args) return msg.channel.send("No args, no roles, no shadows.")

    let newChannel = args[0];
    db.setShadowlogChannel(ID, newChannel)
        .then(() => winston.info(`Guild: ${ID} was assigned ${newChannel}.`))
        .then(() => msg.channel.send(":white_check_mark: noice"))
        .catch(winston.error)
}

module.exports.help = {
    name: "shadow.setchannel"
}