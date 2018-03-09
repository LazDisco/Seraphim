module.exports.run = async (msg, args, client, db, ID) => {

    msg.channel.send(`Pinging server: ${client.ping}ms`)
    // Ping!
}

module.exports.help = {
    name: "ping"
}