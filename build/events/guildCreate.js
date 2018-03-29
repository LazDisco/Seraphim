import winston from 'winston';


module.exports = (guild, db) => {

    // Add guild to DB
    db.createGuild(guild.id)
        .then(() => winston.info(`Guild: ${guild.name} added to the db.`))
        .catch(winston.error)
    db.restoreShadowlog(guild.id)
        .then(() => winston.info(`Guild: ${guild.name} was given the false shadowlog flag.`))
        .catch(winston.error)
    db.customisationInit(guild.id)
        .then(() => winston.info(`Guild: ${guild.name} was added to the custom table.`))
        .catch(winston.error)

}
