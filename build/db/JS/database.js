import rethink from 'rethinkdbdash'; // Import the rethinkdb dash driver
import Promise from 'bluebird'; // Our promises package
import winston from 'winston'; // Time to log shit

let defaultPrefix = "|"
let defaultPlayerlistChannel = "playerlist"

module.exports = class { // This is used when we create a new instance in index.js
    constructor() {
        this.r = rethink({
            db: 'TBB'
        }) // The name of our database | TBB = The Brigand Bot
    }



    // rethinkDBdash documentation - https://github.com/neumino/rethinkdbdash - PIN
    // RethinkDB documentation - https://rethinkdb.com/api/javascript - PIN
    // Kudos to BitQuote for this stuff on TCQB.

    // function for creating defaults. initialisation.
    init() {
        return this.r.tableCreate('guilds').run() // Create table for each guild, this will handle our customisation.
            .then(() => winston.info("Guild table created.")) // If it works
            .catch(() => winston.warn("Guild table already exists.")) // If it already exists.
            .finally(() => this.r.tableCreate('playerlist').run()) // Create a table just for playerlist.
            .then(() => winston.info("Playerlist table created successfully.")) // It worked
            .catch(() => winston.warn("Playerlist table already exists.")) // We already have one.
            .finally(() => this.r.tableCreate('tags').run()) // You get the idea.
            .then(() => winston.info("Tags table created.")) // etc etc
            .catch(() => winston.warn('Tags table already exists.')) // done
    }

    // Add Guild to Database - auto called when bot is added. Can be added via command in event of error
    createGuild(id) {
        return this.r.table('guilds').insert({
            id,
            prefix: defaultPrefix,
            playerlistChannel: defaultPlayerlistChannel
        }).run();
    }

    // Create table for Epiniac - alt use, add to .finally(() => of init() (or a .then(() => )  )
    addEpiniac() {
        return this.r.tableCreate('epiniac').run() // Create a table just for PoB supplies
            .then(() => winston.info("Epiniac table created.")) // If it works
            .catch(() => winston.warn("Epiniac table already exists.")) // If it already exists.
    }

    // Function for adding report to the database
    createEpiniacReport(userID, shipName, cargoName, cargoAmount, screenshots, time) {
        return this.r.table('epiniac').insert({
            reporter: userID,
            ship: shipName,
            cargo: cargoName,
            amount: cargoAmount,
            screenshot: screenshots,
            timestamp: time,
            message_id: null
        }).run();
    }

    // Get list of keys that have a common reporter
    getEpiniacReportByID(userID) {
        return this.r.table('epiniac').filter({ reporter: userID }).pluck('id', 'timestamp').run()
    }

    // Get list of keys that have a common cargo type
    getEpiniacReportByCargo(cargoType) {
        return this.r.table('epiniac').filter({ cargo: cargoType }).pluck('id', 'timestamp').coerceTo('array').run()
    }

    // Get list of keys that have a common ship name
    getEpiniacReportByShip(shipName) {
        return this.r.table('epiniac').filter({ ship: shipName }).pluck('id', 'timestamp').run()
    }

    // Count number of reports made to epiniac
    countEpiniacReports() {
        return this.r.table('epiniac').count().run();
    }

    // Count number of reports made to epiniac by a certain person
    countEpiniacIndividualReports(userID) {
        return this.r.table('epiniac').filter({
            reporter: id
        }).count().run();
    }

    // Get the most recent reports, sort via timestamp.
    getEpiniacRecentReports(userCount) {
        return this.r.table('epiniac').orderBy('timestamp').limit(userCount).run();
    }

    // Get a report with a specific primary key
    getEpiniacReport(id) {
        return this.r.table('epiniac').get(id).run();
    }

    // Set a new prefix for the guild
    setGuildPrefix(id, newPrefix) {
        return this.r.table('guilds').get(id).update({
            prefix: newPrefix
        }).run();
    }

    // Set a new playerlist channel for the guild
    setPlayerlistChannel(id, newPlayerlistChannel) {
        return this.r.table('guilds').get(id).update({
            playerlistChannel: newPlayerlistChannel
        }).run();
    }

    addFactionToWatchList(guild, factionT, factionN) {
        return this.r.table('playerlist').insert({
            guildID: guild,
            factionName: factionN,
            factionTag: factionT
        })
    }

    addShipToWatchList(guild, shipN, reason) {
        return this.r.table('playerlist').insert({
            guildID: guild,
            shipName: shipN,
            watchlistReason: reason
        })
    }

    removeShipFromWatchList(shipN) {
        return this.r.table('playerlist').filter(this.r.row('shipName').eq(shipN)).delete().run();
    }

    removeFactionFromWatchList(factionT) {
        return this.r.table('playerlist').filter(this.r.row('factionTag').eq(factionT)).delete().run();
    }

    getFactionForWatchlist(id) {
        return this.r.table('playerlist').filter({ guildID: id }).getField('factionTag').run();
    }

    getShipForWatchlist(id) {
        return this.r.table('playerlist').filter({ guildID: id }).getField('shipName').run();
    }

    pullFactionWatchlist(id) {
        return this.r.table('playerlist').filter({ guildID: id }).run()
    }

    pullIndividualsWatchlist(id) {
        return this.r.table('playerlist').filter({ guildID: id }).run()
    }

    // Set it to on
    enableShadowlog(id, role) {
        return this.r.table('playerlist').get(id).update({
            enabled: "true",
            rolename: role
        }).run();
    }
    // Set it to off
    disableShadowlog(id) {
        return this.r.table('playerlist').get(id).update({
            enabled: "false"
        }).run();
    }

    setShadowlogChannel(id, channel) {
        return this.r.table('playerlist').get(id).update({
            defaultChannel: channel
        }).run();
    }

    // Used to restore the default state of false. 
    // This is for when a server doesn't have this value (for whatever reason).
    // I also added this to the guild create event
    restoreShadowlog(id) {
        return this.r.table('playerlist').insert({
            id,
            enabled: "false",
            rolename: "default",
            defaultChannel: "default"
        }).run();
    }

    createNewTag(id, tag_name, content) {
        return this.r.table('tags').insert({
            guildID: id,
            tag: tag_name,
            message: content
        }).run();
    }

    getTagData(id, tag_name) {
        return this.r.table('tags').filter({ guildID: id, tag: tag_name }).pluck('tag', 'message').run()
    }

    deleteTag(id, tag_name) {
        return this.r.table('tags').filter(
            this.r.row('guildID').eq(id).and(this.r.row('tag').eq(tag_name))
        ).delete().run();
    }

    countGuildTags(id) {
        return this.r.table('tags').filter({ guildID: id }).count().run()
    }

    listGuildTags(id) {
        return this.r.table('tags').filter({ guildID: id }).orderBy('tag').run()
    }
}