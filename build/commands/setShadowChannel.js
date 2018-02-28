module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return msg.reply("You are not Laz.")
    if (!args) return msg.channel.send("No args, no roles, no shadows.")

    let newChannel = args[0];
    db.setShadowlogChannel(ID, newChannel)
        .then(() => winston.info(`Guild: ${ID} was assigned ${newChannel}.`))
        .catch(winston.error)

    msg.channel.send(":white_check_mark: noice")
}

module.exports.help = {
    name: "shadow.setchannel"
}