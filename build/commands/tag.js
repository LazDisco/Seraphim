import winston from 'winston'; // Winston for logging
import sendArray from '../processes/sendArray.js' // We need this to convert our db information
import format from 'string-format' // We also need this for that same reason

const tagTemplate = require('../defaults.json').tagTemplate
const tagListTemplate = require('../defaults.json').tagListTemplate

module.exports.run = async (msg, args, client, db, ID) => {
    let command = args[0] // Makes the code a lot nicer to read.

    let one = args.shift(); // Take args[1] and make it its own value
    let two = args.shift(); // Take args[2] and amke it its own value
    let three = args.join(' '); // Take everything else, make it its own value.
    three = three.replace(/#/g, '\n');

    const formatTag = (res) => {
        const {
            tag: tag_name,
            message: content
        } = res

        return format(tagTemplate, tag_name, content);
    }

    const formatTagList = (res) => {
        const {
            tag: tag_name,
        } = res

        return format(tagListTemplate, tag_name);
    }

    if (command == "create") {
        if (msg.author.id !== secrets.ownerID) return msg.reply("ERR: This command has been locked. People have shown that they cannot be trusted. Please use 'tag get' to view existing tags.")
        if (two == undefined || three == undefined) return msg.channel.send(`:x: ERR: Tag or Message was undefined.`)
        db.createNewTag(ID, two, three)
            .then(() => msg.channel.send(`Tag: \`${two}\` created successfully. :white_check_mark:`))
            .catch((err) => winston.error(err))
    }

    if (command == "get") {
        if (two == undefined) return msg.channel.send(`:x: ERR: Tag was undefined.`)
        db.getTagData(ID, two)
            .then((res) => {
                if(res) {
                sendArray(res.map(formatTag), msg.channel);
                }
                if(!res) {
                    msg.channel.send(`:x: \n ERR: Cannot find tag \`${two}\``)
                }
            })
            .catch((err) => {
                winston.error(err)
                msg.channel.send(`:x: Failed. See log for details.`)
            })
    }

    if (command == "delete") {
        if (msg.author.id !== secrets.ownerID) return msg.reply("ERR: This command has been locked. People have shown that they cannot be trusted. Please use 'tag get' to view existing tags.")
        if (two == undefined) return msg.channel.send(`:x: ERR: Tag was undefined.`)
        db.deleteTag(ID, two)
            .then(() => {
                msg.channel.send(`:white_check_mark: Success. \`${two}\` has been removed.`);
            })
            .catch((err) => {
                msg.channel.send(`:x:\n ERR: Failed to remove from the database. See log for information.`)
                winston.error(err)
            })
    }

    if (command == "list") {
        db.listGuildTags(ID)
            .then((res) => {
                if (res) {
                    sendArray(res.map(formatTagList), msg.channel);
                }
                if (!res) {
                    msg.channel.send(`:x: \n ERR: There are no active tags on this server.`)
                }
            })
            .catch((err) => {
                winston.error(err)
                msg.channel.send(`:x: Failed. See log for details.`)
            })
    }

    if (command == "count") {
        db.countGuildTags(ID)
            .then((res) => {
                if (res) {
                    msg.channel.send(`There are currently a total of \`${res}\` tags active on this server.`);
                }
                if (!res) {
                    msg.channel.send(`:x: \n ERR: There are no active tags on this server.`)
                }
            })
            .catch((err) => {
                winston.error(err)
                msg.channel.send(`:x: Failed. See log for details.`)
            })
    }
}

module.exports.help = {
    name: "tag"
}