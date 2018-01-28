import Discord from 'discord.js' // The one the only D.JS
import winston from 'winston' // Our logging module
import requireDir from 'require-dir' // We need this for our event handler
import fs from 'fs' // Import FS for command handler

import Database from './db/JS/database.js' // Where our db files are located
import secrets from './secrets' // Private info
import defaults from './defaults' // Default information called by the db

const events = requireDir('./events')
// We are going to use seperate files for the really long events to keep things clean

export const client = new Discord.Client() // New client

client.login(secrets.token) // Login to Discord - Connect code to bot
client.commands = new Discord.Collection(); // Our command collections, D.JS <3
// DB Stuff

const db = new Database(); // Create a new database instance
db.init() // Initialise it so it can be used

fs.readdir("./build/commands/", (err, files) => { // Scan that folder for our commands
    if(err) winston.error(err) // Log my errors senpai.

    let jsfiles = files.filter(f => f.split(".").pop() === "js") // Only pick files that have .js at the end
    if(jsfiles.length <= 0 ) {
        winston.info("ERR: Missing command files.") // There are no command files, or no commands folder.
        return
    }

    winston.info(`Loading ${jsfiles.length} commands.`) // How many commands are we loading?
    jsfiles.forEach((f, i) => { // Lets find out.
        let props = require(`./commands/${f}`);
        winston.info(`${i + 1}: ${f} loaded.`)
        client.commands.set(props.help.name, props) // Setup our commands to be used with module.exports (Kudos Threebow)        
    })
})

process.on('unhandledRejection', (reason, p) => {
    winston.debug('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // We want to log what happens when we have an unhandled Promise.
});

client.on('ready', () => {
    winston.info("Bot is ready.\n")
    // Lets get this shit started
});

client.on('message', async msg => {
    events.message(msg, db) // See events/message.js
});

client.on('guildCreate', guild => {
    events.guildCreate(guild, db) // See guildCreate.js
});