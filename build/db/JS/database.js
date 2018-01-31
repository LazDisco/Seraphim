import rethink from 'rethinkdbdash'; // Import the rethinkdb dash driver
import Promise from 'bluebird'; // Our promises package
import winston from 'winston'; // Time to log shit
import defaults from '../../defaults.json'

let defaultPrefix = defaults.prefix 
let defaultPlayerlistChannel = defaults.playerlistChannel 

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
    }

    // DB Functions - Mostly taken from TCQB, little bit custom.

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
}