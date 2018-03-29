import winston from 'winston'; // Winston for logging
import { dbERR } from "../../processes/statusReport.js";

module.exports.run = async (msg, args, client, db, ID) => {
    if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.reply("You do not have permission to use this. You're a bad cookie for trying.")

    if (!args[0]) return msg.reply("This action will irrversibly restore your guild's settings to the default ones that are generated when the bot is added to your server. Are you sure you want to do this?\n\nEnter the command 'reset everything' to confirm.")
    if (args[0] == "everything") {
        let message = await msg.channel.send("Clearing all data. . .")
        db.resetGuild(ID)
            .then(() => {
                db.purgeCustomisations(ID)
                    .then(() => {
                        db.createGuild(ID)
                            .then(() => {
                                db.customisationInit(ID)
                                    .catch(winston.error)
                                message.delete()
                                msg.channel.send("Guild has successfully been reset to default settings.")
                            })
                            .catch(dbERR)
                    })
                    .catch((err) => winston.error(err))
            })
            .catch(dbERR)
    }
}

module.exports.help = {
    name: "reset"
}