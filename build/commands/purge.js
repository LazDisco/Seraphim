module.exports.run = async (msg, args, client, db, ID) => {
    let sender = msg.member;
    if (!sender.hasPermission('MANAGE_MESSAGES')) return msg.reply("ERR: User doesn't have valid permissions to use this command")
    // Make sure that they have the right permissions before using the command.

    // Also I was really tired so I just c+p'ed this code from "an idiot's guide". Kudos.
    const user = msg.mentions.users.first(); // If a user is mentioned.
    const amount = !!parseInt(msg.content.split(' ')[1]) ? parseInt(msg.content.split(' ')[1]) : parseInt(msg.content.split(' ')[2])
    if (!amount) return msg.reply('Must specify an amount to delete!');
    if (!amount && !user) return msg.reply('Must specify a user and amount, or just an amount, of msgs to purge!');
    msg.channel.fetchmsgs({
        limit: amount,
    }).then((msgs) => {
        if (user) {
            const filterBy = user ? user.id : Client.user.id;
            msgs = msgs.filter(m => m.author.id === filterBy).array().slice(0, amount);
        }
        msg.channel.bulkDelete(msgs, true).catch(error => console.log(error.stack));
    });
}

module.exports.help = {
    name: "purge"
}