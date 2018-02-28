import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {

    try {
        db.r.table('playerlist').get(ID).getField('enabled').run(async function (err, result) {
            msg.channel.send(`ERR: Flag already exists. Flag is currently set to ${result}`)
            return msg.channel.send("This command is not required, flag already exists.")
        })
    } catch (error) {
        db.restoreShadowlog(guild.id)
            .then(() => winston.info(`Guild: ${guild.id} was given the false shadowlog flag.`))
            .catch(winston.error)

            msg.channel.send("Restore successful. Flag set to false.")
    }
}

module.exports.help = {
    name: "shadow.restore"
}