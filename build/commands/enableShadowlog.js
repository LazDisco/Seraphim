import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("You are not Laz.")
    if(!args) return msg.channel.send("No args, no roles, no shadows.")

    let role = args[0];
        
    db.enableShadowlog(ID, role)
        .then(() => winston.info(`Guild: ${ID} was given the 'true' shadowlog flag.`))
        .then(() => msg.channel.send("Hold up boyos, Shadowlogging as been enabled?"))
        .catch(winston.error)

}

module.exports.help = {
    name: "shadow.enable"
}