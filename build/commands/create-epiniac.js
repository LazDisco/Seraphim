import secrets from '../secrets.json'

module.exports.run = async (msg, args, client, db, id) => {
    if(msg.author.id !== secrets.ownerID) return msg.reply("ERR: This command is locked to bot owner only.")

    db.addEpiniac()
    .then(msg.channel.send("Info: Successfully created table \`Epiniac\`."))
    .catch(msg.channel.send("Warn: Table already exists."))
}

module.exports.help = {
    name: "create-epiniac"
}