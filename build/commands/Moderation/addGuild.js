import secrets from '../../settings/secrets.json'

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("ERR: This command is locked to bot owner only.")

    let id = args[0]

    db.createGuild(id)
        .then(msg.channel.send(`Info: Successfully created row \`${id}\`.`))
        .catch(msg.channel.send("Warn: Table already exists."))
}

module.exports.help = {
    name: "addguild"
}