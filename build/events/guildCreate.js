import winston from 'winston';


module.exports = (guild, db) => {

    // Add guild to DB
    db.createGuild(guild.id)
        .then(() => winston.info(`Guild: ${guild.id} added to the db.`))
        .catch(winston.error)
    db.restoreShadowlog(guild.id)
        .then(() => winston.info(`Guild: ${guild.id} was given the false shadowlog flag.`))
        .catch(winston.error)

        // I honestly thought that this file would be a lot bigger.

}
