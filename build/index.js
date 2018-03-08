import Discord from 'discord.js'; // The one the only D.JS
import winston from 'winston'; // Our logging module
import requireDir from 'require-dir'; // We need this for our event handler
import fs from 'fs'; // Import FS for command handler
import Disco from 'discoverygc'; // Corile's discovery API module
import RSS from 'rss'; // Used for syndication with the myBB Disco Forum

import Database from './db/JS/database.js'; // Where our db files are located
import secrets from './settings/secrets.json'; // Private info
import options from './settings/options.js'; // Where we are storing all our settings 

export const feed = new RSS(options.optionsRSS);
export const disco = new Disco(options.optionsDisco);
export const client = new Discord.Client() // New client

const events = requireDir('./events');
// We are going to use seperate files for the really long events to keep things clean

client.login(secrets.token) // Login to Discord - Connect code to bot
client.commands = new Discord.Collection(); // Our command collections, D.JS <3
// DB Stuff

export const db = new Database(); // Create a new database instance
db.init() // Initialise it so it can be used

fs.readdir("./build/commands/", (err, files) => { // Scan that folder for our commands
    if (err) winston.error(err) // Log my errors senpai.

    let jsfiles = files.filter(f => f.split(".").pop() === "js") // Only pick files that have .js at the end
    if (jsfiles.length <= 0) {
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

client.on('ready', () => {
    events.ready(client) // See events/ready.js
});

client.on('message', async msg => {
    events.message(msg, db) // See events/message.js
});

client.on('guildCreate', guild => {
    events.guildCreate(guild, db) // See guildCreate.js
});