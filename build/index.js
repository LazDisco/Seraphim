import Discord from 'discord.js'; // The one the only D.JS
import winston from 'winston'; // Our logging module
import requireDir from 'require-dir'; // We need this for our event handler
import Disco from 'discoverygc'; // Corile's discovery API module
import Promise from 'bluebird'; // Our promises package

import Database from './db/JS/database.js'; // Where our db files are located
import secrets from './settings/secrets.json'; // Private info
import options from './settings/options.js'; // Where we are storing all our settings
import { fsDir } from './processes/fsReadDirRecursive.js'; // Much Cleaner 

export const disco = new Disco(options.optionsDisco);
export const client = new Discord.Client() // New client

const commands = requireDir('./commands/', { recurse: true })
const events = requireDir('./events');
// We are going to use seperate files for the really long events to keep things clean

client.login(secrets.token) // Login to Discord - Connect code to bot
client.commands = new Discord.Collection(); // Our command collections, D.JS <3
// DB Stuff

export const db = new Database(); // Create a new database instance
db.init() // Initialise it so it can be used

var files; // Empty var to use to store our files array
fsDir("./build/commands", files)  // Scan that folder for our commands
    .then((files) => {
        // Remove folders, I know it's not pretty, but it's 00:10 right now. I am out of fucks to give.
        for (var i = files.length - 1; i >= 0; i--) {
            if (files[i] === "Epiniac" || files[i] === "Misc" ||
                files[i] === "Playerlist" || files[i] === "Moderation" ||
                files[i] === "Laz" || files[i] === "General") {
                files.splice(i, 1);
            } 
        } 
        winston.info(`Loading ${files.length} commands.`) // How many commands are we loading?
        files.forEach((f, i) => { // Lets find out.
            let props = require(`./${f}`);
            winston.info(`${i + 1}: ${f} loaded.`)
            client.commands.set(props.help.name, props) // Setup our commands to be used with module.exports (Kudos Threebow)        
        })
    })
    .catch((err) => {
        winston.error(err) // Log my errors Senpai!
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