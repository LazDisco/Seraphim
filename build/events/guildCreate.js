import winston from 'winston';
import defaults from "../defaults.json"


module.exports = (guild, db) => {

    // Add guild to DB
    db.createGuild(guild.id)
        .then(() => winston.info(`Guild: ${guild.id} added to the db.`))
        .catch(winston.error)

}
