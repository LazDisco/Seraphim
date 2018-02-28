import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("You are not Laz.")

    db.disableShadowlog(ID)
        .then(() => winston.info(`Guild: ${guild.id} was given the 'false' shadowlog flag.`))
        .catch(winston.error)

    msg.channel.send("Well thats no fun no is it")

}

module.exports.help = {
    name: "shadow.disable"
}