import secrets from '../../settings/secrets.json'

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("ERR: This command is locked to bot owner only.")

    db.addEpiniac() // Really it makes no sense to do it this way, but I don't want to go back and change it. It works now.
        .then(msg.channel.send("Info: Successfully created table \`Epiniac\`."))
        .catch(msg.channel.send("Warn: Table already exists."))
}

module.exports.help = {
    name: "create-epiniac"
}