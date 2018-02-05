import winston from 'winston'; // Winston for logging
import sendArray from '../processes/sendArray.js' // We need this to convert our db information
import format from 'string-format' // We also need this for that same reason

const tagTemplate = require('../defaults.json').tagTemplate

module.exports.run = async (msg, args, client, db, ID) => {
    let command = args[0] // Makes the code a lot nicer to read.

    let one = args.shift(); // Take args[1] and make it its own value
    let two = args.shift(); // Take args[2] and amke it its own value
    let three = args.join(' '); // Take everything else, make it its own value.

    const formatTag = (res) => {
        const {
            tag: tag_name,
            message: content
        } = res

        return format(tagTemplate, tag_name, content);
    }

    if (command == "create") {
        db.createNewTag(ID, two, three)
            .then(() => msg.channel.send(`Tag: \`${two}\` created successfully. :white_check_mark:`))
            .catch((err) => winston.error(err))
    }

    if (command == "get") {
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
        db.deleteTag(ID, two)
            .then(() => {
                msg.channel.send(`:white_check_mark: Success. \`${one}\` has been removed.`);
            })
            .catch((err) => {
                msg.channel.send(`:x:\n ERR: Failed to remove from the database. See log for information.`)
                winston.error(err)
            })
    }
}

module.exports.help = {
    name: "tag"
}