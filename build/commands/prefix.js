module.exports.run = async (msg, args, client, db, id) => {
    let newPrefix = args[0];

    if (newPrefix.length >= 3) {
        return msg.reply("ERR: Prefix cannot be set to greater than 2 characters and cannot use non-standard special characters.")
    }

    msg.channel.send(`Info: Prefix has been changed to \`${newPrefix}\``)

    db.setGuildPrefix(id, newPrefix)
        .then(() => winston.info(`Prefix: ${id} has changed their prefix to ${newPrefix}`))
        .catch(winston.error)




}

module.exports.help = {
    name: "prefix"
}