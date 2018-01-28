import winston from 'winston'; // Winston for logging
import { commands } from "../index.js"; // Import commands because I made a mistake!
import { client } from "../index.js"; // Wow. I am starting to see how this could be more efficent.
import { secrets } from "../index.js"; // Ok I fucked up. Move along.
import format from 'string-format';

import fs from 'fs'; // Import FS for command handler.


module.exports = (msg, db) => {
    // search everything inside guildConfig until you find the current server ID.

    let ID = msg.guild.id;

    var prefix = "|" // If for some reason the Guild doesn't have a default function.
    // Get Guild Prefix for the guild
    db.r.table('guilds').get(ID).getField('prefix').run(function(err, result) {
        if (err) throw err; // Was there an issue with the DB?
        prefix = result // Update prefix 

        if (msg.author.bot) return; // Don't allow bot users
        if (msg.channel.type === "dm") return msg.reply("Sorru, this bot is server only!"); // Ignore DM channels.
        if (msg.channel.type !== "text") return; // Prevent Magic

        let messageArray = msg.content.split(/\s+/g);
        let command = messageArray[0]; // Turn our messages into an array
        let args = messageArray.slice(1); // Each arg is a entry in the array

        if (command == "prefix") // In case we forget our prefix, 
        // the word prefix will trigger the bot to print what is currently being used.
        {
            msg.channel.send(`Info: The current server prefix is \`${prefix}\``) // Our current prefix
        }

        if (command == prefix + "eval") // If we want to execute custom JS with the bot.
        {
            if (msg.author.id !== secrets.ownerID) return; // Protect our eval function from evil-dooers (Eval-Dooers)
            try {
                const code = args.join(" "); // The args after the |eval
                let evaled = eval(code); // Eval it.

                if (typeof evaled !== "string")
                    evaled = require("util").inspect(evaled);

                msg.channel.send(clean(evaled), {
                    code: "xl"
                });
            } catch (err) {
                msg.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``); 
                // Credit to "An Idiot's Guide" for this code - No I don't really understand it all.
            }
        }

        if (!command.startsWith(prefix)) return; // Unless a message has the prefix at the start of it, ignore it.

        let cmd = client.commands.get(command.slice(prefix.length))
        if (cmd) cmd.run(msg, args, client, db, ID) // Send our command to the handler if none of the commands are listed here
    })


};
