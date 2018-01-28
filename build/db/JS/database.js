import rethink from 'rethinkdbdash'; // Import the rethinkdb dash driver
import Promise from 'bluebird'; // Our promises package
import winston from 'winston'; // Time to log shit

let defaultPrefix = "|"
let defaultPlayerlistChannel = "playerlist"

module.exports = class { // This is used when we create a new instance in index.js
    constructor() {
        this.r = rethink({db: 'TBB'}) // The name of our database | TBB = The Brigand Bot
    }

    

    // rethinkDBdash documentation - https://github.com/neumino/rethinkdbdash - PIN
    // RethinkDB documentation - https://rethinkdb.com/api/javascript - PIN
    // Kudos to BitQuote for this stuff on TCQB.

    // function for creating defaults. initialisation.
    init() {
        return this.r.tableCreate('guilds').run() // Create table for each guild, this will handle our customisation.
        .then(() => winston.info("Guild table created.")) // If it works
        .catch(() => winston.warn("Guild table already exists.")) // If it already exists.
    }

    // DB Functions - Mostly taken from TCQB, little bit custom.

    // Add Guild to Database - auto called when bot is added. Can be added via command in event of error
    createGuild(id) {
        return this.r.table('guilds').insert(
            { 
                id, log_channel_id: null, mod_role_id: null, prefix: defaultPrefix, playerlistChannel: defaultPlayerlistChannel 
            }).run();
    }

    addEpiniac() {
        return this.r.tableCreate('epiniac').run() // Create a table just for PoB supplies
        .then(() => winston.info("Epiniac table created.")) // If it works
        .catch(() => winston.warn("Epiniac table already exists.")) // If it already exists.
    }

    // Function for adding report to the database
    createEpiniacReport(userID, shipName, cargoName, cargoAmount, screenshots, time) {
        return this.r.table('epiniac').insert({ reporter: userID, ship: shipName, cargo: cargoName, amount: cargoAmount, screenshot: screenshots, timestamp: time, message_id: null}).run();
    }

    // Count number of reports made to epiniac
    countEpiniacReports() {
        return this.r.table('epiniac').count().run();
    }

    testEpiniac() {
        return this.r.table('epiniac').get('a818e178-7f60-4ba8-adc9-7974d76e8078');
    }

    // Count number of reports made to epiniac by a certain person
    countEpiniacIndividualReports(userID) {
        return this.r.table('epiniac').filter({ reporter: id }).count().run();
    }

    // Get the most recent reports, sort via timestamp.
    getEpiniacRecentReports(userCount) {
        return this.r.table('epiniac').orderBy('timestamp').limit(userCount).run();
    }

    getEpiniacReport(id) {
        return this.r.table('epiniac').get(id).run();
    }

    // Set a new prefix for the guild
    setGuildPrefix(id, newPrefix) {
        return this.r.table('guilds').get(id).update({ prefix: newPrefix }).run();
    }

    // Set a new playerlist channel for the guild
    setPlayerlistChannel(id, newPlayerlistChannel) {
        return this.r.table('guilds').get(id).update({ playerlistChannel: newPlayerlistChannel }).run();
    }

    /*
        Beyond this section it's no longer my own code. It may or may not be better/worse
        Just saying.
    */
    
    // Get a guild's moderator role
    getGuildRole(id) {
        return this.r.table('guilds').get(id).getField('mod_role_id').run();
    }

    // Set guild's moderator role
    setGuildRole(id, roleID) {
        return this.r.table('guilds').get(id).update({ mod_role_id: roleID }).run();
    }

    // Delete data for a guild
    deleteGuild(id) {
        return this.r.table('guilds').get(id).delete().run();
    }

    // Fetch ticket info
    getTicket(id) {
        return this.r.table('tickets').get(id).run();
    }

    // Create user support ticket
    createTicket(guildId, userId, timestamp, description) {
        return this.r.table('tickets').insert({ guild_id: guildId, user_id: userId, timestamp, description, message_id: null }).run();
    }

    // Get ticket's corresponding log message
    getTicketMessage(id) {
        return this.r.table('tickets').get(id).getField('message_id').run();
    }

    // Set ticket's corresponding log message
    setTicketMessage(id, msgId) {
        return this.r.table('tickets').get(id).update({ message_id: msgId }).run();
    }

    // Delete ticket (it has been closed)
    deleteTicket(id) {
        return this.r.table('tickets').get(id).delete().run();
    }

    // Delete ticket by message ID
    deleteTicketByMessage(msgId) {
        return this.r.table('tickets').filter(this.r.row('message_id').eq(msgId)).delete().run();
    }


}