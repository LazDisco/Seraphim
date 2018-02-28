import winston from 'winston'; // Winston for logging
import secrets from "../secrets.json"; // suprsekrt documents

module.exports.run = async (msg, args, client, db, ID) => {

    db.r.table('playerlist').get(ID).getField('enabled').run(async function(err, result) {
        if (result !== undefined) {
            msg.channel.send(`ERR: Flag already exists. Flag is currently set to ${result}`)
            return msg.channel.send("This command is not required, flag already exists.")
        }
        if (result == undefined) {
            db.restoreShadowlog(ID)
                .then(() => winston.info(`Guild: ${ID} was given the false shadowlog flag.`))
                .then(() => msg.channel.send("Restore successful. Flag set to false."))
                .catch(winston.error)
        }
    })
}

module.exports.help = {
    name: "shadow.restore"
}