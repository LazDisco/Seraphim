import secrets from '../secrets.json'

module.exports.run = async (msg, args, client, db, ID) => {
    if (msg.author.id !== secrets.ownerID) return

    let one = args.shift();
    let two = args.join(' ');

    client.channels.get(one).send(two)

}

module.exports.help = {
    name: "servermsg"
}