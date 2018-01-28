module.exports.run = async (msg, args, client, db, id) => {

    msg.channel.send(`Pinging server: ${client.ping}ms`)
}

module.exports.help = {
    name: "ping"
}